document.addEventListener('DOMContentLoaded', function() {
	// Define this function globally so reCAPTCHA can call it
    window.onSubmitRecaptcha = function() {
        const form = document.getElementById('contactForm'); // Get your form by its ID
        if (form) {
            form.submit(); // Submit the form programmatically

            // Optional: Provide immediate user feedback after submission
            const recaptchaWrapper = document.querySelector('.recaptcha-wrapper');
            if (recaptchaWrapper) {
                recaptchaWrapper.innerHTML = '<p style="text-align: center; color: green; font-weight: bold;">Message sent successfully!</p>';
            }
            // You might also want to clear form fields here or redirect the user
            form.reset();
        } else {
            console.error("Contact form with ID 'contactForm' not found for reCAPTCHA submission.");
        }
    };
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinksContainer = document.querySelector('.nav-links');

    let observer;
    let lastScrollY = window.scrollY;

    function setupIntersectionObserver() {
        // Disconnect existing observer if it exists
        if (observer) {
            observer.disconnect();
        }

        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    entry.target.classList.remove('is-fading');
                } else {
                    // Optional: remove is-visible when out of view, if you want re-triggering or different effect
                    // entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach((item) => {
            item.classList.add('is-fading'); // Ensure fade-in elements start faded
            observer.observe(item);
        });
    }

    function setupFooterObserver() {
        // Disconnect previous footer observer if it exists
        if (window.footerObserver) {
            window.footerObserver.disconnect();
        }

        const footerElement = document.querySelector('footer');
        if (footerElement) {
            window.footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        header.classList.add('hide-on-footer');
                    } else {
                        header.classList.remove('hide-on-footer');
                    }
                });
            }, { threshold: 0.1 }); // Adjust threshold as needed
            window.footerObserver.observe(footerElement);
        }
    }


    const pageMetas = {
        'home': {
            title: 'BLACKRIDGE | Welcome Home',
            description: 'Discover exceptional rental solutions in Dallas, TX for traveling professionals, corporate teams, and families. High-quality properties and seamless service.'
        },
        'about': {
            title: 'BLACKRIDGE | About Us - Exceptional Living Solutions',
            description: 'Learn about BLACKRIDGE Management\'s commitment to providing high-quality, comfortable, and convenient extended-stay housing in Dallas, TX.'
        },
        'for-businesses': {
            title: 'BLACKRIDGE | For Businesses - Corporate Housing',
            description: 'Streamlined corporate housing and extended-stay solutions for businesses in Dallas, TX. Flexible, comfortable, and reliable.',
            'og:image': 'https://res.cloudinary.com/dbdcudh2u/image/upload/v1751496878/for-businesses-preview_l0g4c3.png'
        },
        'for-tenants': {
            title: 'BLACKRIDGE | For Tenants - Extended Stays',
            description: 'Find your perfect home away from home with BLACKRIDGE. Comfortable, fully-equipped properties for extended stays in Dallas, TX.',
            'og:image': 'https://res.cloudinary.com/dbdcudh2u/image/upload/v1751496878/for-tenants-preview_f0p92g.png'
        },
        'properties': {
            title: 'BLACKRIDGE | Our Properties - Dallas Extended Stays',
            description: 'Explore high-quality, fully-furnished properties available for extended stays in prime Dallas, TX locations with BLACKRIDGE Management.'
        },
        'services': {
            title: 'BLACKRIDGE | Our Services - Dedicated Support',
            description: 'Comprehensive support services from BLACKRIDGE Management: responsive guest assistance, professional cleaning, and proactive maintenance for your peace of mind.'
        },
        'contact': {
            title: 'BLACKRIDGE | Contact Us - Get In Touch',
            description: 'Contact BLACKRIDGE Management for exceptional living solutions and extended stays in Dallas, TX. Reach out for inquiries, bookings, and support.'
        },
        'terms': {
            title: 'BLACKRIDGE | Terms & Conditions',
            description: 'Review the Terms & Conditions for BLACKRIDGE Management\'s extended stay and rental services.'
        },
        'privacy': {
            title: 'BLACKRIDGE | Privacy Policy',
            description: 'Understand BLACKRIDGE Management\'s Privacy Policy regarding data collection and usage for our extended stay services.'
        },
        'cookies': {
            title: 'BLACKRIDGE | Cookie Policy',
            description: 'Learn about the use of cookies on the BLACKRIDGE Management website in our detailed Cookie Policy.'
        },
        'accessibility': {
            title: 'BLACKRIDGE | Accessibility Statement',
            description: 'BLACKRIDGE Management\'s commitment to accessibility for all users of our website and services.'
        }
    };


    const updateMetaTags = (pageData) => {
        if (!pageData) return;

        document.title = pageData.title || 'BLACKRIDGE | Welcome Home';
        document.querySelector('meta[name="description"]').setAttribute('content', pageData.description || 'Discover exceptional rental solutions in Dallas, TX for traveling professionals, corporate teams, and families. High-quality properties and seamless service.');

        // Update Open Graph (OG) and Twitter meta tags dynamically
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', pageData.title || ogTitle.getAttribute('content'));
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) ogDescription.setAttribute('content', pageData.description || ogDescription.getAttribute('content'));
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', location.href); // Always update with current URL

        // Update OG Image (use page-specific image if available, else default)
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', pageData['og:image'] || 'https://res.cloudinary.com/dbdcudh2u/image/upload/v1751496878/preview-banner_gl73lj.png');
        }
        // Also update twitter:image if it exists and has a specific 'src'
        const twitterImageSrc = document.querySelector('meta[name="twitter:image:src"]');
        if (twitterImageSrc) {
            twitterImageSrc.setAttribute('content', pageData['og:image'] || 'https://res.cloudinary.com/dbdcudh2u/image/upload/v1751496878/preview-banner_gl73lj.png');
        }
    };

    const loadPage = async (pageName) => {
        mainContent.classList.add('is-fading');
        const pagePath = `pages/${pageName}.html`; // This is the internal path to fetch

        try {
            const response = await fetch(pagePath);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Page not found');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            mainContent.innerHTML = content;

            // Handle specific styles for the home page hero
            const existingHomeHeroStyle = document.getElementById('home-hero-style');
            if (pageName === 'home') {
                if (!existingHomeHeroStyle) {
                    const homeHeroStyle = document.createElement('style');
                    homeHeroStyle.id = 'home-hero-style'; // Give it an ID to find later
                    homeHeroStyle.textContent = ".hero { background-image: linear-gradient(rgba(26, 42, 77, 0.6), rgba(26, 42, 77, 0.6)), url('/images/hero-home.jpg'); }";
                    document.head.appendChild(homeHeroStyle);
                }
            } else {
                if (existingHomeHeroStyle) {
                    existingHomeHeroStyle.remove();
                }
            }

            updateMetaTags(pageMetas[pageName]); // Update meta tags with page-specific data

            // Re-run setup functions for newly loaded content
            setupIntersectionObserver();
            setupFooterObserver();
            mainContent.classList.remove('is-fading');

        } catch (error) {
            // Display a generic "Page Not Found" if content loading fails
            mainContent.innerHTML = `<section class="page-header text-center fade-in"><div class="container"><h1>Page Not Found</h1><p>The content you're looking for doesn't exist.</p></div></section>`;
            mainContent.classList.remove('is-fading');
            setupIntersectionObserver(); // Ensure error message also fades in
            setupFooterObserver();
            console.error('Error loading page:', error);
        }
    };

    // Helper to get the canonical page name from a URL path
    const getPageNameFromPath = (path) => {
        let page = 'home'; // Default

        if (path.startsWith('/')) {
            path = path.substring(1); // Remove leading slash
        }

        if (path.startsWith('pages/')) {
            // If path is like "pages/services.html"
            const filename = path.split('/').pop(); // Gets "services.html"
            page = filename.replace('.html', ''); // Gets "services"
        } else if (path) {
            // For paths like "services", "about", etc.
            page = path;
        }
        return page;
    };

    // Initial page load based on current URL
    const initialPageFromUrl = getPageNameFromPath(location.pathname);
    loadPage(initialPageFromUrl);


    document.body.addEventListener('click', (e) => {
        const targetLink = e.target.closest('a[data-page]');
        if (targetLink) {
            e.preventDefault(); // Prevent default link behavior

            const page = targetLink.getAttribute('data-page'); // Get page name from data-page attribute
            const newPath = `/${page}`;

            // Only push state and load page if the URL is actually changing
            if (location.pathname !== newPath) {
                history.pushState({ page }, '', newPath); // Update browser URL
                loadPage(page); // Load the new page content
            }
        }
    });

    window.addEventListener('popstate', (e) => {
        // When browser back/forward buttons are used
        const pageFromState = e.state && e.state.page;
        if (pageFromState) {
            // If popstate provides a page (from pushState), use it
            loadPage(pageFromState);
        } else {
            // Fallback for direct URL entry or if state is null (e.g., initial load after refresh)
            const currentPageFromUrl = getPageNameFromPath(location.pathname);
            loadPage(currentPageFromUrl);
        }
    });

    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        mobileMenuButton.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                mobileMenuButton.classList.remove('active');
            }
        });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
        if (!navLinksContainer.contains(e.target) && !mobileMenuButton.contains(e.target) && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            mobileMenuButton.classList.remove('active');
        }
    });


    // Hide header on scroll down, show on scroll up
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            // Scrolling down and past header height
            header.classList.add('hide-header');
        } else if (currentScrollY < lastScrollY) {
            // Scrolling up
            header.classList.remove('hide-header');
        }
        lastScrollY = currentScrollY;
    });

});