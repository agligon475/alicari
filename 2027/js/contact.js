/**
 * ALICARI 2027 - Contact Modal & Form Controller
 * Manages modal states, real-time validation, feedback messages, and mailto fallback.
 */

export function initContact() {
  const modal = document.getElementById('contact-modal');
  const openTriggers = document.querySelectorAll('.js-contact-trigger');
  const closeBtn = document.getElementById('contact-modal-close');
  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('contact-success-msg');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('modal__backdrop')) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Form Validation & Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('form-name').value.trim();
      const email = document.getElementById('form-email').value.trim();
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value.trim();

      if (!name || !email || !message) {
        alert('Por favor completa todos los campos requeridos (*)');
        return;
      }

      // Email format check
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Por favor ingresa un correo electrónico válido');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
      }

      // Simulate sending and generate mailto fallback
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Enviar mensaje';
        }

        form.style.display = 'none';
        if (successMsg) successMsg.style.display = 'block';

        // Auto redirect to mail client
        const mailtoUri = `mailto:licari.multimedios@gmail.com?subject=${encodeURIComponent(`[Consulta Web 2027] ${subject || 'Contacto'} de ${name}`)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;
        window.location.href = mailtoUri;

        setTimeout(() => {
          form.reset();
          form.style.display = 'block';
          if (successMsg) successMsg.style.display = 'none';
          closeModal();
        }, 4000);
      }, 600);
    });
  }
}
