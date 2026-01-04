document.addEventListener('DOMContentLoaded', function() {
    
    // --- Typing & Bounce Animation ---
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        // Define content to type
        const part1 = "Your Gateway to Studying and ";
        const part2 = "Working Abroad";
        
        // Clear initial content
        heroTitle.innerHTML = '';
        heroTitle.classList.add('typing-cursor');
        
        // Helper function to type text
        const typeText = (element, text, speed) => {
            return new Promise(resolve => {
                let i = 0;
                function type() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        resolve();
                    }
                }
                type();
            });
        };

        // Execution Sequence
        (async function() {
            // 1. Type first part into H1
            await typeText(heroTitle, part1, 50); // 50ms per char
            
            // 2. Create and append span
            const span = document.createElement('span');
            span.classList.add('highlight');
            heroTitle.appendChild(span);
            
            // 3. Type second part into span
            await typeText(span, part2, 50);
            
            // 4. Remove cursor and add bounce animation
            heroTitle.classList.remove('typing-cursor');
            heroTitle.classList.add('bounce');
        })();
    }

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Slider/Carousel Logic ---
    const track = document.querySelector('.slider-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dotsNav = document.querySelector('.slider-nav');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');
    };

    const updateDots = (currentDot, targetDot) => {
        currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide');
    };

    const nextSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        const nextSlide = currentSlide.nextElementSibling || slides[0]; // Loop back to start
        const currentDot = dotsNav.querySelector('.current-slide');
        const nextDot = currentDot.nextElementSibling || dots[0]; // Loop dots

        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
    };

    const prevSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1]; // Loop to end
        const currentDot = dotsNav.querySelector('.current-slide');
        const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];

        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
    };

    // Click events
    nextButton.addEventListener('click', nextSlide);
    prevButton.addEventListener('click', prevSlide);

    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');

        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const currentDot = dotsNav.querySelector('.current-slide');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
    });

    // Auto-slide functionality
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
    
    // Handle window resize for responsive slider
    window.addEventListener('resize', () => {
        const newSlideWidth = slides[0].getBoundingClientRect().width;
        slides.forEach((slide, index) => {
            slide.style.left = newSlideWidth * index + 'px';
        });
        // Reset to current slide position to avoid misalignment
        const currentSlide = track.querySelector('.current-slide');
        track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
    });


    // --- Form Handling with EmailJS ---
    const contactForm = document.getElementById('application-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const country = document.getElementById('country').value;
        const purpose = document.getElementById('purpose').value;
        const message = document.getElementById('message').value;

        if (!fullName || !email || !phone || !country || !purpose) {
            formStatus.textContent = 'Please fill in all required fields.';
            formStatus.className = 'form-status error';
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const templateParams = {
            to_email: 'mdzukas2020@gmail.com',
            from_name: fullName,
            from_email: email,
            phone_number: phone,
            intended_country: country,
            travel_purpose: purpose,
            message: message
        };

        const secondaryParams = {
            ...templateParams,
            to_email: 'kbresearch23@gmail.com'
        };

        const isConfigured = true;

        if (isConfigured) {
            Promise.all([
                emailjs.send('service_sai18zg', 'template_2l3w65s', templateParams),
                emailjs.send('service_sai18zg', 'template_2l3w65s', secondaryParams)
            ])
            .then(() => {
                formStatus.textContent = 'Your details have been sent successfully. We will contact you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            })
            .catch((error) => {
                console.error('FAILED...', error);
                formStatus.textContent = 'Failed to send message. Please try again later.';
                formStatus.className = 'form-status error';
            })
            .finally(() => {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        } else {
            setTimeout(() => {
                formStatus.textContent = 'Your details have been sent successfully. (Simulation Mode)';
                formStatus.className = 'form-status success';
                contactForm.reset();
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }, 1200);
        }
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Scroll Animation (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2 // Trigger when 20% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                             
                // --- Counter Animation ---
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease-out function for smoother effect (optional)
                        // const easeProgress = 1 - Math.pow(1 - progress, 3); 
                        
                        const currentCount = Math.floor(progress * target);
                        counter.innerText = currentCount;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    
                    requestAnimationFrame(updateCount);
                });

                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Target elements for animation
    const animateElements = document.querySelectorAll('.scroll-hidden');
    animateElements.forEach(el => observer.observe(el));

    // FAQ Toggle
    const faqButtons = document.querySelectorAll('.faq-question');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('open');
                const b = i.querySelector('.faq-question');
                if (b) b.setAttribute('aria-expanded', 'false');
            });
            if (!expanded) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

});
