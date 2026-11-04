/* =========================================================
   GAM Maderas – main.js
   ========================================================= */

// ⚙️ CONFIGURACIÓN CENTRAL
const GAM_CONFIG = {
  // WhatsApp en formato internacional, sin "+", sin espacios, sin guiones
  whatsappNumber: "5493515329671", // +54 351 532 9671
  whatsappMensajeDefault: "Hola GAM Maderas! Quisiera hacer una consulta."
};

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
      header.style.boxShadow = window.scrollY > 50
        ? '0 5px 15px rgba(0,0,0,0.1)'
        : '0 2px 10px rgba(0,0,0,0.1)';
    });
  }

  /* =========================
     MAP LOGOS TOOLTIPS
  ========================= */
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
      if (tooltip) { tooltip.remove(); tooltip = null; }
    });
  });

  /* =========================
     COUNTERS
  ========================= */
  const countersContainer = document.querySelector('.counters');
  if (countersContainer) {
    function animateCounter(id, target) {
      let count = 0;
      const step = target / 200;
      function update() {
        count += step;
        const el = document.getElementById(id);
        if (!el) return;
        if (count < target) {
          el.textContent = Math.floor(count).toLocaleString();
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString();
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

  /* =========================
     🟢 BOTÓN FLOTANTE WHATSAPP
     (se inyecta automáticamente en todas las páginas)
  ========================= */
  (function crearBotonWhatsApp() {
    if (document.querySelector('.whatsapp-float')) return;
    const a = document.createElement('a');
    a.className = 'whatsapp-float';
    a.href = `https://wa.me/${GAM_CONFIG.whatsappNumber}?text=${encodeURIComponent(GAM_CONFIG.whatsappMensajeDefault)}`;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute('aria-label', 'Contactar por WhatsApp');
    a.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(a);
  })();

  /* =========================
     UTILIDADES
  ========================= */
  function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.createElement('div');
    toast.className = `gam-toast ${tipo}`;
    toast.innerHTML = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  function obtenerDatos(form) {
    const datos = {};
    new FormData(form).forEach((value, key) => {
      if (key.startsWith('_')) return; // ignora campos ocultos de Formspree
      if (typeof value === 'string') datos[key] = value.trim();
    });
    return datos;
  }

  function construirMensaje(datos, titulo) {
    const lineas = [`*${titulo}*`, ""];
    for (const [key, value] of Object.entries(datos)) {
      if (!value) continue;
      const etiqueta = key.charAt(0).toUpperCase() + key.slice(1);
      lineas.push(`*${etiqueta}:* ${value}`);
    }
    return lineas.join("\n");
  }

  function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${GAM_CONFIG.whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.location.href = url; 
  }

  /* =========================
     FORM COTIZACIÓN (news.html)
  ========================= */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const textoOriginal = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      try {
        const resp = await fetch(quoteForm.action, {
          method: 'POST',
          body: new FormData(quoteForm),
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          mostrarToast('✅ ¡Cotización enviada! Te responderemos a la brevedad.', 'success');
          quoteForm.reset();
        } else {
          mostrarToast('⚠️ Hubo un error al enviar. Probá por WhatsApp.', 'error');
        }
      } catch (err) {
        mostrarToast('⚠️ Sin conexión. Probá por WhatsApp.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = textoOriginal;
      }
    });

    const waBtn = document.getElementById('quoteWhatsAppBtn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const datos = obtenerDatos(quoteForm);
        if (!datos.nombre || !datos.telefono || !datos.email) {
          mostrarToast('⚠️ Completá al menos nombre, teléfono y email.', 'error');
          return;
        }
        abrirWhatsApp(construirMensaje(datos, 'Nueva solicitud de cotización – GAM Maderas'));
        mostrarToast('💬 Abriendo WhatsApp...', 'success');
      });
    }
  }

  /* =========================
     FORM CONTACTO (contact.html)
  ========================= */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const textoOriginal = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      try {
        const resp = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' }
        });

        if (resp.ok) {
          mostrarToast('✅ ¡Mensaje enviado! Gracias por contactarnos.', 'success');
          contactForm.reset();
        } else {
          mostrarToast('⚠️ Hubo un error al enviar. Probá por WhatsApp.', 'error');
        }
      } catch (err) {
        mostrarToast('⚠️ Sin conexión. Probá por WhatsApp.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = textoOriginal;
      }
    });

    const waBtn = document.getElementById('contactWhatsAppBtn');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const datos = obtenerDatos(contactForm);
        if (!datos.nombre || !datos.email || !datos.asunto) {
          mostrarToast('⚠️ Completá nombre, email y asunto.', 'error');
          return;
        }
        abrirWhatsApp(construirMensaje(datos, 'Nuevo mensaje de contacto – GAM Maderas'));
        mostrarToast('💬 Abriendo WhatsApp...', 'success');
      });
    }
  }
  
  
  
    /* =========================
     MENÚ HAMBURGUESA (MÓVIL)
  ========================= */
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Cambiar icono de rayitas a una "X" cuando está abierto
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }
    /* =========================
     MENÚ HAMBURGUESA
  ========================= */
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Cambiar icono a "X" cuando está abierto
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  }

});
