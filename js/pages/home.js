/* ===========================================
   HOME PAGE SPECIFIC JAVASCRIPT
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // MICHAEL BUBLÉ SECTION - SCROLL ANIMATION
    // ===========================================

    const michaelSection = document.getElementById('michael-buble-section');

    if (michaelSection) {
        let animationTriggered = false;

        // Intersection Observer to detect when section enters viewport
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.3 // Trigger when 30% of section is visible
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationTriggered) {
                    // Trigger entrance animation
                    michaelSection.classList.add('animate-in');
                    animationTriggered = true;

                    // After animation completes (1.4s), make it sticky
                    setTimeout(() => {
                        michaelSection.classList.add('is-sticky');
                    }, 1400); // Match the longest animation duration
                }
            });
        }, observerOptions);

        observer.observe(michaelSection);
    }
});
