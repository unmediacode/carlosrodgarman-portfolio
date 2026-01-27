/**
 * TechnicalVideoCard Component
 * Handles technical video card creation, interactions, and modal display
 */

class TechnicalVideoCard {
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

        this.element.innerHTML = `
            <div class="technical-video-card__image-wrapper">
                <img
                    src="${this.data.coverImage}"
                    alt="${this.data.title}"
                    class="technical-video-card__image"
                    loading="lazy"
                >
                ${this.data.year ? `
                    <div class="technical-video-card__badge">
                        ${this.data.year}
                    </div>
                ` : ''}
                ${hasVideo ? `
                    <div class="technical-video-card__play-overlay">
                        <button class="technical-video-card__play-button" aria-label="Play video">
                            <div class="technical-video-card__play-icon"></div>
                        </button>
                    </div>
                ` : ''}
            </div>
            <div class="technical-video-card__info">
                <h3 class="technical-video-card__title">${this.data.title}</h3>
                <div class="technical-video-card__meta">
                    ${this.data.category ? `
                        <span class="technical-video-card__category">${this.data.category}</span>
                    ` : ''}
                    ${this.data.series ? `
                        <span class="technical-video-card__series">${this.data.series}</span>
                    ` : ''}
                </div>
            </div>
        `;

        // Add loaded class to image when it loads
        const img = this.element.querySelector('.technical-video-card__image');
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                img.src = 'technical-videos/images/placeholder.svg';
                img.classList.add('loaded');
            });
        }
    }

    attachEventListeners() {
        const imageWrapper = this.element.querySelector('.technical-video-card__image-wrapper');

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

        // Load YouTube video
        const iframe = this.modal.querySelector('.technical-modal__video');
        if (iframe && !iframe.src) {
            const videoId = this.extractYouTubeID(this.data.videoUrl);
            if (videoId) {
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            }
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';

            // Stop video
            const iframe = this.modal.querySelector('.technical-modal__video');
            if (iframe) {
                iframe.src = '';
            }
        }
    }

    extractYouTubeID(url) {
        if (!url) return null;

        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'technical-modal';
        this.modal.innerHTML = `
            <div class="technical-modal__content">
                <button class="technical-modal__close" aria-label="Close modal">&times;</button>

                <div class="technical-modal__video-wrapper">
                    <iframe
                        class="technical-modal__video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                </div>

                <div class="technical-modal__info">
                    <h2 class="technical-modal__title">${this.data.title}</h2>

                    <div class="technical-modal__meta">
                        ${this.data.category ? `
                            <div class="technical-modal__meta-item">
                                <span class="technical-modal__meta-label">Category</span>
                                <span class="technical-modal__meta-value">${this.data.category}</span>
                            </div>
                        ` : ''}

                        ${this.data.series ? `
                            <div class="technical-modal__meta-item">
                                <span class="technical-modal__meta-label">Series</span>
                                <span class="technical-modal__meta-value">${this.data.series}</span>
                            </div>
                        ` : ''}

                        ${this.data.year ? `
                            <div class="technical-modal__meta-item">
                                <span class="technical-modal__meta-label">Year</span>
                                <span class="technical-modal__meta-value">${this.data.year}</span>
                            </div>
                        ` : ''}
                    </div>

                    ${this.data.description ? `
                        <p class="technical-modal__description">${this.data.description}</p>
                    ` : ''}

                    ${this.data.tags && this.data.tags.length > 0 ? `
                        <div class="technical-modal__tags">
                            ${this.data.tags.map(tag => `
                                <span class="technical-modal__tag">#${tag}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        document.body.appendChild(this.modal);

        // Event listeners
        const closeBtn = this.modal.querySelector('.technical-modal__close');
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
    module.exports = TechnicalVideoCard;
}
