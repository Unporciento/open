/* script.js - GNC Presentación (Versión "Carrusel Horizontal") */

document.addEventListener('DOMContentLoaded', () => {

    const slidesWrapper = document.getElementById('slidesWrapper');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const slideTitleElement = document.getElementById('slideTitle');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlide() {
        // Mueve el carrusel horizontalmente
        slidesWrapper.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;

        // Actualiza el título en la barra de control
        const title = slides[currentIndex].getAttribute('data-title') || 'CONTENIDO';
        slideTitleElement.textContent = title.toUpperCase();

        // Actualiza la barra de progreso
        const percentage = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.width = percentage + '%';

        // Actualiza los botones
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalSlides - 1;
        
        // (Opcional) Actualiza la clase 'active' para animaciones
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index < currentIndex) {
                slide.classList.add('prev');
            }
        });
    }

    function goToNextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex++;
            updateSlide();
        }
    }

    function goToPrevSlide() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide();
        }
    }

    // Event Listeners para Botones
    nextBtn.addEventListener('click', goToNextSlide);
    prevBtn.addEventListener('click', goToPrevSlide);
    
    // Event Listeners para Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            goToNextSlide();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrevSlide();
        }
    });

    // Inicializar presentación
    updateSlide();

    // --- (NUEVO) Fondo de "Gas en Movimiento" ---
    const canvas = document.getElementById('gas-background');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w = canvas.width = innerWidth;
        let h = canvas.height = innerHeight;
        let particles = [];
        const particleCount = 30;

        window.addEventListener('resize', () => {
            w = canvas.width = innerWidth;
            h = canvas.height = innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.vx = (Math.random() - 0.5) * 0.5; // Movimiento horizontal lento
                this.vy = (Math.random() - 0.5) * 0.5; // Movimiento vertical lento
                this.radius = Math.random() * 3 + 2;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > w) this.vx *= -1;
                if (this.y < 0 || this.y > h) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(102, 240, 211, ${this.alpha})`; // Color --color-accent-2
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, w, h);
            
            // Fondo de gradiente base
            let gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/2);
            gradient.addColorStop(0, '#111827'); // bg-content
            gradient.addColorStop(1, '#0a0e27'); // bg-dark (de MinePredict)
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, w, h);

            // Dibujar partículas
            for (let p of particles) {
                p.update();
                p.draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

})();
