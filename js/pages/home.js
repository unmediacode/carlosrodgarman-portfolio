/* ===========================================
   HOME PAGE SPECIFIC JAVASCRIPT
   =========================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // MICHAEL BUBLÉ SECTION - SCROLL-DRIVEN ANIMATION
    // ===========================================

    const michaelSection = document.getElementById('michael-buble-section');
    const gospelSection = document.querySelector('.featured-project--alt');
    const leftPart = document.querySelector('.heading-hero__part--left');
    const rightPart = document.querySelector('.heading-hero__part--right');

    if (michaelSection && leftPart && rightPart && gospelSection) {
        let sectionTop = 0;
        let isSticky = false;
        let animationDistance = window.innerHeight * 1.2; // Distance to complete animation (120% of viewport height)
        let animationComplete = false;

        // Update section position on resize
        function updateSectionPosition() {
            const rect = michaelSection.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            sectionTop = rect.top + scrollTop - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || 70);
        }

        // Handle scroll-driven animation
        function handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height') || 70);

            // Check if section is sticky (reached its sticky position)
            if (scrollTop >= sectionTop) {
                isSticky = true;

                // Calculate scroll progress after section becomes sticky
                const scrollProgress = scrollTop - sectionTop;

                // Calculate animation progress (0 to 1)
                // 0 = start position (off screen)
                // 1 = end position (center)
                let progress = Math.min(scrollProgress / animationDistance, 1);

                // Easing function for smoother animation
                progress = easeOutCubic(progress);

                // Calculate position for left part (from -100vw to 0)
                const leftPosition = -100 + (progress * 100);

                // Calculate position for right part (from +100vw to 0)
                const rightPosition = 100 - (progress * 100);

                // Apply transforms
                leftPart.style.transform = `translateX(${leftPosition}vw)`;
                rightPart.style.transform = `translateX(${rightPosition}vw)`;

                // Block Gospel Symphony section until parallax animation completes
                if (progress < 1) {
                    // Animation not complete - keep Gospel Symphony below
                    const pushDown = (1 - progress) * animationDistance;
                    gospelSection.style.transform = `translateY(${pushDown}px)`;
                    animationComplete = false;
                } else {
                    // Animation complete - allow Gospel Symphony to pass over
                    gospelSection.style.transform = 'translateY(0)';
                    animationComplete = true;
                }
            } else {
                isSticky = false;
                // Reset to initial positions
                leftPart.style.transform = 'translateX(-100vw)';
                rightPart.style.transform = 'translateX(100vw)';
                gospelSection.style.transform = 'translateY(0)';
            }
        }

        // Easing function for smooth animation
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        // Initialize
        updateSectionPosition();
        handleScroll();

        // Listen to scroll events
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Update on resize
        window.addEventListener('resize', function() {
            updateSectionPosition();
            handleScroll();
        });
    }
});
