/* ==========================================================================
   app.js — логика каталога: фильтры, поиск, сортировка, модальные окна,
   переключение языка и темы.
   --------------------------------------------------------------------------
   Все тексты берутся из BH_I18N (i18n.js), тема — из BH_THEME (theme.js).
   Русские строки в этом файле больше не дублируются: единственный источник —
   словари, поэтому смена языка перерисовывает и статику, и динамику.
   ========================================================================== */

(function () {
  'use strict';

  var I18N = window.BH_I18N;
  var THEME = window.BH_THEME;

  /* Короткие обёртки над словарём */
  function t(key, vars) { return I18N.t(key, vars); }
  function tp(key, n, vars) { return I18N.tp(key, n, vars); }

  /* ---------- Иконки (инлайн-SVG) ---------- */
  const ICONS = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"></path><path d="m7 12 5 5 5-5"></path><path d="M5 21h14"></path></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5"></path><path d="M12 8h.01"></path></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"></path></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.4 3 8 7 9 4-1 7-4.6 7-9V6l-7-3Z"></path><path d="m9 12 2 2 4-4"></path></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z"></path></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2.5 20h19L12 3Z"></path><path d="M12 10v4"></path><path d="M12 17h.01"></path></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"></rect><rect x="14" y="3" width="7" height="7" rx="2"></rect><rect x="3" y="14" width="7" height="7" rx="2"></rect><rect x="14" y="14" width="7" height="7" rx="2"></rect></svg>',
    star4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 2.4 5.2L20 10l-4.4 3.8L16.8 20 12 17l-4.8 3 1.2-6.2L4 10l5.6-1.8L12 3Z"></path></svg>',
    window: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="3"></rect><path d="M3 9h18"></path></svg>',
    gamepad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 12h3M8.5 10.5v3"></path><path d="M16 11.5h.01M18 13.5h.01"></path><rect x="2" y="6" width="20" height="12" rx="5"></rect></svg>',
    feather: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4c-3 0-8 1-10 4L5 13v4l5-5"></path><path d="M4 20l5-5"></path><path d="M13 8h4"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"></rect><path d="M8 10V7a4 4 0 0 1 8 0v3"></path></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-4 4 4 4"></path><path d="m16 8 4 4-4 4"></path><path d="m13 6-2 12"></path></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"></rect><path d="M11 18h2"></path></svg>'
  };

  const CATEGORY_ICONS = {
    featured: 'star4', classic: 'window', gaming: 'gamepad', lightweight: 'feather',
    privacy: 'lock', dev: 'code', mobile: 'phone'
  };

  /* ---------- Состояние ---------- */
  const state = {
    query: '',
    category: 'all',
    platform: 'all',
    sort: 'popularity'
  };

  /* Локализованная копия каталога: пересобирается при смене языка */
  let catalog = BROWSERS;
  /* id открытого модального окна — нужно, чтобы перерисовать его при смене языка */
  let openModalId = null;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const els = {
    headerSearch: $('#headerSearch'),
    headerSearchBox: $('.header-search'),
    heroSearch: $('#heroSearch'),
    filtersPanel: $('#filtersPanel'),
    filtersToggle: $('#filtersToggle'),
    categoryList: $('#categoryList'),
    platformList: $('#platformList'),
    resetFilters: $('#resetFilters'),
    activeFilters: $('#activeFilters'),
    resultsCount: $('#resultsCount'),
    sortSelect: $('#sortSelect'),
    cardsGrid: $('#cardsGrid'),
    featuredGrid: $('#featuredGrid'),
    emptyState: $('#emptyState'),
    emptyReset: $('#emptyReset'),
    modalBackdrop: $('#modalBackdrop'),
    modal: $('#modal'),
    modalContent: $('#modalContent'),
    toTop: $('#toTop'),
    scrollProgress: $('#scrollProgress'),
    siteHeader: $('.site-header'),
    statCount: $('#statCount'),
    statBrowsersLabel: $('#statBrowsersLabel'),
    statCats: $('#statCats'),
    statCatsLabel: $('#statCatsLabel'),
    footerRights: $('#footerRights'),
    footerUpdated: $('#footerUpdated'),
    a11yStatus: $('#a11yStatus'),
    langToggle: $('#langToggle'),
    langMenu: $('#langMenu'),
    langCode: $('#langCode'),
    themeToggle: $('#themeToggle'),
    themeMenu: $('#themeMenu')
  };

  /* ---------- Утилиты ---------- */
  const normalize = (str) => (str || '').toString().toLowerCase().replace(/ё/g, 'е').trim();

  /* Название категории из словаря, с откатом на подпись из data.js.
     У псевдокатегории «все» ключ особый — cat.all, без суффикса .label. */
  function categoryLabel(id) {
    const key = id === 'all' ? 'cat.all' : 'cat.' + id + '.label';
    const translated = t(key);
    if (translated !== key) return translated;
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? cat.label : id;
  }

  function categoryHint(id) {
    const translated = t('cat.' + id + '.hint');
    return translated === 'cat.' + id + '.hint' ? '' : translated;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
  }

  /* Запасная иконка: буквенный тайл в цвете бренда, если картинка не загрузилась */
  function letterTile(name, color) {
    const letter = escapeHtml((name || '?').trim().charAt(0).toUpperCase());
    return `<span class="icon-fallback" style="--c:${color}">${letter}</span>`;
  }

  function announce(message) {
    if (els.a11yStatus) els.a11yStatus.textContent = message;
  }

  /* ---------- Фильтрация и сортировка ---------- */
  function matchesQuery(browser, query) {
    if (!query) return true;
    const haystack = normalize([
      browser.name, browser.vendor, browser.tagline, browser.description,
      browser.engine, browser.platforms.join(' '),
      browser.categories.map(categoryLabel).join(' '),
      browser.highlights.join(' ')
    ].join(' '));
    return query.split(/\s+/).every((word) => haystack.includes(word));
  }

  function getFiltered() {
    const query = normalize(state.query);
    let list = catalog.filter((b) => {
      if (!matchesQuery(b, query)) return false;
      if (state.category !== 'all' && !b.categories.includes(state.category)) return false;
      if (state.platform !== 'all' && !b.platforms.includes(state.platform)) return false;
      return true;
    });

    const lang = I18N.getLang();
    const sorters = {
      popularity: (a, b) => b.popularity - a.popularity,
      name: (a, b) => a.name.localeCompare(b.name, lang),
      featured: (a, b) => (b.featured - a.featured) || (b.popularity - a.popularity)
    };
    return list.sort(sorters[state.sort] || sorters.popularity);
  }

  /* ---------- Рендер: фильтры ---------- */
  function renderCategoryFilters() {
    const items = [{ id: 'all' }].concat(CATEGORIES);
    els.categoryList.innerHTML = items.map((cat) => {
      const count = cat.id === 'all'
        ? catalog.length
        : catalog.filter((b) => b.categories.includes(cat.id)).length;
      const icon = cat.id === 'all' ? ICONS.grid : ICONS[CATEGORY_ICONS[cat.id]] || ICONS.grid;
      const pressed = state.category === cat.id;
      const hint = categoryHint(cat.id);
      const title = hint ? ` title="${escapeHtml(hint)}"` : '';
      return `<button type="button" class="filter-item" data-category="${cat.id}"
                aria-pressed="${pressed}"${title}>
                <span class="ico">${icon}</span>
                <span>${escapeHtml(categoryLabel(cat.id))}</span>
                <span class="count">${count}</span>
              </button>`;
    }).join('');
  }

  function renderPlatformFilters() {
    els.platformList.innerHTML = PLATFORMS.map((p) => {
      const pressed = state.platform === p;
      return `<button type="button" class="platform-chip" data-platform="${p}" aria-pressed="${pressed}">${p}</button>`;
    }).join('');
  }

  /* ---------- Рендер: карточки ---------- */
  function tagsHtml(browser) {
    return browser.categories.slice(0, 3)
      .map((id) => `<span class="tag">${escapeHtml(categoryLabel(id))}</span>`)
      .join('');
  }

  function platformsHtml(browser) {
    return browser.platforms.map((p) => `<span class="platform-tag">${escapeHtml(p)}</span>`).join('');
  }

  function cardHtml(browser, index = 0) {
    const badge = browser.featured
      ? `<span class="badge">${ICONS.star}${escapeHtml(t('card.badge'))}</span>`
      : '';
    return `
      <article class="card" style="--brand:${browser.color}22; --brand-solid:${browser.color}; --i:${Math.min(index, 10)}" data-id="${browser.id}">
        <div class="card-head">
          <span class="icon-tile">
            <img src="${browser.icon}" alt="" loading="lazy" width="52" height="52"
                 onerror="this.replaceWith(this.parentNode.querySelector('template').content.cloneNode(true))">
            <template>${letterTile(browser.name, browser.color)}</template>
          </span>
          <div class="card-title">
            <h3>${escapeHtml(browser.name)}</h3>
            <span class="vendor">${escapeHtml(browser.vendor)}</span>
          </div>
          ${badge}
        </div>
        <p class="card-tagline">${escapeHtml(browser.tagline)}</p>
        <div class="tag-row">${tagsHtml(browser)}</div>
        <div class="meta-row">
          <span>${escapeHtml(browser.engine)}</span>
          <span class="sep"></span>
          <span>${escapeHtml(browser.license)}</span>
        </div>
        <div class="platforms">${platformsHtml(browser)}</div>
        <div class="card-foot">
          <a class="btn btn-primary" href="${browser.download}" target="_blank" rel="noopener nofollow">
            ${ICONS.download}${escapeHtml(t('card.download'))}
          </a>
          <button type="button" class="btn btn-ghost" data-details="${browser.id}">
            ${ICONS.info}${escapeHtml(t('card.details'))}
          </button>
        </div>
        <span class="official-note">${ICONS.shield}${escapeHtml(t('card.official', { host: new URL(browser.site).hostname }))}</span>
      </article>`;
  }

  function renderCards() {
    const list = getFiltered();
    const total = catalog.length;

    els.cardsGrid.innerHTML = list.map((b, i) => cardHtml(b, i)).join('');
    els.cardsGrid.hidden = list.length === 0;
    els.emptyState.hidden = list.length !== 0;

    els.resultsCount.innerHTML = list.length
      ? t('results.found', { n: list.length, word: tp('unit.browser', list.length), total: total })
      : t('results.none');

    renderActiveFilters();
    updateUrl();
  }

  function renderFeatured() {
    const featured = catalog.filter((b) => b.featured).sort((a, b) => b.popularity - a.popularity);
    els.featuredGrid.innerHTML = featured.map((b) => `
      <article class="featured-card" style="--brand:${b.color}; --brand-solid:${b.color}">
        <div class="featured-top">
          <span class="icon-tile lg">
            <img src="${b.icon}" alt="" loading="lazy" width="60" height="60"
                 onerror="this.replaceWith(this.parentNode.querySelector('template').content.cloneNode(true))">
            <template>${letterTile(b.name, b.color)}</template>
          </span>
          <div>
            <h3>${escapeHtml(b.name)}</h3>
            <div class="vendor">${escapeHtml(b.vendor)}</div>
          </div>
        </div>
        <p>${escapeHtml(b.tagline)}</p>
        <div class="tag-row">${tagsHtml(b)}</div>
        <div class="featured-foot">
          <a class="btn btn-primary btn-sm" href="${b.download}" target="_blank" rel="noopener nofollow">
            ${ICONS.download}${escapeHtml(t('card.download'))}
          </a>
          <button type="button" class="btn btn-ghost btn-sm" data-details="${b.id}">
            ${escapeHtml(t('card.details'))}
          </button>
        </div>
      </article>`).join('');
  }

  /* ---------- Активные фильтры (пилюли) ---------- */
  function renderActiveFilters() {
    const pills = [];
    if (state.query) {
      pills.push(`<span class="pill">${escapeHtml(t('pill.search', { q: state.query }))}<button type="button" data-clear="query" aria-label="${escapeHtml(t('pill.clearSearch'))}">${ICONS.close}</button></span>`);
    }
    if (state.category !== 'all') {
      pills.push(`<span class="pill">${escapeHtml(categoryLabel(state.category))}<button type="button" data-clear="category" aria-label="${escapeHtml(t('pill.clearCategory'))}">${ICONS.close}</button></span>`);
    }
    if (state.platform !== 'all') {
      pills.push(`<span class="pill">${escapeHtml(state.platform)}<button type="button" data-clear="platform" aria-label="${escapeHtml(t('pill.clearPlatform'))}">${ICONS.close}</button></span>`);
    }
    els.activeFilters.innerHTML = pills.join('');
    els.activeFilters.hidden = pills.length === 0;
    els.resetFilters.hidden = pills.length === 0;
  }

  /* ---------- Модальное окно ---------- */
  let lastFocused = null;

  function openModal(id) {
    const b = catalog.find((x) => x.id === id);
    if (!b) return;

    const notice = b.notice
      ? `<div class="notice">${ICONS.warn}<span>${escapeHtml(b.notice)}</span></div>`
      : '';

    const platforms = b.platforms.map((p) => `<span class="platform-tag">${escapeHtml(p)}</span>`).join('');

    els.modalContent.innerHTML = `
      <div class="modal-head">
        <span class="icon-tile lg">
          <img src="${b.icon}" alt="" width="60" height="60"
               onerror="this.replaceWith(this.parentNode.querySelector('template').content.cloneNode(true))">
          <template>${letterTile(b.name, b.color)}</template>
        </span>
        <div>
          <h3 id="modalTitle">${escapeHtml(b.name)}</h3>
          <div class="vendor">${escapeHtml(b.vendor)}</div>
        </div>
        <button type="button" class="modal-close" data-close aria-label="${escapeHtml(t('modal.close'))}">${ICONS.close}</button>
      </div>
      <div class="modal-body">
        <p class="desc">${escapeHtml(b.description)}</p>

        <div>
          <div class="modal-section-title">${escapeHtml(t('modal.highlights'))}</div>
          <ul class="highlight-list">
            ${b.highlights.map((h) => `<li>${ICONS.check}<span>${escapeHtml(h)}</span></li>`).join('')}
          </ul>
        </div>

        <div>
          <div class="modal-section-title">${escapeHtml(t('modal.specs'))}</div>
          <dl class="spec-grid">
            <div class="spec"><dt>${escapeHtml(t('modal.engine'))}</dt><dd>${escapeHtml(b.engine)}</dd></div>
            <div class="spec"><dt>${escapeHtml(t('modal.license'))}</dt><dd>${escapeHtml(b.license)}</dd></div>
            <div class="spec"><dt>${escapeHtml(t('modal.categories'))}</dt><dd>${escapeHtml(b.categories.map(categoryLabel).join(', '))}</dd></div>
          </dl>
        </div>

        <div>
          <div class="modal-section-title">${escapeHtml(t('modal.platforms'))}</div>
          <div class="platforms">${platforms}</div>
        </div>

        ${notice}

        <div class="modal-foot">
          <a class="btn btn-primary" href="${b.download}" target="_blank" rel="noopener nofollow">
            ${ICONS.download}${escapeHtml(t('modal.download'))}
          </a>
          <a class="btn btn-ghost" href="${b.site}" target="_blank" rel="noopener nofollow">
            ${ICONS.external}${escapeHtml(t('modal.site'))}
          </a>
        </div>
      </div>`;

    openModalId = id;
    lastFocused = document.activeElement;
    els.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    els.modal.scrollTop = 0;
    const closeBtn = $('[data-close]', els.modalContent);
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    openModalId = null;
    els.modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  /* ---------- Синхронизация с адресной строкой ---------- */
  function updateUrl() {
    const params = new URLSearchParams();
    if (state.query) params.set('q', state.query);
    if (state.category !== 'all') params.set('cat', state.category);
    if (state.platform !== 'all') params.set('os', state.platform);
    if (state.sort !== 'popularity') params.set('sort', state.sort);
    const hash = params.toString();
    try {
      history.replaceState(null, '', hash ? `#${hash}` : location.pathname + location.search);
    } catch (e) { /* file:// или песочница без History API */ }
  }

  function readUrl() {
    const params = new URLSearchParams(location.hash.slice(1));
    state.query = params.get('q') || '';
    const cat = params.get('cat');
    if (cat && (cat === 'all' || CATEGORIES.some((c) => c.id === cat))) state.category = cat;
    const os = params.get('os');
    if (os && PLATFORMS.includes(os)) state.platform = os;
    const sort = params.get('sort');
    if (sort && ['popularity', 'name', 'featured'].includes(sort)) state.sort = sort;
  }

  function syncInputs() {
    els.headerSearch.value = state.query;
    els.heroSearch.value = state.query;
    els.sortSelect.value = state.sort;
  }

  /* ---------- Тексты, которые не лежат в разметке ---------- */
  const UPDATED_AT = new Date(2026, 8, 1); /* сентябрь 2026 — дата последнего обновления каталога */

  function renderStaticText() {
    els.statCount.textContent = String(BROWSERS.length);
    els.statCats.textContent = String(CATEGORIES.length);
    els.statBrowsersLabel.textContent = tp('hero.stat.browsers', BROWSERS.length);
    els.statCatsLabel.textContent = tp('hero.stat.categories', CATEGORIES.length);

    const year = new Date().getFullYear();
    els.footerRights.textContent = t('footer.rights', { year: year });
    els.footerUpdated.textContent = t('footer.updated', { date: I18N.formatMonthYear(UPDATED_AT) });
  }

  function refreshCatalog() {
    catalog = I18N.localizeAll(BROWSERS);
  }

  /* ---------- Обновление интерфейса ---------- */
  function refresh() {
    renderCategoryFilters();
    renderPlatformFilters();
    renderCards();
    syncInputs();
  }

  function setQuery(value, { scroll = false } = {}) {
    state.query = value;
    els.headerSearch.value = value;
    els.heroSearch.value = value;
    renderCards();
    if (scroll) {
      const y = $('#catalog').getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  const isMobile = () => window.matchMedia('(max-width: 780px)').matches;

  /* На мобильных поиск в шапке свёрнут в иконку — разворачиваем его */
  function focusHeaderSearch() {
    if (isMobile()) els.headerSearchBox.classList.add('expanded');
    els.headerSearch.focus();
  }

  /* ---------- Выбор языка ---------- */
  function renderLangMenu() {
    const active = I18N.getLang();
    els.langMenu.innerHTML = I18N.LOCALES.map((loc) => `
      <button type="button" class="picker-option" role="option" data-lang="${loc.id}" aria-selected="${loc.id === active}">
        <span class="lang-chip" aria-hidden="true">${escapeHtml(loc.code)}</span>
        <span class="picker-text"><b>${escapeHtml(loc.name)}</b><em>${escapeHtml(loc.english)}</em></span>
        <span class="picker-check" aria-hidden="true">${ICONS.check}</span>
      </button>`).join('');
  }

  function syncLangButton() {
    const loc = I18N.locale();
    els.langCode.textContent = loc.code;
    els.langToggle.setAttribute('title', t('lang.current', { name: loc.name }));
  }

  function setLanguage(id) {
    if (!I18N.isSupported(id) || id === I18N.getLang()) return;
    I18N.setLang(id); /* применяет статику и рассылает слушателям сигнал */
  }

  /* ---------- Выпадающие меню (язык и тема) ---------- */
  const pickers = [];

  function closePickers(except) {
    pickers.forEach(({ button, menu }) => {
      if (menu === except) return;
      menu.hidden = true;
      button.setAttribute('aria-expanded', 'false');
    });
  }

  function openPicker(button, menu) {
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    const first = menu.querySelector('[role="option"][aria-selected="true"]') || menu.querySelector('[role="option"]');
    if (first) first.focus();
  }

  function wirePicker(button, menu, onPick) {
    pickers.push({ button, menu });

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = menu.hidden;
      closePickers(menu);
      if (willOpen) openPicker(button, menu);
      else closePickers();
    });

    menu.addEventListener('click', (e) => e.stopPropagation());

    menu.addEventListener('click', (e) => {
      const option = e.target.closest('[role="option"]');
      if (!option) return;
      onPick(option);
      closePickers();
      button.focus();
    });

    /* Стрелки внутри открытого меню */
    menu.addEventListener('keydown', (e) => {
      const options = Array.from(menu.querySelectorAll('[role="option"]'));
      const index = options.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        (options[index + 1] || options[0]).focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        (options[index - 1] || options[options.length - 1]).focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        options[0].focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        options[options.length - 1].focus();
      }
    });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        if (menu.hidden) {
          e.preventDefault();
          closePickers(menu);
          openPicker(button, menu);
        }
      }
    });
  }

  function wirePickers() {
    wirePicker(els.langToggle, els.langMenu, (option) => setLanguage(option.dataset.lang));
    wirePicker(els.themeToggle, els.themeMenu, (option) => THEME.setTheme(option.dataset.themeId));

    document.addEventListener('click', () => closePickers());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closePickers();
    });
  }

  /* ---------- События ---------- */
  function bindEvents() {
    // Поиск: синхронизируем оба поля
    els.headerSearch.addEventListener('input', (e) => setQuery(e.target.value));
    els.heroSearch.addEventListener('input', (e) => setQuery(e.target.value));

    els.headerSearchBox.addEventListener('click', () => {
      if (isMobile()) focusHeaderSearch();
    });

    els.headerSearch.addEventListener('blur', () => {
      if (isMobile() && !els.headerSearch.value) els.headerSearchBox.classList.remove('expanded');
    });

    els.heroSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') setQuery(e.target.value, { scroll: true });
    });

    // Категории
    els.categoryList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-category]');
      if (!btn) return;
      state.category = btn.dataset.category;
      refresh();
    });

    // Платформы
    els.platformList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-platform]');
      if (!btn) return;
      const value = btn.dataset.platform;
      state.platform = state.platform === value ? 'all' : value;
      refresh();
    });

    // Сброс
    const resetAll = () => {
      state.query = '';
      state.category = 'all';
      state.platform = 'all';
      state.sort = 'popularity';
      refresh();
    };
    els.resetFilters.addEventListener('click', resetAll);
    els.emptyReset.addEventListener('click', resetAll);

    // Снятие отдельных фильтров
    els.activeFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-clear]');
      if (!btn) return;
      const key = btn.dataset.clear;
      if (key === 'query') state.query = '';
      if (key === 'category') state.category = 'all';
      if (key === 'platform') state.platform = 'all';
      refresh();
    });

    // Сортировка
    els.sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderCards();
    });

    // Карточки: подробнее
    document.addEventListener('click', (e) => {
      const detailsBtn = e.target.closest('[data-details]');
      if (detailsBtn) {
        openModal(detailsBtn.dataset.details);
        return;
      }
      if (e.target.closest('[data-close]') || e.target === els.modalBackdrop) closeModal();
    });

    // Мобильные фильтры
    els.filtersToggle.addEventListener('click', () => {
      const open = els.filtersPanel.classList.toggle('open');
      els.filtersToggle.setAttribute('aria-expanded', String(open));
    });

    // Горячие клавиши
    document.addEventListener('keydown', (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
      if (e.key === 'Escape') {
        if (els.modalBackdrop.classList.contains('open')) closeModal();
        else if (typing) e.target.blur();
        return;
      }
      if (e.key === '/' && !typing) {
        e.preventDefault();
        focusHeaderSearch();
      }
    });

    // Прокрутка: кнопка «наверх», индикатор прогресса, тень шапки
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      els.toTop.classList.toggle('show', y > 700);
      els.siteHeader.classList.toggle('is-scrolled', y > 8);
      const progress = max > 0 ? Math.min(y / max, 1) : 0;
      els.scrollProgress.style.transform = `scaleX(${progress.toFixed(4)})`;
      els.scrollProgress.classList.toggle('is-active', y > 40);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
    els.toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // Навигация по категориям из подвала
    $$('[data-category-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        state.category = link.dataset.categoryLink;
        state.query = '';
        state.platform = 'all';
        refresh();
        const y = $('#catalog').getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Реакция на смену языка ---------- */
  function onLanguageChange(lang) {
    syncLangButton();
    renderLangMenu();
    renderStaticText();
    refreshCatalog();
    renderFeatured();
    refresh();
    if (openModalId) openModal(openModalId);
    announce(t('a11y.lang', { name: I18N.locale().name }));
  }

  /* ---------- Старт ---------- */
  function init() {
    I18N.init();
    THEME.init();

    readUrl();

    I18N.applyI18n(document);   /* статичная разметка: data-i18n* + <title> + lang */
    renderStaticText();
    renderLangMenu();
    syncLangButton();

    THEME.initMenu(els.themeMenu);

    refreshCatalog();
    renderFeatured();
    refresh();
    bindEvents();
    wirePickers();

    I18N.onLangChange(onLanguageChange);
    THEME.onChange((choice) => {
      announce(t('a11y.theme', { name: t('theme.' + choice) }));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
