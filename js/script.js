document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinksContainer = document.querySelector('.nav-links');

    let observer;
    let lastScrollY = window.scrollY;

    function setupIntersectionObserver() {
        const animatedItems = document.querySelectorAll('.fade-in');
        
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        animatedItems.forEach(item => {
            observer.observe(item);
        });
    }

    function setupFooterObserver() {
        const footerObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        if (footer) {
            footerObserver.observe(footer);
        }
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 150) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = window.scrollY;
    });

    if (mobileMenuButton && navLinksContainer) {
        mobileMenuButton.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }
    
    const pageMetas = {
        'home': { title: 'Meridian | Welcome Home', description: 'Discover quality, furnished housing in Dallas tailored for professionals, businesses, and relocations. Seamless, trusted, and ready when you are.' },
        'about': { title: 'Meridian | About Us', description: 'With a decade of experience, Meridian is known for reliability, attention to detail, and responsive service. Learn how we support professionals with exceptional housing.' },
        'for-businesses': { title: 'Meridian | For Businesses', description: 'Flexible, scalable housing for corporate, medical, education, and insurance sectors. Discover how Meridian supports professionals with reliable, high-quality stays.' },
        'for-tenants': { title: 'Meridian | For Tenants', description: 'Comfortable, modern furnished homes in top Dallas neighborhoods. Seamless transitions, responsive support, and peace of mind for extended stays.' },
        'properties': { title: 'Meridian | Our Properties', description: 'Explore renovated, furnished single-family homes in A and B class Dallas neighborhoods. Ideal for work-from-home professionals and extended stays.' },
        'services': { title: 'Meridian | Our Services', 'description': 'From remote onboarding to responsive support, discover how Meridian delivers fast, flexible service for business and tenant needs in Dallas.' },
        'contact': { title: 'Meridian | Contact Us', description: 'Have a question or need housing support? Call, text, or email Meridian for fast, responsive help. We typically respond within an hour.' },
        'terms': { title: 'Meridian | Terms & Conditions', description: 'Review Meridian’s legal terms and service guidelines for rentals and housing agreements.' },
        'privacy': { title: 'Meridian | Privacy Policy', description: 'Learn how Meridian protects your data and privacy across our rental and service platforms.' },
        'cookies': { title: 'Meridian | Cookie Policy', description: 'Understand how cookies are used on the Meridian website to improve your browsing experience.' },
        'accessibility': { title: 'Meridian | Accessibility', description: 'Meridian is committed to accessibility and strives to ensure all users can access our services and website.' }
    };

    const loadPage = async (page = 'home') => {
        if (observer) {
            observer.disconnect();
        }
        
        mainContent.classList.add('is-fading');
        footer.classList.remove('is-visible'); 
        await new Promise(resolve => setTimeout(resolve, 200));

        navLinksContainer.classList.remove('active');
        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`.nav-links a[data-page="${page}"]`);
        if (activeLink) activeLink.classList.add('active');

        try {
            const response = await fetch(`pages/${page}.html`);
            if (!response.ok) throw new Error('Page not found');
            const content = await response.text();
            
            mainContent.innerHTML = content;
            window.scrollTo(0, 0);

            // --- NEW CODE BLOCK TO INJECT TERMS CONTENT ---
            if (page === 'terms') {
                const placeholder = document.getElementById('terms-content-placeholder');
                if (placeholder) {
                    fetch('pages/terms-content.html') // <<< FIXED
                        .then(res => res.text())
                        .then(html => {
                            placeholder.innerHTML = html;
                        });
                }
            }
            // --- END OF NEW CODE BLOCK ---
                        // --- NEW CODE BLOCK TO INJECT COOKIE CONTENT ---
            if (page === 'cookies') {
                const placeholder = document.getElementById('cookie-content-placeholder');
                if (placeholder) {
                    fetch('pages/cookie-content.html') // <<< FIXED
                        .then(res => res.text())
                        .then(html => {
                            placeholder.innerHTML = html;
                        });
                }
            }
            // --- END OF NEW CODE BLOCK ---
                        // --- NEW CODE BLOCK TO INJECT PRIVACY CONTENT ---
            if (page === 'privacy') {
                const placeholder = document.getElementById('privacy-content-placeholder');
                if (placeholder) {
                    fetch('pages/privacy-content.html') // <<< FIXED
                        .then(res => res.text())
                        .then(html => {
                            placeholder.innerHTML = html;
                        });
                }
            }
            // --- END OF NEW CODE BLOCK ---

            if (pageMetas[page]) {
                document.title = pageMetas[page].title;
                document.querySelector('meta[name="description"]').setAttribute('content', pageMetas[page].description);
            }
            
            setupIntersectionObserver();
            setupFooterObserver(); 
            mainContent.classList.remove('is-fading');

        } catch (error) {
            mainContent.innerHTML = `<section class="page-header text-center fade-in"><div class="container"><h1>Page Not Found</h1><p>The content you're looking for doesn't exist.</p></div></section>`;
            mainContent.classList.remove('is-fading');
            setupIntersectionObserver();
            setupFooterObserver();
            console.error('Error loading page:', error);
        }
    };
    
    document.body.addEventListener('click', (e) => {
        const targetLink = e.target.closest('a[data-page]');
        if (targetLink) {
            e.preventDefault();
            const page = targetLink.getAttribute('data-page');
            if (location.hash !== `#${page}`) {
                history.pushState({ page }, '', `#${page}`);
                loadPage(page);
            }
        }
    });

    window.addEventListener('popstate', (e) => {
        const page = (e.state && e.state.page) || 'home';
        loadPage(page);
    });

    const initialPage = location.hash.substring(1) || 'home';
    loadPage(initialPage);
});