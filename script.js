/* script.js - GNC Presentación (Versión "Informe Interactivo") */

document.addEventListener('DOMContentLoaded', () => {

    const slides = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.querySelector('.content-area');

    // --- 1. Observador para la Navegación (Cuál slide está activa) ---
    
    // Esta función actualiza la barra lateral
    const updateActiveNav = (id) => {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    };

    // El observador que mira qué slide está en pantalla
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveNav(id);
            }
        });
    }, {
        root: contentArea,
        threshold: 0.51 // Se activa cuando más del 50% está visible
    });

    // Observar cada slide
    slides.forEach(slide => navObserver.observe(slide));

    
    // --- 2. Observador para Animaciones (Animar al scrollear) ---
    
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animar solo una vez
            }
        });
    }, {
        root: contentArea,
        threshold: 0.1 // Activar apenas entre en pantalla
    });

    // Observar cada elemento que debe animarse
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });

    
    // --- 3. Scroll Suave para la Navegación ---
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 4. Navegación por Teclado (Espacio/Flechas) ---
    
    // (Deshabilitado por defecto en modo scroll, pero útil si se quiere volver a modo "slide")
    // Por ahora, el scroll natural con la rueda del mouse y las flechas es el método de navegación.

});
