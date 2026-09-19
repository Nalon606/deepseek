/* ==========================================================================
   cursor.js — кастомный курсор: точка + догоняющий кружок
   • точка следует за указателем почти мгновенно (мягкое сглаживание)
   • кружок догоняет точку с инерцией: чем быстрее движение, тем заметнее
     отставание и сильнее вытягивание по направлению движения
   • работает только на устройствах с точным указателем (мышь/трекпад)
   • полностью отключается при prefers-reduced-motion и на тач-экранах
   ========================================================================== */

(function () {
  'use strict';

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const layer = document.getElementById('cursorLayer');
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!layer || !dot || !ring) return;

  /* Сглаживание: чем больше коэффициент, тем быстрее элемент догоняет цель.
     Разница между точкой и кружком и создаёт эффект «догоняющего» кольца. */
  const DOT_EASE = 0.38;
  const RING_EASE = 0.12;
  const STRETCH_DIVISOR = 52;   // чувствительность вытягивания к скорости
  const STRETCH_MAX = 1.42;
  const SLEEP_SPEED = 0.05;     // ниже этой скорости анимация засыпает

  const INTERACTIVE = [
    'a', 'button', '[role="button"]', 'select', 'summary', 'label',
    'input[type="checkbox"]', 'input[type="radio"]', 'input[type="range"]',
    '.card', '.featured-card', '.filter-item', '.platform-chip',
    '.compare-chip', '.pill', '.tag', '.platform-tag', '.icon-tile'
  ].join(',');
  const TEXT_FIELD = 'input[type="text"], input[type="search"], input:not([type]), textarea';

  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let dotX = pointerX, dotY = pointerY;
  let ringX = pointerX, ringY = pointerY;
  let ringAngle = 0;
  let stretch = 1;
  let hovering = false;
  let textMode = false;
  let pressed = false;
  let running = false;
  let rafId = null;

  function enable() {
    document.documentElement.classList.add('custom-cursor');
    layer.hidden = false;
  }

  function disable() {
    document.documentElement.classList.remove('custom-cursor');
    layer.hidden = true;
    stop();
  }

  function setVisible(on) {
    layer.classList.toggle('is-visible', on);
  }

  function frame() {
    rafId = null;

    // точка — быстро догоняет указатель
    dotX += (pointerX - dotX) * DOT_EASE;
    dotY += (pointerY - dotY) * DOT_EASE;

    // кружок — догоняет уже саму точку, поэтому отстаёт сильнее
    const prevX = ringX, prevY = ringY;
    ringX += (dotX - ringX) * RING_EASE;
    ringY += (dotY - ringY) * RING_EASE;

    const vx = ringX - prevX;
    const vy = ringY - prevY;
    const speed = Math.hypot(vx, vy);

    // вытягивание кольца по направлению движения; при наведении и в поле ввода — всегда круг
    const target = (!hovering && !textMode && speed > 0.4)
      ? Math.min(1 + speed / STRETCH_DIVISOR, STRETCH_MAX)
      : 1;
    stretch += (target - stretch) * 0.25;

    if (textMode) {
      // каретка в поле ввода должна стоять строго вертикально
      let d = -ringAngle;
      while (d > 180) d -= 360;
      while (d < -180) d += 360;
      ringAngle += d * 0.25;
    } else if (speed > 0.4) {
      const angle = Math.atan2(vy, vx) * 180 / Math.PI;
      // сглаживаем поворот по кратчайшей дуге
      let diff = angle - ringAngle;
      while (diff > 180) diff -= 360;
      while (diff < -180) diff += 360;
      ringAngle += diff * 0.3;
    }

    dot.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0)`;
    ring.style.transform =
      `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) ` +
      `rotate(${ringAngle.toFixed(2)}deg) scale(${stretch.toFixed(3)}, 1)`;

    const settled = speed < SLEEP_SPEED &&
      Math.abs(pointerX - ringX) < 0.5 &&
      Math.abs(pointerY - ringY) < 0.5 &&
      (!textMode || Math.abs(ringAngle) < 0.3);

    if (!settled) rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function ripple(x, y) {
    const el = document.createElement('span');
    el.className = 'cursor-ripple';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.addEventListener('animationend', () => el.remove());
    layer.appendChild(el);
  }

  function onPointerMove(e) {
    pointerX = e.clientX;
    pointerY = e.clientY;
    if (!layer.classList.contains('is-visible')) setVisible(true);
    if (!running) start();
  }

  function onPointerOver(e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const isText = !!target.closest(TEXT_FIELD);
    const isInteractive = !isText && !!target.closest(INTERACTIVE);

    if (isText !== textMode) {
      textMode = isText;
      layer.classList.toggle('is-text', isText);
      if (isText && !running) start();   // нужен кадр, чтобы выпрямить каретку
    }
    if (isInteractive !== hovering) {
      hovering = isInteractive;
      layer.classList.toggle('is-hover', isInteractive);
    }
  }

  function onPointerDown(e) {
    pressed = true;
    layer.classList.add('is-down');
    ripple(e.clientX, e.clientY);
    if (!running) start();
  }

  function onPointerUp() {
    pressed = false;
    layer.classList.remove('is-down');
  }

  function onLeave() { setVisible(false); }
  function onEnter() { setVisible(true); if (!running) start(); }

  function sync() {
    if (finePointer.matches && !reduceMotion.matches) {
      enable();
      setVisible(false);
    } else {
      disable();
    }
  }

  // Слушатели
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerover', onPointerOver, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointercancel', onPointerUp, { passive: true });
  window.addEventListener('blur', onLeave);
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);

  if (finePointer.addEventListener) {
    finePointer.addEventListener('change', sync);
    reduceMotion.addEventListener('change', sync);
  }

  sync();

  // для отладки и тестов
  window.__cursor = {
    isPressed: () => pressed,
    isHovering: () => hovering,
    isText: () => textMode,
    angle: () => ringAngle,
    start, stop
  };
})();
