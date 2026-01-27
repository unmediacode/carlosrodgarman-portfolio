# Blog Images

Esta carpeta contiene las imágenes destacadas (featured images) para los posts del blog.

## Especificaciones de Imágenes

### Formato y Dimensiones
- **Aspecto:** 16:9 (1920x1080px recomendado)
- **Formato:** JPG o WebP optimizado
- **Peso máximo:** 300KB por imagen
- **Calidad:** Alta resolución para visualización en web

## Convención de Nombres

Los nombres de archivo deben coincidir con los especificados en `data/blog-posts.json`:

- `antelope-galaxy-64.jpg` - Post sobre Antelope Galaxy 64
- `neve-interview.jpg` - Post de entrevista con Neve
- `journey-galicia-la.jpg` - Post sobre el viaje desde Galicia a Los Ángeles
- `neve-antelope-synergy.jpg` - Post sobre la sinergia Neve + Antelope
- `og-image.jpg` - Imagen por defecto para compartir en redes sociales (1200x630px)

## Placeholder

Si falta una imagen específica, el sistema mostrará una imagen placeholder automáticamente.

## Optimización

Todas las imágenes deben estar optimizadas para web:
- Comprimir usando herramientas como TinyPNG o ImageOptim
- Convertir a WebP cuando sea posible para mejor rendimiento
- Usar lazy loading (ya implementado en el código)
