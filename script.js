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


    // 2. Interactive Feature Hover Selector & Detail View
    const featureDataDetail = {
        'mockup-members': {
            mainTitle: 'Members',
            subTitle: 'Member Management',
            text: '<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae obcaecati id natus dignissimos totam at incidunt ipsam odio consequatur ducimus!</p><p>Placeat assumenda. Saepe repellendus delectus minima ullam facilis laboriosam facere harum quas laudantium voluptate corrupti reiciendis ipsa, odio repudiandae ab.</p>'
        },
        'mockup-attendance': {
            mainTitle: 'Attendance',
            subTitle: 'Track Check-ins',
            text: '<p>Monitor daily attendance, track peak hours, and keep an eye on member engagement with real-time check-in data.</p>'
        },
        'mockup-memberships': {
            mainTitle: 'Memberships',
            subTitle: 'Flexible Plans',
            text: '<p>Create and manage various membership tiers, handle renewals, and track active subscriptions effortlessly.</p>'
        },
        'mockup-payments': {
            mainTitle: 'Payments',
            subTitle: 'Revenue Tracking',
            text: '<p>Automate billing, track overdue payments, and get a clear overview of your monthly revenue streams.</p>'
        },
        'mockup-workouts': {
            mainTitle: 'Workouts',
            subTitle: 'Program Design',
            text: '<p>Assign workout plans, track member progress, and build custom exercise libraries for your trainers.</p>'
        },
        'mockup-crm': {
            mainTitle: 'CRM',
            subTitle: 'Client Relations',
            text: '<p>Automate follow-ups, send targeted communications, and never miss an opportunity to engage with your leads and members.</p>'
        },
        'mockup-analytics': {
            mainTitle: 'Analytics',
            subTitle: 'Business Insights',
            text: '<p>Get deep insights into retention rates, month-over-month growth, and overall business health with powerful analytics.</p>'
        }
    };

    const featureItems = document.querySelectorAll('.feature-item');
    const combinedMockupContainer = document.getElementById('combined-mockup-container');
    const combinedSubtitle = document.getElementById('combined-subtitle');
    const combinedText = document.getElementById('combined-text');
    const hiddenMockups = document.getElementById('hidden-mockups');

    if (featureItems.length > 0 && combinedMockupContainer) {
        featureItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Update active state for list items
                featureItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');

                const targetId = item.getAttribute('data-target');
                const data = featureDataDetail[targetId];
                if (!data) return;

                // Update text content
                if (combinedSubtitle) combinedSubtitle.textContent = data.subTitle;
                if (combinedText) combinedText.innerHTML = data.text;

                // Update Mockup Box
                if (hiddenMockups) {
                    const targetMockup = hiddenMockups.querySelector(`#${targetId}`);
                    combinedMockupContainer.innerHTML = '';
                    if (targetMockup && targetMockup.children.length > 0) {
                        const clonedBox = targetMockup.children[0].cloneNode(true);
                        combinedMockupContainer.appendChild(clonedBox);
                    }
                }

                // Add a smooth fade-in animation to the newly injected content
                gsap.fromTo([combinedMockupContainer.children[0], combinedSubtitle, combinedText], 
                    { opacity: 0, y: 10 }, 
                    { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
                );
            });
        });
    }

    // 3. Footer Aurora Bars Animation
    function initAuroraBars() {
        const container = document.getElementById('footerAurora');
        if (!container) return;

        const barCount = 30; // Matches React default feel but tweaked for full width
        const minHeightRatio = 0.18;
        const maxHeightRatio = 0.92;
        const speed = 0.5;
        
        const bars = [];
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'aurora-bar';
            container.appendChild(bar);
            bars.push(bar);
        }

        let startTime = performance.now();

        function animate(currentTime) {
            const elapsed = (currentTime - startTime) / 1000;
            const time = elapsed * speed;

            bars.forEach((bar, index) => {
                const norm = index / (barCount - 1);
                const arch = Math.sin(norm * Math.PI);
                const phase1 = (index / barCount) * Math.PI * 2;
                const phase2 = (index / barCount) * Math.PI * 5.3;
                const wave = 0.5 + 0.25 * Math.sin(time * 1.1 + phase1) + 0.25 * Math.sin(time * 0.7 + phase2);
                const blended = arch * 0.65 + wave * 0.35;
                const heightFraction = minHeightRatio + blended * (maxHeightRatio - minHeightRatio);
                
                bar.style.height = `${heightFraction * 100}%`;
            });

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    initAuroraBars();

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

    // 6. Infinite Scroller Animation
    const scrollerTrack = document.querySelector('.scroller-track');
    const scrollerCards = document.querySelectorAll('.scroller-card');
    const scrollerTitle = document.querySelector('.scroller-active-title');
    const scrollerDesc = document.querySelector('.scroller-active-desc');
    const scrollerTextArea = document.querySelector('.scroller-text-area');
    
    if (scrollerTrack && scrollerCards.length > 0) {
        const scrollerDetails = [
            { title: "Create", desc: "Build your event from the ground up with custom registration forms and ticketing." },
            { title: "Discover", desc: "Reach athletes globally through the STRON marketplace." },
            { title: "Register", desc: "Provide frictionless sign-ups and automated confirmations." },
            { title: "Participate", desc: "Engage users with live leaderboards and interactive tracking." },
            { title: "Complete", desc: "Publish official results and distribute finisher badges." },
            { title: "Review", desc: "Gather feedback and analyze your event's success." }
        ];
        
        const totalOriginalCards = 6;
        let currentIndex = 0;
        
        function updateScrollerState() {
            scrollerCards.forEach((card, index) => {
                if (index === currentIndex || index === currentIndex + totalOriginalCards) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            
            const cardHeight = scrollerCards[0].offsetHeight;
            const style = window.getComputedStyle(scrollerTrack);
            const gap = parseFloat(style.gap) || 24;
            const moveAmount = currentIndex * (cardHeight + gap);
            
            scrollerTrack.style.transform = `translateY(-${moveAmount}px)`;
            
            scrollerTextArea.classList.add('fade-out');
            setTimeout(() => {
                const dataIndex = currentIndex % totalOriginalCards;
                scrollerTitle.innerText = scrollerDetails[dataIndex].title;
                scrollerDesc.innerText = scrollerDetails[dataIndex].desc;
                scrollerTextArea.classList.remove('fade-out');
            }, 300);
        }
        
        updateScrollerState();
        
        setInterval(() => {
            currentIndex++;
            scrollerTrack.classList.remove('no-transition');
            updateScrollerState();
            
            if (currentIndex === totalOriginalCards) {
                setTimeout(() => {
                    scrollerTrack.classList.add('no-transition');
                    currentIndex = 0;
                    scrollerTrack.style.transform = `translateY(0px)`;
                    // Update active classes without triggering text fade
                    scrollerCards.forEach((card, index) => {
                        if (index === 0) card.classList.add('active');
                        else card.classList.remove('active');
                    });
                }, 600); // Wait for transition duration
            }
        }, 3500);
    }
    
    // 7. FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            // If it wasn't open, open it
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

});
