/* ===========================================
   RG STUDIO PAGE SPECIFIC JAVASCRIPT
   =========================================== */

// Floating animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.rg-hero__logo');
    const description = document.querySelector('.rg-hero__description');

    if (!logo || !description) return;

    // Intersection Observer para detectar cuando el hero es visible
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Se activa cuando el 30% del elemento es visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Activar animación de flotación
                logo.classList.add('float-active');
                description.classList.add('float-active');
            } else {
                // Desactivar cuando sale del viewport (opcional)
                logo.classList.remove('float-active');
                description.classList.remove('float-active');
            }
        });
    }, observerOptions);

    // Observar el logo (usamos el logo como referencia para toda la sección hero)
    observer.observe(logo);

    // ===========================================
    // STUDIO GALLERY LIGHTBOX
    // ===========================================

    const lightbox = document.getElementById('studioLightbox');
    const thumbs = document.querySelectorAll('.studio-thumbs__item');
    const closeBtn = document.querySelector('.lightbox__close');
    const prevBtn = document.querySelector('.lightbox__prev');
    const nextBtn = document.querySelector('.lightbox__next');
    const lightboxCaption = document.querySelector('.lightbox__caption');

    let currentIndex = 0;
    const images = [
        { name: 'Control Room A', id: 'control-room' },
        { name: 'Recording Booth', id: 'recording-booth' },
        { name: 'Mixing Console', id: 'mixing-console' },
        { name: 'Equipment Rack', id: 'equipment-rack' },
        { name: 'Live Room', id: 'live-room' },
        { name: 'Lounge Area', id: 'lounge-area' }
    ];

    // Abrir lightbox al hacer click en thumbnail
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentIndex = index;
            openLightbox();
        });
    });

    // Cerrar lightbox
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Navegación anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        });
    }

    // Navegación siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        });
    }

    // Cerrar al hacer click fuera del contenido
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightbox();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightbox();
        }
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightbox();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const currentImage = images[currentIndex];
        if (lightboxCaption) {
            lightboxCaption.textContent = currentImage.name;
        }
    }

    // ===========================================
    // MICROPHONE MODALS
    // ===========================================

    const micModal = document.getElementById('micModal');
    const micBtns = document.querySelectorAll('.mic-card__btn');
    const micModalClose = document.querySelector('.mic-modal__close');
    const micModalOverlay = document.querySelector('.mic-modal__overlay');
    const micModalTitle = document.querySelector('.mic-modal__title');
    const micModalDownload = document.querySelector('.mic-modal__download');

    // Datos de los micrófonos
    const microphones = {
        'neuman-u47': {
            name: 'Neuman U47',
            manual: 'manuals/neuman-u47.pdf',
            diagram: 'diagrams/neuman-u47-polar.svg'
        },
        'neuman-149': {
            name: 'Neuman 149',
            manual: 'manuals/neuman-149.pdf',
            diagram: 'diagrams/neuman-149-polar.svg'
        },
        'sennheser-md421': {
            name: 'Sennheser MD421',
            manual: 'manuals/sennheser-md421.pdf',
            diagram: 'diagrams/sennheser-md421-polar.svg'
        },
        'royer-122': {
            name: 'Royer 122',
            manual: 'manuals/royer-122.pdf',
            diagram: 'diagrams/royer-122-polar.svg'
        },
        'philips-c12': {
            name: 'Philips C12',
            manual: 'manuals/philips-c12.pdf',
            diagram: 'diagrams/philips-c12-polar.svg'
        },
        'neuman-k185': {
            name: 'Neuman K185',
            manual: 'manuals/neuman-k185.pdf',
            diagram: 'diagrams/neuman-k185-polar.svg'
        },
        'sony-c100': {
            name: 'Sony C100',
            manual: 'manuals/sony-c100.pdf',
            diagram: 'diagrams/sony-c100-polar.svg'
        },
        'shure-sm58': {
            name: 'Shure SM58',
            manual: 'manuals/shure-sm58.pdf',
            diagram: 'diagrams/shure-sm58-polar.svg'
        },
        'shure-sm57': {
            name: 'Shure SM57',
            manual: 'manuals/shure-sm57.pdf',
            diagram: 'diagrams/shure-sm57-polar.svg'
        },
        'akg-112': {
            name: 'AKG 112',
            manual: 'manuals/akg-112.pdf',
            diagram: 'diagrams/akg-112-polar.svg'
        }
    };

    // Abrir modal al hacer click en botón de micrófono
    micBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const micId = btn.getAttribute('data-mic');
            const mic = microphones[micId];

            if (mic) {
                openMicModal(mic);
            }
        });
    });

    // Cerrar modal
    if (micModalClose) {
        micModalClose.addEventListener('click', closeMicModal);
    }

    if (micModalOverlay) {
        micModalOverlay.addEventListener('click', closeMicModal);
    }

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && micModal && micModal.classList.contains('active')) {
            closeMicModal();
        }
    });

    function openMicModal(mic) {
        if (!micModal) return;

        // Actualizar contenido del modal
        if (micModalTitle) {
            micModalTitle.textContent = mic.name;
        }

        if (micModalDownload) {
            micModalDownload.setAttribute('href', mic.manual);
            micModalDownload.setAttribute('download', `${mic.name}-manual.pdf`);
        }

        // TODO: Cuando tengas los diagramas polares, descomentar esto:
        // const diagramPlaceholder = document.querySelector('.mic-modal__diagram-placeholder');
        // if (diagramPlaceholder && mic.diagram) {
        //     diagramPlaceholder.innerHTML = `<img src="${mic.diagram}" alt="${mic.name} Polar Pattern">`;
        // }

        micModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMicModal() {
        if (!micModal) return;

        micModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // ===========================================
    // MICROPHONE CAROUSEL AUTO-SCROLL
    // ===========================================

    const micCarousel = document.querySelector('.legendary-mics-grid');
    const micPrevBtn = document.querySelector('.carousel-btn--prev');
    const micNextBtn = document.querySelector('.carousel-btn--next');

    if (micCarousel) {
        let scrollPosition = 0;
        let isScrolling = true;
        let scrollSpeed = 0.5; // pixels por frame
        let animationId;

        function autoScroll() {
            if (!isScrolling) return;

            scrollPosition += scrollSpeed;
            const maxScroll = micCarousel.scrollWidth - micCarousel.clientWidth;

            // Si llegamos al final, volver al inicio
            if (scrollPosition >= maxScroll) {
                scrollPosition = 0;
            }

            micCarousel.scrollLeft = scrollPosition;
            animationId = requestAnimationFrame(autoScroll);
        }

        // Pausar auto-scroll al hover sobre el carousel
        micCarousel.addEventListener('mouseenter', () => {
            isScrolling = false;
            cancelAnimationFrame(animationId);
        });

        micCarousel.addEventListener('mouseleave', () => {
            isScrolling = true;
            scrollPosition = micCarousel.scrollLeft;
            autoScroll();
        });

        // Navegación con botón anterior
        if (micPrevBtn) {
            micPrevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isScrolling = false;
                cancelAnimationFrame(animationId);

                micCarousel.scrollBy({
                    left: -400,
                    behavior: 'smooth'
                });

                scrollPosition = micCarousel.scrollLeft - 400;

                setTimeout(() => {
                    scrollPosition = micCarousel.scrollLeft;
                    isScrolling = true;
                    autoScroll();
                }, 2000);
            });
        }

        // Navegación con botón siguiente
        if (micNextBtn) {
            micNextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isScrolling = false;
                cancelAnimationFrame(animationId);

                micCarousel.scrollBy({
                    left: 400,
                    behavior: 'smooth'
                });

                scrollPosition = micCarousel.scrollLeft + 400;

                setTimeout(() => {
                    scrollPosition = micCarousel.scrollLeft;
                    isScrolling = true;
                    autoScroll();
                }, 2000);
            });
        }

        // Iniciar auto-scroll
        console.log('Starting microphone carousel auto-scroll');
        autoScroll();
    } else {
        console.log('Microphone carousel not found');
    }
});
