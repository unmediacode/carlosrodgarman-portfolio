# Sistema de Extracción Automática de Colores

## Cómo Funciona

El sistema ahora **extrae automáticamente los colores dominantes** de cada portada de álbum para aplicarlos a los paneles de información. No hay colores predefinidos en el JSON.

### Proceso de Extracción

1. **Carga de Imagen**
   - La portada del álbum se carga usando lazy loading
   - Cuando la imagen termina de cargar, se activa el proceso de extracción

2. **Análisis de Píxeles**
   - Se crea un canvas temporal de 100x100px
   - La imagen se dibuja escalada en el canvas
   - Se leen los datos de píxeles usando `getImageData()`

3. **Filtrado Inteligente**
   - Se ignoran píxeles muy oscuros (brightness < 30)
   - Se ignoran píxeles muy claros (brightness > 220)
   - Se ignoran píxeles transparentes (alpha < 128)
   - Se muestrea cada 4º píxel para mejor rendimiento

4. **Cálculo del Color Promedio**
   - Se promedian los valores RGB de los píxeles válidos
   - El color se oscurece un 30% para mejor contraste con texto blanco
   - Se aplica con opacidad 0.92 para efecto glassmorphism

5. **Aplicación**
   - El color se aplica como variable CSS `--panel-color`
   - Ambos paneles (work y info) usan este color automáticamente

## Ventajas

✅ **Coherencia Visual**: Cada panel refleja los colores reales de la portada
✅ **Automático**: No requiere asignar colores manualmente
✅ **Único**: Cada álbum tiene su propio color basado en su artwork
✅ **Accesible**: El oscurecimiento automático garantiza buen contraste
✅ **Performante**: Análisis rápido en canvas pequeño (100x100)

## Algoritmo de Extracción

```javascript
extractColorFromImage(img) {
    // 1. Crear canvas 100x100
    // 2. Dibujar imagen escalada
    // 3. Leer píxeles con getImageData()
    // 4. Filtrar píxeles (skip muy oscuros/claros/transparentes)
    // 5. Promediar RGB de píxeles válidos
    // 6. Oscurecer 30% para contraste
    // 7. Aplicar como rgba(r, g, b, 0.92)
}
```

## Fallbacks

Si hay algún error en la extracción:
- Se aplica color por defecto: `rgba(50, 50, 65, 0.92)`
- Se muestra advertencia en consola
- El reproductor continúa funcionando normalmente

## Ejemplos

Una portada con tonos rojos → Panel rojizo
Una portada con tonos azules → Panel azulado
Una portada con tonos verdes → Panel verdoso
Una portada multicolor → Panel con el color promedio

## Testing

Para probar el sistema:
1. Abre `test-colors.html` en el navegador
2. Verás 15 reproductores con colores extraídos
3. Abre la consola (F12) para ver los valores RGB extraídos
4. Haz clic en "+" de cualquier reproductor para ver el panel con su color único

## Código Relevante

**Archivo**: `cd-player/cd-player.js`
- Línea ~50: `loadImage()` - Carga imagen y activa extracción
- Línea ~70: `extractColorFromImage()` - Algoritmo de extracción
- Línea ~38: `init()` - Ya no usa colores predefinidos

**Archivo**: `cd-player/cd-player.css`
- Línea ~143, ~271: `var(--panel-color)` - Variable CSS que recibe el color

## Optimización de Rendimiento

- **Canvas pequeño**: 100x100px (no imagen completa)
- **Muestreo**: Cada 4º píxel (no todos los píxeles)
- **Filtrado eficiente**: Skip de píxeles inválidos en una sola pasada
- **Fallback rápido**: Si filtrado es muy agresivo, re-muestrea sin filtros
- **Sin bloqueo**: Proceso asíncrono, no bloquea UI

## Comparación

### Antes (Colores Predefinidos)
```json
{
  "id": "gloria-trevi",
  "panelColor": "#2C3E50",  // Manual
  ...
}
```

### Ahora (Extracción Automática)
```json
{
  "id": "gloria-trevi",
  // No panelColor - se extrae de la imagen
  ...
}
```

El campo `panelColor` en el JSON ya no se utiliza. Los colores se calculan dinámicamente de las portadas reales.
