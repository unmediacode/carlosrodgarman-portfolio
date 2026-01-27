/**
 * Photo Gallery JavaScript
 * Loads gallery photos dynamically from JSON
 */

class PhotoGallery {
    constructor() {
        this.photos = [];
        this.galleryContainer = document.getElementById('photoGallery');
        this.init();
    }

    async init() {
        if (!this.galleryContainer) return;

        await this.loadPhotos();
        this.renderGallery();
    }

    async loadPhotos() {
        try {
            const response = await fetch('data/gallery-photos.json');
            this.photos = await response.json();
        } catch (error) {
            console.error('Error loading gallery photos:', error);
        }
    }

    renderGallery() {
        if (this.photos.length === 0) {
            this.galleryContainer.innerHTML = '<p>No photos available.</p>';
            return;
        }

        const galleryHTML = this.photos.map(photo => this.createPhotoItem(photo)).join('');
        this.galleryContainer.innerHTML = galleryHTML;
    }

    createPhotoItem(photo) {
        return `
            <div class="photo-gallery__item">
                <img
                    src="assets/images/gallery/${photo.filename}"
                    alt="${photo.alt}"
                    loading="lazy"
                >
                <div class="photo-gallery__caption">${photo.caption}</div>
            </div>
        `;
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhotoGallery();
});
