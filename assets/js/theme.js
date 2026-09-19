/* ==========================================================================
   theme.js — выбор темы оформления
   --------------------------------------------------------------------------
   Темы — это наборы CSS-переменных, привязанные к атрибуту data-theme на <html>.
   Скрипт только переключает атрибут, хранит выбор и строит меню выбора.
   Плюс три служебных вещи:
     · data-theme-mode="light|dark" — чтобы CSS знал «светлая или тёмная» база
       (нужно для иконки в кнопке и для нативных контролов);
     · style.color-scheme — нативные скроллбары и поля ввода в тон теме;
     · <meta name="theme-color"> — цвет адресной строки в мобильных браузерах.
   ========================================================================== */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'bh-theme';
  var DEFAULT_THEME = 'auto';

  /* id — значение data-theme; group — раздел в меню; mode — светлая/тёмная база;
     swatch — два цвета для кружка-превью; meta — цвет адресной строки. */
  var THEMES = [
    { id: 'auto', group: 'system', mode: null, swatch: ['#f5f6fb', '#141a25'], meta: '#4f46e5' },
    { id: 'light', group: 'light', mode: 'light', swatch: ['#f5f6fb', '#4f46e5'], meta: '#4f46e5' },
    { id: 'sepia', group: 'light', mode: 'light', swatch: ['#f4ecdd', '#9a6b3f'], meta: '#9a6b3f' },
    { id: 'solarized', group: 'light', mode: 'light', swatch: ['#fdf6e3', '#268bd2'], meta: '#268bd2' },
    { id: 'nord', group: 'light', mode: 'light', swatch: ['#eceff4', '#5e81ac'], meta: '#5e81ac' },
    { id: 'dark', group: 'dark', mode: 'dark', swatch: ['#141a25', '#7f88ff'], meta: '#141a25' },
    { id: 'midnight', group: 'dark', mode: 'dark', swatch: ['#000000', '#5b9dff'], meta: '#000000' },
    { id: 'dracula', group: 'dark', mode: 'dark', swatch: ['#282a36', '#bd93f9'], meta: '#282a36' },
    { id: 'forest', group: 'dark', mode: 'dark', swatch: ['#0e1a14', '#4ade80'], meta: '#0e1a14' },
    { id: 'contrast', group: 'dark', mode: 'dark', swatch: ['#000000', '#ffd400'], meta: '#000000' }
  ];

  var GROUP_ORDER = ['system', 'light', 'dark'];

  var darkQuery = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;
  var current = DEFAULT_THEME;
  var listeners = [];
  var menuEl = null;

  function byId(id) {
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].id === id) return THEMES[i];
    }
    return null;
  }

  function isSupported(id) { return !!byId(id); }

  /* ---------- Чтение сохранённого выбора ---------- */
  function readSaved() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* приватный режим */ }
    if (saved && isSupported(saved)) return saved;
    /* Совместимость: раньше хранились только 'light' и 'dark' — они валидны как есть. */
    return DEFAULT_THEME;
  }

  /* 'auto' разворачивается в 'light' или 'dark' по системной настройке */
  function resolve(id) {
    var theme = byId(id) || byId(DEFAULT_THEME);
    if (theme.id !== 'auto') return theme.id;
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function getTheme() { return current; }
  function getResolved() { return resolve(current); }

  /* ---------- Применение ---------- */
  function apply() {
    var id = resolve(current);
    var theme = byId(id);
    var root = document.documentElement;

    root.setAttribute('data-theme', id);
    root.setAttribute('data-theme-mode', (theme && theme.mode) || 'light');
    root.setAttribute('data-theme-choice', current);

    try { root.style.colorScheme = (theme && theme.mode) || 'light'; } catch (e) { /* старые движки */ }

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta && theme && theme.meta) meta.setAttribute('content', theme.meta);
  }

  /* ---------- Переключение ---------- */
  function setTheme(id, options) {
    var next = isSupported(id) ? id : DEFAULT_THEME;
    var changed = next !== current;
    current = next;

    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* приватный режим */ }

    apply();
    if (menuEl) markActive();

    if (!options || !options.silent) {
      listeners.forEach(function (fn) {
        try { fn(next, resolve(next), changed); } catch (e) { /* не ломаем остальные */ }
      });
    }
    return next;
  }

  function onChange(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  }

  /* ---------- Меню выбора ---------- */
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"></path></svg>';

  function label(id) {
    return global.BH_I18N ? global.BH_I18N.t('theme.' + id) : id;
  }

  function hint(id) {
    return global.BH_I18N ? global.BH_I18N.t('theme.' + id + '.hint') : '';
  }

  function renderMenu() {
    if (!menuEl) return;

    var html = '';
    GROUP_ORDER.forEach(function (group) {
      var items = THEMES.filter(function (t) { return t.group === group; });
      if (!items.length) return;
      html += '<div class="picker-group">' + groupLabel(group) + '</div>';
      items.forEach(function (theme) {
        html += optionHtml(theme);
      });
    });

    menuEl.innerHTML = html;
    markActive();
  }

  function groupLabel(group) {
    if (!global.BH_I18N) return group;
    return global.BH_I18N.t('theme.group.' + group);
  }

  function optionHtml(theme) {
    /* Классы picker-text / picker-check общие с меню языка — стили описаны один раз
       в разделе «11. Выбор языка и темы оформления». */
    return '<button type="button" class="theme-option" role="option" data-theme-id="' + theme.id + '"' +
      ' aria-selected="false" style="--sw1:' + theme.swatch[0] + ';--sw2:' + theme.swatch[1] + '">' +
      '<span class="theme-swatch" aria-hidden="true"></span>' +
      '<span class="picker-text"><b>' + label(theme.id) + '</b><em>' + hint(theme.id) + '</em></span>' +
      '<span class="picker-check" aria-hidden="true">' + CHECK + '</span>' +
      '</button>';
  }

  function markActive() {
    if (!menuEl) return;
    Array.prototype.forEach.call(menuEl.querySelectorAll('[data-theme-id]'), function (btn) {
      btn.setAttribute('aria-selected', String(btn.getAttribute('data-theme-id') === current));
    });
  }

  /* initMenu только рисует меню и перерисовывает его при смене языка.
     Обработку кликов и клавиатуры берёт на себя app.js — так поведение
     обоих меню (язык и тема) описано в одном месте. */
  function initMenu(el) {
    menuEl = el;
    renderMenu();

    if (global.BH_I18N) {
      global.BH_I18N.onLangChange(function () { renderMenu(); });
    }
  }

  /* ---------- Старт ---------- */
  function init() {
    current = readSaved();
    apply();

    if (darkQuery) {
      var onSystemChange = function () {
        if (current !== 'auto') return;
        apply();
        listeners.forEach(function (fn) {
          try { fn(current, resolve(current), true); } catch (e) { /* ignore */ }
        });
      };
      if (darkQuery.addEventListener) darkQuery.addEventListener('change', onSystemChange);
      else if (darkQuery.addListener) darkQuery.addListener(onSystemChange);
    }
  }

  global.BH_THEME = {
    THEMES: THEMES,
    STORAGE_KEY: STORAGE_KEY,
    init: init,
    initMenu: initMenu,
    renderMenu: renderMenu,
    getTheme: getTheme,
    getResolved: getResolved,
    setTheme: setTheme,
    onChange: onChange,
    isSupported: isSupported
  };
})(window);
