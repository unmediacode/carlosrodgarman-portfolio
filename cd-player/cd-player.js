/**
 * CD Player Component
 * Interactive album player with expandable panels
 *
 * Features:
 * - Play/pause audio with visual feedback
 * - Work panel: Shows completed work role when playing
 * - Info panel: Shows artist, title, year, progress bar, and streaming links
 * - Single playback enforcement: Only one song plays at a time
 * - Custom panel colors via CSS variables
 */

// SVG Icons
const ICONS = {
    PLAY: '<path d="M8 5v14l11-7z"/>',
    PAUSE: '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>',
    APPLE_MUSIC: '<path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>',
    SPOTIFY: '<path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>',
    AMAZON: '<path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"/>'
};

class CDPlayer {
    // Static array to track all instances for single playback enforcement
    static instances = [];

    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.isPlaying = false;
        this.audio = null;

        // Agregar esta instancia al array
        CDPlayer.instances.push(this);

        this.init();
    }

    init() {
        this.render();
        this.loadImage();
        this.attachEventListeners();
        this.createAudioElement();
    }

    /**
     * Loads the album cover image using lazy loading
     * Sets the src attribute from data-src for progressive loading
     * Extracts dominant color from the image when loaded
     */
    loadImage() {
        const img = this.element.querySelector('.cd-player__cover-image');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;

            // Add loaded class and extract color when image is fully loaded
            img.addEventListener('load', () => {
                img.classList.add('loaded');
                this.extractColorFromImage(img);
            });

            // Handle error case
            img.addEventListener('error', () => {
                console.warn(`Failed to load image: ${img.dataset.src}`);
                img.classList.add('loaded'); // Still add class to prevent infinite loading state
                // Apply fallback color
                this.element.style.setProperty('--panel-color', 'rgba(50, 50, 65, 0.92)');
            });
        }
    }

    /**
     * Extracts dominant color from album cover image
     * Uses Canvas API to analyze image pixels and find the most prominent color
     */
    extractColorFromImage(img) {
        try {
            // Create a canvas to analyze the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Use small size for performance
            const size = 100;
            canvas.width = size;
            canvas.height = size;

            // Draw image scaled down
            ctx.drawImage(img, 0, 0, size, size);

            // Get image data
            const imageData = ctx.getImageData(0, 0, size, size);
            const pixels = imageData.data;

            // Color buckets for averaging (skip very dark and very light pixels)
            let r = 0, g = 0, b = 0, count = 0;

            // Sample every 4th pixel for performance
            for (let i = 0; i < pixels.length; i += 16) {
                const red = pixels[i];
                const green = pixels[i + 1];
                const blue = pixels[i + 2];
                const alpha = pixels[i + 3];

                // Skip transparent, very dark, or very bright pixels
                if (alpha < 128) continue;

                const brightness = (red + green + blue) / 3;
                if (brightness < 30 || brightness > 220) continue;

                r += red;
                g += green;
                b += blue;
                count++;
            }

            if (count === 0) {
                // Fallback to sampling all pixels if filtering was too aggressive
                for (let i = 0; i < pixels.length; i += 16) {
                    r += pixels[i];
                    g += pixels[i + 1];
                    b += pixels[i + 2];
                    count++;
                }
            }

            // Calculate average color
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);

            // Darken the color by 30% for better text contrast
            r = Math.floor(r * 0.7);
            g = Math.floor(g * 0.7);
            b = Math.floor(b * 0.7);

            // Apply color with opacity
            const rgba = `rgba(${r}, ${g}, ${b}, 0.92)`;
            this.element.style.setProperty('--panel-color', rgba);

        } catch (error) {
            console.warn('Error extracting color from image:', error);
            // Fallback to default dark color
            this.element.style.setProperty('--panel-color', 'rgba(50, 50, 65, 0.92)');
        }
    }

    render() {
        const html = `
            <div class="cd-player__cover">
                <img data-src="${this.data.coverImage}" alt="${this.data.title}" class="cd-player__cover-image" loading="lazy">
                <div class="cd-player__cover-overlay"></div>

                <div class="cd-player__controls">
                    <button class="cd-player__btn cd-player__btn--info" aria-label="More info">
                        +
                    </button>
                    <button class="cd-player__btn cd-player__btn--play" aria-label="Play">
                        <svg viewBox="0 0 24 24" class="icon-play">
                            ${ICONS.PLAY}
                        </svg>
                    </button>
                </div>
            </div>

            <div class="cd-player__work-panel">
                <div class="cd-player__work-content">
                    <h3 class="cd-player__work-title">Completed work</h3>
                    <p class="cd-player__work-role">${this.data.completedWork}</p>
                </div>
            </div>

            <div class="cd-player__info-panel">
                <div class="cd-player__info-content">
                    <h2 class="cd-player__info-artist">${this.data.artist}</h2>
                    <h3 class="cd-player__info-title">${this.data.title}</h3>
                    <p class="cd-player__info-year">${this.data.year}</p>

                    <div class="cd-player__progress">
                        <div class="cd-player__progress-bar">
                            <div class="cd-player__progress-fill"></div>
                            <div class="cd-player__progress-thumb"></div>
                        </div>
                        <div class="cd-player__progress-time">
                            <span class="cd-player__time-current">0:00</span>
                            <span class="cd-player__time-total">0:00</span>
                        </div>
                    </div>

                    <div class="cd-player__links">
                        <a href="${this.data.links.appleMusic}" target="_blank" class="cd-player__link" aria-label="Apple Music">
                            <svg viewBox="0 0 24 24" fill="currentColor">${ICONS.APPLE_MUSIC}</svg>
                        </a>
                        <a href="${this.data.links.spotify}" target="_blank" class="cd-player__link" aria-label="Spotify">
                            <svg viewBox="0 0 24 24" fill="currentColor">${ICONS.SPOTIFY}</svg>
                        </a>
                        <a href="${this.data.links.amazon}" target="_blank" class="cd-player__link" aria-label="Amazon Music">
                            <svg viewBox="0 0 512 512" fill="currentColor">${ICONS.AMAZON}</svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        this.element.innerHTML = html;
    }

    /**
     * Creates and configures the audio element
     * Sets up event listeners for playback, progress, and duration
     */
    createAudioElement() {
        if (!this.data.audioFile || this.data.audioFile === '') {
            return;
        }

        this.audio = new Audio(this.data.audioFile);
        this.audio.volume = 0.7;

        // When audio ends, reset to initial state
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.closeWorkPanel();
        });

        // Update progress bar during playback
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        // Update duration when metadata loads
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });
    }

    /**
     * Updates the progress bar and current time display
     * Uses querySelectorAll to update progress in both panels
     */
    updateProgress() {
        if (!this.audio) return;

        const progressFills = this.element.querySelectorAll('.cd-player__progress-fill');
        const progressThumbs = this.element.querySelectorAll('.cd-player__progress-thumb');
        const currentTimeEls = this.element.querySelectorAll('.cd-player__time-current');

        const percent = (this.audio.currentTime / this.audio.duration) * 100 || 0;

        progressFills.forEach(progressFill => {
            progressFill.style.width = percent + '%';
        });

        progressThumbs.forEach(progressThumb => {
            progressThumb.style.left = percent + '%';
        });

        currentTimeEls.forEach(currentTimeEl => {
            currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        });
    }

    /**
     * Updates the total duration display
     */
    updateDuration() {
        if (!this.audio) return;

        const totalTimeEls = this.element.querySelectorAll('.cd-player__time-total');

        totalTimeEls.forEach(totalTimeEl => {
            totalTimeEl.textContent = this.formatTime(this.audio.duration);
        });
    }

    /**
     * Formats seconds into M:SS format
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time string
     */
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';

        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Attaches event listeners to control buttons and progress bars
     */
    attachEventListeners() {
        const playBtn = this.element.querySelector('.cd-player__btn--play');
        const infoBtn = this.element.querySelector('.cd-player__btn--info');

        // Play/pause button
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });
        }

        // Info button ("+") toggles info panel
        if (infoBtn) {
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleInfoPanel();
            });
        }

        // Progress bar click to seek (works in both panels)
        const progressBars = this.element.querySelectorAll('.cd-player__progress-bar');
        progressBars.forEach(progressBar => {
            progressBar.addEventListener('click', (e) => {
                if (!this.audio) return;

                const rect = progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = percent * this.audio.duration;
            });
        });
    }

    /**
     * Toggles between play and pause states
     * If no audio file, just toggles the work panel
     */
    togglePlay() {
        if (!this.audio) {
            // No audio file, just toggle panel
            if (this.isPlaying) {
                this.isPlaying = false;
                this.updatePlayButton();
                this.closeWorkPanel();
            } else {
                this.isPlaying = true;
                this.updatePlayButton();
                this.openWorkPanel();
            }
            return;
        }

        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    /**
     * Starts audio playback
     * Enforces single playback by pausing all other instances
     */
    play() {
        if (this.audio) {
            this.pauseAllOthers();

            this.audio.play();
            this.isPlaying = true;
            this.updatePlayButton();
            this.openWorkPanel();
        }
    }

    /**
     * Pauses all other CD player instances
     * Ensures only one song plays at a time
     */
    pauseAllOthers() {
        CDPlayer.instances.forEach(instance => {
            if (instance !== this && instance.isPlaying) {
                instance.pause();
            }
        });
    }

    /**
     * Closes all panels in all CD player instances
     * Ensures only one panel is open at a time
     */
    closeAllPanels() {
        CDPlayer.instances.forEach(instance => {
            if (instance !== this) {
                instance.closeWorkPanel();
                instance.closeInfoPanel();
            }
        });
    }

    /**
     * Closes the info panel
     */
    closeInfoPanel() {
        const panel = this.element.querySelector('.cd-player__info-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    /**
     * Pauses audio playback
     */
    pause() {
        if (this.audio) {
            this.audio.pause();
            this.isPlaying = false;
            this.updatePlayButton();
            this.closeWorkPanel();
        }
    }

    /**
     * Updates the play button icon based on playing state
     */
    updatePlayButton() {
        const playBtn = this.element.querySelector('.cd-player__btn--play');
        const icon = playBtn.querySelector('svg');

        icon.innerHTML = this.isPlaying ? ICONS.PAUSE : ICONS.PLAY;
    }

    /**
     * Opens the work panel (shows completed work role)
     * Closes all other panels first
     */
    openWorkPanel() {
        const workPanel = this.element.querySelector('.cd-player__work-panel');
        const infoPanel = this.element.querySelector('.cd-player__info-panel');

        // Close all panels in all other players
        this.closeAllPanels();

        // Close info panel if open in this player
        if (infoPanel) {
            infoPanel.classList.remove('active');
        }

        if (workPanel) {
            workPanel.classList.add('active');
        }
    }

    /**
     * Closes the work panel
     */
    closeWorkPanel() {
        const panel = this.element.querySelector('.cd-player__work-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    /**
     * Toggles the info panel (from + button)
     * Closes all other panels first, does not affect music playback
     */
    toggleInfoPanel() {
        const workPanel = this.element.querySelector('.cd-player__work-panel');
        const infoPanel = this.element.querySelector('.cd-player__info-panel');

        if (!infoPanel) return;

        const isCurrentlyActive = infoPanel.classList.contains('active');

        // Close all panels in all other players
        this.closeAllPanels();

        // Close work panel if open in this player
        if (workPanel) {
            workPanel.classList.remove('active');
        }

        // Toggle info panel (music keeps playing)
        if (!isCurrentlyActive) {
            infoPanel.classList.add('active');
        } else {
            infoPanel.classList.remove('active');
        }
    }

    /**
     * Cleans up the player instance
     * Stops audio and removes from instances array
     */
    destroy() {
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }

        // Remove this instance from the static instances array
        const index = CDPlayer.instances.indexOf(this);
        if (index > -1) {
            CDPlayer.instances.splice(index, 1);
        }
    }
}

/**
 * Initializes CD players from a data JSON file
 * @param {string} dataUrl - URL to the music data JSON file
 *
 * Supports two modes:
 * 1. Dynamic creation: If element with id="albumsGrid" exists, creates players dynamically
 * 2. Static elements: If .cd-player elements already exist, initializes them with data
 */
function initCDPlayers(dataUrl) {
    fetch(dataUrl)
        .then(response => response.json())
        .then(albums => {
            // Check if there's a grid container (for music.html)
            const gridContainer = document.getElementById('albumsGrid');

            if (gridContainer) {
                // Create player elements for all albums
                albums.forEach(album => {
                    const playerElement = document.createElement('div');
                    playerElement.className = 'cd-player';
                    playerElement.dataset.albumId = album.id;
                    gridContainer.appendChild(playerElement);

                    new CDPlayer(playerElement, album);
                });
            } else {
                // Original behavior for pre-existing .cd-player elements
                const playerElements = document.querySelectorAll('.cd-player');

                playerElements.forEach((element, index) => {
                    const albumId = element.dataset.albumId;
                    const albumData = albums.find(album => album.id === albumId) || albums[index];

                    if (albumData) {
                        new CDPlayer(element, albumData);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading CD player data:', error);
        });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CDPlayer, initCDPlayers };
}
