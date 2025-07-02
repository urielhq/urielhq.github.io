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
        'home': { title: 'Meridian | Your Home Away From Home', description: 'Discover exceptional rental solutions in Dallas, TX...' },
        'about': { title: 'About Us | Meridian', description: 'Learn about our commitment to quality, trust, and lasting relationships...' },
        'for-businesses': { title: 'For Businesses | Meridian', description: 'Find strategic housing solutions for businesses in Dallas, TX...' },
        'for-tenants': { title: 'For Tenants | Meridian', description: 'Find your modern rental in Dallas, TX...' },
        'properties': { title: 'Our Properties | Meridian', description: 'Explore high-quality, modern rental properties in Dallas...' },
        'services': { title: 'Our Services | Meridian', 'description': 'Discover dedicated support for seamless rental experiences...' },
        'contact': { title: 'Contact Us | Meridian', description: 'Contact us today for exceptional rental solutions...' },
        'terms': { title: 'Terms & Conditions | Meridian', description: 'Review the terms and conditions for Meridian.' },
        'privacy': { title: 'Privacy Policy | Meridian', description: 'Review the Meridian housing privacy policy.' },
        'cookies': { title: 'Cookie Policy | Meridian', description: 'Review the Meridian housing cookie policy.' },
        'accessibility': { title: 'Accessibility | Meridian', description: 'Review the Meridian housing accessibility statement.' }
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

            // --- NEW CODE BLOCK TO INJECT TERMLY CONTENT ---
            if (page === 'terms') {
                const placeholder = document.getElementById('termly-content-placeholder');
                if (placeholder) {
                    fetch('pages/_terms-content.html')
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