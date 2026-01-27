# Guía de Assets

Este archivo contiene las especificaciones para los assets que necesitas agregar al proyecto.

## 📸 Imágenes Requeridas

### Hero Section
**Ubicación**: `assets/images/hero/hero-bg.jpg`

**Especificaciones**:
- Dimensiones recomendadas: 1920x1200px
- Formato: JPG optimizado
- Peso máximo: 300KB
- Contenido: Imagen atmosférica relacionada con producción musical, estudio de grabación, o ambiente artístico
- Tratamiento: La imagen llevará un overlay oscuro en CSS, así que puede ser cualquier tono

**Sugerencias de búsqueda**:
- "music studio recording session dark"
- "professional recording studio atmosphere"
- "music producer workspace cinematic"

---

### Michael Bublé Section
**Ubicación**: `assets/images/backgrounds/michael-buble-bg.jpg`

**Especificaciones**:
- Dimensiones recomendadas: 1920x960px
- Formato: JPG optimizado
- Peso máximo: 250KB
- Contenido: Imagen elegante, sofisticada (jazz, orquesta, o ambiente clásico)
- Tratamiento: Llevará overlay gris claro (#f0efef con 85-90% opacidad)

**Sugerencias de búsqueda**:
- "jazz orchestra elegant atmosphere"
- "classical music venue sophisticated"
- "concert hall stage lights"

---

### Gospel Symphony Section
**Ubicación**: `assets/images/backgrounds/gospel-symphony-bg.jpg`

**Especificaciones**:
- Dimensiones recomendadas: 1920x960px
- Formato: JPG optimizado
- Peso máximo: 250KB
- Contenido: Imagen relacionada con gospel, coro, o ambiente espiritual/musical
- Tratamiento: Llevará overlay gris claro (#f0efef con 88-92% opacidad)

**Sugerencias de búsqueda**:
- "gospel choir performance light"
- "church music atmosphere warm"
- "symphony orchestra spiritual"

---

## 🎨 Logos y Vectores

### Logo Principal
**Ubicación**: `assets/logos/logo.svg`

**Especificaciones**:
- Formato: SVG
- Dimensiones: Flexible, pero diseñado para caber en 132x51px
- Colores: Blanco (#ffffff) para uso en header oscuro
- Contenido: Texto "Rodgarman" con tipografía Montserrat semibold o similar

**Cómo crear**:
```html
<svg width="132" height="51" viewBox="0 0 132 51" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="35" font-family="Montserrat, sans-serif" font-size="32" font-weight="600" fill="white">
        Rodgarman
    </text>
</svg>
```

---

### Favicon
**Ubicación**: `assets/logos/favicon.ico`

**Especificaciones**:
- Formato: ICO (multi-resolución: 16x16, 32x32, 48x48)
- Contenido: Iniciales "CR" o símbolo representativo

**Herramientas recomendadas**:
- https://favicon.io
- https://realfavicongenerator.net

---

### Dolby Atmos Logo
**Ubicación**: `assets/vectors/dolby-atmos.svg`

**Especificaciones**:
- Formato: SVG
- Dimensiones: 100x37px aproximadamente
- Colores: Blanco o gris oscuro
- **Importante**: Usar el logo oficial de Dolby Atmos

**Fuente**:
- Descargar de recursos oficiales de Dolby o usar versión vectorial libre

---

## 🏢 Logos de Clientes

**Ubicación**: `assets/logos/clients/`

Todos los logos deben cumplir:
- **Formato**: SVG (preferido) o PNG con fondo transparente
- **Dimensiones**: Max 270x126px
- **Colores**: Versión monocromática en gris oscuro (#666666) preferiblemente
- **Peso**: Max 50KB por logo

### Lista de logos requeridos:

1. **logo-sony.svg** - Sony Music
2. **logo-time-life.svg** - Time Life
3. **logo-warner-music.svg** - Warner Music Group
4. **logo-dream.svg** - Dream Records
5. **logo-universal.svg** - Universal Music Group
6. **logo-rtve.svg** - RTVE (Radio Televisión Española)
7. **logo-paramount.svg** - Paramount Pictures
8. **logo-warner.svg** - Warner Bros

**Dónde conseguir**:
- Páginas oficiales de cada compañía (sección "Press" o "Brand Assets")
- Wikimedia Commons (versiones vectoriales oficiales)
- Brandfetch.com
- WorldVectorLogo.com

**Tratamiento**:
- Preferir versiones monocromáticas o convertir a escala de grises
- Asegurar que sean versiones oficiales y de alta calidad
- Optimizar el SVG (remove metadata, simplify paths)

---

## ⚡ Optimización de Assets

### Imágenes JPG
```bash
# Usando ImageMagick
convert input.jpg -quality 85 -resize 1920x output.jpg

# Usando online: TinyJPG.com o Squoosh.app
```

### SVG
```bash
# Usando SVGO
npx svgo input.svg -o output.svg

# Manualmente: remover metadatos innecesarios en un editor de texto
```

---

## 📋 Checklist de Assets

- [ ] `assets/images/hero/hero-bg.jpg`
- [ ] `assets/images/backgrounds/michael-buble-bg.jpg`
- [ ] `assets/images/backgrounds/gospel-symphony-bg.jpg`
- [ ] `assets/logos/logo.svg`
- [ ] `assets/logos/favicon.ico`
- [ ] `assets/vectors/dolby-atmos.svg`
- [ ] `assets/logos/clients/logo-sony.svg`
- [ ] `assets/logos/clients/logo-time-life.svg`
- [ ] `assets/logos/clients/logo-warner-music.svg`
- [ ] `assets/logos/clients/logo-dream.svg`
- [ ] `assets/logos/clients/logo-universal.svg`
- [ ] `assets/logos/clients/logo-rtve.svg`
- [ ] `assets/logos/clients/logo-paramount.svg`
- [ ] `assets/logos/clients/logo-warner.svg`

---

## 🎯 Prioridad

**Alta prioridad** (necesarios para que el sitio se vea completo):
1. Logo principal (logo.svg)
2. Favicon (favicon.ico)
3. Imagen hero (hero-bg.jpg)

**Media prioridad**:
4. Imágenes de backgrounds de secciones
5. Logo Dolby Atmos

**Baja prioridad** (el sitio funciona con placeholders):
6. Logos de clientes (actualmente usando placeholders que se ven bien)

---

## 💡 Tips

- Las imágenes de fondo no necesitan ser perfectas ya que llevan overlays
- Para logos de clientes, la consistencia visual es más importante que la perfección
- Usa herramientas de compresión para mantener el sitio rápido
- Si un logo oficial no está disponible, un placeholder bien diseñado es aceptable temporalmente
