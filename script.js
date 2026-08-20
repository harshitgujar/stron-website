// STRON - Interactive scripts

document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP + Locomotive Scroll Setup
    gsap.registerPlugin(ScrollTrigger);

    const locoScroll = new LocomotiveScroll({
        el: document.querySelector("[data-scroll-container]"),
        smooth: true,
        multiplier: 1
    });

    locoScroll.on("scroll", ScrollTrigger.update);

    // Sticky Nav Logic: Show when scrolling stops
    const stickyNav = document.getElementById('sticky-nav');
    if (stickyNav) {
        let scrollTimeout;
        let isScrolling = false;
        
        locoScroll.on('scroll', (args) => {
            // Only show sticky nav if we've scrolled down a bit (e.g., past the hero section)
            if (args.scroll.y > 200) {
                if (!isScrolling) {
                    // Start scrolling - hide nav
                    stickyNav.style.transform = 'translateY(-100%)';
                }
                isScrolling = true;
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Stopped scrolling - show nav
                    isScrolling = false;
                    stickyNav.style.transform = 'translateY(0)';
                }, 350); // wait 350ms after scroll stops
            } else {
                // If near the top, hide the sticky nav completely since the original nav is visible
                stickyNav.style.transform = 'translateY(-100%)';
                clearTimeout(scrollTimeout);
                isScrolling = false;
            }
        });
    }


    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });

    // Smooth scroll for Contact Us
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const footer = document.querySelector('#contact');
            if (footer && locoScroll) {
                locoScroll.scrollTo(footer);
            }
        });
    });


    
    // Handle initial hash routing for locomotive scroll
    setTimeout(() => {
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target && locoScroll) {
                locoScroll.scrollTo(target);
            }
        }
    }, 500); // Wait for layout to settle


    // Standard fade-in for section containers
    const fadeElements = gsap.utils.toArray('.fade-in');
    fadeElements.forEach((el) => {
        gsap.fromTo(el, 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    scroller: "[data-scroll-container]",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Stagger animation for grid cards
    gsap.utils.toArray('.grid-3').forEach(grid => {
        gsap.fromTo(grid.children, 
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: grid,
                    scroller: "[data-scroll-container]",
                    start: "top 85%",
                }
            }
        );
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();


    // 2. Interactive Feature Accordion & Dynamic Mockup Showcase
    const featureScreens = {
        'members': {
            pill: 'MEMBERS',
            title: 'Member Directory',
            statNum: '1,248',
            statLbl: 'Active Members',
            bg: 'linear-gradient(135deg, #3385ff, #7928ca)'
        },
        'attendance': {
            pill: 'ATTENDANCE',
            title: 'Live Check-in Hub',
            statNum: '94.2%',
            statLbl: 'Weekly Check-in Rate',
            bg: 'linear-gradient(135deg, #00c3ff, #0a66f0)'
        },
        'memberships': {
            pill: 'PLANS & PASSES',
            title: 'Tiered Memberships',
            statNum: '4 Tiers',
            statLbl: 'Auto-Renew Enabled',
            bg: 'linear-gradient(135deg, #ff2d78, #ff8c00)'
        },
        'payments': {
            pill: 'FINANCE',
            title: 'Automated Billing',
            statNum: '$42,850',
            statLbl: 'Processed This Month',
            bg: 'linear-gradient(135deg, #00ff87, #0a66f0)'
        },
        'workouts': {
            pill: 'PROGRAMMING',
            title: 'Workout Engine',
            statNum: '320+',
            statLbl: 'Custom WODs Logged',
            bg: 'linear-gradient(135deg, #7928ca, #ff007f)'
        },
        'crm': {
            pill: 'CRM & LEADS',
            title: 'Lead Pipeline',
            statNum: '84%',
            statLbl: 'Lead-to-Trial Conversion',
            bg: 'linear-gradient(135deg, #f12711, #f5af19)'
        },
        'analytics': {
            pill: 'ANALYTICS',
            title: 'Business Health',
            statNum: '91.8%',
            statLbl: 'Quarterly Member Retention',
            bg: 'linear-gradient(135deg, #11998e, #38ef7d)'
        }
    };

    const accordionItems = document.querySelectorAll('.feature-acc-item');
    const pixelMockupImg = document.getElementById('pixelMockupImg');

    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const activateItem = () => {
                const isActive = item.classList.contains('active');
                if (isActive) return;

                // Toggle active classes
                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                if (pixelMockupImg && typeof gsap !== 'undefined') {
                    gsap.fromTo(pixelMockupImg, 
                        { scale: 0.98, opacity: 0.9 },
                        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
                    );
                }
            };

            // Switch interaction to hover (mouseenter) while retaining touch support
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
                
                // Optional: Close other items for single-open behavior
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
    // 8. Reviews Carousel Logic (Queue with Swapping 3D Rotation)
    const reviewCards = Array.from(document.querySelectorAll('.review-card-tilted'));
    const btnPrev = document.getElementById('btn-prev-review');
    const btnNext = document.getElementById('btn-next-review');
    const carouselContainer = document.getElementById('reviews-carousel');

    if (reviewCards.length > 0 && btnPrev && btnNext) {
        const totalCards = reviewCards.length; // 6 cards
        let activeIndex = 1; // start with Alex R (index 1) in center, Sarah (0) on left, David (2) on right
        let isAnimating = false;

        function updateCarousel() {
            reviewCards.forEach((card, i) => {
                // Calculate circular offset relative to activeIndex
                const diff = (i - activeIndex + totalCards) % totalCards;

                // Reset all position classes
                card.classList.remove('pos-center', 'pos-left', 'pos-right', 'pos-hidden-left', 'pos-hidden-right');

                if (diff === 0) {
                    // Center Active Card
                    card.classList.add('pos-center');
                } else if (diff === 1) {
                    // Immediate Right Card
                    card.classList.add('pos-right');
                } else if (diff === totalCards - 1) {
                    // Immediate Left Card
                    card.classList.add('pos-left');
                } else if (diff <= Math.floor(totalCards / 2)) {
                    // Waiting in Right Queue
                    card.classList.add('pos-hidden-right');
                } else {
                    // Waiting in Left Queue
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

        // Button clicks
        btnNext.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });

        btnPrev.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });

        // Direct card click support (Click left card -> rotate left; Click right card -> rotate right)
        reviewCards.forEach((card) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('pos-left')) {
                    prevSlide();
                } else if (card.classList.contains('pos-right')) {
                    nextSlide();
                }
            });
        });

        // Touch swipe support for mobile
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
                        nextSlide(); // swipe left -> next
                    } else {
                        prevSlide(); // swipe right -> prev
                    }
                }
            }, { passive: true });
        }

        // Keyboard arrow support when in view
        document.addEventListener('keydown', (e) => {
            if (!carouselContainer) return;
            const rect = carouselContainer.getBoundingClientRect();
            const isInView = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInView) {
                if (e.key === 'ArrowRight') nextSlide();
                else if (e.key === 'ArrowLeft') prevSlide();
            }
        });

        // Initial setup
        updateCarousel();
    }

});
