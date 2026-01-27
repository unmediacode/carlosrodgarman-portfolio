# Configuración del Proyecto Web - Carlos Rodgarman

## Arquitectura Establecida
- Fecha inicio: 2026-01-23
- Página base: index.html (Home)
- Tipo: Landing page para productor musical

## Design Tokens (extraídos del diseño)

### Colores
- Primary: #232c33 (dark slate)
- Secondary: #f0efef (light gray)
- Surface: #f8f8f8 (off-white)
- Text: #262626 (almost black)
- Text Light: #ffffff80 (white 50%)
- Text Inverted: #ffffff (white)
- Background: #ffffff (white)
- Border: #e5e5e5 (light border)
- Accent: #ffffff1a (white 10% - for hover states)

### Tipografía
- Font Family: 'Montserrat', system-ui, -apple-system, sans-serif
- Font Sizes:
  - xs: 0.8125rem (13px)
  - sm: 0.875rem (14px)
  - base: 0.9375rem (15px)
  - lg: 1.5rem (24px)
  - xl: 2.25rem (36px)
  - 2xl: 2.8125rem (45px)
  - 3xl: 3.25rem (52px)
  - hero: 5.625rem (90px)
  - display: 7.5rem (120px)
- Font Weights: normal(400), medium(500), semibold(600), bold(700)
- Line Heights: tight(1), normal(1.4), relaxed(1.55)

### Espaciado
- xs: 0.625rem (10px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)
- 2xl: 4.375rem (70px)

### Bordes
- Radius sm: 4px
- Radius md: 8px
- Radius lg: 12px
- Radius full: 500px

### Sombras
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)

## Componentes Creados
- [x] .header (logo + navigation)
- [x] .nav, .nav__list, .nav__item, .nav__link
- [x] .section (container genérico)
- [x] .section--dark, .section--light
- [x] .section-title (títulos con líneas decorativas)
- [x] .btn--link (botones de enlace)
- [x] .logo-grid (grid de logos de clientes)
- [x] .footer
- [x] .service-card (tarjetas de servicios) - agregado en RG Studio
- [x] .equipment-table (tablas técnicas de equipamiento) - agregado en RG Studio
- [x] .studio-gallery (galería de fotos del estudio) - agregado en RG Studio
- [x] .cta-section (secciones de llamada a la acción) - agregado en RG Studio
- [x] .badge (badges de estado NEW/primary/success) - agregado en RG Studio

## Páginas del Proyecto
1. index.html - Home ✓
2. rg-studio.html - RG Studio ✓ (con js/pages/rg-studio.js para animación flotante)

## Convenciones de Naming
- CSS: BEM (.bloque__elemento--modificador)
- IDs: kebab-case (mi-elemento)
- JS Functions: camelCase (miFunction)
- Archivos: kebab-case (mi-archivo.css)
- Assets: kebab-case, descriptivo (hero-home.jpg, logo-sony.svg)

## Estructura de Assets
assets/
├── images/          # Fotos e imágenes de contenido
│   ├── hero/        # Imágenes hero/banner
│   └── backgrounds/ # Fondos de secciones
├── icons/           # Iconos SVG/PNG
├── logos/           # Logos de marca y clientes
│   ├── logo.svg     # Logo principal
│   └── clients/     # Logos de clientes
├── vectors/         # Ilustraciones SVG (Dolby Atmos, etc.)
├── videos/          # Videos
└── fonts/           # Fuentes locales (si aplica)

## Assets Utilizados
| Archivo | Ubicación | Usado en | Estado |
|---------|-----------|----------|--------|
| hero-bg.jpg | assets/images/hero/ | hero section | ✅ Integrado |
| michael-buble-bg.jpg | assets/images/backgrounds/ | Michael Bublé section | ✅ Integrado |
| gospel-symphony-bg.jpg | assets/images/backgrounds/ | Gospel Symphony section | ✅ Integrado |
| logo.svg | assets/logos/ | header, footer | ✅ Integrado |
| dolby-atmos.svg | assets/vectors/ | section Michael Bublé | ✅ Integrado |
| logo_sony.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_time_life.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_warner_music.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_dream.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_universal.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_rtve.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_paramount.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| logo_waner.svg | assets/logos/clients/ | clients section | ✅ Integrado |
| cursor-soundwave.svg | assets/icons/ | cursor global | ✅ Integrado |
| favicon.ico | assets/logos/ | todas | ⏳ Pendiente (opcional) |

## Elementos Compartidos
- Header: Presente en todas las páginas
- Footer: Presente en todas las páginas
- Nav: Presente en todas las páginas

## Notas de Diseño
- Diseño tipo portfolio/landing page para productor musical
- Enfoque en proyectos destacados (Michael Bublé, Gospel Symphony)
- Secciones alternas dark/light para ritmo visual
- Tipografía bold y espaciada para títulos
- Uso de líneas decorativas horizontales en títulos
- Footer con rotación de texto en el lado derecho
- **Cursor personalizado**: Onda de sonido (cursor-soundwave.svg) aplicado globalmente
- **Efectos de hover**: Animación de onda sonora en links de navegación
- **Hero RG Studio**: Logo y tagline con animación de flotación suave (4s loop) desincronizada, con sombras dinámicas. Se activa al hacer scroll hacia el hero usando Intersection Observer (threshold: 30%)
- **Sección Services (RG Studio)**: Diseño moderno "Minimal Luxury + Neón Sutil"
  - Color principal: #990033 (burgundy/rosa oscuro)
  - Gradiente sutil en fondo negro (#000000 → #0a0a0a)
  - Títulos con glow animado y sombras de neón
  - Cards con glassmorphism (rgba blur)
  - Efectos de hover 3D con transformación y sombras profundas
  - Iconos con animación de pulsación (ecualizador)
  - Shine effect horizontal al hover
  - Bordes con glow burgundy al hover
  - Micro-interacciones en items de lista
