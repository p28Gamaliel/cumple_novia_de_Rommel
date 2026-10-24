/**
 * Cumpleaños Valentina - Lógica Interactiva
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const heartBtn = document.getElementById('heart-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const progressPercentage = document.getElementById('progress-percentage');
    const portraitSection = document.getElementById('portrait-section');
    const unlockedContent = document.getElementById('unlocked-content');
    const unlockHint = document.getElementById('unlock-hint');
    const heartsContainer = document.getElementById('hearts-container');

    // Elementos del Carrusel
    const carouselTrack = document.getElementById('carousel-track');
    const carouselCounter = document.getElementById('carousel-counter');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    const dots = document.querySelectorAll('.carousel-dots-container .dot');

    // Elementos del Sobre
    const envelope = document.getElementById('envelope');
    const waxSeal = document.getElementById('wax-seal');
    const envelopeBody = document.querySelector('.envelope-body');

    // Variables de progreso
    let progress = 0;
    const progressIncrement = 25; // 4 toques para llegar a 100%
    const progressMessages = {
        0: 'Presiona el corazón con amor...',
        25: 'Llenando de sonrisas...',
        50: 'Un poquito más de magia...',
        75: '¡Casi listo para ti! ✨',
        100: '¡Para ti con todo mi corazón! 🎉'
    };

    // ==========================================
    // 1. BOTÓN DE CORAZÓN & BARRA DE PROGRESO
    // ==========================================

    // Generar partículas de corazones flotantes al pulsar
    function createFloatingHeart(x, y) {
        if (!heartsContainer) return;

        const heart = document.createElement('div');
        heart.textContent = '❤️';
        heart.style.position = 'fixed';
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.fontSize = `${Math.floor(Math.random() * 16 + 18)}px`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '9998';
        heart.style.transform = 'translate(-50%, -50%) scale(1)';
        heart.style.transition = 'all 1.1s cubic-bezier(0.2, 0.9, 0.4, 1)';
        heart.style.opacity = '1';

        heartsContainer.appendChild(heart);

        const xOffset = (Math.random() - 0.5) * 130;
        const yOffset = -(Math.random() * 90 + 70);

        requestAnimationFrame(() => {
            heart.style.transform = `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset}px)) scale(1.4)`;
            heart.style.opacity = '0';
        });

        setTimeout(() => {
            heart.remove();
        }, 1100);
    }

    // Función principal al presionar el corazón
    function handleHeartClick(e) {
        if (e) {
            e.preventDefault();
        }

        // Vibración háptica en celulares si está disponible
        if (navigator.vibrate) {
            try { navigator.vibrate(40); } catch (err) {}
        }

        // Obtener coordenadas para las partículas
        const rect = heartBtn.getBoundingClientRect();
        const clientX = (e && e.clientX) ? e.clientX : (rect.left + rect.width / 2);
        const clientY = (e && e.clientY) ? e.clientY : (rect.top + rect.height / 2);

        // Disparar 3 corazones flotantes
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createFloatingHeart(clientX, clientY);
            }, i * 60);
        }

        // Si ya está en 100%, festejar con confeti y bajar a la sección
        if (progress >= 100) {
            launchConfetti();
            if (portraitSection) {
                portraitSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        // Aumentar progreso
        progress = Math.min(100, progress + progressIncrement);
        
        // Actualizar barra de progreso y texto
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        if (progressPercentage) {
            progressPercentage.textContent = `${progress}%`;
        }
        if (progressText) {
            progressText.textContent = progressMessages[progress] || '¡Lleno de amor!';
        }

        // Al alcanzar el 100%
        if (progress === 100) {
            if (unlockedContent) {
                unlockedContent.classList.remove('locked');
            }
            if (unlockHint) {
                unlockHint.classList.remove('hidden');
            }

            // Lanzar confeti de celebración
            launchConfetti();

            // Desplazar suavemente a la sección de fotos
            setTimeout(() => {
                if (portraitSection) {
                    portraitSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 650);
        }
    }

    if (heartBtn) {
        heartBtn.addEventListener('click', handleHeartClick);
    }

    // ==========================================
    // 2. CARRUSEL ESTILO INSTAGRAM (3 FOTOS)
    // ==========================================
    let currentSlide = 0;
    const totalSlides = 3;

    function updateCarouselState(index) {
        currentSlide = index;
        if (carouselCounter) {
            carouselCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        }

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goToSlide(index) {
        if (!carouselTrack) return;
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;

        const slideWidth = carouselTrack.clientWidth;
        carouselTrack.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
        updateCarouselState(index);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(currentSlide + 1);
        });
    }

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.getAttribute('data-index'), 10);
            goToSlide(idx);
        });
    });

    // Deslizamiento táctil natural
    if (carouselTrack) {
        let scrollTimeout;
        carouselTrack.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const slideWidth = carouselTrack.clientWidth;
                if (slideWidth > 0) {
                    const newIndex = Math.round(carouselTrack.scrollLeft / slideWidth);
                    if (newIndex !== currentSlide) {
                        updateCarouselState(newIndex);
                    }
                }
            }, 60);
        }, { passive: true });
    }

    // ==========================================
    // 3. CARTA INTERACTIVA & SELLO DE CERA
    // ==========================================
    function openEnvelope() {
        if (!envelope) return;

        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            launchConfetti(45);

            if (navigator.vibrate) {
                try { navigator.vibrate([30, 50, 40]); } catch (e) {}
            }

            setTimeout(() => {
                const letterPaper = document.getElementById('letter-paper');
                if (letterPaper) {
                    letterPaper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 400);
        }
    }

    if (waxSeal) {
        waxSeal.addEventListener('click', openEnvelope);
        waxSeal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                openEnvelope();
            }
        });
    }

    if (envelopeBody) {
        envelopeBody.addEventListener('click', openEnvelope);
    }

    // ==========================================
    // 4. CELEBRACIÓN CON CONFETTI EN CANVAS
    // ==========================================
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let confettiParticles = [];
        let animationId = null;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const confettiColors = ['#D9A5A9', '#C48B90', '#C8A265', '#FFFDF9', '#EFE4D8', '#B87278'];

        class ConfettiPiece {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * (canvas.height * 0.4) - 40;
                this.size = Math.random() * 8 + 6;
                this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                this.speedX = (Math.random() - 0.5) * 5;
                this.speedY = Math.random() * 3 + 2.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = (Math.random() - 0.5) * 6;
                this.opacity = 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotationSpeed;
                this.opacity -= 0.007;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
                ctx.restore();
            }
        }

        window.launchConfetti = function(count = 70) {
            for (let i = 0; i < count; i++) {
                confettiParticles.push(new ConfettiPiece());
            }

            if (!animationId) {
                animateConfetti();
            }
        };

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < canvas.height + 50);

            for (let p of confettiParticles) {
                p.update();
                p.draw();
            }

            if (confettiParticles.length > 0) {
                animationId = requestAnimationFrame(animateConfetti);
            } else {
                animationId = null;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    } else {
        window.launchConfetti = function() {};
    }
});
