/* ===========================================
   HOME PAGE SPECIFIC JAVASCRIPT
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Efecto fade-in suave para las secciones
    const sections = document.querySelectorAll('.featured-project, .section--surface');

    const observerOptions = {
        threshold: 0.15, // La sección debe estar al menos 15% visible
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Solo animar una vez
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
