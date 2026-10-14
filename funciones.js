document.addEventListener('DOMContentLoaded', () => {
  // Cierra avisos del servidor.
  document.querySelectorAll('.flash-close').forEach(button => button.addEventListener('click', () => button.closest('.flash').remove()));

  // Carrusel destacado: botones, indicadores, autoplay y pausa.
  document.querySelectorAll('[data-slider]').forEach(slider => {
    const slides = [...slider.querySelectorAll('[data-slide]')];
    const dots = [...slider.querySelectorAll('[data-dot]')];
    const counter = slider.querySelector('[data-counter]');
    const pauseButton = slider.querySelector('[data-pause]');
    if (!slides.length) return;
    let current = 0;
    let paused = false;
    let timer;
    const show = index => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === current));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
      if (counter) counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    const restart = () => {
      clearInterval(timer);

      if (!paused && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = setInterval(() => show(current + 1), 6500);
      }
    };
    slider.querySelector('[data-prev]')?.addEventListener('click', () => {
      show(current - 1);
      restart();
    });
    slider.querySelector('[data-next]')?.addEventListener('click', () => {
      show(current + 1);
      restart();
    });
    dots.forEach(dot => dot.addEventListener('click', () => { show(Number(dot.dataset.dot)); restart(); }));
    pauseButton?.addEventListener('click', () => {
      paused = !paused;
      pauseButton.textContent = paused ? '▶' : 'Ⅱ';
      pauseButton.setAttribute('aria-label', paused ? 'Reanudar carrusel' : 'Pausar carrusel');
      restart();
    });
    slider.addEventListener('mouseenter', () => clearInterval(timer));
    slider.addEventListener('mouseleave', restart);
    show(0); restart();
  });

  // Alterna formulario de inicio de sesión y registro.
  const tabs = [...document.querySelectorAll('[data-auth-tab]')];
  const forms = [...document.querySelectorAll('[data-auth-form]')];
  tabs.forEach(tab => tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    forms.forEach(form => form.classList.toggle('hidden', form.dataset.authForm !== tab.dataset.authTab));
  }));

  // Confirmación antes de eliminar usuarios desde administración.
  document.querySelectorAll('form[data-confirm]').forEach(form => form.addEventListener('submit', event => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  }));

  // Atajo de teclado: "/" enfoca el buscador sin interferir con formularios.
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      const search = document.querySelector('.search-box input');
      if (search) {
        event.preventDefault();
        search.focus();
      }
    }
  });
});
