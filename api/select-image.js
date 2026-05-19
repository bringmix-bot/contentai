"""
PARCHE: Selección inteligente de imágenes por brief
Ejecutar desde C:\\mcm-server\\repo:

    python aplicar_parche.py

Modifica public/index.html reemplazando la llamada a /api/select-image
por selección directa con Claude Vision desde el browser.
"""

import os, sys, shutil

FILE = os.path.join(os.path.dirname(__file__), "public", "index.html")

if not os.path.exists(FILE):
    # Try relative path
    FILE = "public/index.html"
if not os.path.exists(FILE):
    print("ERROR: No encuentro public/index.html")
    print("Ejecutá este script desde la raíz del repo (C:\\mcm-server\\repo)")
    sys.exit(1)

# Backup
backup = FILE + ".backup"
shutil.copy2(FILE, backup)
print(f"Backup creado: {backup}")

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

OLD = """            if(validImgs.length === 0) {
              imgMatchWarning = true;
            } else {
              const r = await fetch("/api/select-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  brief: postBrief,
                  images: validImgs.map(d=>({idx:d.idx, b64:d.b64, mtype:d.mtype, fileName:d.fileName}))
                })
              });
              const d = await r.json();
              if(d.success && typeof d.chosenIdx === "number" && d.chosenIdx >= 0 && d.chosenIdx < imgs.length) {
                imgSrc = imgs[d.chosenIdx].preview;
                setProgressMsg(`Post ${i+1}: ✓ imagen elegida para "${postBrief}"`);
              } else {
                imgMatchWarning = true;
              }
            }"""

NEW = """            if(validImgs.length > 0) {
              // Selección con Claude Vision directo desde el browser.
              // El browser tiene acceso a localhost:3001 y convierte las imágenes a base64
              // antes de mandarlas a Claude — sin pasar por Vercel.
              const visionContent = [
                {
                  type: "text",
                  text: `Sos un director de arte. Tenés ${validImgs.length} imágenes numeradas del 0 al ${validImgs.length - 1}. El brief del post es: "${postBrief}". Analizá cada imagen y elegí la que mejor se adapta a ese brief. Respondé SOLO con el número de índice (0, 1, 2...), sin texto adicional.`
                },
                ...validImgs.map(d => ({
                  type: "image",
                  source: { type: "base64", media_type: d.mtype, data: d.b64 }
                }))
              ];

              const visionResp = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  model: "claude-sonnet-4-20250514",
                  max_tokens: 10,
                  messages: [{ role: "user", content: visionContent }]
                })
              });

              const visionData = await visionResp.json();
              const raw = visionData.content?.[0]?.text?.trim() || "";
              const chosenValidIdx = parseInt(raw, 10);

              if(!isNaN(chosenValidIdx) && chosenValidIdx >= 0 && chosenValidIdx < validImgs.length) {
                const originalIdx = validImgs[chosenValidIdx].idx;
                imgSrc = imgs[originalIdx]?.preview || imgs[i % imgs.length].preview;
                setProgressMsg(`Post ${i+1}: ✓ imagen ${originalIdx + 1} elegida para "${postBrief}"`);
              } else {
                imgSrc = imgs[i % imgs.length].preview;
              }
            }"""

if OLD not in content:
    print("ERROR: No encontré el bloque a reemplazar.")
    print("Puede que el archivo ya esté parchado, o que la versión sea diferente.")
    print()
    print("Verificá que el archivo contenga estas líneas:")
    print('  const r = await fetch("/api/select-image",')
    sys.exit(1)

patched = content.replace(OLD, NEW, 1)

with open(FILE, "w", encoding="utf-8") as f:
    f.write(patched)

print(f"✅ Parche aplicado exitosamente en {FILE}")
print()
print("Ahora ejecutá:")
print("  cd C:\\mcm-server\\repo")
print("  git add public\\index.html")
print('  git commit -m "fix: seleccion de imagen por brief via Claude Vision en browser"')
print("  git push")
