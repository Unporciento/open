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

    // --- 4. Controles (Ocultos, pero funcionales para el script) ---
    
    // (Este código es para los botones, que ahora están ocultos,
    // pero lo dejo por si quieres volver a ponerlos)
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn && nextBtn) {
        // Esta lógica es para un modo "slide" y no "scroll".
        // La navegación principal ahora es el scroll y la barra lateral.
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
    }

});