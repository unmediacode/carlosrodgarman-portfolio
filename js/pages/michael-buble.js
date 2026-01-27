/* ===========================================
   MICHAEL BUBLÉ PAGE SPECIFIC JAVASCRIPT
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===========================================
    // CURTAIN ANIMATION
    // ===========================================
    const curtain = document.getElementById('michaelBubleCurtain');
    const CURTAIN_KEY = 'michaelBubleCurtainShown';

    // Check if curtain was shown in this session
    const curtainShown = sessionStorage.getItem(CURTAIN_KEY);

    if (!curtainShown) {
        // Wait for loading animation then open curtain
        setTimeout(() => {
            if (curtain) {
                curtain.classList.add('curtain-open');
                // Mark as shown for this session
                sessionStorage.setItem(CURTAIN_KEY, 'true');

                // Remove from DOM after animation completes
                setTimeout(() => {
                    curtain.remove();
                }, 1400);
            }
        }, 1200);
    } else {
        // Skip curtain if already shown
        if (curtain) {
            curtain.remove();
        }
    }

    // ===========================================
    // FADE-IN SUAVE PARA SECCIONES
    // ===========================================
    const sections = document.querySelectorAll('.mb-description, .mb-album, .mb-platforms, .mb-gallery, .mb-press');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
