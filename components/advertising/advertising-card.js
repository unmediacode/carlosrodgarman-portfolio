/**
 * AdvertisingCard Component
 * Handles advertising card creation, interactions, and modal display
 */

class AdvertisingCard {
    constructor(element, data) {
        this.element = element;
        this.data = data;
        this.modal = null;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const hasVideo = this.data.videoUrl && this.data.videoUrl.trim() !== '';

        // Determine badge class based on category
        let badgeClass = 'product';
        if (this.data.category === 'DVD SERIES') {
            badgeClass = 'series';
        } else if (this.data.category === 'LOGO') {
            badgeClass = 'logo';
        }

        this.element.innerHTML = `
            <div class="advertising-card__image-wrapper">
                <img
                    src="${this.data.coverImage}"
                    alt="${this.data.title}"
                    class="advertising-card__image"
                    loading="lazy"
                >
                ${this.data.year ? `
                    <div class="advertising-card__badge advertising-card__badge--${badgeClass}">
                        ${this.data.year}
                    </div>
                ` : ''}
                ${hasVideo ? `
                    <div class="advertising-card__play-overlay">
                        <button class="advertising-card__play-button" aria-label="Play video">
                            <div class="advertising-card__play-icon"></div>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="advertising-card__info">
                <h3 class="advertising-card__title">${this.data.title}</h3>
                <div class="advertising-card__meta">
                    ${this.data.category ? `
                        <span class="advertising-card__category">${this.data.category}</span>
                    ` : ''}
                </div>
            </div>
        `;

        // Add loaded class to image when it loads
        const img = this.element.querySelector('.advertising-card__image');
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.src = 'advertising/images/placeholder.svg';
                img.classList.add('loaded');
            });
        }
    }

    attachEventListeners() {
        const imageWrapper = this.element.querySelector('.advertising-card__image-wrapper');

        // Touch interaction for mobile/iPad
        if (imageWrapper) {
            let touchStartTime = 0;

            imageWrapper.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                this.element.classList.add('touch-active');
            }, { passive: true });

            imageWrapper.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;

                // If it was a quick tap (not a scroll)
                if (touchDuration < 200) {
                    // If there's a video, open modal
                    if (this.data.videoUrl && this.data.videoUrl.trim() !== '') {
                        this.openModal();
                    } else {
                        // Keep hover effect visible for 2 seconds
                        if (this.touchTimeout) {
                            clearTimeout(this.touchTimeout);
                        }
                        this.touchTimeout = setTimeout(() => {
                            this.element.classList.remove('touch-active');
                        }, 2000);
                    }
                }
            }, { passive: true });
        }

        // Click on card to open modal if video exists (desktop)
        if (this.data.videoUrl && this.data.videoUrl.trim() !== '') {
            this.element.addEventListener('click', () => this.openModal());
        }
    }

    openModal() {
        // Create modal if it doesn't exist
        if (!this.modal) {
            this.createModal();
        }

        // Show modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Load video
        const video = this.modal.querySelector('.advertising-modal__video');
        if (video && !video.src) {
            video.src = this.data.videoUrl;
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';

            // Pause video
            const video = this.modal.querySelector('.advertising-modal__video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'advertising-modal';
        this.modal.innerHTML = `
            <div class="advertising-modal__content">
                <button class="advertising-modal__close" aria-label="Close modal">&times;</button>

                <div class="advertising-modal__video-wrapper">
                    <video
                        class="advertising-modal__video"
                        controls
                        playsinline
                        preload="metadata"
                    >
                        <source src="${this.data.videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div class="advertising-modal__info">
                    <h2 class="advertising-modal__title">${this.data.title}</h2>

                    <div class="advertising-modal__meta">
                        ${this.data.client ? `
                            <div class="advertising-modal__meta-item">
                                <span class="advertising-modal__meta-label">Client</span>
                                <span class="advertising-modal__meta-value">${this.data.client}</span>
                            </div>
                        ` : ''}

                        ${this.data.category ? `
                            <div class="advertising-modal__meta-item">
                                <span class="advertising-modal__meta-label">Category</span>
                                <span class="advertising-modal__meta-value">${this.data.category}</span>
                            </div>
                        ` : ''}

                        ${this.data.year ? `
                            <div class="advertising-modal__meta-item">
                                <span class="advertising-modal__meta-label">Year</span>
                                <span class="advertising-modal__meta-value">${this.data.year}</span>
                            </div>
                        ` : ''}
                    </div>

                    ${this.data.description ? `
                        <p class="advertising-modal__description">${this.data.description}</p>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Event listeners
        const closeBtn = this.modal.querySelector('.advertising-modal__close');
        closeBtn.addEventListener('click', () => this.closeModal());

        // Close on background click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    destroy() {
        if (this.modal) {
            this.modal.remove();
        }
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvertisingCard;
}
