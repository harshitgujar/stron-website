// STRON - Interactive scripts

document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP ScrollTrigger Setup
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Section animations
        gsap.utils.toArray('.saas-section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });
        });
    }

    

    // 3. Sticky Nav Logic (Native Scroll)
    const stickyNav = document.getElementById('sticky-nav');
    if (stickyNav) {
        let scrollTimeout;
        let lastY = 0;
        
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            const heroThreshold = window.innerHeight * 0.5;
            
            if (currentY > heroThreshold) {
                if (currentY > lastY) {
                    // Scrolling down - hide
                    stickyNav.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up - show
                    stickyNav.style.transform = 'translateY(0px)';
                }
                
                lastY = currentY;
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    stickyNav.style.transform = 'translateY(0px)';
                }, 150); 
            } else {
                stickyNav.style.transform = 'translateY(-100%)';
                clearTimeout(scrollTimeout);
            }
        }, { passive: true });
    }

    // 4. Section 2 Feature Interaction / Tab switching
    const listItems = document.querySelectorAll('.saas-feature-item');
    const pixelMockupImg = document.getElementById('pixelMockupImg');

    const imageMap = {
        '1': 'assets/3r23-1.png',
        '2': 'assets/ws-1.png',
        '3': 'assets/ws-1.png',
        '4': 'assets/3r23-1.png'
    };

    if (listItems.length > 0) {
        listItems.forEach(item => {
            const activateItem = () => {
                listItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                const featureId = item.getAttribute('data-feature');
                if (pixelMockupImg && imageMap[featureId]) {
                    pixelMockupImg.src = imageMap[featureId];
                }

                if (pixelMockupImg && typeof gsap !== 'undefined') {
                    gsap.fromTo(pixelMockupImg, 
                        { scale: 0.98, opacity: 0.9 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            };

            item.addEventListener('mouseenter', activateItem);
            item.addEventListener('click', activateItem);
        });
    }

    // 5. Events Staggered Carousel Controls
    const eventsViewport = document.getElementById('eventsCarouselViewport');
    const eventsPrevBtn = document.getElementById('eventsPrevBtn');
    const eventsNextBtn = document.getElementById('eventsNextBtn');

    if (eventsViewport && eventsPrevBtn && eventsNextBtn) {
        function getScrollStep() {
            const firstCard = eventsViewport.querySelector('.stagger-col');
            if (!firstCard) return 360;
            const style = window.getComputedStyle(eventsViewport.querySelector('.staggered-carousel-track'));
            const gap = parseFloat(style.gap) || 48;
            return firstCard.offsetWidth + gap;
        }

        function updateCarouselButtons() {
            const maxScroll = eventsViewport.scrollWidth - eventsViewport.clientWidth;
            eventsPrevBtn.disabled = eventsViewport.scrollLeft <= 5;
            eventsNextBtn.disabled = eventsViewport.scrollLeft >= maxScroll - 5;
        }

        eventsNextBtn.addEventListener('click', () => {
            const step = getScrollStep();
            const maxScroll = eventsViewport.scrollWidth - eventsViewport.clientWidth;
            if (eventsViewport.scrollLeft >= maxScroll - 10) {
                eventsViewport.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                eventsViewport.scrollBy({ left: step, behavior: 'smooth' });
            }
        });

        eventsPrevBtn.addEventListener('click', () => {
            const step = getScrollStep();
            const maxScroll = eventsViewport.scrollWidth - eventsViewport.clientWidth;
            if (eventsViewport.scrollLeft <= 10) {
                eventsViewport.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                eventsViewport.scrollBy({ left: -step, behavior: 'smooth' });
            }
        });

        eventsViewport.addEventListener('scroll', updateCarouselButtons, { passive: true });
        updateCarouselButtons();
    }
    
    // 7. Editorial FAQ Accordion Logic
    const faqCardItems = document.querySelectorAll('.faq-card-item');
    
    if (faqCardItems.length > 0) {
        faqCardItems.forEach(item => {
            const header = item.querySelector('.faq-card-header');
            if (!header) return;

            header.addEventListener('click', (e) => {
                e.preventDefault();
                const isActive = item.classList.contains('active');
                
                faqCardItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherBtn = otherItem.querySelector('.faq-card-header');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });
                
                if (isActive) {
                    item.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // 8. Reviews Carousel Logic
    const reviewCards = Array.from(document.querySelectorAll('.review-card-tilted'));
    const btnPrev = document.getElementById('btn-prev-review');
    const btnNext = document.getElementById('btn-next-review');
    const carouselContainer = document.getElementById('reviews-carousel');

    if (reviewCards.length > 0 && btnPrev && btnNext) {
        const totalCards = reviewCards.length;
        let activeIndex = 1;
        let isAnimating = false;

        function updateCarousel() {
            reviewCards.forEach((card, i) => {
                const diff = (i - activeIndex + totalCards) % totalCards;
                card.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden-left', 'pos-hidden-right');

                if (diff === 0) {
                    card.classList.add('pos-center');
                } else if (diff === 1) {
                    card.classList.add('pos-right');
                } else if (diff === totalCards - 1) {
                    card.classList.add('pos-left');
                } else if (diff <= Math.floor(totalCards / 2)) {
                    card.classList.add('pos-hidden-right');
                } else {
                    card.classList.add('pos-hidden-left');
                }
            });
        }

        function nextSlide() {
            if (isAnimating) return;
            isAnimating = true;
            activeIndex = (activeIndex + 1) % totalCards;
            updateCarousel();
            setTimeout(() => { isAnimating = false; }, 400);
        }

        function prevSlide() {
            if (isAnimating) return;
            isAnimating = true;
            activeIndex = (activeIndex - 1 + totalCards) % totalCards;
            updateCarousel();
            setTimeout(() => { isAnimating = false; }, 400);
        }

        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });

        reviewCards.forEach((card) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('pos-left')) {
                    prevSlide();
                } else if (card.classList.contains('pos-right')) {
                    nextSlide();
                }
            });
        });

        if (carouselContainer) {
            let touchStartX = 0;
            let touchEndX = 0;

            carouselContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carouselContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDist = touchEndX - touchStartX;
                if (Math.abs(swipeDist) > 40) {
                    if (swipeDist < 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            }, { passive: true });
        }

        document.addEventListener('keydown', (e) => {
            if (!carouselContainer) return;
            const rect = carouselContainer.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                if (e.key === 'ArrowRight') nextSlide();
                else if (e.key === 'ArrowLeft') prevSlide();
            }
        });

        updateCarousel();
    }
});
