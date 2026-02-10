// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking on a navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && nav.classList.contains('active')) {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's an internal link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add active state to navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
});

// Add CSS for active navigation link
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color) !important;
        border-bottom-color: var(--primary-color) !important;
    }
`;
document.head.appendChild(style);
