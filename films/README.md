# Films & TV Section - Documentación de Diseño

## Filosofía de Diseño

La página Films & TV fue diseñada como **hermana visual de la página Music**, manteniendo una coherencia estética perfecta mientras se adapta al formato de posters cinematográficos.

## Principios de Diseño Aplicados

### 1. **Coherencia Visual con Music**
- ✅ **Mismo efecto telón**: Apertura dramática hacia arriba
- ✅ **Misma tipografía**: Montserrat en todos los textos
- ✅ **Mismas animaciones**: Reveal progresivo con bounce
- ✅ **Mismo timing**: 1.4s para telón, stagger de 50ms entre cards
- ✅ **Misma paleta**: Fondo #f5f5f5, sombras suaves, hover elevado

### 2. **Adaptación al Contenido**
Diferencias justificadas por el contenido:
- **Aspect ratio**: 2:3 (poster de cine) vs 1:1 (portada de álbum)
- **Grid**: 3 columnas (formato poster) vs 4 columnas (formato cuadrado)
- **Cards blancas**: Simula marcos de galería de cine
- **Botón amarillo**: Color característico de Hollywood/premios

### 3. **Jerarquía Visual**
```
TÍTULO (1.25rem, bold, uppercase)
  ↓
ROLE (0.875rem, medium, color secundario)
  ↓
BOTÓN PRIMARIO (amarillo, prominente)
  ↓
BOTÓN SECUNDARIO (outline, sutil)
```

### 4. **Espaciado Profesional**
- **Gap horizontal**: 2rem (equilibrio entre densidad y respiro)
- **Gap vertical**: 3rem (más espacio para acentuar formato vertical)
- **Padding interno**: 2rem arriba, 1.75rem laterales
- **Distancia hover**: -12px (más dramático que Music: -8px)

## Estructura de Componentes

### FilmCard Component
```
film-card/
├── film-card.css      → Estilos del componente
├── film-card.js       → Lógica del componente
└── films-data.json    → Datos estructurados
```

### Anatomía de una Film Card

```
┌─────────────────────────────┐
│    [YEAR BADGE]             │ ← Badge absoluto, top-right
│                             │
│                             │
│       POSTER IMAGE          │ ← Aspect ratio 2:3
│      (con hover scale)      │
│                             │
│                             │
├─────────────────────────────┤
│  TÍTULO EN MAYÚSCULAS       │ ← 1.25rem, bold
│  Role descriptivo           │ ← 0.875rem, color #666
│                             │
│  [  WATCH TRAILER  ]        │ ← Botón amarillo primario
│  [  View on IMDb   ]        │ ← Botón outline secundario
└─────────────────────────────┘
```

## Efectos y Animaciones

### 1. **Curtain Effect** (Telón)
```css
transform: translateY(-100%)
transition: 1.4s cubic-bezier(0.77, 0, 0.175, 1)
```
- Misma curva que Music
- Velocidad idéntica para coherencia
- Z-index: 9999 para garantizar overlay completo

### 2. **Card Reveal**
```css
@keyframes revealCard {
    0%: opacity 0, translateY(30px), scale(0.95)
    100%: opacity 1, translateY(0), scale(1)
}
duration: 0.6s
easing: cubic-bezier(0.34, 1.56, 0.64, 1) // bounce suave
stagger: 50ms por card
```

### 3. **Hover Effect**
```css
transform: translateY(-12px)
box-shadow: 0 24px 60px rgba(0,0,0,0.2)
duration: 0.4s
easing: cubic-bezier(0.4, 0, 0.2, 1)
```

**Poster durante hover:**
```css
transform: scale(1.08)
overlay opacity: 0 → 1
duration: 0.6s (más lento para dramatismo)
```

### 4. **Image Loading**
```css
Initial: opacity 0
Loaded: opacity 1, transition 0.3s
```
Fade-in suave, sin saltos bruscos

## Sistema de Grid Responsivo

### Desktop (> 1024px)
```css
grid-template-columns: repeat(3, 1fr);
gap: 3rem 2rem;
```
- 3 columnas perfectas
- Espaciado generoso vertical
- Max-width contenedor: 1200px

### Tablet (768px - 1024px)
```css
grid-template-columns: repeat(2, 1fr);
gap: 2.5rem 2rem;
```
- 2 columnas para mejor legibilidad
- Gap reducido proporcionalmente

### Mobile (< 768px)
```css
grid-template-columns: repeat(2, 1fr);
gap: 2rem 1.5rem;
```
- Mantiene 2 columnas hasta 480px
- Prioriza visualización de comparación

### Mobile Small (< 480px)
```css
grid-template-columns: 1fr;
gap: 2rem;
```
- Una sola columna
- Experiencia vertical optimizada

## Botones de Acción

### Botón Primario (Watch Trailer)
**Color**: `#FFD700` (oro Hollywood)
**Hover**: `#FFC700` (más saturado)
**Shadow**: `0 4px 12px rgba(255, 215, 0, 0.3)`
**Hover Shadow**: `0 6px 20px rgba(255, 215, 0, 0.5)`

**Por qué amarillo:**
- Asociación cultural con premios (Oscar, Golden Globe)
- Alto contraste con fondo blanco
- Call-to-action prominente sin ser agresivo

### Botón Secundario (IMDb)
**Color**: Transparente con border `#e0e0e0`
**Hover**: Fondo `#f5f5f5`, border más oscuro
**Función**: Acción terciaria, menos urgente

## Optimizaciones de Performance

### 1. **Progressive Loading**
- Carga por lotes: 6 cards a la vez (2 filas)
- Delay entre lotes: 400ms
- Stagger interno: 50ms por card

### 2. **Lazy Loading**
- Atributo `loading="lazy"` nativo
- Data-src pattern para control manual
- Fallback graceful en errores

### 3. **Image Optimization**
- Posters optimizados (< 100KB cada uno)
- Aspect ratio CSS previene layout shift
- Placeholder gradient durante carga

## Accesibilidad

✅ **Semántica HTML5**: Estructura clara con landmarks
✅ **ARIA labels**: Botones descriptivos
✅ **Contraste**: Todos los textos > 4.5:1
✅ **Focus states**: Visibles en navegación por teclado
✅ **Alt text**: Descripciones significativas en imágenes

## Integración con YouTube

### Extracción de Video ID
```javascript
extractYouTubeID(url) {
    // Soporta múltiples formatos:
    // - youtube.com/watch?v=XXX
    // - youtu.be/XXX
    // - youtube.com/embed/XXX
    return videoID;
}
```

### Apertura de Trailer
- Se abre en nueva pestaña
- URL limpia sin parámetros innecesarios
- Fallback a URL directa si falla extracción

## Testing

### Verificación Visual
1. Abrir `films.html`
2. Verificar apertura suave del telón
3. Observar reveal progresivo de cards
4. Probar hover effects
5. Verificar botones de trailer

### Verificación de Carga
1. Abrir DevTools → Network
2. Verificar carga progresiva de imágenes
3. Confirmar lazy loading funciona
4. Medir tiempo de First Contentful Paint

### Verificación Responsive
1. Probar en 375px (mobile)
2. Probar en 768px (tablet)
3. Probar en 1024px (desktop)
4. Verificar grid adapta correctamente

## Comparación Music vs Films

| Aspecto | Music | Films & TV |
|---------|-------|------------|
| **Grid** | 4 columnas | 3 columnas |
| **Aspect Ratio** | 1:1 (cuadrado) | 2:3 (poster) |
| **Background Card** | Transparente | Blanco |
| **Hover Elevation** | -8px | -12px |
| **Gap Vertical** | 2rem | 3rem |
| **Stagger Timing** | 20ms | 50ms |
| **Batch Size** | 12 players | 6 cards |
| **Botón Principal** | Play (redondo) | Trailer (rectangular) |
| **Color Acento** | Ninguno | Amarillo (#FFD700) |

## Consideraciones de Marca

### Paleta Limitada
- **Blanco**: Limpieza, profesionalismo
- **Gris claro**: Fondo neutro tipo galería
- **Negro texto**: Máxima legibilidad
- **Amarillo**: Único color de marca para CTAs

### Tipografía Consistente
- **Montserrat**: Toda la familia (400, 500, 600, 700)
- **Uppercase para títulos**: Autoridad cinematográfica
- **Letter-spacing amplio**: Elegancia premium

### Sombras Suaves
- Nunca harsh shadows
- Siempre transiciones suaves
- Layers progresivos en hover

## Extensibilidad Futura

### Campos Opcionales en JSON
```json
{
    "description": "Para modal con más info",
    "awards": ["Festival A", "Premio B"],
    "cast": ["Actor 1", "Actor 2"],
    "director": "Nombre Director",
    "duration": "120 min",
    "genre": ["Drama", "Thriller"]
}
```

### Componentes Potenciales
- **Modal de detalles**: Click en poster abre info expandida
- **Filtros**: Por año, rol, género
- **Video player**: Trailer embebido en la misma página
- **Galería**: Screenshots adicionales del proyecto

## Archivos Clave

- `films.html` - Página principal
- `films/film-card.js` - Componente JavaScript (200 líneas)
- `films/film-card.css` - Estilos del componente (180 líneas)
- `css/pages/films.css` - Estilos específicos de página (120 líneas)
- `films/films-data.json` - Datos estructurados (10 films)

## Comandos Útiles

```bash
# Ver tamaño de imágenes
ls -lh assets/images/films/*.jpg

# Validar JSON
jq . films/films-data.json

# Buscar TODOs en el código
grep -r "TODO" films/

# Contar líneas de código
wc -l films/*.{js,css}
```

---

**Diseñado con**: Atención al detalle, coherencia de marca, y pensamiento en sistemas.
**Inspirado en**: Netflix UI, Apple TV+, IMDb Pro, y portfolios cinematográficos premium.
