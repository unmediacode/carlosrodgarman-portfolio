# 🔐 Instrucciones para Subir a GitHub Manualmente

## ⚠️ Problema Detectado

Hay un problema de autenticación con GitHub. Necesitas autenticarte para poder hacer push.

## ✅ Repositorio Local Listo

Tu código está listo para subir:
- ✅ Git inicializado
- ✅ Commit creado (233 archivos)
- ✅ Remote configurado
- ✅ Videos excluidos (demasiado grandes para GitHub)
- ⏳ Falta: Autenticación para push

## 🔑 Solución: Usar Personal Access Token

### Paso 1: Crear Personal Access Token en GitHub

1. Ve a: https://github.com/settings/tokens
2. Click en **"Generate new token (classic)"**
3. Configuración del token:
   ```
   Note: CarlosRodgarman Portfolio Push
   Expiration: 90 days (o el que prefieras)
   Scopes: ✓ repo (full control of private repositories)
   ```
4. Click **"Generate token"**
5. **COPIA EL TOKEN** (solo se muestra una vez!)

### Paso 2: Hacer Push con el Token

Ejecuta este comando en la terminal:

```bash
git push -u origin main
```

Cuando te pida credenciales:
- **Username**: `unmediacode` (tu usuario de GitHub)
- **Password**: `PEGA_TU_TOKEN_AQUÍ` (NO tu contraseña, sino el token)

### Paso 3: Verificar en GitHub

Ve a: https://github.com/unmediacode/carlosrodgarman-portfolio

Deberías ver todos tus archivos!

---

## 🔐 Alternativa: Autenticar GitHub CLI

Si prefieres usar GitHub CLI:

```bash
# 1. Autenticar
gh auth login

# 2. Seguir las instrucciones en pantalla
# Selecciona: GitHub.com → HTTPS → Paste token → Pega tu token

# 3. Hacer push
git push -u origin main
```

---

## 📊 Lo que se va a subir

- **Commit**: 2aa4cde
- **Archivos**: 233 files
- **Tamaño**: ~15MB (sin videos)
- **Contenido**:
  - ✅ 5 páginas HTML
  - ✅ 100+ imágenes
  - ✅ CSS completo
  - ✅ JavaScript components
  - ✅ Advertising images (29 imágenes)
  - ❌ Videos (excluidos - 479MB)

---

## 🎥 ¿Qué pasó con los videos?

Los videos fueron excluidos porque:
- GitHub tiene límite de 100MB por archivo
- `carrilanos_trailer.mp4` pesa 346MB
- Total carpeta videos: 479MB

### Solución para los videos:

1. **Súbelos a tu servidor web directamente**
   ```bash
   scp -r assets/videos/* usuario@servidor:/var/www/carlosrodgarman.com/assets/videos/
   ```

2. **O usa un CDN como:**
   - Cloudflare R2
   - AWS S3
   - DigitalOcean Spaces

---

## 🚨 Comandos de Emergencia

Si necesitas reintentar el push:

```bash
# Ver estado
git status

# Ver remote
git remote -v

# Reintentar push
git push -u origin main

# Ver logs
git log --oneline
```

---

## ✅ Una vez que subas exitosamente

1. **Renombra README_GITHUB.md**
   ```bash
   mv README_GITHUB.md README.md
   git add README.md
   git commit -m "Add main README"
   git push
   ```

2. **Opcional: Activa GitHub Pages**
   - Settings → Pages
   - Source: main branch
   - Tu sitio: https://unmediacode.github.io/carlosrodgarman-portfolio/

---

## 📞 ¿Necesitas Ayuda?

- Documentación GitHub: https://docs.github.com/en/authentication
- Personal Access Tokens: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

**¡Casi terminamos! Solo falta la autenticación.** 🚀
