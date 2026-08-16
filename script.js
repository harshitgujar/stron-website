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

    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
        },
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });

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
    const mockupScreen = document.getElementById('feature-mockup-screen');

    if (accordionItems.length > 0 && mockupScreen) {
        accordionItems.forEach(item => {
            item.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                if (isActive) return;

                // Toggle active classes
                accordionItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const featureKey = item.getAttribute('data-feature');
                const screenData = featureScreens[featureKey];
                if (!screenData) return;

                // Animate mockup screen transition with GSAP
                const currentCard = mockupScreen.querySelector('.feature-screen-card');
                if (currentCard && typeof gsap !== 'undefined') {
                    gsap.to(currentCard, {
                        opacity: 0,
                        y: 12,
                        scale: 0.96,
                        duration: 0.35,
                        ease: "power2.inOut",
                        onComplete: () => {
                            mockupScreen.innerHTML = `
                                <div class="feature-screen-card" style="background: ${screenData.bg}; opacity: 0; transform: translateY(-12px) scale(0.96);">
                                    <div class="screen-pill">${screenData.pill}</div>
                                    <div class="screen-title">${screenData.title}</div>
                                    <div class="screen-stats">
                                        <div class="stat-num">${screenData.statNum}</div>
                                        <div class="stat-lbl">${screenData.statLbl}</div>
                                    </div>
                                </div>
                            `;
                            const newCard = mockupScreen.querySelector('.feature-screen-card');
                            if (newCard) {
                                gsap.fromTo(newCard, 
                                    { opacity: 0, y: -12, scale: 0.96 },
                                    { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "power2.out" }
                                );
                            }
                        }
                    });
                } else if (currentCard) {
                    currentCard.style.opacity = '0';
                    setTimeout(() => {
                        mockupScreen.innerHTML = `
                            <div class="feature-screen-card" style="background: ${screenData.bg}; opacity: 0; transform: translateY(-10px) scale(0.96);">
                                <div class="screen-pill">${screenData.pill}</div>
                                <div class="screen-title">${screenData.title}</div>
                                <div class="screen-stats">
                                    <div class="stat-num">${screenData.statNum}</div>
                                    <div class="stat-lbl">${screenData.statLbl}</div>
                                </div>
                            </div>
                        `;
                        requestAnimationFrame(() => {
                            const newCard = mockupScreen.querySelector('.feature-screen-card');
                            if (newCard) {
                                newCard.style.opacity = '1';
                                newCard.style.transform = 'translateY(0) scale(1)';
                            }
                        });
                    }, 200);
                }
            });
        });
    }



    // 5. Scramble Text Animation
    class TextScrambler {
        constructor(node) {
            this.node = node;
            this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
            this.originalText = node.nodeValue;
            this.queue = [];
        }
        
        setText(newText) {
            const oldText = this.originalText || '';
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += char;
                } else {
                    output += from;
                }
            }
            this.node.nodeValue = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const scrambleElements = document.querySelectorAll('.scramble');
    
    // Helper to find all text nodes inside an element
    function getTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === 3) {
            if (node.nodeValue.trim() !== '') {
                textNodes.push(node);
            }
        } else {
            for (let child of node.childNodes) {
                textNodes.push(...getTextNodes(child));
            }
        }
        return textNodes;
    }
    
    const scrambleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            
            // First time setup to store original text nodes
            if (!el.textNodesCache) {
                el.textNodesCache = getTextNodes(el).map(node => ({
                    node: node,
                    originalText: node.nodeValue,
                    fx: new TextScrambler(node)
                }));
            }

            if (entry.isIntersecting) {
                // Scramble again!
                el.textNodesCache.forEach(cacheItem => {
                    cacheItem.node.nodeValue = ''; // Clear it out initially
                    cacheItem.fx.setText(cacheItem.originalText);
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
    });

    scrambleElements.forEach(el => scrambleObserver.observe(el));

    // 6. Events Staggered Carousel Controls
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
