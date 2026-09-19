/* ==========================================================================
   i18n.js — переключение языка интерфейса
   --------------------------------------------------------------------------
   Что здесь есть:
   · LOCALES      — список поддерживаемых языков (код, самоназвание, тег BCP-47);
   · I18N         — словари строк интерфейса по языкам;
   · t(key, vars) — получить строку с подстановкой {переменных};
   · tp(key, n)   — строка с правильной формой множественного числа
                    (через Intl.PluralRules, а не «русские» правила вручную);
   · applyI18n()  — разложить строки по статичной разметке через data-i18n*;
   · localizeBrowser(b) — наложить перевод описаний браузеров поверх data.js.

   Цепочка отката для любой строки:  выбранный язык → en → ru → сам ключ.
   Поэтому новый язык можно добавить частичным словарём.
   ========================================================================== */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'bh-lang';

  /* ---------- 1. Поддерживаемые языки ---------- */
  var LOCALES = [
    { id: 'ru', code: 'RU', name: 'Русский', english: 'Russian' },
    { id: 'en', code: 'EN', name: 'English', english: 'English' },
    { id: 'de', code: 'DE', name: 'Deutsch', english: 'German' },
    { id: 'es', code: 'ES', name: 'Español', english: 'Spanish' }
  ];

  var FALLBACK_CHAIN = ['en', 'ru'];

  /* ---------- 2. Словари ---------- */
  var I18N = {
    /* ======================= РУССКИЙ ======================= */
    ru: {
      'meta.title': 'BrowserHub — каталог браузеров: скачать Chrome, Яндекс Браузер, Firefox, Opera и другие',
      'meta.description': 'Каталог популярных браузеров с описанием, фильтрами по категориям и поиском. Все кнопки скачивания ведут только на официальные сайты разработчиков.',
      'meta.ogTitle': 'BrowserHub — каталог браузеров для скачивания',
      'meta.ogDescription': 'Chrome, Яндекс Браузер, Firefox, Opera, Opera GX, Brave, Vivaldi, Tor и другие — с фильтрами, поиском и ссылками на официальные источники.',

      'skip.link': 'Перейти к каталогу',
      'brand.sub': 'каталог браузеров',
      'nav.aria': 'Основная навигация',
      'nav.featured': 'Рекомендуемые',
      'nav.catalog': 'Все браузеры',
      'nav.how': 'Как выбирать',
      'nav.about': 'О каталоге',

      'search.header.label': 'Поиск браузера по названию',
      'search.header.placeholder': 'Поиск: Firefox, приватный…',
      'search.hero.label': 'Поиск браузера',
      'search.hero.placeholder': 'Например: игровой, приватный, лёгкий, Opera GX…',
      'filters.toggle': 'Фильтры',

      'lang.button': 'Сменить язык интерфейса',
      'lang.title': 'Язык интерфейса',
      'lang.current': 'Текущий язык: {name}',

      'theme.button': 'Выбрать тему оформления',
      'theme.title': 'Тема оформления',
      'theme.group.system': 'Системная',
      'theme.group.light': 'Светлые',
      'theme.group.dark': 'Тёмные',
      'theme.auto': 'Как в системе',
      'theme.auto.hint': 'Следует настройкам ОС',
      'theme.light': 'Светлая',
      'theme.light.hint': 'Нейтральная светлая база',
      'theme.sepia': 'Сепия',
      'theme.sepia.hint': 'Тёплый бумажный фон',
      'theme.solarized': 'Solarized',
      'theme.solarized.hint': 'Низкий контраст, меньше устают глаза',
      'theme.nord': 'Nord',
      'theme.nord.hint': 'Холодные серо-синие тона',
      'theme.dark': 'Тёмная',
      'theme.dark.hint': 'Классическая тёмная тема',
      'theme.midnight': 'Чёрная (OLED)',
      'theme.midnight.hint': 'Чистый чёрный, экономит заряд на OLED',
      'theme.dracula': 'Dracula',
      'theme.dracula.hint': 'Фиолетовый акцент на тёмном',
      'theme.forest': 'Лесная',
      'theme.forest.hint': 'Тёмно-зелёная, спокойная',
      'theme.contrast': 'Высокий контраст',
      'theme.contrast.hint': 'Максимальная читаемость',

      'hero.badge': 'Все ссылки ведут только на официальные сайты разработчиков',
      'hero.title': 'Скачайте <span class="grad">подходящий браузер</span> за пару минут',
      'hero.lead': 'Собрали популярные браузеры в одном каталоге: сравните скорость, приватность и потребление памяти, отфильтруйте по категории и перейдите на официальную страницу загрузки. Никаких сторонних сборок и зеркал.',
      'hero.stat.browsers': { one: 'браузер в каталоге', few: 'браузера в каталоге', many: 'браузеров в каталоге' },
      'hero.stat.categories': { one: 'категория и фильтр', few: 'категории и фильтра', many: 'категорий и фильтров' },
      'hero.stat.official': 'официальные ссылки',

      'featured.title': 'Рекомендуемые браузеры',
      'featured.desc': 'Выбор редакции: универсальные варианты, которые подойдут большинству пользователей на Windows, macOS и мобильных устройствах.',
      'featured.link': 'Смотреть все браузеры',

      'catalog.title': 'Каталог браузеров',
      'catalog.desc': 'Фильтруйте по категориям и платформам, ищите по названию и описанию, сортируйте по популярности или алфавиту.',
      'filters.panel': 'Фильтры каталога',
      'filters.categories': 'Категории',
      'filters.platform': 'Платформа',
      'filters.reset': 'Сбросить все фильтры',
      'sort.label': 'Сортировка',
      'sort.popularity': 'По популярности',
      'sort.name': 'По названию (А–Я)',
      'sort.featured': 'Сначала рекомендуемые',

      'empty.title': 'Браузеры не найдены',
      'empty.desc': 'Попробуйте изменить запрос или сбросить фильтры — возможно, нужный браузер есть в другой категории.',
      'empty.reset': 'Сбросить фильтры',

      'how.title': 'Как выбрать браузер',
      'how.desc': 'Три простых вопроса, которые помогают определиться, если не хочется читать характеристики.',
      'how.c1.title': 'Важна приватность?',
      'how.c1.tag': 'Категория «Приватные»',
      'how.c1.text': 'Берите Brave, Firefox, LibreWolf или Mullvad: они блокируют трекеры по умолчанию. Нужна максимальная анонимность — Tor Browser, но он медленнее.',
      'how.c2.title': 'Играете и стримите?',
      'how.c2.tag': 'Категория «Игровые»',
      'how.c2.text': 'Opera GX умеет ограничивать память и процессор под игру, а Microsoft Edge даёт игровую панель, счётчик FPS и помощник Game Assist.',
      'how.c3.title': 'Компьютер слабый?',
      'how.c3.tag': 'Категория «Лёгкие»',
      'how.c3.text': 'Pale Moon, Falkon, Waterfox и Chromium требуют меньше памяти и быстрее запускаются. Минус — ручные обновления и иногда урезанная совместимость.',

      'about.title': 'О каталоге',
      'about.desc': 'Мы не размещаем установщики и не зарабатываем на загрузках: каждая кнопка «Скачать» открывает страницу разработчика браузера в новой вкладке.',
      'about.c1.title': 'Только официальные источники',
      'about.c1.text': 'Ссылки ведут на домены разработчиков: google.com, mozilla.org, browser.yandex.ru, opera.com, microsoft.com и другие. Сторонние сборки в каталог не попадают.',
      'about.c2.title': 'Описания без маркетинга',
      'about.c2.text': 'Коротко о том, чем браузер отличается: движок, лицензия, платформы и реальные плюсы. В карточке «Подробнее» — ключевые возможности и предупреждения.',
      'about.c3.title': 'Быстрый подбор',
      'about.c3.text': 'Поиск по названию и описанию, фильтры по категориям и платформам, сортировка и сохранение фильтров в ссылке — можно поделиться подборкой.',

      'footer.about': 'Независимый каталог браузеров: описания, фильтры и ссылки на официальные страницы загрузки. Мы не связаны с разработчиками браузеров и не размещаем собственные сборки.',
      'footer.categories': 'Категории',
      'footer.nav': 'Навигация',
      'footer.privacy': 'Приватные браузеры',
      'footer.gaming': 'Игровые браузеры',
      'footer.lightweight': 'Лёгкие браузеры',
      'footer.mobile': 'Браузеры для телефона',
      'footer.rights': '© {year} BrowserHub. Названия и логотипы принадлежат их правообладателям.',
      'footer.updated': 'Обновлено: {date}',

      'toTop': 'Наверх',

      'card.badge': 'Выбор редакции',
      'card.download': 'Скачать',
      'card.details': 'Подробнее',
      'card.official': 'Официальный источник: {host}',

      'modal.close': 'Закрыть',
      'modal.highlights': 'Ключевые возможности',
      'modal.specs': 'Характеристики',
      'modal.engine': 'Движок',
      'modal.license': 'Лицензия',
      'modal.categories': 'Категории',
      'modal.platforms': 'Доступные платформы',
      'modal.download': 'Скачать с официального сайта',
      'modal.site': 'Сайт разработчика',

      'pill.search': 'Поиск: «{q}»',
      'pill.clearSearch': 'Очистить поиск',
      'pill.clearCategory': 'Сбросить категорию',
      'pill.clearPlatform': 'Сбросить платформу',

      'results.found': 'Найдено <b>{n}</b> {word} из {total}',
      'results.none': 'Ничего не найдено',
      'unit.browser': { one: 'браузер', few: 'браузера', many: 'браузеров' },

      'cat.all': 'Все браузеры',
      'cat.featured.label': 'Рекомендуемые',
      'cat.featured.hint': 'Отобранные редакцией браузеры для большинства задач',
      'cat.classic.label': 'Классические',
      'cat.classic.hint': 'Универсальные браузеры на каждый день',
      'cat.gaming.label': 'Игровые',
      'cat.gaming.hint': 'Оптимизированы под игры и стриминг',
      'cat.lightweight.label': 'Лёгкие',
      'cat.lightweight.hint': 'Мало едят память, работают на слабых ПК',
      'cat.privacy.label': 'Приватные',
      'cat.privacy.hint': 'Блокируют трекеры и защищают данные',
      'cat.dev.label': 'Для разработчиков',
      'cat.dev.hint': 'Гибкие настройки и мощные инструменты',
      'cat.mobile.label': 'Мобильные',
      'cat.mobile.hint': 'Есть версии для Android и iOS',

      'a11y.lang': 'Язык интерфейса изменён: {name}',
      'a11y.theme': 'Тема оформления: {name}',

      'noscript': 'Для работы фильтров и поиска нужен JavaScript. Список браузеров и официальные ссылки доступны напрямую: Google Chrome — google.com/chrome, Яндекс Браузер — browser.yandex.ru, Mozilla Firefox — mozilla.org/firefox, Opera — opera.com, Opera GX — opera.com/gx, Microsoft Edge — microsoft.com/edge, Safari — apple.com/safari, Brave — brave.com, Vivaldi — vivaldi.com, Tor Browser — torproject.org, LibreWolf — librewolf.net, Mullvad Browser — mullvad.net/browser, DuckDuckGo — duckduckgo.com/app, Waterfox — waterfox.net, Pale Moon — palemoon.org, Chromium — chromium.org, Falkon — falkon.org, Arc — arc.net.'
    },

    /* ======================= ENGLISH ======================= */
    en: {
      'meta.title': 'BrowserHub — browser catalog: download Chrome, Yandex Browser, Firefox, Opera and more',
      'meta.description': 'A catalog of popular browsers with descriptions, category filters and search. Every download button leads to the vendor’s official site only.',
      'meta.ogTitle': 'BrowserHub — a catalog of browsers to download',
      'meta.ogDescription': 'Chrome, Yandex Browser, Firefox, Opera, Opera GX, Brave, Vivaldi, Tor and more — with filters, search and links to official sources.',

      'skip.link': 'Skip to the catalog',
      'brand.sub': 'browser catalog',
      'nav.aria': 'Main navigation',
      'nav.featured': 'Recommended',
      'nav.catalog': 'All browsers',
      'nav.how': 'How to choose',
      'nav.about': 'About',

      'search.header.label': 'Search browsers by name',
      'search.header.placeholder': 'Search: Firefox, private…',
      'search.hero.label': 'Search browsers',
      'search.hero.placeholder': 'For example: gaming, private, lightweight, Opera GX…',
      'filters.toggle': 'Filters',

      'lang.button': 'Change interface language',
      'lang.title': 'Interface language',
      'lang.current': 'Current language: {name}',

      'theme.button': 'Choose a theme',
      'theme.title': 'Theme',
      'theme.group.system': 'System',
      'theme.group.light': 'Light',
      'theme.group.dark': 'Dark',
      'theme.auto': 'Match system',
      'theme.auto.hint': 'Follows your OS setting',
      'theme.light': 'Light',
      'theme.light.hint': 'Neutral light base',
      'theme.sepia': 'Sepia',
      'theme.sepia.hint': 'Warm paper-like background',
      'theme.solarized': 'Solarized',
      'theme.solarized.hint': 'Low contrast, easier on the eyes',
      'theme.nord': 'Nord',
      'theme.nord.hint': 'Cool blue-grey tones',
      'theme.dark': 'Dark',
      'theme.dark.hint': 'The classic dark theme',
      'theme.midnight': 'Black (OLED)',
      'theme.midnight.hint': 'Pure black, saves power on OLED',
      'theme.dracula': 'Dracula',
      'theme.dracula.hint': 'Purple accent on dark',
      'theme.forest': 'Forest',
      'theme.forest.hint': 'Calm dark green',
      'theme.contrast': 'High contrast',
      'theme.contrast.hint': 'Maximum readability',

      'hero.badge': 'Every link goes straight to the developer’s official site',
      'hero.title': 'Find <span class="grad">the right browser</span> in a couple of minutes',
      'hero.lead': 'Popular browsers in one catalog: compare speed, privacy and memory use, filter by category and jump to the official download page. No third-party builds, no mirrors.',
      'hero.stat.browsers': { one: 'browser in the catalog', other: 'browsers in the catalog' },
      'hero.stat.categories': { one: 'category and filter', other: 'categories and filters' },
      'hero.stat.official': 'official links',

      'featured.title': 'Recommended browsers',
      'featured.desc': 'Editor’s picks: well-rounded options that suit most people on Windows, macOS and mobile.',
      'featured.link': 'Browse all browsers',

      'catalog.title': 'Browser catalog',
      'catalog.desc': 'Filter by category and platform, search names and descriptions, sort by popularity or alphabetically.',
      'filters.panel': 'Catalog filters',
      'filters.categories': 'Categories',
      'filters.platform': 'Platform',
      'filters.reset': 'Reset all filters',
      'sort.label': 'Sorting',
      'sort.popularity': 'By popularity',
      'sort.name': 'By name (A–Z)',
      'sort.featured': 'Recommended first',

      'empty.title': 'No browsers found',
      'empty.desc': 'Try a different query or reset the filters — the browser you need may sit in another category.',
      'empty.reset': 'Reset filters',

      'how.title': 'How to choose a browser',
      'how.desc': 'Three simple questions that help you decide when you would rather not read spec sheets.',
      'how.c1.title': 'Privacy matters?',
      'how.c1.tag': 'Category “Private”',
      'how.c1.text': 'Go for Brave, Firefox, LibreWolf or Mullvad: they block trackers by default. For maximum anonymity there is Tor Browser, but it is slower.',
      'how.c2.title': 'You game and stream?',
      'how.c2.tag': 'Category “Gaming”',
      'how.c2.text': 'Opera GX can cap memory and CPU while you play, and Microsoft Edge adds a gaming panel, an FPS counter and Game Assist.',
      'how.c3.title': 'Old or low-end PC?',
      'how.c3.tag': 'Category “Lightweight”',
      'how.c3.text': 'Pale Moon, Falkon, Waterfox and Chromium need less memory and start faster. The trade-off: manual updates and occasionally limited compatibility.',

      'about.title': 'About the catalog',
      'about.desc': 'We do not host installers and earn nothing from downloads: every “Download” button opens the browser vendor’s page in a new tab.',
      'about.c1.title': 'Official sources only',
      'about.c1.text': 'Links point to vendor domains: google.com, mozilla.org, browser.yandex.ru, opera.com, microsoft.com and others. Third-party builds never make it into the catalog.',
      'about.c2.title': 'Descriptions without marketing',
      'about.c2.text': 'Just the essentials: engine, license, platforms and real advantages. “Details” lists key features and warnings.',
      'about.c3.title': 'Fast shortlisting',
      'about.c3.text': 'Search names and descriptions, filter by category and platform, sort, and keep filters in the URL — the shortlist is shareable.',

      'footer.about': 'An independent browser catalog: descriptions, filters and links to official download pages. We are not affiliated with any browser vendor and host no builds of our own.',
      'footer.categories': 'Categories',
      'footer.nav': 'Navigation',
      'footer.privacy': 'Private browsers',
      'footer.gaming': 'Gaming browsers',
      'footer.lightweight': 'Lightweight browsers',
      'footer.mobile': 'Mobile browsers',
      'footer.rights': '© {year} BrowserHub. Names and logos belong to their respective owners.',
      'footer.updated': 'Updated: {date}',

      'toTop': 'Back to top',

      'card.badge': 'Editor’s pick',
      'card.download': 'Download',
      'card.details': 'Details',
      'card.official': 'Official source: {host}',

      'modal.close': 'Close',
      'modal.highlights': 'Key features',
      'modal.specs': 'Specifications',
      'modal.engine': 'Engine',
      'modal.license': 'License',
      'modal.categories': 'Categories',
      'modal.platforms': 'Available platforms',
      'modal.download': 'Download from the official site',
      'modal.site': 'Developer site',

      'pill.search': 'Search: “{q}”',
      'pill.clearSearch': 'Clear search',
      'pill.clearCategory': 'Clear category',
      'pill.clearPlatform': 'Clear platform',

      'results.found': 'Found <b>{n}</b> {word} out of {total}',
      'results.none': 'Nothing found',
      'unit.browser': { one: 'browser', other: 'browsers' },

      'cat.all': 'All browsers',
      'cat.featured.label': 'Recommended',
      'cat.featured.hint': 'Hand-picked by the editors for most tasks',
      'cat.classic.label': 'Classic',
      'cat.classic.hint': 'All-round browsers for everyday use',
      'cat.gaming.label': 'Gaming',
      'cat.gaming.hint': 'Tuned for games and streaming',
      'cat.lightweight.label': 'Lightweight',
      'cat.lightweight.hint': 'Low memory use, runs on weak hardware',
      'cat.privacy.label': 'Private',
      'cat.privacy.hint': 'Block trackers and protect your data',
      'cat.dev.label': 'For developers',
      'cat.dev.hint': 'Flexible settings and powerful tooling',
      'cat.mobile.label': 'Mobile',
      'cat.mobile.hint': 'Available for Android and iOS',

      'a11y.lang': 'Interface language changed: {name}',
      'a11y.theme': 'Theme: {name}',

      'noscript': 'JavaScript is required for filters and search. The browser list and official links are available directly: Google Chrome — google.com/chrome, Yandex Browser — browser.yandex.ru, Mozilla Firefox — mozilla.org/firefox, Opera — opera.com, Opera GX — opera.com/gx, Microsoft Edge — microsoft.com/edge, Safari — apple.com/safari, Brave — brave.com, Vivaldi — vivaldi.com, Tor Browser — torproject.org, LibreWolf — librewolf.net, Mullvad Browser — mullvad.net/browser, DuckDuckGo — duckduckgo.com/app, Waterfox — waterfox.net, Pale Moon — palemoon.org, Chromium — chromium.org, Falkon — falkon.org, Arc — arc.net.'
    },

    /* ======================= DEUTSCH ======================= */
    de: {
      'meta.title': 'BrowserHub — Browser-Katalog: Chrome, Yandex Browser, Firefox, Opera und mehr herunterladen',
      'meta.description': 'Katalog beliebter Browser mit Beschreibungen, Kategoriefiltern und Suche. Alle Download-Buttons führen ausschließlich zu den offiziellen Seiten der Entwickler.',
      'meta.ogTitle': 'BrowserHub — Browser-Katalog zum Herunterladen',
      'meta.ogDescription': 'Chrome, Yandex Browser, Firefox, Opera, Opera GX, Brave, Vivaldi, Tor und mehr — mit Filtern, Suche und Links zu offiziellen Quellen.',

      'skip.link': 'Zum Katalog springen',
      'brand.sub': 'Browser-Katalog',
      'nav.aria': 'Hauptnavigation',
      'nav.featured': 'Empfohlen',
      'nav.catalog': 'Alle Browser',
      'nav.how': 'Auswahlhilfe',
      'nav.about': 'Über den Katalog',

      'search.header.label': 'Browser nach Namen suchen',
      'search.header.placeholder': 'Suche: Firefox, privat…',
      'search.hero.label': 'Browser suchen',
      'search.hero.placeholder': 'Zum Beispiel: Gaming, privat, leicht, Opera GX…',
      'filters.toggle': 'Filter',

      'lang.button': 'Sprache der Oberfläche ändern',
      'lang.title': 'Sprache der Oberfläche',
      'lang.current': 'Aktuelle Sprache: {name}',

      'theme.button': 'Design auswählen',
      'theme.title': 'Design',
      'theme.group.system': 'System',
      'theme.group.light': 'Hell',
      'theme.group.dark': 'Dunkel',
      'theme.auto': 'Wie im System',
      'theme.auto.hint': 'Folgt der Systemeinstellung',
      'theme.light': 'Hell',
      'theme.light.hint': 'Neutrale helle Basis',
      'theme.sepia': 'Sepia',
      'theme.sepia.hint': 'Warmer, papierähnlicher Hintergrund',
      'theme.solarized': 'Solarized',
      'theme.solarized.hint': 'Geringer Kontrast, augenschonend',
      'theme.nord': 'Nord',
      'theme.nord.hint': 'Kühle blau-graue Töne',
      'theme.dark': 'Dunkel',
      'theme.dark.hint': 'Das klassische dunkle Design',
      'theme.midnight': 'Schwarz (OLED)',
      'theme.midnight.hint': 'Reines Schwarz, spart Strom auf OLED',
      'theme.dracula': 'Dracula',
      'theme.dracula.hint': 'Violetter Akzent auf Dunkel',
      'theme.forest': 'Wald',
      'theme.forest.hint': 'Ruhiges dunkles Grün',
      'theme.contrast': 'Hoher Kontrast',
      'theme.contrast.hint': 'Maximale Lesbarkeit',

      'hero.badge': 'Alle Links führen ausschließlich zu den offiziellen Entwicklerseiten',
      'hero.title': 'Finden Sie <span class="grad">den passenden Browser</span> in wenigen Minuten',
      'hero.lead': 'Beliebte Browser in einem Katalog: Vergleichen Sie Geschwindigkeit, Datenschutz und Speicherbedarf, filtern Sie nach Kategorie und wechseln Sie zur offiziellen Download-Seite. Keine Fremdbuilds, keine Spiegel.',
      'hero.stat.browsers': { one: 'Browser im Katalog', other: 'Browser im Katalog' },
      'hero.stat.categories': { one: 'Kategorie und Filter', other: 'Kategorien und Filter' },
      'hero.stat.official': 'offizielle Links',

      'featured.title': 'Empfohlene Browser',
      'featured.desc': 'Redaktionsauswahl: universelle Optionen, die für die meisten Nutzer unter Windows, macOS und auf Mobilgeräten passen.',
      'featured.link': 'Alle Browser ansehen',

      'catalog.title': 'Browser-Katalog',
      'catalog.desc': 'Nach Kategorie und Plattform filtern, nach Name und Beschreibung suchen, nach Beliebtheit oder alphabetisch sortieren.',
      'filters.panel': 'Katalogfilter',
      'filters.categories': 'Kategorien',
      'filters.platform': 'Plattform',
      'filters.reset': 'Alle Filter zurücksetzen',
      'sort.label': 'Sortierung',
      'sort.popularity': 'Nach Beliebtheit',
      'sort.name': 'Nach Name (A–Z)',
      'sort.featured': 'Empfohlene zuerst',

      'empty.title': 'Keine Browser gefunden',
      'empty.desc': 'Ändern Sie die Suchanfrage oder setzen Sie die Filter zurück — vielleicht passt ein Browser aus einer anderen Kategorie.',
      'empty.reset': 'Filter zurücksetzen',

      'how.title': 'Wie wählt man einen Browser?',
      'how.desc': 'Drei einfache Fragen, die bei der Entscheidung helfen, wenn Sie keine Datenblätter lesen möchten.',
      'how.c1.title': 'Datenschutz wichtig?',
      'how.c1.tag': 'Kategorie „Privat“',
      'how.c1.text': 'Nehmen Sie Brave, Firefox, LibreWolf oder Mullvad: Sie blockieren Tracker standardmäßig. Maximale Anonymität bietet der Tor Browser, er ist aber langsamer.',
      'how.c2.title': 'Sie spielen und streamen?',
      'how.c2.tag': 'Kategorie „Gaming“',
      'how.c2.text': 'Opera GX kann Speicher und CPU für das Spiel begrenzen, Microsoft Edge bietet ein Gaming-Panel, einen FPS-Zähler und Game Assist.',
      'how.c3.title': 'Der Rechner ist schwach?',
      'how.c3.tag': 'Kategorie „Leichtgewichte“',
      'how.c3.text': 'Pale Moon, Falkon, Waterfox und Chromium brauchen weniger Speicher und starten schneller. Nachteil: manuelle Updates und teils eingeschränkte Kompatibilität.',

      'about.title': 'Über den Katalog',
      'about.desc': 'Wir hosten keine Installer und verdienen nichts an Downloads: Jeder „Download“-Button öffnet die Seite des Browser-Entwicklers in einem neuen Tab.',
      'about.c1.title': 'Nur offizielle Quellen',
      'about.c1.text': 'Die Links führen zu Entwicklerdomains: google.com, mozilla.org, browser.yandex.ru, opera.com, microsoft.com und weitere. Fremdbuilds kommen nicht in den Katalog.',
      'about.c2.title': 'Beschreibungen ohne Marketing',
      'about.c2.text': 'Kurz das Wesentliche: Engine, Lizenz, Plattformen und echte Vorteile. Unter „Details“ stehen die wichtigsten Funktionen und Hinweise.',
      'about.c3.title': 'Schnelle Auswahl',
      'about.c3.text': 'Suche in Name und Beschreibung, Filter nach Kategorie und Plattform, Sortierung und Filter im Link gespeichert — die Auswahl lässt sich teilen.',

      'footer.about': 'Unabhängiger Browser-Katalog: Beschreibungen, Filter und Links zu offiziellen Download-Seiten. Wir sind mit den Browser-Entwicklern nicht verbunden und hosten keine eigenen Builds.',
      'footer.categories': 'Kategorien',
      'footer.nav': 'Navigation',
      'footer.privacy': 'Private Browser',
      'footer.gaming': 'Gaming-Browser',
      'footer.lightweight': 'Leichte Browser',
      'footer.mobile': 'Browser fürs Handy',
      'footer.rights': '© {year} BrowserHub. Namen und Logos gehören ihren jeweiligen Rechteinhabern.',
      'footer.updated': 'Aktualisiert: {date}',

      'toTop': 'Nach oben',

      'card.badge': 'Redaktionswahl',
      'card.download': 'Herunterladen',
      'card.details': 'Details',
      'card.official': 'Offizielle Quelle: {host}',

      'modal.close': 'Schließen',
      'modal.highlights': 'Wichtigste Funktionen',
      'modal.specs': 'Eckdaten',
      'modal.engine': 'Engine',
      'modal.license': 'Lizenz',
      'modal.categories': 'Kategorien',
      'modal.platforms': 'Verfügbare Plattformen',
      'modal.download': 'Vom offiziellen Anbieter herunterladen',
      'modal.site': 'Entwicklerseite',

      'pill.search': 'Suche: „{q}“',
      'pill.clearSearch': 'Suche löschen',
      'pill.clearCategory': 'Kategorie zurücksetzen',
      'pill.clearPlatform': 'Plattform zurücksetzen',

      'results.found': '<b>{n}</b> {word} von {total} gefunden',
      'results.none': 'Nichts gefunden',
      'unit.browser': { one: 'Browser', other: 'Browser' },

      'cat.all': 'Alle Browser',
      'cat.featured.label': 'Empfohlen',
      'cat.featured.hint': 'Von der Redaktion für die meisten Aufgaben ausgewählt',
      'cat.classic.label': 'Klassisch',
      'cat.classic.hint': 'Universelle Browser für jeden Tag',
      'cat.gaming.label': 'Gaming',
      'cat.gaming.hint': 'Optimiert für Spiele und Streaming',
      'cat.lightweight.label': 'Leicht',
      'cat.lightweight.hint': 'Wenig Speicherbedarf, läuft auf schwacher Hardware',
      'cat.privacy.label': 'Privat',
      'cat.privacy.hint': 'Blockieren Tracker und schützen Daten',
      'cat.dev.label': 'Für Entwickler',
      'cat.dev.hint': 'Flexible Einstellungen und starke Werkzeuge',
      'cat.mobile.label': 'Mobil',
      'cat.mobile.hint': 'Versionen für Android und iOS verfügbar',

      'a11y.lang': 'Sprache geändert: {name}',
      'a11y.theme': 'Design: {name}',

      'noscript': 'Für Filter und Suche ist JavaScript erforderlich. Die Browserliste und die offiziellen Links sind direkt verfügbar: Google Chrome — google.com/chrome, Yandex Browser — browser.yandex.ru, Mozilla Firefox — mozilla.org/firefox, Opera — opera.com, Opera GX — opera.com/gx, Microsoft Edge — microsoft.com/edge, Safari — apple.com/safari, Brave — brave.com, Vivaldi — vivaldi.com, Tor Browser — torproject.org, LibreWolf — librewolf.net, Mullvad Browser — mullvad.net/browser, DuckDuckGo — duckduckgo.com/app, Waterfox — waterfox.net, Pale Moon — palemoon.org, Chromium — chromium.org, Falkon — falkon.org, Arc — arc.net.'
    },

    /* ======================= ESPAÑOL ======================= */
    es: {
      'meta.title': 'BrowserHub — catálogo de navegadores: descarga Chrome, Yandex Browser, Firefox, Opera y más',
      'meta.description': 'Catálogo de navegadores populares con descripciones, filtros por categoría y búsqueda. Todos los botones de descarga llevan solo al sitio oficial del desarrollador.',
      'meta.ogTitle': 'BrowserHub — catálogo de navegadores para descargar',
      'meta.ogDescription': 'Chrome, Yandex Browser, Firefox, Opera, Opera GX, Brave, Vivaldi, Tor y más — con filtros, búsqueda y enlaces a fuentes oficiales.',

      'skip.link': 'Ir al catálogo',
      'brand.sub': 'catálogo de navegadores',
      'nav.aria': 'Navegación principal',
      'nav.featured': 'Recomendados',
      'nav.catalog': 'Todos los navegadores',
      'nav.how': 'Cómo elegir',
      'nav.about': 'Sobre el catálogo',

      'search.header.label': 'Buscar navegador por nombre',
      'search.header.placeholder': 'Buscar: Firefox, privado…',
      'search.hero.label': 'Buscar navegador',
      'search.hero.placeholder': 'Por ejemplo: gaming, privado, ligero, Opera GX…',
      'filters.toggle': 'Filtros',

      'lang.button': 'Cambiar el idioma de la interfaz',
      'lang.title': 'Idioma de la interfaz',
      'lang.current': 'Idioma actual: {name}',

      'theme.button': 'Elegir tema',
      'theme.title': 'Tema',
      'theme.group.system': 'Sistema',
      'theme.group.light': 'Claros',
      'theme.group.dark': 'Oscuros',
      'theme.auto': 'Como el sistema',
      'theme.auto.hint': 'Sigue la configuración del sistema',
      'theme.light': 'Claro',
      'theme.light.hint': 'Base clara neutra',
      'theme.sepia': 'Sepia',
      'theme.sepia.hint': 'Fondo cálido tipo papel',
      'theme.solarized': 'Solarized',
      'theme.solarized.hint': 'Contraste bajo, menos fatiga visual',
      'theme.nord': 'Nord',
      'theme.nord.hint': 'Tonos fríos gris azulados',
      'theme.dark': 'Oscuro',
      'theme.dark.hint': 'El tema oscuro clásico',
      'theme.midnight': 'Negro (OLED)',
      'theme.midnight.hint': 'Negro puro, ahorra batería en OLED',
      'theme.dracula': 'Dracula',
      'theme.dracula.hint': 'Acento violeta sobre oscuro',
      'theme.forest': 'Bosque',
      'theme.forest.hint': 'Verde oscuro y tranquilo',
      'theme.contrast': 'Alto contraste',
      'theme.contrast.hint': 'Máxima legibilidad',

      'hero.badge': 'Todos los enlaces llevan solo a los sitios oficiales de los desarrolladores',
      'hero.title': 'Encuentra <span class="grad">el navegador adecuado</span> en un par de minutos',
      'hero.lead': 'Los navegadores más populares en un solo catálogo: compara velocidad, privacidad y consumo de memoria, filtra por categoría y pasa a la página oficial de descarga. Sin compilaciones de terceros ni espejos.',
      'hero.stat.browsers': { one: 'navegador en el catálogo', other: 'navegadores en el catálogo' },
      'hero.stat.categories': { one: 'categoría y filtro', other: 'categorías y filtros' },
      'hero.stat.official': 'enlaces oficiales',

      'featured.title': 'Navegadores recomendados',
      'featured.desc': 'Selección editorial: opciones versátiles que sirven a la mayoría de los usuarios en Windows, macOS y móviles.',
      'featured.link': 'Ver todos los navegadores',

      'catalog.title': 'Catálogo de navegadores',
      'catalog.desc': 'Filtra por categoría y plataforma, busca por nombre y descripción, ordena por popularidad o alfabéticamente.',
      'filters.panel': 'Filtros del catálogo',
      'filters.categories': 'Categorías',
      'filters.platform': 'Plataforma',
      'filters.reset': 'Restablecer todos los filtros',
      'sort.label': 'Orden',
      'sort.popularity': 'Por popularidad',
      'sort.name': 'Por nombre (A–Z)',
      'sort.featured': 'Recomendados primero',

      'empty.title': 'No se encontraron navegadores',
      'empty.desc': 'Cambia la búsqueda o restablece los filtros: puede que el navegador que buscas esté en otra categoría.',
      'empty.reset': 'Restablecer filtros',

      'how.title': 'Cómo elegir un navegador',
      'how.desc': 'Tres preguntas sencillas que ayudan a decidir si prefieres no leer especificaciones.',
      'how.c1.title': '¿Te importa la privacidad?',
      'how.c1.tag': 'Categoría «Privados»',
      'how.c1.text': 'Elige Brave, Firefox, LibreWolf o Mullvad: bloquean rastreadores de forma predeterminada. Para el máximo anonimato está Tor Browser, aunque es más lento.',
      'how.c2.title': '¿Juegas y haces streaming?',
      'how.c2.tag': 'Categoría «Gaming»',
      'how.c2.text': 'Opera GX puede limitar la memoria y la CPU para el juego, y Microsoft Edge añade panel gaming, contador de FPS y Game Assist.',
      'how.c3.title': '¿Tu equipo es antiguo?',
      'how.c3.tag': 'Categoría «Ligeros»',
      'how.c3.text': 'Pale Moon, Falkon, Waterfox y Chromium consumen menos memoria y arrancan más rápido. La pega: actualizaciones manuales y compatibilidad a veces limitada.',

      'about.title': 'Sobre el catálogo',
      'about.desc': 'No alojamos instaladores ni ganamos con las descargas: cada botón «Descargar» abre la página del desarrollador en una pestaña nueva.',
      'about.c1.title': 'Solo fuentes oficiales',
      'about.c1.text': 'Los enlaces llevan a dominios de los desarrolladores: google.com, mozilla.org, browser.yandex.ru, opera.com, microsoft.com y otros. Las compilaciones de terceros no entran en el catálogo.',
      'about.c2.title': 'Descripciones sin marketing',
      'about.c2.text': 'Lo esencial en pocas líneas: motor, licencia, plataformas y ventajas reales. En «Detalles» están las funciones clave y los avisos.',
      'about.c3.title': 'Selección rápida',
      'about.c3.text': 'Búsqueda por nombre y descripción, filtros por categoría y plataforma, orden y filtros guardados en el enlace: puedes compartir la selección.',

      'footer.about': 'Catálogo independiente de navegadores: descripciones, filtros y enlaces a las páginas oficiales de descarga. No tenemos relación con los desarrolladores ni alojamos compilaciones propias.',
      'footer.categories': 'Categorías',
      'footer.nav': 'Navegación',
      'footer.privacy': 'Navegadores privados',
      'footer.gaming': 'Navegadores gaming',
      'footer.lightweight': 'Navegadores ligeros',
      'footer.mobile': 'Navegadores para el móvil',
      'footer.rights': '© {year} BrowserHub. Los nombres y logotipos pertenecen a sus respectivos titulares.',
      'footer.updated': 'Actualizado: {date}',

      'toTop': 'Arriba',

      'card.badge': 'Elección del editor',
      'card.download': 'Descargar',
      'card.details': 'Detalles',
      'card.official': 'Fuente oficial: {host}',

      'modal.close': 'Cerrar',
      'modal.highlights': 'Funciones clave',
      'modal.specs': 'Especificaciones',
      'modal.engine': 'Motor',
      'modal.license': 'Licencia',
      'modal.categories': 'Categorías',
      'modal.platforms': 'Plataformas disponibles',
      'modal.download': 'Descargar del sitio oficial',
      'modal.site': 'Sitio del desarrollador',

      'pill.search': 'Búsqueda: «{q}»',
      'pill.clearSearch': 'Borrar búsqueda',
      'pill.clearCategory': 'Quitar categoría',
      'pill.clearPlatform': 'Quitar plataforma',

      'results.found': 'Se encontraron <b>{n}</b> {word} de {total}',
      'results.none': 'Sin resultados',
      'unit.browser': { one: 'navegador', other: 'navegadores' },

      'cat.all': 'Todos los navegadores',
      'cat.featured.label': 'Recomendados',
      'cat.featured.hint': 'Elegidos por la redacción para la mayoría de tareas',
      'cat.classic.label': 'Clásicos',
      'cat.classic.hint': 'Navegadores versátiles para el día a día',
      'cat.gaming.label': 'Gaming',
      'cat.gaming.hint': 'Optimizados para juegos y streaming',
      'cat.lightweight.label': 'Ligeros',
      'cat.lightweight.hint': 'Poca memoria y funcionan en equipos modestos',
      'cat.privacy.label': 'Privados',
      'cat.privacy.hint': 'Bloquean rastreadores y protegen tus datos',
      'cat.dev.label': 'Para desarrolladores',
      'cat.dev.hint': 'Ajustes flexibles y herramientas potentes',
      'cat.mobile.label': 'Móviles',
      'cat.mobile.hint': 'Con versiones para Android e iOS',

      'a11y.lang': 'Idioma cambiado: {name}',
      'a11y.theme': 'Tema: {name}',

      'noscript': 'Se necesita JavaScript para los filtros y la búsqueda. La lista de navegadores y los enlaces oficiales están disponibles directamente: Google Chrome — google.com/chrome, Yandex Browser — browser.yandex.ru, Mozilla Firefox — mozilla.org/firefox, Opera — opera.com, Opera GX — opera.com/gx, Microsoft Edge — microsoft.com/edge, Safari — apple.com/safari, Brave — brave.com, Vivaldi — vivaldi.com, Tor Browser — torproject.org, LibreWolf — librewolf.net, Mullvad Browser — mullvad.net/browser, DuckDuckGo — duckduckgo.com/app, Waterfox — waterfox.net, Pale Moon — palemoon.org, Chromium — chromium.org, Falkon — falkon.org, Arc — arc.net.'
    }
  };

  /* ---------- 3. Текущий язык ---------- */

  var currentLang = 'ru';
  var listeners = [];

  function isSupported(id) {
    return LOCALES.some(function (l) { return l.id === id; });
  }

  /* Нормализуем тег вида "de-AT" или "es-419" до поддерживаемого "de"/"es" */
  function matchLocale(tag) {
    if (!tag) return null;
    var lower = String(tag).toLowerCase();
    if (isSupported(lower)) return lower;
    var base = lower.split('-')[0];
    return isSupported(base) ? base : null;
  }

  function detectLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && isSupported(saved)) return saved;
    } catch (e) { /* приватный режим или file:// */ }
    var nav = global.navigator;
    var candidates = (nav && nav.languages) || (nav && nav.language ? [nav.language] : []);
    for (var i = 0; i < candidates.length; i++) {
      var hit = matchLocale(candidates[i]);
      if (hit) return hit;
    }
    return 'ru';
  }

  function getLang() { return currentLang; }

  function locale() {
    var found = LOCALES.filter(function (l) { return l.id === currentLang; })[0];
    return found || LOCALES[0];
  }

  /* ---------- 4. Доступ к строкам ---------- */

  function lookup(lang, key) {
    var dict = I18N[lang];
    return dict && Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : undefined;
  }

  function raw(key) {
    var value = lookup(currentLang, key);
    if (value !== undefined) return value;
    for (var i = 0; i < FALLBACK_CHAIN.length; i++) {
      value = lookup(FALLBACK_CHAIN[i], key);
      if (value !== undefined) return value;
    }
    return key;
  }

  function interpolate(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, function (match, name) {
      return Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match;
    });
  }

  /* Обычная строка: t('results.none') или t('footer.rights', { year: 2026 }) */
  function t(key, vars) {
    var value = raw(key);
    if (value && typeof value === 'object') value = value.other || value.many || value.one;
    return interpolate(value, vars);
  }

  /* Строка с числом: форма выбирается через Intl.PluralRules */
  function tp(key, n, vars) {
    var value = raw(key);
    if (!value || typeof value !== 'object') return interpolate(t(key, vars), vars);
    var category;
    try {
      category = new Intl.PluralRules(currentLang).select(n);
    } catch (e) {
      category = 'other';
    }
    var form = value[category] || value.other || value.many || value.few || value.one || '';
    return interpolate(form, Object.assign({ n: n }, vars || {}));
  }

  /* ---------- 5. Применение к разметке ----------
     Поддерживаются атрибуты:
       data-i18n              → textContent
       data-i18n-html         → innerHTML (строка содержит разметку)
       data-i18n-placeholder  → атрибут placeholder
       data-i18n-aria-label   → атрибут aria-label
       data-i18n-title        → атрибут title
       data-i18n-content      → атрибут content (для <meta>)
     Любой другой data-i18n-<attr> подставляется в одноимённый атрибут.
  ------------------------------------------------ */
  var ATTR_KEYS = { placeholder: 'placeholder', 'aria-label': 'aria-label', title: 'title', content: 'content', alt: 'alt', value: 'value' };

  function applyI18n(root) {
    var scope = root || document;

    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n]'), function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });

    Array.prototype.forEach.call(scope.querySelectorAll('[data-i18n-html]'), function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });

    Object.keys(ATTR_KEYS).forEach(function (name) {
      var sel = '[data-i18n-' + name + ']';
      Array.prototype.forEach.call(scope.querySelectorAll(sel), function (el) {
        el.setAttribute(ATTR_KEYS[name], t(el.getAttribute('data-i18n-' + name)));
      });
    });

    /* Меняем язык документа и заголовок вкладки */
    if (scope === document) {
      document.documentElement.setAttribute('lang', currentLang);
      document.title = t('meta.title');
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle'));
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', t('meta.ogDescription'));
    }
  }

  /* ---------- 6. Перевод описаний браузеров ----------
     Русский текст лежит в data.js и является источником.
     Остальные языки — в content.<lang>.js. Если перевода нет,
     используется цепочка lang → en → ru (данные из data.js).
  ------------------------------------------------------ */
  function contentFor(lang) {
    /* content.<lang>.js объявляет const BROWSER_CONTENT — на window такое
       объявление не попадает, поэтому обращаемся к идентификатору напрямую,
       а наличие проверяем через typeof (иначе ReferenceError при отсутствии файла). */
    if (typeof BROWSER_CONTENT === 'undefined' || !BROWSER_CONTENT) return null;
    return BROWSER_CONTENT[lang] || null;
  }

  function localizeBrowser(browser) {
    var overrides = contentFor(currentLang);
    var row = overrides && overrides[browser.id];
    if (!row) {
      if (currentLang !== 'ru') {
        var en = contentFor('en');
        row = en && en[browser.id];
      }
    }
    if (!row) return browser;

    var merged = {};
    Object.keys(browser).forEach(function (k) { merged[k] = browser[k]; });
    Object.keys(row).forEach(function (k) {
      if (row[k] !== undefined && row[k] !== null) merged[k] = row[k];
    });
    return merged;
  }

  function localizeAll(list) {
    return list.map(localizeBrowser);
  }

  /* ---------- 7. Локализованные форматы ---------- */

  /* Месяц + год для подписи «Обновлено» */
  function formatMonthYear(date) {
    try {
      var month = new Intl.DateTimeFormat(currentLang, { month: 'long' }).format(date);
      return month + ' ' + new Intl.DateTimeFormat(currentLang, { year: 'numeric' }).format(date);
    } catch (e) {
      return String(date.getFullYear());
    }
  }

  /* ---------- 8. Переключение ---------- */

  function setLang(id, options) {
    var next = isSupported(id) ? id : 'ru';
    var changed = next !== currentLang;
    currentLang = next;

    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* приватный режим */ }

    if (options && options.silent) return;

    applyI18n(document);
    listeners.forEach(function (fn) {
      try { fn(next, changed); } catch (e) { /* один сломанный слушатель не ломает остальные */ }
    });
  }

  function onLangChange(fn) {
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i > -1) listeners.splice(i, 1);
    };
  }

  function init() {
    currentLang = detectLang();
  }

  /* ---------- 9. Экспорт ---------- */
  global.BH_I18N = {
    LOCALES: LOCALES,
    STORAGE_KEY: STORAGE_KEY,
    init: init,
    getLang: getLang,
    setLang: setLang,
    onLangChange: onLangChange,
    locale: locale,
    t: t,
    tp: tp,
    applyI18n: applyI18n,
    localizeBrowser: localizeBrowser,
    localizeAll: localizeAll,
    formatMonthYear: formatMonthYear,
    isSupported: isSupported
  };
})(window);
