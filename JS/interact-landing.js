/* JAVASCRIPT FOR INTERACTIVE ELEMENTS
    1. Hamburger Menu Toggle
    2. CTA Button Modal/Alert
    3. Soft Fade-in Animations on Scroll
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. HAMBURGER MENU TOGGLE ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('main-nav');
    const headerCta = document.getElementById('header-cta-btn');
    
    // Function to handle the CTA click (shows modal)
    const handleCtaClick = () => {
        const modal = document.getElementById('cta-modal');
        if (modal) {
            modal.classList.add('active');
        } else {
            alert("Thanks for your interest! We'll contact you shortly.");
        }
    };

    if (hamburger && navMenu) {
        // --- Mobile CTA Handling (Cloning the header button into the mobile menu) ---
        if (window.innerWidth <= 768 && headerCta) {
            // Clone the button for the mobile menu
            const mobileCtaClone = headerCta.cloneNode(true);
            mobileCtaClone.id = 'mobile-cta-btn'; // Unique ID
            
            // Re-apply the click listener to the clone
            mobileCtaClone.addEventListener('click', handleCtaClick);

            // Create a wrapper div to match the nav-link styling/spacing
            const ctaWrapper = document.createElement('div');
            ctaWrapper.classList.add('nav-link');
            // Remove bottom border for the button wrapper
            ctaWrapper.style.borderBottom = 'none'; 
            
            // Adjust clone style for better fit in the vertical menu
            mobileCtaClone.style.margin = '10px auto'; 
            mobileCtaClone.style.display = 'flex';
            mobileCtaClone.style.width = 'fit-content';
            mobileCtaClone.style.padding = '10px 20px';
            
            ctaWrapper.appendChild(mobileCtaClone);
            navMenu.appendChild(ctaWrapper);
        }

        // --- Hamburger Toggle Logic ---
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle icon (bars to times/close)
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.main-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.querySelector('i').classList.remove('fa-times');
                    hamburger.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }


    // --- 2. CTA BUTTON MODAL/ALERT FUNCTIONALITY ---
    const bookCallBtn = document.getElementById('book-call-btn');
    const modal = document.getElementById('cta-modal');
    const closeButton = document.querySelector('.modal-content .close-button');


    // Attach click listeners to all relevant CTA buttons
    if (bookCallBtn) {
        bookCallBtn.addEventListener('click', handleCtaClick);
    }
    if (headerCta) {
        headerCta.addEventListener('click', handleCtaClick);
    }

    // Modal closing logic
    if (closeButton && modal) {
        closeButton.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }


    // --- 3. SOFT FADE-IN ANIMATIONS ON SCROLL (Intersection Observer) ---
    
    const elementsToAnimate = document.querySelectorAll('[data-animation="fade-in"]');

    if (elementsToAnimate.length > 0) {
        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of element visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Check if element is visible and transition delay has passed
                if (entry.isIntersecting) {
                    // Use setTimeout to respect the CSS transition-delay property set in HTML
                    const delay = parseFloat(entry.target.style.transitionDelay || 0) * 1000;
                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }, delay);
                }
            });
        }, observerOptions);

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

});