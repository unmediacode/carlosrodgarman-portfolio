# CD Player Component

Reproductor de álbumes interactivo con paneles expandibles y enlaces a plataformas de streaming.

## Características

- ✅ **Hover interactivo**: Los botones Play e Info aparecen al pasar el mouse
- ✅ **Panel desplegable con color dinámico**: Se despliega hacia abajo al reproducir con color personalizado por álbum
- ✅ **Barra de progreso interactiva**: Muestra el progreso del audio con tiempos
- ✅ **Enlaces de streaming**: Apple Music, Spotify y Amazon Music en el panel
- ✅ **Modal de información**: Muestra detalles del álbum, control de volumen y enlaces
- ✅ **Reproductor de audio**: Reproduce preview del álbum
- ✅ **Responsive**: Se adapta a todos los tamaños de pantalla
- ✅ **Múltiples reproductores**: Puedes tener varios en la misma página
- ✅ **Data-driven**: Todos los datos se cargan desde JSON
- ✅ **75 álbumes precargados**: Datos importados desde Excel

## Estructura de archivos

```
cd-player/
├── cd-player.html      # Demo/ejemplo de uso
├── cd-player.css       # Estilos del componente
├── cd-player.js        # Funcionalidad JavaScript
├── data.json           # Datos de ejemplo
├── music-data.json     # 75 álbumes reales (convertidos desde Excel)
└── README.md           # Este archivo

Página principal:
music.html              # Página MUSIC con grid de todos los álbumes
css/pages/music.css     # Estilos de la página MUSIC
```

## Página Music

La página `music.html` muestra todos los 75 álbumes en un grid responsive. Para acceder:

```
http://localhost/music.html
```

O desde el menú principal: **HOME > MUSIC**

## Instalación

### 1. Incluir archivos CSS y JS

En tu página HTML (por ejemplo, `music.html`):

```html
<head>
    <link rel="stylesheet" href="cd-player/cd-player.css">
</head>
<body>
    <!-- Tu contenido -->

    <script src="cd-player/cd-player.js"></script>
</body>
```

### 2. Crear contenedores para los reproductores

```html
<div class="cd-player" data-album-id="impossible-dream"></div>
<div class="cd-player" data-album-id="otro-album"></div>
```

### 3. Inicializar los reproductores

```html
<script>
    // Al final del body, después de incluir cd-player.js
    initCDPlayers('cd-player/data.json');
</script>
```

## Configuración de datos (JSON)

Edita el archivo `data.json` para agregar tus álbumes:

```json
{
  "id": "impossible-dream",
  "coverImage": "../images/albums/impossible-dream.jpg",
  "artist": "Aaron Lazar",
  "title": "Impossible Dream",
  "year": "2023",
  "completedWork": "Engineer",
  "audioFile": "../audio/impossible-dream-preview.mp3",
  "links": {
    "appleMusic": "https://music.apple.com/album/...",
    "spotify": "https://open.spotify.com/album/...",
    "amazon": "https://music.amazon.com/albums/..."
  }
}
```

### Campos del JSON:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| `id` | Identificador único del álbum | `"impossible-dream"` |
| `coverImage` | Ruta a la imagen de portada | `"../images/albums/cover.jpg"` |
| `artist` | Nombre del artista | `"Aaron Lazar"` |
| `title` | Título del álbum | `"Impossible Dream"` |
| `year` | Año de lanzamiento | `"2023"` |
| `completedWork` | Tu rol en el proyecto | `"Engineer"`, `"Producer"`, `"Mixing"` |
| `panelColor` | **Color del panel desplegable** | `"#8B1A1A"`, `"#6B6B6B"` |
| `audioFile` | Ruta al archivo de audio preview | `"../audio/preview.mp3"` |
| `links.appleMusic` | URL de Apple Music | `"https://music.apple.com/..."` |
| `links.spotify` | URL de Spotify | `"https://open.spotify.com/..."` |
| `links.amazon` | URL de Amazon Music | `"https://music.amazon.com/..."` |

### Colores del Panel

El campo `panelColor` define el color de fondo del panel que se despliega al reproducir. Este color debe combinar con la carátula del álbum para crear una experiencia visual cohesiva.

**Ejemplos de colores por estilo de carátula:**

| Estilo de Carátula | Color Sugerido | Código Hex |
|-------------------|----------------|------------|
| Rojo/Borgoña | Rojo oscuro | `#8B1A1A` |
| Gris/Sepia | Gris medio | `#6B6B6B` |
| Amarillo/Dorado | Amarillo suave | `#B8A773` |
| Rosa/Magenta | Rosa intenso | `#C71585` |
| Azul/Púrpura | Azul medio | `#4A4A7A` |
| Marrón/Sepia | Marrón oscuro | `#5A4A3A` |

Si no se especifica `panelColor`, se usa el color por defecto: `#4a4a4a` (gris oscuro).

## Uso en la página Music

### Ejemplo de grid de álbumes:

```html
<section class="music-section">
    <div class="container">
        <h2>My Work</h2>

        <div class="albums-grid">
            <div class="cd-player" data-album-id="album-1"></div>
            <div class="cd-player" data-album-id="album-2"></div>
            <div class="cd-player" data-album-id="album-3"></div>
            <div class="cd-player" data-album-id="album-4"></div>
        </div>
    </div>
</section>

<style>
.albums-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 3rem;
}

@media screen and (max-width: 768px) {
    .albums-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
}
</style>

<script>
    initCDPlayers('cd-player/data.json');
</script>
```

## Funcionamiento

### Estado inicial
- Solo se muestra la portada del álbum

### Al hacer hover
- Aparecen dos botones en la esquina inferior derecha:
  - **Play button**: Reproduce el audio
  - **+ button**: Abre el modal con información

### Al hacer click en Play
1. Se reproduce el audio
2. Se despliega el panel "Completed work" hacia abajo
3. El botón cambia a icono de Pausa (||)
4. Al pausar, el panel se recoge

### Al hacer click en "+"
- Se abre un modal con:
  - Nombre del artista
  - Título del álbum
  - Año de lanzamiento
  - Control de volumen
  - Enlaces a Apple Music, Spotify y Amazon

## Personalización

### Cambiar colores

Edita `cd-player.css` y modifica estas variables:

```css
/* Botones blancos por defecto */
.cd-player__btn {
    background: #ffffff;
    color: #1a1a1a;
}

/* Modal oscuro */
.cd-player__modal-content {
    background: linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
}

/* Panel "Completed work" */
.cd-player__work-panel {
    background: rgba(255, 255, 255, 0.95);
}
```

### Cambiar tamaño máximo

```css
.cd-player {
    max-width: 400px; /* Cambia este valor */
}
```

### Cambiar border-radius

```css
.cd-player {
    border-radius: 24px; /* Más o menos redondeado */
}
```

## Navegadores soportados

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (últimas versiones)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Los reproductores no aparecen
- Verifica que los archivos CSS y JS están correctamente enlazados
- Revisa la consola del navegador (F12) para errores
- Asegúrate de llamar `initCDPlayers()` después de cargar el JS

### El audio no se reproduce
- Verifica que la ruta al archivo de audio es correcta
- Asegúrate de que el archivo existe y es accesible
- Algunos navegadores bloquean autoplay, el usuario debe interactuar primero

### Las imágenes no se ven
- Verifica las rutas relativas en el JSON
- Asegúrate de que las imágenes existen en las rutas especificadas

### El modal no se cierra
- Intenta presionar la tecla ESC
- Click en el botón X
- Click fuera del modal (en el fondo oscuro)

## Demo

Abre `cd-player.html` en tu navegador para ver una demo funcional del componente.

## Soporte

Para problemas o preguntas sobre este componente, contacta al desarrollador.

---

**Desarrollado para Carlos Rodgarman Website** © 2026
