'use strict';

/* ═══════════════════════════════════════════════════════════
   1. КАСТОМНЫЙ КУРСОР
═══════════════════════════════════════════════════════════ */
(function initCursor() {
  const cursor         = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');

  if (!cursor || !cursorFollower) return;
  if (window.innerWidth <= 1024) return;

  let mouseX    = 0;
  let mouseY    = 0;
  let followerX = 0;
  let followerY = 0;

  /* Основной курсор — мгновенное перемещение */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  /* Follower — плавное следование через RAF */
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  /* Hover-эффект на интерактивных элементах */
  const hoverTargets = document.querySelectorAll(
    'a, button, .menu-card, .atmosphere__img-wrap, .reviews__dot, .social-link'
  );

  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      cursorFollower.classList.add('cursor--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      cursorFollower.classList.remove('cursor--hover');
    });
  });

  /* Скрываем курсор когда мышь уходит за пределы окна */
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity         = '0';
    cursorFollower.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity         = '1';
    cursorFollower.style.opacity = '0.5';
  });
})();

/* ═══════════════════════════════════════════════════════════
   2. НАВИГАЦИЯ — скролл + мобильное меню
═══════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const burger     = document.getElementById('burger');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks   = document.querySelectorAll('.nav-menu__link');

  if (!navbar) return;

  /* ── Изменение фона при скролле ── */
  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── Открытие мобильного меню ── */
  function openMenu() {
    navMenu.classList.add('open');
    navOverlay.classList.add('active');
    burger.classList.add('active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  }

  /* ── Закрытие мобильного меню ── */
  function closeMenu() {
    navMenu.classList.remove('open');
    navOverlay.classList.remove('active');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  /* Клик по бургеру */
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });
  }

  /* Клик по оверлею */
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  /* Клик по ссылке — закрываем меню */
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* Закрытие по клавише Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      if (burger) burger.focus();
    }
  });

  /* ── Активная ссылка при скролле (Intersection Observer) ── */
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();

/* ═══════════════════════════════════════════════════════════
   3. SCROLL-АНИМАЦИИ (Intersection Observer — .reveal)
═══════════════════════════════════════════════════════════ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          /* Одноразовая анимация — отписываемся */
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   4. ПАРАЛЛАКС HERO
═══════════════════════════════════════════════════════════ */
(function initParallax() {
  const heroBg = document.getElementById('heroBg');
  if (!heroBg) return;

  /* Параллакс только на десктопе */
  if (window.innerWidth <= 768) return;

  let ticking = false;

  function applyParallax() {
    const scrollY = window.scrollY;
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
})();

/* ═══════════════════════════════════════════════════════════
   5. СЛАЙДЕР ОТЗЫВОВ
═══════════════════════════════════════════════════════════ */
(function initSlider() {
  const track    = document.getElementById('reviewsTrack');
  const dotsWrap = document.getElementById('reviewsDots');
  const prevBtn  = document.getElementById('reviewsPrev');
  const nextBtn  = document.getElementById('reviewsNext');

  if (!track || !dotsWrap) return;

  const slides       = Array.from(track.children);
  const total        = slides.length;
  let current        = 0;
  let autoplayTimer  = null;
  let isDragging     = false;
  let startX         = 0;
  let currentTranslate = 0;

  /* ── Создаём точки-индикаторы ── */
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('reviews__dot');
    dot.setAttribute('aria-label', `Перейти к отзыву ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goTo(i);
      resetAutoplay();
    });
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  /* ── Переход к слайду ── */
  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-pressed', i === current ? 'true' : 'false');
    });
  }

  /* ── Кнопки вперёд/назад ── */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      resetAutoplay();
    });
  }

  /* ── Автопрокрутка (5 секунд) ── */
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      goTo(current + 1);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  startAutoplay();

  /* Останавливаем автопрокрутку при наведении */
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  /* ── Свайп на мобильных (Touch Events) ── */
  track.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    currentTranslate = e.touches[0].clientX - startX;
  }, { passive: true });

  track.addEventListener('touchend', () => {
    isDragging = false;
    const threshold = 50;

    if (currentTranslate < -threshold) {
      goTo(current + 1);
    } else if (currentTranslate > threshold) {
      goTo(current - 1);
    }

    currentTranslate = 0;
    startAutoplay();
  });

  /* ── Свайп мышью (Mouse Drag) ── */
  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    stopAutoplay();
    track.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentTranslate = e.clientX - startX;
  });

  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    const threshold = 60;

    if (currentTranslate < -threshold) {
      goTo(current + 1);
    } else if (currentTranslate > threshold) {
      goTo(current - 1);
    }

    currentTranslate = 0;
    track.style.cursor = 'grab';
    startAutoplay();
  });

  /* ── Управление клавиатурой ── */
  document.addEventListener('keydown', (e) => {
    const slider = document.getElementById('reviewsSlider');
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const isVisible =
      rect.top < window.innerHeight && rect.bottom > 0;

    if (!isVisible) return;

    if (e.key === 'ArrowLeft') {
      goTo(current - 1);
      resetAutoplay();
    } else if (e.key === 'ArrowRight') {
      goTo(current + 1);
      resetAutoplay();
    }
  });

  /* Начальное состояние */
  goTo(0);
})();

/* ═══════════════════════════════════════════════════════════
   6. ВАЛИДАЦИЯ И ОТПРАВКА ФОРМЫ
═══════════════════════════════════════════════════════════ */
(function initForm() {
  const form           = document.getElementById('contactForm');
  const fieldName      = document.getElementById('fieldName');
  const fieldEmail     = document.getElementById('fieldEmail');
  const fieldPhone     = document.getElementById('fieldPhone');
  const fieldMessage   = document.getElementById('fieldMessage');
  const nameError      = document.getElementById('nameError');
  const emailError     = document.getElementById('emailError');
  const messageError   = document.getElementById('messageError');
  const formSuccess    = document.getElementById('formSuccess');

  if (!form) return;

  /* ── Вспомогательные функции ── */
  function showError(input, errorEl, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (errorEl) errorEl.textContent = message;
  }

  function showSuccess(input, errorEl) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorEl) errorEl.textContent = '';
  }

  function clearState(input, errorEl) {
    input.classList.remove('error', 'success');
    if (errorEl) errorEl.textContent = '';
  }

  /* ── Валидация имени ── */
  function validateName() {
    const value = fieldName.value.trim();

    if (value.length === 0) {
      showError(fieldName, nameError, 'Пожалуйста, введите ваше имя');
      return false;
    }

    if (value.length < 2) {
      showError(fieldName, nameError, 'Имя должно содержать минимум 2 символа');
      return false;
    }

    if (value.length > 60) {
      showError(fieldName, nameError, 'Имя слишком длинное');
      return false;
    }

    if (!/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(value)) {
      showError(fieldName, nameError, 'Имя может содержать только буквы');
      return false;
    }

    showSuccess(fieldName, nameError);
    return true;
  }

  /* ── Валидация email ── */
  function validateEmail() {
    const value = fieldEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value.length === 0) {
      showError(fieldEmail, emailError, 'Пожалуйста, введите ваш email');
      return false;
    }

    if (!emailRegex.test(value)) {
      showError(fieldEmail, emailError, 'Введите корректный email адрес');
      return false;
    }

    showSuccess(fieldEmail, emailError);
    return true;
  }

  /* ── Валидация сообщения ── */
  function validateMessage() {
    const value = fieldMessage.value.trim();

    if (value.length === 0) {
      showError(fieldMessage, messageError, 'Пожалуйста, напишите ваше сообщение');
      return false;
    }

    if (value.length < 10) {
      showError(fieldMessage, messageError, 'Сообщение слишком короткое (минимум 10 символов)');
      return false;
    }

    if (value.length > 1000) {
      showError(fieldMessage, messageError, 'Сообщение слишком длинное (максимум 1000 символов)');
      return false;
    }

    showSuccess(fieldMessage, messageError);
    return true;
  }

  /* ── Маска телефона ── */
  if (fieldPhone) {
    fieldPhone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      if (value.startsWith('8')) {
        value = '7' + value.slice(1);
      }

      if (value.startsWith('7')) {
        value = value.slice(0, 11);
        let formatted = '+7';
        if (value.length > 1) formatted += ' (' + value.slice(1, 4);
        if (value.length > 4) formatted += ') ' + value.slice(4, 7);
        if (value.length > 7) formatted += '-' + value.slice(7, 9);
        if (value.length > 9) formatted += '-' + value.slice(9, 11);
        e.target.value = formatted;
      }
    });

    fieldPhone.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && fieldPhone.value.length <= 3) {
        fieldPhone.value = '';
      }
    });
  }

  /* ── Валидация в реальном времени (при потере фокуса) ── */
  if (fieldName) {
    fieldName.addEventListener('blur', validateName);
    fieldName.addEventListener('input', () => {
      if (fieldName.classList.contains('error')) validateName();
    });
  }

  if (fieldEmail) {
    fieldEmail.addEventListener('blur', validateEmail);
    fieldEmail.addEventListener('input', () => {
      if (fieldEmail.classList.contains('error')) validateEmail();
    });
  }

  if (fieldMessage) {
    fieldMessage.addEventListener('blur', validateMessage);
    fieldMessage.addEventListener('input', () => {
      if (fieldMessage.classList.contains('error')) validateMessage();
    });
  }

  /* ── Отправка формы ── */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid    = validateName();
    const isEmailValid   = validateEmail();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      /* Фокус на первое поле с ошибкой */
      if (!isNameValid) {
        fieldName.focus();
      } else if (!isEmailValid) {
        fieldEmail.focus();
      } else {
        fieldMessage.focus();
      }
      return;
    }

    /* Имитация отправки (spinner на кнопке) */
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';
    submitBtn.style.opacity = '0.75';

    /* Имитация запроса к серверу */
    setTimeout(() => {
      /* Скрываем поля */
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach((group) => {
        group.style.opacity    = '0';
        group.style.transform  = 'translateY(-8px)';
        group.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        setTimeout(() => {
          group.style.display = 'none';
        }, 300);
      });

      submitBtn.style.display = 'none';

      /* Показываем сообщение об успехе */
      setTimeout(() => {
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);

      /* Сбрасываем форму */
      form.reset();

      /* Восстанавливаем кнопку (на случай если форму снова покажут) */
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';

    }, 1800);
  });
})();

/* ═══════════════════════════════════════════════════════════
   7. КНОПКИ МЕНЮ — анимация заказа
═══════════════════════════════════════════════════════════ */
(function initMenuButtons() {
  const menuBtns = document.querySelectorAll('.menu-card__btn');

  menuBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const card         = btn.closest('.menu-card');
      const productName  = card
        ? card.querySelector('.menu-card__name')?.textContent
        : 'Напиток';
      const price        = card
        ? card.querySelector('.menu-card__price')?.textContent
        : '';

      const originalText = btn.textContent;

      /* Анимация нажатия */
      btn.textContent    = '✓ Добавлено';
      btn.style.pointerEvents = 'none';
      btn.style.transform     = 'scale(0.95)';

      setTimeout(() => {
        btn.style.transform = 'scale(1)';
      }, 150);

      setTimeout(() => {
        btn.textContent         = originalText;
        btn.style.pointerEvents = 'auto';
      }, 2000);

      /* Toast-уведомление */
      showToast(`${productName} — ${price} добавлен в заказ ☕`);
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   8. TOAST-УВЕДОМЛЕНИЯ
═══════════════════════════════════════════════════════════ */
function showToast(message, duration = 3000) {
  /* Контейнер для тостов */
  let toastContainer = document.getElementById('toastContainer');

  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  /* Создаём тост */
  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: #3D2B1F;
    color: #F5F0E8;
    padding: 14px 22px;
    border-radius: 14px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    opacity: 0;
    transform: translateY(12px) scale(0.96);
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: 300px;
    pointer-events: none;
    border-left: 3px solid #C49A6C;
  `;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  /* Появление */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateY(0) scale(1)';
    });
  });

  /* Исчезновение */
  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(8px) scale(0.96)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

/* ═══════════════════════════════════════════════════════════
   9. ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ (для старых браузеров)
═══════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth',
      });
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   10. ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ (Intersection Observer)
═══════════════════════════════════════════════════════════ */
(function initLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (!lazyImages.length) return;

  /* Если браузер поддерживает нативный lazy — ничего не делаем */
  if ('loading' in HTMLImageElement.prototype) return;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          img.removeAttribute('loading');
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '200px 0px',
      threshold: 0,
    }
  );

  lazyImages.forEach((img) => imageObserver.observe(img));
})();

/* ═══════════════════════════════════════════════════════════
   11. СЧЁТЧИК АНИМАЦИИ (для факта "50 000+ гостей")
═══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = [
    { selector: '.about__fact:nth-child(1) strong', end: 5,      suffix: ' лет',    duration: 1200 },
    { selector: '.about__fact:nth-child(3) strong', end: 50000,  suffix: '+',       duration: 2000 },
  ];

  counters.forEach(({ selector, end, suffix, duration }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const originalText = el.textContent;
    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            started = true;
            animateCounter(el, 0, end, suffix, duration);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el.closest('.about__fact') || el);
  });

  function animateCounter(el, start, end, suffix, duration) {
    const startTime  = performance.now();
    const range      = end - start;

    function update(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      /* Easing — ease out */
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + range * eased);

      el.textContent = value.toLocaleString('ru-RU') + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
})();

/* ═══════════════════════════════════════════════════════════
   12. SCROLL-TO-TOP КНОПКА
═══════════════════════════════════════════════════════════ */
(function initScrollToTop() {
  /* Создаём кнопку */
  const btn = document.createElement('button');
  btn.id             = 'scrollToTop';
  btn.setAttribute('aria-label', 'Вернуться наверх');
  btn.innerHTML      = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"/>
    </svg>
  `;
  btn.style.cssText = `
    position: fixed;
    bottom: 28px;
    left: 28px;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #8B5E3C;
    color: #FFFFFF;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    opacity: 0;
    transform: translateY(12px) scale(0.85);
    transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.2s ease;
    z-index: 9000;
    pointer-events: none;
  `;

  document.body.appendChild(btn);

  /* Показываем/скрываем при скролле */
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        btn.style.opacity       = '1';
        btn.style.transform     = 'translateY(0) scale(1)';
        btn.style.pointerEvents = 'auto';
      } else {
        btn.style.opacity       = '0';
        btn.style.transform     = 'translateY(12px) scale(0.85)';
        btn.style.pointerEvents = 'none';
      }
    },
    { passive: true }
  );

    /* Hover */
  btn.addEventListener('mouseenter', () => {
    btn.style.backgroundColor = '#6B4729';
    btn.style.transform       = 'translateY(-3px) scale(1.08)';
    btn.style.boxShadow       = '0 12px 32px rgba(0,0,0,0.22)';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.backgroundColor = '#8B5E3C';
    btn.style.transform       = 'translateY(0) scale(1)';
    btn.style.boxShadow       = '0 8px 24px rgba(0,0,0,0.15)';
  });

  btn.addEventListener('mousedown', () => {
    btn.style.transform = 'translateY(0) scale(0.95)';
  });

  btn.addEventListener('mouseup', () => {
    btn.style.transform = 'translateY(-3px) scale(1.08)';
  });

  /* Клик — прокрутка наверх */
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   13. АКТИВНЫЙ СТИЛЬ ДЛЯ ССЫЛОК НАВИГАЦИИ (CSS-класс)
═══════════════════════════════════════════════════════════ */
(function injectNavActiveStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-menu__link.active {
      color: #FFFFFF !important;
    }
    .nav-menu__link.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════
   14. RIPPLE-ЭФФЕКТ НА КНОПКАХ
═══════════════════════════════════════════════════════════ */
(function initRipple() {
  const rippleTargets = document.querySelectorAll(
    '.btn--primary, .btn--outline-light, .btn--cta, .menu-card__btn'
  );

  rippleTargets.forEach((btn) => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', (e) => {
      /* Убираем старый ripple если есть */
      const existingRipple = btn.querySelector('.ripple-wave');
      if (existingRipple) existingRipple.remove();

      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.25);
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;

      btn.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) ripple.remove();
      }, 700);
    });
  });

  /* Добавляем CSS для анимации ripple */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* ═══════════════════════════════════════════════════════════
   15. ТЕМА — ОПРЕДЕЛЕНИЕ СИСТЕМНОЙ ТЕМЫ (prefers-color-scheme)
═══════════════════════════════════════════════════════════ */
(function initThemeDetection() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  /* На данный момент сайт использует светлую кофейную тему.
     Этот блок зарезервирован для будущей тёмной темы. */
  function handleThemeChange(e) {
    if (e.matches) {
      /* Тёмная системная тема — можно подключить dark-переменные */
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  prefersDark.addEventListener('change', handleThemeChange);
  handleThemeChange(prefersDark);
})();

/* ═══════════════════════════════════════════════════════════
   16. ОТСЛЕЖИВАНИЕ ПРОИЗВОДИТЕЛЬНОСТИ (только DEV)
═══════════════════════════════════════════════════════════ */
(function initPerformanceLog() {
  /* Выводим только в режиме разработки (localhost) */
  if (!window.location.hostname.includes('localhost') &&
      !window.location.hostname.includes('127.0.0.1')) return;

  window.addEventListener('load', () => {
    if (!window.performance || !window.performance.timing) return;

    const timing   = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;

    console.group('%c☕ MORNING FOG — Performance', 'color:#8B5E3C; font-weight:bold;');
    console.log(`%cDOM Ready:    ${domReady}ms`, 'color:#C49A6C');
    console.log(`%cFull Load:    ${loadTime}ms`, 'color:#C49A6C');
    console.groupEnd();
  });
})();

/* ═══════════════════════════════════════════════════════════
   17. ЗАЩИТА ОТ ПРАВОГО КЛИКА НА ИЗОБРАЖЕНИЯХ
═══════════════════════════════════════════════════════════ */
(function protectImages() {
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    img.setAttribute('draggable', 'false');
  });
})();

/* ═══════════════════════════════════════════════════════════
   18. ИНИЦИАЛИЗАЦИЯ ВСЕГО ПОСЛЕ DOMContentLoaded
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Устанавливаем текущий год в футере ── */
  const yearEls = document.querySelectorAll('.footer__copy');
  const currentYear = new Date().getFullYear();

  yearEls.forEach((el) => {
    el.textContent = el.textContent.replace('2024', currentYear);
  });

  /* ── Добавляем класс loaded на body (для CSS-анимаций) ── */
  document.body.classList.add('loaded');

  /* ── Preloader скрываем если есть ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.opacity    = '0';
    preloader.style.transition = 'opacity 0.4s ease';
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  }

  /* ── Логотип в консоли ── */
  if (window.location.hostname.includes('localhost') ||
      window.location.hostname.includes('127.0.0.1')) {
    console.log(
      '%c\n  ☕ MORNING FOG  \n  Версия: 1.0.0   \n',
      `
        background: #3D2B1F;
        color: #C49A6C;
        font-size: 14px;
        font-weight: bold;
        padding: 4px 12px;
        border-radius: 6px;
        letter-spacing: 2px;
      `
    );
  }
});

/* ═══════════════════════════════════════════════════════════
   19. ОБРАБОТКА ОШИБОК ИЗОБРАЖЕНИЙ
═══════════════════════════════════════════════════════════ */
(function handleImageErrors() {
  document.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      /* Заменяем на заглушку если изображение не загрузилось */
      img.style.cssText = `
        background: linear-gradient(135deg, #EDE3D4 0%, #C49A6C 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      `;
      img.alt = 'Изображение временно недоступно';
      img.removeAttribute('src');
    });
  });
})();

/* ═══════════════════════════════════════════════════════════
   20. RESIZE HANDLER — пересчёт при изменении размера окна
═══════════════════════════════════════════════════════════ */
(function initResizeHandler() {
  let resizeTimer = null;

  window.addEventListener('resize', () => {
    /* Дебаунс — вызываем не чаще 1 раза в 250ms */
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {

      /* Закрываем мобильное меню при расширении окна */
      if (window.innerWidth > 1024) {
        const navMenu    = document.getElementById('navMenu');
        const navOverlay = document.getElementById('navOverlay');
        const burger     = document.getElementById('burger');

        if (navMenu && navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          if (navOverlay) navOverlay.classList.remove('active');
          if (burger) {
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
          }
          document.body.classList.remove('no-scroll');
        }
      }

      /* Скрываем/показываем кастомный курсор */
      const cursor         = document.getElementById('cursor');
      const cursorFollower = document.getElementById('cursorFollower');

      if (cursor && cursorFollower) {
        if (window.innerWidth <= 1024) {
          cursor.style.display         = 'none';
          cursorFollower.style.display = 'none';
          document.body.style.cursor  = 'auto';
        } else {
          cursor.style.display         = 'block';
          cursorFollower.style.display = 'block';
          document.body.style.cursor  = 'none';
        }
      }

    }, 250);
  });
})();