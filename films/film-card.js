/**
 * Film Card Component
 * Elegant card for displaying film/TV projects
 *
 * Features:
 * - Poster with hover effects
 * - Title, role, and year display
 * - Trailer button with YouTube integration
 * - Lazy loading of images
 * - Auto color extraction from poster
 */

class FilmCard {
    // Static array to track all instances
    static instances = [];

    constructor(element, data) {
        this.element = element;
        this.data = data;

        // Add this instance to the array
        FilmCard.instances.push(this);

        this.init();
    }

    init() {
        this.render();
        this.loadImage();
        this.attachEventListeners();
    }

    /**
     * Renders the film card HTML structure
     */
    render() {
        const html = `
            <div class="film-card__poster">
                ${this.data.year ? `<div class="film-card__year">${this.data.year}</div>` : ''}
                <img data-src="${this.data.coverImage}"
                     alt="${this.data.title}"
                     class="film-card__poster-image"
                     loading="lazy">
                <div class="film-card__poster-overlay"></div>
            </div>

            <div class="film-card__content">
                <h3 class="film-card__title">${this.data.title}</h3>
                <p class="film-card__role">${this.data.role}</p>

                <div class="film-card__actions">
                    ${this.data.trailerUrl ? `
                        <button class="film-card__btn film-card__btn--primary" data-action="trailer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="display: inline-block; vertical-align: middle; margin-right: 6px;">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                            Watch Trailer
                        </button>
                    ` : ''}
                    ${this.data.imdbUrl ? `
                        <a href="${this.data.imdbUrl}"
                           target="_blank"
                           class="film-card__btn film-card__btn--secondary">
                            View on IMDb
                        </a>
                    ` : ''}
                </div>
            </div>
        `;

        this.element.innerHTML = html;
    }

    /**
     * Loads the poster image using lazy loading
     * Adds fade-in effect when loaded
     */
    loadImage() {
        const img = this.element.querySelector('.film-card__poster-image');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;

            // Add loaded class when image is fully loaded
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            // Handle error case
            img.addEventListener('error', () => {
                console.warn(`Failed to load image: ${img.dataset.src}`);
                img.classList.add('loaded');
            });
        }
    }

    /**
     * Attaches event listeners to buttons
     */
    attachEventListeners() {
        const trailerBtn = this.element.querySelector('[data-action="trailer"]');
        const poster = this.element.querySelector('.film-card__poster');

        // Touch interaction for mobile/iPad
        if (poster) {
            let touchStartTime = 0;

            poster.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                this.element.classList.add('touch-active');
            }, { passive: true });

            poster.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;

                // If it was a quick tap (not a scroll), keep hover effect visible for 2 seconds
                if (touchDuration < 200) {
                    // Clear any existing timeout
                    if (this.touchTimeout) {
                        clearTimeout(this.touchTimeout);
                    }

                    // Keep hover effect visible for 2 seconds
                    this.touchTimeout = setTimeout(() => {
                        this.element.classList.remove('touch-active');
                    }, 2000);
                }
            }, { passive: true });
        }

        if (trailerBtn) {
            trailerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openTrailer();
            });
        }
    }

    /**
     * Opens the trailer in a modal or external link
     * For local MP4 files, opens in modal
     * For YouTube links, opens in YouTube
     */
    openTrailer() {
        if (!this.data.trailerUrl) return;

        // Check if it's a local video file
        if (this.data.trailerUrl.endsWith('.mp4')) {
            // Open local video in modal
            VideoModal.open(this.data.trailerUrl, this.data.title);
        } else {
            // External URL (YouTube, etc.)
            window.open(this.data.trailerUrl, '_blank');
        }
    }

    /**
     * Cleans up the film card instance
     */
    destroy() {
        // Remove this instance from the static instances array
        const index = FilmCard.instances.indexOf(this);
        if (index > -1) {
            FilmCard.instances.splice(index, 1);
        }
    }
}

/**
 * Initializes film cards from a data JSON file
 * @param {string} dataUrl - URL to the films data JSON file
 */
function initFilmCards(dataUrl) {
    fetch(dataUrl)
        .then(response => response.json())
        .then(films => {
            // Check if there's a grid container
            const gridContainer = document.getElementById('filmsGrid');

            if (gridContainer) {
                // Create card elements for all films
                films.forEach(film => {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'film-card';
                    cardElement.dataset.filmId = film.id;
                    gridContainer.appendChild(cardElement);

                    new FilmCard(cardElement, film);
                });
            } else {
                // Original behavior for pre-existing .film-card elements
                const cardElements = document.querySelectorAll('.film-card');

                cardElements.forEach((element, index) => {
                    const filmId = element.dataset.filmId;
                    const filmData = films.find(film => film.id === filmId) || films[index];

                    if (filmData) {
                        new FilmCard(element, filmData);
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error loading film data:', error);
        });
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FilmCard, initFilmCards };
}

/**
 * Video Modal - Singleton class for displaying video trailers
 * 
 * Features:
 * - Modal overlay with video player
 * - Close button (X)
 * - ESC key to close
 * - Click outside to close
 * - Pause video on close
 */
class VideoModal {
    static instance = null;
    static modalElement = null;

    /**
     * Gets or creates the singleton instance
     */
    static getInstance() {
        if (!VideoModal.instance) {
            VideoModal.instance = new VideoModal();
        }
        return VideoModal.instance;
    }

    constructor() {
        if (VideoModal.instance) {
            return VideoModal.instance;
        }

        this.createModal();
        this.attachEventListeners();
        VideoModal.instance = this;
    }

    /**
     * Creates the modal HTML structure
     */
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'video-modal';
        modal.innerHTML = `
            <div class="video-modal__container">
                <button class="video-modal__close" aria-label="Close video">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <video class="video-modal__video" controls controlsList="nodownload">
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-modal__title"></div>
            </div>
        `;

        document.body.appendChild(modal);
        VideoModal.modalElement = modal;

        this.modal = modal;
        this.video = modal.querySelector('.video-modal__video');
        this.closeBtn = modal.querySelector('.video-modal__close');
        this.container = modal.querySelector('.video-modal__container');
        this.titleEl = modal.querySelector('.video-modal__title');
    }

    /**
     * Attaches event listeners for closing the modal
     */
    attachEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.close());

        // Click outside video container
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Prevent clicks inside container from closing
        this.container.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    /**
     * Opens the modal with a video
     * @param {string} videoUrl - URL to the video file
     * @param {string} title - Title of the film
     */
    static open(videoUrl, title) {
        const instance = VideoModal.getInstance();
        
        // Set video source
        const source = instance.video.querySelector('source');
        source.src = videoUrl;
        instance.video.load();

        // Set title
        instance.titleEl.textContent = title;

        // Show modal
        instance.modal.classList.add('active');
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';

        // Auto play video
        setTimeout(() => {
            instance.video.play().catch(err => {
                console.warn('Autoplay prevented:', err);
            });
        }, 300);
    }

    /**
     * Closes the modal
     */
    close() {
        // Pause video
        this.video.pause();

        // Hide modal
        this.modal.classList.remove('active');

        // Re-enable body scroll
        document.body.style.overflow = '';

        // Clear video source after transition
        setTimeout(() => {
            const source = this.video.querySelector('source');
            source.src = '';
            this.video.load();
        }, 300);
    }

    /**
     * Static method to close from anywhere
     */
    static close() {
        if (VideoModal.instance) {
            VideoModal.instance.close();
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FilmCard, initFilmCards, VideoModal };
}
