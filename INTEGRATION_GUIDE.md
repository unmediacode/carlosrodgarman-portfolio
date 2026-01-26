# Guía de Integración de Assets

Esta guía te muestra cómo integrar los assets reales una vez que los tengas disponibles.

## 🖼️ Integración de Imágenes de Fondo

### Hero Section
En `index.html`, la sección hero ya tiene la referencia:
```html
<section class="section section--hero hero" id="home">
```

En `css/pages/home.css`:
```css
.hero {
    background-image: url('../../assets/images/hero/hero-bg.jpg');
}
```

**Una vez tengas la imagen**, simplemente colócala en:
- `assets/images/hero/hero-bg.jpg`

El sitio la cargará automáticamente.

---

### Secciones de Proyectos Destacados

Las secciones Michael Bublé y Gospel Symphony usan inline styles:

```html
<section class="section section--featured featured-project"
         style="background-image: url('assets/images/backgrounds/michael-buble-bg.jpg');">
```

**Para integrar**:
1. Coloca las imágenes en `assets/images/backgrounds/`
2. No necesitas cambiar nada más, funcionarán automáticamente

---

## 🎨 Integración del Logo Principal

### Opción 1: SVG Inline (Recomendado)

En `index.html`, reemplaza el SVG temporal del logo:

```html
<!-- Actual (temporal) -->
<svg width="132" height="51" viewBox="0 0 132 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="35" font-family="Montserrat, sans-serif" font-size="32" font-weight="600" fill="white">Rodgarman</text>
</svg>

<!-- Reemplazar con tu logo real -->
<svg width="132" height="51" viewBox="0 0 132 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- Tu diseño de logo aquí -->
</svg>
```

### Opción 2: Archivo SVG Externo

```html
<a href="index.html" class="logo" aria-label="Volver al inicio">
    <img src="assets/logos/logo.svg" alt="Rodgarman" width="132" height="51">
</a>
```

**Recuerda**: El logo también aparece en el footer, búscalo y actualízalo allí también.

---

## 🏢 Integración de Logos de Clientes

### Método Actual (Placeholders)
```html
<div class="logo-grid__item">
    <div class="client-logo-placeholder">Sony Music</div>
</div>
```

### Método con Logos Reales

#### Opción 1: SVG Inline
```html
<div class="logo-grid__item">
    <svg width="270" height="126" viewBox="0 0 270 126" xmlns="http://www.w3.org/2000/svg">
        <!-- Contenido del SVG del logo -->
    </svg>
</div>
```

#### Opción 2: Archivo SVG (Recomendado para múltiples logos)
```html
<div class="logo-grid__item">
    <img src="assets/logos/clients/logo-sony.svg" alt="Sony Music" loading="lazy">
</div>
```

### Ejemplo Completo de Integración

Reemplaza toda la sección de logos en `index.html`:

```html
<div class="logo-grid">
    <!-- Fila 1 -->
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-sony.svg" alt="Sony Music" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-time-life.svg" alt="Time Life" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-warner-music.svg" alt="Warner Music" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-dream.svg" alt="Dream Records" loading="lazy">
    </div>

    <!-- Fila 2 -->
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-universal.svg" alt="Universal Music" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-rtve.svg" alt="RTVE" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-paramount.svg" alt="Paramount" loading="lazy">
    </div>
    <div class="logo-grid__item">
        <img src="assets/logos/clients/logo-warner.svg" alt="Warner Bros" loading="lazy">
    </div>
</div>
```

---

## 🎵 Integración del Logo Dolby Atmos

### Ubicación
En la sección Michael Bublé:

```html
<!-- Actual (placeholder) -->
<div class="vector-logo">
    <svg width="100" height="37" viewBox="0 0 100 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="37" fill="white" opacity="0.9"/>
        <text x="10" y="23" font-family="sans-serif" font-size="10" fill="#000">DOLBY ATMOS</text>
    </svg>
</div>

<!-- Con logo real -->
<div class="vector-logo">
    <img src="assets/vectors/dolby-atmos.svg" alt="Dolby Atmos" width="100" height="37">
</div>
```

---

## 🔗 Iconos SVG para Redes Sociales

Los iconos de redes sociales actuales son funcionales. Si quieres personalizarlos:

### Fuentes recomendadas:
1. **Lucide Icons** (recomendado): https://lucide.dev
2. **Heroicons**: https://heroicons.com
3. **Feather Icons**: https://feathericons.com

### Ejemplo de reemplazo (Facebook):
```html
<!-- Reemplazar el path actual -->
<a href="#" class="social-link" aria-label="Facebook">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <!-- Nuevo SVG de Lucide o similar -->
    </svg>
</a>
```

---

## ⚡ Optimización Post-Integración

Una vez integrados todos los assets:

### 1. Optimizar Imágenes JPG
```bash
# Reducir calidad manteniendo visual
convert hero-bg.jpg -quality 85 -strip hero-bg-optimized.jpg
```

### 2. Optimizar SVGs
```bash
# Instalar SVGO
npm install -g svgo

# Optimizar todos los SVGs
svgo -f assets/logos/clients -o assets/logos/clients
```

### 3. Verificar Pesos
```bash
# Ver tamaño de assets
du -h assets/images/*/*.jpg
du -h assets/logos/clients/*.svg
```

**Targets recomendados**:
- Imágenes JPG: < 300KB cada una
- SVG logos: < 50KB cada uno
- Total assets: < 2MB

---

## 📱 Responsive Images (Opcional - Optimización avanzada)

Para mejorar el rendimiento en móviles:

```html
<section class="section section--hero hero" id="home"
         style="background-image: image-set(
             url('assets/images/hero/hero-bg-mobile.jpg') 1x,
             url('assets/images/hero/hero-bg.jpg') 2x
         );">
```

---

## ✅ Checklist de Integración

### Prioridad Alta
- [ ] Integrar logo principal en header
- [ ] Integrar logo principal en footer
- [ ] Agregar favicon
- [ ] Agregar imagen hero-bg.jpg

### Prioridad Media
- [ ] Integrar imágenes de secciones destacadas
- [ ] Agregar logo Dolby Atmos

### Prioridad Baja
- [ ] Reemplazar placeholders de logos de clientes
- [ ] Optimizar todos los assets
- [ ] Personalizar iconos de redes sociales

---

## 🐛 Troubleshooting

### "La imagen no se carga"
1. Verifica la ruta relativa es correcta
2. Comprueba que el archivo existe: `ls -la assets/images/hero/`
3. Verifica permisos: `chmod 644 assets/images/hero/hero-bg.jpg`
4. Revisa la consola del navegador (F12) para errores

### "El logo se ve pixelado"
1. Asegúrate de usar SVG, no PNG
2. Si es SVG, verifica el viewBox está correcto
3. Si es PNG, usa una resolución 2x (264x102px para logo de 132x51px)

### "Los logos de clientes no están alineados"
1. Verifica que todos tengan dimensiones similares
2. Ajusta en CSS si es necesario:
```css
.logo-grid__item img {
    max-width: 200px; /* Ajustar según necesidad */
}
```

---

## 💡 Mejores Prácticas

1. **Siempre usa `loading="lazy"`** para imágenes fuera del viewport inicial
2. **Incluye `alt` descriptivos** para accesibilidad
3. **Usa SVG para logos** siempre que sea posible
4. **Optimiza antes de subir** a producción
5. **Mantén backups** de assets originales sin optimizar
6. **Documenta cambios** en PROJECT_CONFIG.md

---

¿Necesitas ayuda con la integración? Revisa:
- README.md - Información general del proyecto
- PROJECT_CONFIG.md - Configuración y design tokens
- ASSETS_GUIDE.md - Especificaciones de assets
