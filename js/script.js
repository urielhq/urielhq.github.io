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
        'home': { title: 'BLACKRIDGE | Welcome Home', description: 'Discover quality, furnished housing in Dallas tailored for professionals, businesses, and relocations. Seamless, trusted, and ready when you are.' },
        'about': { title: 'BLACKRIDGE | About Us', description: 'With a decade of experience, BLACKRIDGE is known for reliability, attention to detail, and responsive service. Learn how we support professionals with exceptional housing.' },
        'for-businesses': { title: 'BLACKRIDGE | For Businesses', description: 'Flexible, scalable housing for corporate, medical, education, and insurance sectors. Discover how BLACKRIDGE supports professionals with reliable, high-quality stays.' },
        'for-tenants': { title: 'BLACKRIDGE | For Tenants', description: 'Comfortable, modern furnished homes in top Dallas neighborhoods. Seamless transitions, responsive support, and peace of mind for extended stays.' },
        'properties': { title: 'BLACKRIDGE | Our Properties', description: 'Explore renovated, furnished single-family homes in A and B class Dallas neighborhoods. Ideal for work-from-home professionals and extended stays.' },
        'services': { title: 'BLACKRIDGE | Our Services', 'description': 'From remote onboarding to responsive support, discover how BLACKRIDGE delivers fast, flexible service for business and tenant needs in Dallas.' },
        'contact': { title: 'BLACKRIDGE | Contact Us', description: 'Have a question or need housing support? Call, text, or email BLACKRIDGE for fast, responsive help. We typically respond within an hour.' },
        'terms': { title: 'BLACKRIDGE | Terms & Conditions', description: 'Review BLACKRIDGE’s legal terms and service guidelines for rentals and housing agreements.' },
        'privacy': { title: 'BLACKRIDGE | Privacy Policy', description: 'Learn how BLACKRIDGE protects your data and privacy across our rental and service platforms.' },
        'cookies': { title: 'BLACKRIDGE | Cookie Policy', description: 'Understand how cookies are used on the BLACKRIDGE website to improve your browsing experience.' },
        'accessibility': { title: 'BLACKRIDGE | Accessibility', description: 'BLACKRIDGE is committed to accessibility and strives to ensure all users can access our services and website.' }
    };

    const loadPage = async (page = 'home') => {
        if (observer) {
            observer.disconnect();
        }
		
		// Track virtual pageview for Google Analytics
gtag('event', 'page_view', {
  page_location: window.location.href,
  page_path: window.location.pathname + window.location.hash,
  page_title: document.title
});
        
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

if (page === 'contact') {
  const emailEl = document.getElementById("contact-email");
  if (emailEl) {
    const u = "contact";
    const d = ["blackridge", "mgmt", "com"];
    const e = `${u}@${d[0]}${d[1]}.${d[2]}`;
    emailEl.href = `mailto:${e}`;
    emailEl.textContent = e;
    emailEl.rel = "nofollow";
  }

  const phoneEl = document.getElementById("contact-phone");
  if (phoneEl) {
    const p = ["512", "785", "3518"];
    const raw = p.join("");
    const formatted = `(${p[0]}) ${p[1]}-${p[2]}`;
    phoneEl.href = `tel:${raw}`;
    phoneEl.textContent = formatted;
    phoneEl.rel = "nofollow";
  }

  // --- NEW RECAPTCHA RENDERING CODE ---
  // Ensure grecaptcha is defined before trying to render
  if (typeof grecaptcha !== 'undefined' && grecaptcha.render) {
    // Find the div where reCAPTCHA should be rendered
    const recaptchaDiv = document.querySelector('.g-recaptcha');
    if (recaptchaDiv) {
      // Check if it hasn't been rendered already (important for SPA)
      if (!recaptchaDiv.dataset.rendered) {
        grecaptcha.render(recaptchaDiv, {
          'sitekey': recaptchaDiv.getAttribute('data-sitekey')
        });
        recaptchaDiv.dataset.rendered = 'true'; // Mark as rendered
      }
    } else {
      console.warn("reCAPTCHA div not found on contact page.");
    }
  } else {
    console.warn("reCAPTCHA API (grecaptcha) not yet loaded or render function not available.");
  }
  // --- END NEW RECAPTCHA RENDERING CODE ---
}


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
if (location.pathname !== `/${page}`) {
  history.pushState({ page }, '', `/${page}`);
  loadPage(page);
}

        }
    });

    window.addEventListener('popstate', (e) => {
        const page = (e.state && e.state.page) || 'home';
        loadPage(page);
    });

    const initialPage = location.pathname.substring(1) || 'home';
    loadPage(initialPage);
});