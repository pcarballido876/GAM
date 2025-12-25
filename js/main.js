document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       SCROLL SUAVE
    ========================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    /* =========================
       HEADER SHADOW
    ========================= */
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.style.boxShadow =
                window.scrollY > 50
                    ? '0 5px 15px rgba(0,0,0,0.1)'
                    : '0 2px 10px rgba(0,0,0,0.1)';
        });
    }

    /* =========================
       FORM CONTACT
    ========================= */
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('Thank you for your message! We will contact you soon.');
            contactForm.reset();
        });
    }

    /* =========================
       CTA BUTTONS
    ========================= */
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            const contact = document.querySelector('#contact');
            if (contact) contact.scrollIntoView({ behavior: 'smooth' });
        });
    }

    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', () => {
            const business = document.querySelector('#business');
            if (business) business.scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* =========================
       🌍 MAP PINS TOOLTIPS
    ========================= 
    document.querySelectorAll('.map-pin').forEach(pin => {

        let tooltip;

        pin.addEventListener('mouseenter', () => {
            tooltip = document.createElement('div');
            tooltip.className = 'pin-tooltip';
            tooltip.innerHTML = pin.dataset.info;
            document.body.appendChild(tooltip);

            const rect = pin.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 + 'px';
            tooltip.style.top = rect.top - 10 + 'px';
        });

        pin.addEventListener('mouseleave', () => {
            if (tooltip) {
                tooltip.remove();
                tooltip = null;
            }
        });
    });*/
	
	/* =========================
   MAP LOGOS TOOLTIPS (en lugar de pins)
		========================= */
		// Cambia de .map-pin a .map-logo
		document.querySelectorAll('.map-logo').forEach(logo => {

			let tooltip;

			logo.addEventListener('mouseenter', () => {
				tooltip = document.createElement('div');
				tooltip.className = 'pin-tooltip';
				tooltip.innerHTML = logo.dataset.info;
				document.body.appendChild(tooltip);

				const rect = logo.getBoundingClientRect();
				tooltip.style.left = rect.left + rect.width / 2 + 'px';
				tooltip.style.top = rect.top - 10 + 'px';
			});

			logo.addEventListener('mouseleave', () => {
				if (tooltip) {
					tooltip.remove();
					tooltip = null;
				}
			});
		});

    /* =========================
       COUNTERS (solo si existen)
    ========================= */
    const countersContainer = document.querySelector('.counters');

    if (countersContainer) {

        function animateCounter(id, target) {
            let count = 0;
            const step = target / 200;

            function update() {
                count += step;
                if (count < target) {
                    document.getElementById(id).textContent =
                        Math.floor(count).toLocaleString();
                    requestAnimationFrame(update);
                } else {
                    document.getElementById(id).textContent =
                        target.toLocaleString();
                }
            }
            update();
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounter('counter1', 85000);
                animateCounter('counter2', 400000);
                observer.disconnect();
            }
        });

        observer.observe(countersContainer);
    }

});

