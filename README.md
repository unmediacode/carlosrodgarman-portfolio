# Carlos Rodgarman - Website Portfolio

Landing page profesional para Carlos Rodgarman, productor musical, arreglista e ingeniero de sonido.

## 🚀 Estructura del Proyecto

```
CarlosRodgarman.com/
├── index.html              # Página principal (Home)
├── css/
│   ├── variables.css       # Variables globales (colores, fuentes, espaciados)
│   ├── reset.css           # Reset CSS mínimo
│   ├── components.css      # Componentes reutilizables
│   ├── layout.css          # Layouts (header, footer, nav)
│   └── pages/
│       └── home.css        # Estilos específicos de Home
├── js/
│   ├── main.js             # Inicialización global
│   ├── components/         # Componentes JS reutilizables
│   └── pages/              # JS específico por página
├── assets/                 # Recursos multimedia
│   ├── images/
│   │   ├── hero/           # Imágenes hero/banner
│   │   └── backgrounds/    # Fondos de secciones
│   ├── icons/              # Iconos SVG
│   ├── logos/              # Logos
│   │   ├── logo.svg        # Logo principal
│   │   ├── favicon.ico     # Favicon
│   │   └── clients/        # Logos de clientes
│   └── vectors/            # Ilustraciones SVG
├── PROJECT_CONFIG.md       # Configuración y documentación del proyecto
└── README.md               # Este archivo
```

## 🎨 Design Tokens

### Colores
- **Primary**: #232c33 (dark slate)
- **Secondary**: #f0efef (light gray)
- **Surface**: #f8f8f8 (off-white)
- **Text**: #262626

### Tipografía
- **Font Family**: Montserrat (Google Fonts)
- **Pesos**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espaciado
Sistema de espaciado consistente desde 10px hasta 70px.

## 📦 Assets Necesarios

Para completar el proyecto, necesitas agregar los siguientes assets:

### Imágenes
- `assets/images/hero/hero-bg.jpg` - Fondo para la sección hero
- `assets/images/backgrounds/michael-buble-bg.jpg` - Fondo para sección Michael Bublé
- `assets/images/backgrounds/gospel-symphony-bg.jpg` - Fondo para sección Gospel Symphony

### Logos
- `assets/logos/logo.svg` - Logo principal "Rodgarman"
- `assets/logos/favicon.ico` - Favicon del sitio
- `assets/vectors/dolby-atmos.svg` - Logo Dolby Atmos

### Logos de Clientes (ubicar en `assets/logos/clients/`)
- `logo-sony.svg`
- `logo-time-life.svg`
- `logo-warner-music.svg`
- `logo-dream.svg`
- `logo-universal.svg`
- `logo-rtve.svg`
- `logo-paramount.svg`
- `logo-warner.svg`

## 🚀 Cómo usar

1. **Abrir el proyecto**: Simplemente abre `index.html` en tu navegador
2. **Servidor local** (recomendado):
   ```bash
   # Usando Python 3
   python3 -m http.server 8000

   # O usando Node.js con http-server
   npx http-server
   ```
3. **Visita**: `http://localhost:8000`

## ✨ Características

- ✅ Diseño responsive (optimizado para desktop)
- ✅ Navegación smooth scroll
- ✅ Header fijo con navegación activa
- ✅ Secciones alternas dark/light
- ✅ Grid de logos de clientes
- ✅ Footer completo con enlaces y redes sociales
- ✅ Optimización de rendimiento (lazy loading)
- ✅ Accesibilidad (ARIA labels, focus states)

## 🎯 Páginas Implementadas

- [x] **Home** (index.html) - Página principal con hero, proyectos destacados y clientes

## 📝 Próximos Pasos

Para agregar nuevas páginas al sitio:

1. Lee `PROJECT_CONFIG.md` para entender la arquitectura
2. Reutiliza componentes de `components.css`
3. Copia header/footer/nav de `index.html`
4. Crea CSS específico en `css/pages/[nombre-pagina].css`
5. Actualiza `PROJECT_CONFIG.md` con los cambios

## 🛠️ Tecnologías

- HTML5 semántico
- CSS3 (Custom Properties, Flexbox, Grid)
- JavaScript Vanilla (ES6+)
- Google Fonts (Montserrat)

## 📄 Licencia

© 2026 Carlos Rodgarman. Todos los derechos reservados.

---

**Nota**: Este proyecto fue generado usando el skill **pencil-to-web** desde diseños de Pencil.dev
