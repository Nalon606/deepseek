/* ==========================================================================
   content.en.js — English text for the catalog entries
   --------------------------------------------------------------------------
   Русские описания браузеров лежат в data.js и остаются источником.
   Здесь только переопределения: любое поле, которого нет в файле,
   берётся из data.js как есть (имя, вендор, движок, ссылки, цвет и т. д.).

   Языки, для которых перевода нет (сейчас это de и es), автоматически
   получают этот английский текст — см. BH_I18N.localizeBrowser().
   ========================================================================== */

const BROWSER_CONTENT = {
  en: {
    chrome: {
      tagline: 'The most popular browser, with the largest extension library',
      description: 'The reference Chromium browser: a fast Blink engine, sync through a Google account, the Chrome Web Store and automatic security updates. Best-in-class compatibility with modern sites and web apps, but more tightly tied to Google services than the rest.',
      license: 'Free, proprietary',
      highlights: [
        'Huge library of extensions and themes',
        'Automatic updates and fast patching of vulnerabilities',
        'Sync of tabs, passwords and history',
        'Profiles for work, study and personal life',
        'Excellent compatibility with web apps'
      ]
    },

    edge: {
      tagline: 'A Chromium browser with an AI assistant, vertical tabs and a gaming panel',
      description: 'Built on Chromium, so it supports extensions from the Chrome Web Store. It brings vertical tabs, Collections for saving pages, Efficiency mode to save battery, the built-in Copilot assistant and a gaming panel with Game Assist and performance stats.',
      license: 'Free, proprietary',
      highlights: [
        'Vertical tabs and tab groups',
        'Efficiency mode saves battery life',
        'Gaming panel, Game Assist and an FPS counter',
        'Built-in PDF and web capture tools',
        'Supports Chrome extensions'
      ]
    },

    firefox: {
      tagline: 'An independent browser on its own Gecko engine with strong privacy',
      description: 'The only major browser with its own Gecko engine — it does not depend on Chromium and keeps the web competitive. Enhanced Tracking Protection is on by default, Containers keep sites isolated from each other, and there is a solid password manager plus deep tuning through about:config.',
      license: 'Open source (MPL 2.0)',
      highlights: [
        'Its own engine — independence from Chromium',
        'Blocks trackers and crypto-mining scripts',
        'Containers keep accounts separate',
        'Deep tuning through about:config',
        'Regular updates and open source'
      ]
    },

    yandex: {
      name: 'Yandex Browser',
      vendor: 'Yandex',
      tagline: 'A Russian-language browser with Alice, video translation and tracker protection',
      description: 'Tuned for the Russian-speaking web: the Alice voice assistant right in the address bar, on-the-fly translation of videos and subtitles, My Wave and quick access to Yandex services. It includes an ad blocker, protection from dangerous sites and an incognito mode with DNS encryption.',
      license: 'Free, proprietary',
      highlights: [
        'Alice and voice search in the address bar',
        'On-the-fly translation of videos, subtitles and text',
        'Built-in ad and tracker blocker',
        'Warnings about dangerous and phishing sites',
        'Sync with a Yandex account'
      ]
    },

    opera: {
      tagline: 'A browser with a built-in VPN, an ad blocker and a sidebar',
      description: 'One of the first Chromium browsers with a free built-in VPN that needs no extensions. Add an ad blocker, a sidebar with messengers, tab islands, a data-saving mode and a secure password generator — all already included.',
      license: 'Free, proprietary',
      highlights: [
        'Free built-in VPN with no limits',
        'Built-in ad blocker',
        'Sidebar with messengers and social networks',
        'Data saving and faster page loading',
        'Snapshots and tab islands'
      ]
    },

    operagx: {
      tagline: 'A gaming browser with RAM/CPU limiters and neon lighting',
      description: 'The gaming edition of Opera: limiters for RAM, CPU and network so the browser does not steal resources from your game. Inside there is GX Corner with deals and releases, Twitch and Discord integration, interface sounds, keyboard lighting and dozens of gaming-style themes.',
      license: 'Free, proprietary',
      highlights: [
        'RAM, CPU and bandwidth limiters',
        'GX Corner: deals, releases and gaming news',
        'Twitch and Discord integration',
        'Hotkeys and a Do Not Disturb mode',
        'Custom lighting, sounds and themes'
      ]
    },

    safari: {
      tagline: 'Apple’s stock browser with the best battery life on Mac and iPhone',
      description: 'The most power-efficient browser for Apple hardware: optimised for M-series chips, it supports iCloud sync, Apple Pay, Private Relay and Intelligent Tracking Prevention. It runs only on Apple devices — Windows and Android versions do not exist.',
      license: 'Free, proprietary',
      notice: 'Available only on Apple devices: macOS, iOS and iPadOS. There are no Windows or Android versions.',
      highlights: [
        'Maximum battery life on MacBook and iPhone',
        'Tracking prevention and IP hiding through Private Relay',
        'Tab and password sync through iCloud',
        'Reader view without ads or distractions',
        'Support for Apple Pay and passkeys'
      ]
    },

    brave: {
      tagline: 'A private browser with ad blocking out of the box and BAT rewards',
      description: 'Blocks ads and trackers without extensions, so pages load noticeably faster. Brave Shields are adjustable by strictness level, there are private windows routed through Tor, the Brave Search engine and an optional rewards programme paid in BAT tokens.',
      license: 'Open source (MPL 2.0)',
      highlights: [
        'Ad and tracker blocking by default',
        'Private windows routed through Tor',
        'Fingerprint randomisation',
        'Its own Brave Search engine',
        'Faster thanks to stripped ad scripts'
      ]
    },

    vivaldi: {
      tagline: 'The most customisable browser: panels, gestures, notes and mail inside',
      description: 'A browser for people who want to configure everything: panel positions, mouse gestures, keyboard shortcuts, tab stacks, tiling and cascades. It already ships a download manager, notes, an RSS reader, a calendar, a mail client, an ad blocker and a session manager.',
      license: 'Free, proprietary',
      highlights: [
        'Tab stacks, tiling and cascade mode',
        'Mouse gestures and fully customisable panels',
        'Built-in notes, mail, calendar and RSS',
        'Ad and tracker blocker',
        'Sync with on-device encryption'
      ]
    },

    arc: {
      tagline: 'A browser with spaces instead of tabs and a split-screen view',
      description: 'Rethinks how tabs work: instead of an endless strip there are Spaces for different contexts plus a sidebar. It adds Split View for two pages side by side, Boost to restyle any site, built-in mini apps and sync across devices.',
      license: 'Free, proprietary',
      highlights: [
        'Spaces and pinned tabs',
        'Split View — two pages in one window',
        'Boost to customise any site',
        'Automatic tab archiving on a timer',
        'Sidebar with notes and mini apps'
      ]
    },

    tor: {
      tagline: 'Maximum anonymity: traffic travels through the multi-hop Tor network',
      description: 'Routes your connection through several nodes of the Tor network, so a site sees the exit node address rather than your IP. All privacy settings are maxed out, with security levels and fingerprinting protection. The price of anonymity is slower page loads.',
      engine: 'Gecko (modified)',
      license: 'Open source',
      notice: 'Page loading is slower than usual: traffic passes through several Tor nodes, and some sites may ask for a captcha.',
      highlights: [
        'Hides your IP address and location',
        'Multi-layer traffic encryption',
        'Security levels from standard to safest',
        'Fingerprinting protection',
        'Bypasses site blocks'
      ]
    },

    librewolf: {
      tagline: 'Firefox without telemetry and with hard-line privacy settings',
      description: 'An independent Firefox fork with telemetry stripped out and the most private defaults: enforced HTTPS, uBlock Origin out of the box, data cleared on exit and fingerprinting protection. It requires manual updates or a package manager.',
      engine: 'Gecko (Firefox fork)',
      license: 'Open source (MPL 2.0)',
      notice: 'There are no automatic updates: new versions must be installed manually or through a package manager.',
      highlights: [
        'Telemetry and data collection fully disabled',
        'uBlock Origin preinstalled',
        'HTTPS enforced on every site',
        'Cookies and cache cleared on exit',
        'Fingerprint tracking protection'
      ]
    },

    mullvad: {
      tagline: 'Anti-fingerprinting: makes every user indistinguishable from the rest',
      description: 'A joint project by Mullvad VPN and the Tor Project built to defeat browser fingerprinting: every user shares the same window size, fonts and User-Agent. No telemetry and no ad trackers, and you can use it with any VPN.',
      engine: 'Gecko (Firefox ESR fork)',
      license: 'Open source',
      notice: 'Updates arrive less often than in Firefox: keep an eye on the current version on the project site.',
      highlights: [
        'One shared browser fingerprint for all users',
        'Works with any VPN service',
        'No telemetry and no ad trackers',
        'Blocks third-party scripts and social widgets',
        'Developed together with the Tor Project'
      ]
    },

    duckduckgo: {
      tagline: 'A private browser with a Fire Button and protection from miners',
      description: 'A simple browser that does not keep your search history or build an ad profile. The Fire Button closes every tab and wipes session data in one tap, while built-in protection blocks trackers, hidden miners and redirects to shady sites.',
      engine: 'Blink / WebKit (per platform)',
      license: 'Open source (partially)',
      highlights: [
        'Fire Button wipes the session in one tap',
        'Blocks trackers and hidden miners',
        'Private search without personalisation',
        'Encrypts connections and redirects',
        'A clean interface with no clutter'
      ]
    },

    waterfox: {
      tagline: 'A lightweight Firefox fork for weak and older computers',
      description: 'Keeps the classic Firefox interface and support for legacy extensions, while using less memory and running on weak hardware. Minimal telemetry, a built-in tracker blocker and separate builds for different systems.',
      engine: 'Gecko (Firefox fork)',
      license: 'Open source (MPL 2.0)',
      highlights: [
        'Low RAM consumption',
        'The classic Firefox interface',
        'Support for legacy extensions',
        'Minimal telemetry',
        'Runs on old Windows versions'
      ]
    },

    palemoon: {
      tagline: 'A retro browser on its own Goanna engine with minimal requirements',
      description: 'A Firefox fork with its own Goanna engine, a classic interface and old-school customisability. It is very undemanding on resources, but some modern sites and extensions may misbehave — the price of stability and backward compatibility.',
      engine: 'Goanna',
      license: 'Open source (MPL 2.0)',
      notice: 'The Goanna engine lags behind modern standards: some sites and extensions may not work correctly.',
      highlights: [
        'Its own Goanna engine',
        'Very low resource requirements',
        'A classic, configurable interface',
        'Support for legacy XUL extensions',
        'Fully open source'
      ]
    },

    chromium: {
      tagline: 'The open foundation of Chrome — without proprietary components',
      description: 'The open-source project that Chrome, Edge, Opera, Brave and others are built from. There is no telemetry, no proprietary codecs and no Google services, but security updates are up to you — a browser for people who know what they are doing.',
      engine: 'Blink (Chromium)',
      license: 'Open source (BSD)',
      notice: 'Security updates must be installed manually — the browser does not update itself.',
      highlights: [
        'The upstream build without proprietary modules',
        'No telemetry and no bundled services',
        'Fully open source',
        'The base for most modern browsers',
        'Updates are installed manually'
      ]
    },

    falkon: {
      tagline: 'A simple, fast Qt browser with a built-in ad blocker',
      description: 'A lightweight browser on the QtWebEngine engine from the KDE ecosystem: a built-in ad blocker, extension support, a download manager and a private mode. It starts quickly and works well on weak machines and in Linux distributions.',
      engine: 'QtWebEngine (Chromium)',
      license: 'Open source (GPL)',
      highlights: [
        'Very fast startup and low load',
        'Built-in ad blocker',
        'Extension support',
        'Integration with the KDE desktop',
        'Fully open source'
      ]
    }
  }
};
