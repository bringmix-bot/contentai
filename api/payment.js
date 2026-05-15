// api/payment.js
// Maneja creación de pagos con MercadoPago (ARS) y Stripe (USD/USDT)
// y webhooks de confirmación para activar el plan automáticamente

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const action = req.query.action;
  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;      // MercadoPago
  const STRIPE_SECRET   = process.env.STRIPE_SECRET_KEY;    // Stripe
  const APP_URL         = process.env.APP_URL || "https://contentai-nine.vercel.app";

  // ── CREAR PAGO ──────────────────────────────────────────────
  if (action === "create" && req.method === "POST") {
    const { planId, amount, currency, email, name, uid } = req.body;

    try {
      if (currency === "ARS") {
        // ── MERCADOPAGO ──
        const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
          },
          body: JSON.stringify({
            items: [{
              id: planId,
              title: `MCM — Plan ${planId.charAt(0).toUpperCase()+planId.slice(1)}`,
              description: "Suscripción mensual a MCM My Community Manager",
              quantity: 1,
              unit_price: amount,
              currency_id: "ARS",
            }],
            payer: { email, name },
            back_urls: {
              success: `${APP_URL}?payment=success&plan=${planId}&uid=${uid}`,
              failure: `${APP_URL}?payment=failure`,
              pending: `${APP_URL}?payment=pending`,
            },
            auto_return: "approved",
            notification_url: `${APP_URL}/api/payment?action=webhook-mp`,
            external_reference: `${uid}|${planId}`,
            // Suscripción recurrente
            subscription_data: {
              frequency: 1,
              frequency_type: "months",
              billing_day: new Date().getDate(),
              billing_day_proportional: true,
            },
          }),
        });
        const mpData = await mpRes.json();
        if (mpData.error) throw new Error(mpData.message || mpData.error);
        return res.status(200).json({
          success: true,
          initPoint: mpData.init_point,
          preferenceId: mpData.id,
        });

      } else {
        // ── STRIPE ──
        // Crear o buscar customer
        const customerRes = await fetch("https://api.stripe.com/v1/customers", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${STRIPE_SECRET}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ email, name, metadata: { uid, plan: planId } }),
        });
        const customer = await customerRes.json();

        // Prices en Stripe (configurar en dashboard de Stripe)
        const STRIPE_PRICES = {
          pro:     process.env.STRIPE_PRICE_PRO     || "price_pro_monthly",
          premium: process.env.STRIPE_PRICE_PREMIUM || "price_premium_monthly",
        };

        // Crear sesión de Checkout con suscripción
        const sessionRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${STRIPE_SECRET}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "customer": customer.id,
            "mode": "subscription",
            "line_items[0][price]": STRIPE_PRICES[planId],
            "line_items[0][quantity]": "1",
            "success_url": `${APP_URL}?payment=success&plan=${planId}&uid=${uid}`,
            "cancel_url": `${APP_URL}?payment=cancelled`,
            "metadata[uid]": uid,
            "metadata[plan]": planId,
            // Acepta USDT via Stripe crypto (si está habilitado en el dashboard)
            "payment_method_types[]": "card",
          }),
        });
        const session = await sessionRes.json();
        if (session.error) throw new Error(session.error.message);
        return res.status(200).json({
          success: true,
          initPoint: session.url,
          sessionId: session.id,
        });
      }
    } catch (e) {
      return res.status(500).json({ success: false, error: e.message });
    }
  }

  // ── WEBHOOK MERCADOPAGO ──────────────────────────────────────
  if (action === "webhook-mp" && req.method === "POST") {
    try {
      const { type, data } = req.body;
      if (type === "payment") {
        const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
          headers: { "Authorization": `Bearer ${MP_ACCESS_TOKEN}` }
        });
        const payment = await payRes.json();
        if (payment.status === "approved") {
          const [uid, planId] = (payment.external_reference || "").split("|");
          if (uid && planId) {
            // Actualizar plan del usuario en KV store o base de datos
            // Por ahora logueamos — en producción actualizar en DB
            console.log(`MP Payment approved: uid=${uid} plan=${planId}`);
            // TODO: guardar en KV/DB
          }
        }
      }
      return res.status(200).send("OK");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── WEBHOOK STRIPE ───────────────────────────────────────────
  if (action === "webhook-stripe" && req.method === "POST") {
    try {
      const event = req.body;
      if (event.type === "checkout.session.completed" || event.type === "invoice.paid") {
        const metadata = event.data?.object?.metadata || {};
        const { uid, plan } = metadata;
        if (uid && plan) {
          console.log(`Stripe Payment: uid=${uid} plan=${plan}`);
          // TODO: guardar en KV/DB
        }
      }
      return res.status(200).send("OK");
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── VERIFICAR ESTADO DEL PLAN ────────────────────────────────
  if (action === "status" && req.method === "GET") {
    const { uid } = req.query;
    // TODO: consultar DB con el plan activo del usuario
    return res.status(200).json({ success: true, plan: "free" });
  }

  return res.status(400).json({ success: false, error: "Acción no reconocida" });
}
