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
        // 3. Unified Smart Scroll Navigation (Hide on Scroll Down, Show on Scroll Stop & Up in all sections)
    const navbar = document.querySelector('.nav.new-nav');
    if (navbar) {
        let scrollTimeout;
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // At the top of the page, keep navbar visible
            if (currentScrollY <= 40) {
                navbar.style.transform = 'translateY(0)';
                clearTimeout(scrollTimeout);
                lastScrollY = currentScrollY;
                return;
            }
            
            if (currentScrollY > lastScrollY && currentScrollY > 60) {
                // Scrolling down -> smoothly slide up and hide
                navbar.style.transform = 'translateY(-100%)';
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up -> immediately slide down into view
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
            
            // When user stops scrolling in ANY section -> slide down into view
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                navbar.style.transform = 'translateY(0)';
            }, 180);
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


    // 9. STRON Directory Live Filter & Search Logic (Gyms & Run Clubs)
    const dirSearchInput = document.getElementById('directorySearchInput');
    const cityChips = document.querySelectorAll('.city-filter-chip');
    const dirCards = document.querySelectorAll('.directory-card');
    const noResultsMsg = document.getElementById('directoryNoResults');

    if (dirCards.length > 0) {
        let activeCity = 'all';
        let searchQuery = '';

        function filterDirectory() {
            let visibleCount = 0;
            const query = searchQuery.toLowerCase().trim();

            dirCards.forEach(card => {
                const name = (card.getAttribute('data-name') || '').toLowerCase();
                const city = (card.getAttribute('data-city') || '').toLowerCase();
                const loc = (card.getAttribute('data-location') || '').toLowerCase();
                const tags = (card.getAttribute('data-tags') || '').toLowerCase();

                const matchesCity = (activeCity === 'all' || city === activeCity.toLowerCase());
                const matchesSearch = !query || name.includes(query) || city.includes(query) || loc.includes(query) || tags.includes(query);

                if (matchesCity && matchesSearch) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResultsMsg) {
                noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
            }
        }

        if (dirSearchInput) {
            dirSearchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                filterDirectory();
            });
        }

        if (cityChips.length > 0) {
            cityChips.forEach(chip => {
                chip.addEventListener('click', (e) => {
                    e.preventDefault();
                    cityChips.forEach(c => c.classList.remove('active'));
                    chip.classList.add('active');
                    activeCity = chip.getAttribute('data-city-filter') || 'all';
                    filterDirectory();
                });
            });
        }
    }

});
