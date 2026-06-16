# Refactor Report

## Files Changed

| File | Change |
| --- | --- |
| index.html | replaced inline style block 2 with a stylesheet link at the same position |
| assets/css/pages/home.css | created or replaced with verbatim CSS from the owning page |
| audit.html | replaced inline style block 2 with a stylesheet link at the same position |
| assets/css/pages/audit.css | created or replaced with verbatim CSS from the owning page |
| discovery.html | replaced inline style block 1 with a stylesheet link at the same position |
| assets/css/pages/discovery.css | created or replaced with verbatim CSS from the owning page |
| brand-foundation-sprint.html | replaced inline style block 1 with a stylesheet link at the same position |
| assets/css/pages/sprint.css | created or replaced with verbatim CSS from the owning page |
| websites-digital-experiences.html | replaced inline style block 1 with a stylesheet link at the same position |
| assets/css/pages/website.css | created or replaced with verbatim CSS from the owning page |
| creative-agency-delhi.html | replaced inline style block 2 with a stylesheet link at the same position |
| assets/css/pages/creative-agency-delhi.css | created or replaced with verbatim CSS from the owning page |
| index.html | 1 duplicate trailing /assets/css/pages/home.css link removed to preserve original cascade |
| CSS_DEPENDENCY_MAP.md | generated |
| DUPLICATE_SELECTORS.md | generated |
| UNUSED_SELECTORS.md | generated |
| MIGRATION_PLAN.md | generated |
| REFACTOR_REPORT.md | generated |

## Selectors Moved

| Original file | Destination file | Selector | Reason |
| --- | --- | --- | --- |
| index.html | assets/css/pages/home.css | `:root` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*::before` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*::after` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `html` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `body` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `::selection` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `img` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `a` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `::-webkit-scrollbar` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `::-webkit-scrollbar-track` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `::-webkit-scrollbar-thumb` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.skip-link` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.skip-link:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `nav` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `nav.scrolled` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-logo` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-logo sup` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-links` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-links a` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-links a:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-links a.active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-cta` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-cta:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-links` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-cta` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.nav-cta` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-ctas` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hamburger` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.pill-menu` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.pill-line` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.pill-body` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hamburger.open .pill-line` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hamburger.open .pill-body` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hamburger` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hamburger` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu.open` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu a:not(.mob-contact)` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu a:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu a:active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu a.finger-active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.sr-only` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mob-menu .mob-contact` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up.visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up.d1` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up.d2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up.d3` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.fade-up.d4` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-1` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-3` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-4` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-5` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-anim-6` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#hero` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-content` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-eyebrow` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-left` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-right` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-bg-shapes` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.shape` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.shape-1` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.shape-2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.shape-3` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.shape` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-left` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-right` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-left` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-edge-right` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-h1` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-h1 em` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-sub` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-ctas` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.btn-primary` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.btn-primary:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.btn-outline` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.btn-outline:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-proof` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-lines` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-vert` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-horiz` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-vert` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-vert:nth-child(2)` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-horiz` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-horiz:nth-child(4)` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-vert` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.line-horiz` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-hint` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-line` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-line-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-hint span` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-hint` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-section .section-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-header` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-eyebrow` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-title` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-count` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-manifesto` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-count` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-img-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-img-wrap img` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card:hover .work-img-wrap img` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card-info` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card-cat` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card-stmt` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-card-stmt` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-strip-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip::after` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip:active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip::-webkit-scrollbar` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip::-webkit-scrollbar-track` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip::-webkit-scrollbar-thumb` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card iframe` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-poster > div:last-child` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card .reel-poster > div:last-child` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-poster > div:last-child svg` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-poster` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-poster > div:first-child` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap iframe` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-attr` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.work-attr a` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-header` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.Engagements-section > .section-inner > div[style*="display:grid"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card--dark` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card--dark .btn-primary` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.service-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.service-num` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.service-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.service-desc` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-quote` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-manifesto` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-quote em` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-divider` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-divider.visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-pillars` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-pillars` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-pillar-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.approach-pillar-text` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.capabilities-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-intro` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-intro` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-intro-h2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-intro-h2 em` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-intro-right p` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-num` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-def` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-outputs` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-outputs li` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-outputs li::before` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for-text` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-main p` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-main p.small` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-stats` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-stats` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-stat-num` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.studio-stat-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-intro-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-intro-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-h2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-sub` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-grid .intel-card:last-child:nth-child(odd)` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-arrow` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-card:hover .intel-arrow` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-thesis` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-tags` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-tag` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-brand-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-overlay` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-overlay.open` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-body` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-close` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-close:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-cat` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-h2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-lead` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-p` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.modal-quote` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-section` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-h2` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-h2 em` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-sub` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-philosophy` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.wa-btn` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.wa-btn:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.wa-note` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.phone-link` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.phone-link:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-links` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-link-row` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-link-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-link-value` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-link-row:hover .contact-link-value` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input::placeholder` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input:-webkit-autofill` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input:-webkit-autofill:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input:-webkit-autofill:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input:-webkit-autofill:active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti input:-webkit-autofill` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti input:-webkit-autofill:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti input:-webkit-autofill:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti input:-webkit-autofill:active` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-input.error` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.field-error` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.field-error.visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `select.form-input` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `select.form-input option` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-row` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-row` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.submit-btn` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.submit-btn` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.submit-btn:hover:not(:disabled)` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.submit-btn:disabled` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.form-next` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.site-footer` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-inner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.site-footer` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-logo` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-logo sup` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-tagline` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-links` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link[aria-label="FB / Facebook"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link[aria-label="Instagram"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link[aria-label="LinkedIn"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link[aria-label="X / Twitter"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.social-link[aria-label="YT / YouTube"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-col-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-link` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-link:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-contact-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-contact-val` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-contact-val:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-bar` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-bar p` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-philosophy` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#back-to-top` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#back-to-top.visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#back-to-top:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.spinner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.howwework-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.howwework-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.founder-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.founder-grid > div:first-child` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.hero-h1` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.scroll-strip` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster img` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster:hover img` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster .play-btn` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster:hover .play-btn` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.video-poster .play-btn svg` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-poster-loading` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-spinner` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `a:focus-visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `button:focus-visible` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*::before` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `*::after` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `select.form-input:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `input.form-input:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `textarea.form-input:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#back-to-top` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-wa` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-wa` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-wa:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-label` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-close` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-close:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-title` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-sub` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-close` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-book-close:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-wa` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `#mobile-wa:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.intel-card:hover` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.howwework-grid > div` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagement-card--dark` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.cap-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.built-for` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.engagements-grid` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `[style*="grid-template-columns:repeat(auto-fit"]` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.film-card` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.reel-wrap` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.footer-bar` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.section-header` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-link-row` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.contact-links` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-list` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-list::-webkit-scrollbar` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-list::-webkit-scrollbar-thumb` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country.iti__highlight` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__dial-code` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__search-input` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__search-input:focus` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti--container .iti__country-list` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-list` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country.iti__highlight` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__country-name` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__dial-code` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__flag` | home page selectors were embedded inline and the page already referenced this page-level file |
| index.html | assets/css/pages/home.css | `.iti__flag` | home page selectors were embedded inline and the page already referenced this page-level file |
| audit.html | assets/css/pages/audit.css | `*` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `*::before` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `*::after` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `:root` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `html` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `body` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `::-webkit-scrollbar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `::-webkit-scrollbar-track` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `::-webkit-scrollbar-thumb` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `nav` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `nav.scrolled` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-logo` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-logo sup` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-links` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-links a` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-links a:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-cta` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-cta:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `nav a` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.nav-links` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `*` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hamburger` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.pill-menu` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.pill-line` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.pill-body` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hamburger.open .pill-line` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hamburger.open .pill-body` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hamburger` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hamburger` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu.open` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu a:not(.mob-contact)` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu a:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu a:active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu a.finger-active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#mob-menu .mob-contact` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sr-only` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.page-wrap` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-eyebrow` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-eyebrow::before` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero h1` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero h1 em` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-sub` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-section` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-card` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-card` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-wrap` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-meta` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step-label` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step-fraction` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-track` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-fill` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-fill::after` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step-dots` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.dot` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.dot.active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.dot.done` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.dot-line` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.steps-container` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step.active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step-heading` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step-desc` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field-group` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field label` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field label span.optional` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field input` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field select` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field input::placeholder` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field input:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field select:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field textarea` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.error-msg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field input.error + .error-msg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field.has-error .error-msg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field-row` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.select-wrap` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `select` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `select:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.budget-options` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.budget-pill` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.budget-pill:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.budget-pill.selected` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `input[name="budget"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-options` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card.selected` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-icon` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card.selected .goal-icon` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-text` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-title` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-sub` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-check` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card.selected .goal-check` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-check::after` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.goal-card.selected .goal-check::after` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `input[name="goal"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-footer` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-ghost` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-ghost:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-ghost:disabled` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-primary` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-primary:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-primary:active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-generate` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-generate:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-generate` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-ghost` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn svg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#success-screen` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#success-screen.visible` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.analysis-header` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.analysis-badge` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.spinner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.analysis-title` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.analysis-sub` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.divider` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.divider::before` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.divider::after` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.checklist` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-item` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-item:last-child` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-item.revealed` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-icon` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-icon.done` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-label` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-status` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.check-status.complete` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.privacy-note` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.privacy-note a` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.header-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-section` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.step` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-wrap` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-footer` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.field-row` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.privacy-note` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#success-screen` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-sidebar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-brand` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-brand-label` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-brand-name` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.clickable` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.clickable:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.active::before` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-num` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.active .tab-num` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.done .tab-num` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-info` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-title` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab:not(.active) .tab-title` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-sub` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.done .tab-title` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-save` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-save` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.btn-save:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.save-toast` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.save-toast.visible` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-right` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-sidebar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-sidebar::-webkit-scrollbar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-brand` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-tab.active::before` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-info` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.tab-num` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.sidebar-save` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.progress-wrap` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `#success-screen.visible ~ *` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti:focus-within` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__flag-container` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__selected-flag` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone:-webkit-autofill` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone:-webkit-autofill:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone:-webkit-autofill:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti input#contact-phone:-webkit-autofill:active` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__arrow` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-list` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-list::-webkit-scrollbar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-list::-webkit-scrollbar-thumb` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country.iti__highlight` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-name` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__dial-code` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__search-input` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__search-input:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country.iti__highlight` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__search-input` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__dial-code` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.audit-select` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.audit-select:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.audit-text-input` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.audit-text-input:focus` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-card:has(#success-screen.visible)` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-card:has(#success-screen.visible) .form-sidebar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.form-card:has(#success-screen.visible) .form-right` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.trust-grid` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.deliverables-grid` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.trust-section` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.deliverables-section` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.page-hero` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.page-hero .form-card` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti--container .iti__country-list` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-list` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country.iti__highlight` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__country-name` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__dial-code` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__flag` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.iti__flag` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.page-hero` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-bg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-bg svg` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-bg-blob` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-bg-blob-1` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-bg-blob-2` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-eyebrow` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-eyebrow-dot` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-h1` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-h1 sup` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-price-pill` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-sub` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-proof-chips` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.hero-chip` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.fade-up` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.fade-up:nth-child(2)` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.page-hero .form-card` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.site-footer` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-inner` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.site-footer` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-logo` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-logo sup` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-tagline` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-philosophy` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-links` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link[aria-label="FB / Facebook"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link[aria-label="Instagram"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link[aria-label="LinkedIn"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link[aria-label="X / Twitter"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.social-link[aria-label="YT / YouTube"]` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-col-label` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-link` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-link:hover` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-link` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-bar a` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-bar` | audit page selectors were embedded inline and are owned by audit.html |
| audit.html | assets/css/pages/audit.css | `.footer-bar p` | audit page selectors were embedded inline and are owned by audit.html |
| discovery.html | assets/css/pages/discovery.css | `:root` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*::before` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*::after` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `html` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `body` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `::selection` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `a` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `img` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `::-webkit-scrollbar` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `::-webkit-scrollbar-track` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `::-webkit-scrollbar-thumb` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `nav` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `nav.scrolled` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-logo` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-logo sup` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-links` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-links a` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-links a:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-cta` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-cta:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.nav-links` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hamburger` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.pill-menu` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.pill-line` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.pill-body` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hamburger.open .pill-line` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hamburger.open .pill-body` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hamburger` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hamburger` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu.open` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu a:not(.mob-contact)` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu a:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu a:active` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu a.finger-active` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#mob-menu .mob-contact` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.page-hero` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-bg` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-bg svg` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-bg-blob` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-bg-blob-1` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-bg-blob-2` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-eyebrow` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-eyebrow-dot` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-h1` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-h1 sup` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-price-pill` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-sub` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-proof-chips` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.hero-chip` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-card` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-card-title` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-card-sub` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.field` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-label` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-input` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-input::placeholder` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-input:focus` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-input.has-error` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `textarea.form-input` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `select.form-input` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `select.form-input option` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.field-error` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.field-error.show` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-row` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-row` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.form-stack` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti:focus-within` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__selected-flag` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti input#discovery-phone` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti input#discovery-phone:-webkit-autofill` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti input#discovery-phone:-webkit-autofill:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti input#discovery-phone:-webkit-autofill:focus` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti input#discovery-phone:-webkit-autofill:active` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__country-list` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__country` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__country.iti__highlight` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__flag` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.iti__flag` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.consent-row` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.consent-row input[type=checkbox]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.consent-row label` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.consent-row a` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.submit-btn` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.submit-btn:hover:not(:disabled)` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.submit-btn:disabled` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.spinner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-section` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-grid` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-grid` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-card` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-num` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-label` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.trust-desc` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.wyg-section` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.wyg-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.wyg-header` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.section-eyebrow` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.section-h2` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverables-grid` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverables-grid` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverable-card` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverable-icon` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverable-name` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.deliverable-desc` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.site-footer` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.site-footer` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-logo` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-logo sup` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-tagline` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-philosophy` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-links` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link[aria-label="FB / Facebook"]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link[aria-label="Instagram"]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link[aria-label="LinkedIn"]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link[aria-label="X / Twitter"]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.social-link[aria-label="YT / YouTube"]` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-col-label` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-link` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-link:hover` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-bar` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.footer-bar p` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#payment-success-overlay` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-inner` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-check` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-eyebrow` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-h2` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-sub` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-note` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-steps-card` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-steps-label` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-steps` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-step` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.step-num` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.step-title` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.step-desc` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `#success-payment-id` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.success-actions` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.btn-wa` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.btn-close-overlay` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.fade-up` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.fade-up.d1` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.fade-up.d2` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.fade-up.d3` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.scroll-reveal` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `.scroll-reveal.visible` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*::before` | discovery page selectors were embedded inline and are owned by discovery.html |
| discovery.html | assets/css/pages/discovery.css | `*::after` | discovery page selectors were embedded inline and are owned by discovery.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `:root` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*::before` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*::after` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `html` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `body` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `::selection` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `a` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `img` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `::selection` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `::-webkit-scrollbar` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `::-webkit-scrollbar-track` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `::-webkit-scrollbar-thumb` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `nav` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `nav.scrolled` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-logo` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-logo sup` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-links` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-links a` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-links a:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-cta` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-cta:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.nav-links` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hamburger` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.pill-menu` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.pill-line` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.pill-body` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hamburger.open .pill-line` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hamburger.open .pill-body` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hamburger` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hamburger` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu.open` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu a:not(.mob-contact)` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu a:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu a:active` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu a.finger-active` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#mob-menu .mob-contact` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.page-hero` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-bg` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-bg svg` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-bg-blob` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-bg-blob-1` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-bg-blob-2` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-eyebrow` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-eyebrow-dot` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-h1` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-h1 sup` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-price-pill` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-sub` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-checklist` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-check-item` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.hero-check-icon` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-card` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-card-title` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-card-sub` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `#sprint-success` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.success-check-icon` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.success-title` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.success-sub` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.success-steps-list` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.success-steps-label-s` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.sprint-step` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.sprint-step:last-child` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.sprint-step-num` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.sprint-step-title` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.sprint-step-desc` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.btn-wa-sprint` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.field` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-label` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-input` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-input::placeholder` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-input:focus` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-input.has-error` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-input option` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `textarea.form-input` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `select.form-input` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.field-error` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.field-error.show` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-row` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-row` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.form-stack` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti:focus-within` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__selected-flag` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti input#sprint-phone` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti input#sprint-phone:-webkit-autofill` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti input#sprint-phone:-webkit-autofill:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti input#sprint-phone-webkit-autofill:focus` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti input#sprint-phone:-webkit-autofill:active` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__country-list` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__country` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__country.iti__highlight` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__flag` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.iti__flag` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.consent-row` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.consent-row input[type=checkbox]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.consent-row label` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.consent-row a` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.submit-btn` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.submit-btn:hover:not(:disabled)` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.submit-btn:disabled` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.spinner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-section` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.section-eyebrow` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.section-h2` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-grid` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-grid` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-grid` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-card` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-week` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-name` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.process-desc` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverables-section` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverables-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverables-grid` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverables-grid` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverable-card` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverable-icon` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverable-name` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.deliverable-desc` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.site-footer` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-inner` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.site-footer` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-logo` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-logo sup` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-tagline` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-philosophy` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-links` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link[aria-label="FB / Facebook"]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link[aria-label="Instagram"]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link[aria-label="LinkedIn"]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link[aria-label="X / Twitter"]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.social-link[aria-label="YT / YouTube"]` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-col-label` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-link` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-link:hover` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-bar` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.footer-bar p` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.fade-up` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.fade-up.d1` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.fade-up.d2` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.scroll-reveal` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `.scroll-reveal.visible` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*::before` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| brand-foundation-sprint.html | assets/css/pages/sprint.css | `*::after` | sprint page selectors were embedded inline and are owned by brand-foundation-sprint.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `:root` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*::before` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*::after` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `html` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `body` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `::selection` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `a` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `img` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `nav` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `nav.scrolled` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-logo` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-logo sup` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-links` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-links a` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-links a:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-cta` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-cta:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.nav-links` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hamburger` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.pill-menu` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.pill-line` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.pill-body` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hamburger.open .pill-line` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hamburger.open .pill-body` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hamburger` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hamburger` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu.open` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu a:not(.mob-contact)` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu a:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu a:active` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu a.finger-active` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#mob-menu .mob-contact` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.page-hero` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-bg` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-bg svg` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-bg-blob` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-bg-blob-1` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-bg-blob-2` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-eyebrow` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-eyebrow-dot` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-h1` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-h1 sup` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-price-pill` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-sub` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-proof-chips` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.hero-chip` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-card` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-card-title` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-card-sub` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.field` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-label` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-input` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-input::placeholder` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-input:focus` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-input.has-error` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `textarea.form-input` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `select.form-input` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `select.form-input option` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.field-error` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.field-error.show` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-row` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-row` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.form-stack` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti:focus-within` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__selected-flag` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti input#web-phone` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti input#web-phone:-webkit-autofill` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti input#web-phone:-webkit-autofill:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti input#web-phone:-webkit-autofill:focus` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti input#web-phone:-webkit-autofill:active` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__country-list` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__country` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__country.iti__highlight` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__flag` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.iti__flag` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.consent-row` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.consent-row input[type=checkbox]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.consent-row label` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.consent-row a` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.submit-btn` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.submit-btn:hover:not(:disabled)` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.submit-btn:disabled` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.spinner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-section` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-grid` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-grid` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-card` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-num` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-label` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.trust-desc` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.wyg-section` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.wyg-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.wyg-header` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.section-eyebrow` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.section-h2` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverables-grid` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverables-grid` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverable-card` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverable-icon` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverable-name` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.deliverable-desc` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.site-footer` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.site-footer` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-logo` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-logo sup` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-tagline` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-philosophy` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-links` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link[aria-label="FB / Facebook"]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link[aria-label="Instagram"]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link[aria-label="LinkedIn"]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link[aria-label="X / Twitter"]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.social-link[aria-label="YT / YouTube"]` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-col-label` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-link` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-link:hover` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-bar` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-bar p` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#payment-success-overlay` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-inner` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-check` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-eyebrow` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-h2` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-sub` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-note` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-steps-card` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-steps-label` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-steps` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-step` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.step-num` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.step-title` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.step-desc` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `#success-payment-id` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.success-actions` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.btn-wa` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.btn-close-overlay` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.fade-up` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.fade-up.d1` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.fade-up.d2` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.fade-up.d3` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.scroll-reveal` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.scroll-reveal.visible` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*::before` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `*::after` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| websites-digital-experiences.html | assets/css/pages/website.css | `.footer-philosophy` | website service page selectors were embedded inline and are owned by websites-digital-experiences.html |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `:root` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*::before` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*::after` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `html` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `body` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `::selection` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `img` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `a` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `::-webkit-scrollbar` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `::-webkit-scrollbar-track` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `::-webkit-scrollbar-thumb` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.skip-link` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.skip-link:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `nav` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `nav.scrolled` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-logo` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-logo sup` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-links` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-links a` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-links a:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-links a.active` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-cta` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-cta:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-links` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-cta` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.nav-cta` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-ctas` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hamburger` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.pill-menu` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.pill-line` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.pill-body` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hamburger.open .pill-line` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hamburger.open .pill-body` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hamburger` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hamburger` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu.open` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu a:not(.mob-contact)` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu a:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu a:active` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu a.finger-active` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.sr-only` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mob-menu .mob-contact` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up.visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up.d1` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up.d2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up.d3` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.fade-up.d4` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-1` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-3` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-4` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-5` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-anim-6` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#hero` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-content` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-eyebrow` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-left` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-right` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-bg-shapes` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.shape` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.shape-1` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.shape-2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.shape-3` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.shape` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-left` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-right` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-left` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-edge-right` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-h1` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-h1 em` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-sub` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-ctas` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.btn-primary` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.btn-primary:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.btn-outline` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.btn-outline:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-proof` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-lines` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-vert` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-horiz` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-vert` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-vert:nth-child(2)` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-horiz` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-horiz:nth-child(4)` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-vert` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.line-horiz` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-hint` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-line` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-line-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-hint span` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-hint` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-section .section-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-header` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-eyebrow` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-title` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-count` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-manifesto` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-count` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-img-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-img-wrap img` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card:hover .work-img-wrap img` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card-info` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card-cat` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card-stmt` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-card-stmt` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-strip-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip::after` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip:active` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip::-webkit-scrollbar` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip::-webkit-scrollbar-track` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip::-webkit-scrollbar-thumb` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card iframe` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-poster > div:last-child` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card .reel-poster > div:last-child` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-poster > div:last-child svg` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-poster` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-poster > div:first-child` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap iframe` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-attr` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.work-attr a` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-header` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.Engagements-section > .section-inner > div[style*="display:grid"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card--dark` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card--dark .btn-primary` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.service-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.service-num` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.service-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.service-desc` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-quote` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-manifesto` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-quote em` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-divider` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-divider.visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-pillars` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-pillars` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-pillar-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.approach-pillar-text` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.capabilities-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-intro` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-intro` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-intro-h2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-intro-h2 em` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-intro-right p` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-num` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-def` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-outputs` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-outputs li` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-outputs li::before` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for-text` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-main p` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-main p.small` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-stats` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-stats` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-stat-num` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.studio-stat-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-intro-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-intro-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-h2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-sub` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-grid .intel-card:last-child:nth-child(odd)` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-arrow` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-card:hover .intel-arrow` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-thesis` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-tags` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-tag` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-brand-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-overlay` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-overlay.open` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-body` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-close` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-close:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-cat` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-h2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-lead` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-p` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.modal-quote` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-section` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-h2` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-h2 em` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-sub` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-philosophy` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.wa-btn` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.wa-btn:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.wa-note` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.phone-link` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.phone-link:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-links` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-link-row` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-link-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-link-value` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-link-row:hover .contact-link-value` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-input` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-input::placeholder` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-input:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-input.error` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.field-error` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.field-error.visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `select.form-input` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `select.form-input option` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-row` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-row` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.submit-btn` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.submit-btn` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.submit-btn:hover:not(:disabled)` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.submit-btn:disabled` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.form-next` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.site-footer` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-inner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.site-footer` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-logo` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-logo sup` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-tagline` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-links` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link[aria-label="FB / Facebook"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link[aria-label="Instagram"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link[aria-label="LinkedIn"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link[aria-label="X / Twitter"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.social-link[aria-label="YT / YouTube"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-col-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-link` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-link:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-link` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-contact-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-contact-val` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-contact-val:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-bar` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-bar p` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-philosophy` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#back-to-top` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#back-to-top.visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#back-to-top:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.spinner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.howwework-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.howwework-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.founder-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.founder-grid > div:first-child` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.hero-h1` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.scroll-strip` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster img` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster:hover img` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster .play-btn` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster:hover .play-btn` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.video-poster .play-btn svg` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-poster-loading` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-spinner` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `a:focus-visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `button:focus-visible` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*::before` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `*::after` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `select.form-input:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `input.form-input:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `textarea.form-input:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#back-to-top` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-wa` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-wa` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-wa:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-label` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-close` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-close:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-title` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-sub` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-close` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-book-close:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-wa` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `#mobile-wa:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.intel-card:hover` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.howwework-grid > div` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagement-card--dark` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.cap-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.built-for` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.engagements-grid` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `[style*="grid-template-columns:repeat(auto-fit"]` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.film-card` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.reel-wrap` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.footer-bar` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.section-header` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-link-row` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.contact-links` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-list` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-list::-webkit-scrollbar` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-list::-webkit-scrollbar-thumb` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country.iti__highlight` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__dial-code` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__search-input` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__search-input:focus` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti--container .iti__country-list` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-list` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country.iti__highlight` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__country-name` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__dial-code` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__flag` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |
| creative-agency-delhi.html | assets/css/pages/creative-agency-delhi.css | `.iti__flag` | creative agency page selectors were embedded inline; legacy css/creative-agency-delhi.css remains untouched |

## Selectors Retained

| Category | Reason |
| --- | --- |
| shared CSS in assets/css/*.css | kept in place to avoid cascade changes |
| form and intl-tel-input overrides still inline | form behavior and third-party widget behavior were prioritized over consolidation |
| legacy css/base.css | legacy file retained by rule |
| css/creative-agency-delhi.css | explicitly untouched by rule |
| unused selector candidates | not removed because absence is not proven at runtime |

## Selectors Requiring Manual Review

| File | Line | Selector |
| --- | --- | --- |
| assets/css/base.css | 1 | `*` |
| assets/css/base.css | 1 | `*::before` |
| assets/css/base.css | 1 | `*::after` |
| assets/css/base.css | 3 | `html` |
| assets/css/base.css | 10 | `body` |
| assets/css/base.css | 20 | `::selection` |
| assets/css/base.css | 25 | `*` |
| assets/css/base.css | 27 | `img` |
| assets/css/base.css | 28 | `a` |
| assets/css/base.css | 30 | `::-webkit-scrollbar` |
| assets/css/base.css | 31 | `::-webkit-scrollbar-track` |
| assets/css/base.css | 32 | `::-webkit-scrollbar-thumb` |
| assets/css/base.css | 49 | `a:focus-visible` |
| assets/css/base.css | 49 | `button:focus-visible` |
| assets/css/base.css | 1 | `*` |
| assets/css/base.css | 1 | `*::before` |
| assets/css/base.css | 1 | `*::after` |
| assets/css/layout.css | 6 | `nav` |
| assets/css/layout.css | 50 | `nav a` |
| assets/css/pages/audit.css | 2 | `*` |
| assets/css/pages/audit.css | 2 | `*::before` |
| assets/css/pages/audit.css | 2 | `*::after` |
| assets/css/pages/audit.css | 4 | `:root` |
| assets/css/pages/audit.css | 33 | `html` |
| assets/css/pages/audit.css | 35 | `body` |
| assets/css/pages/audit.css | 45 | `::-webkit-scrollbar` |
| assets/css/pages/audit.css | 46 | `::-webkit-scrollbar-track` |
| assets/css/pages/audit.css | 47 | `::-webkit-scrollbar-thumb` |
| assets/css/pages/audit.css | 50 | `nav` |
| assets/css/pages/audit.css | 75 | `nav a` |
| assets/css/pages/audit.css | 77 | `*` |
| assets/css/pages/audit.css | 399 | `select` |
| assets/css/pages/audit.css | 418 | `select:focus` |
| assets/css/pages/audit.css | 459 | `input[name="budget"]` |
| assets/css/pages/audit.css | 550 | `input[name="goal"]` |
| assets/css/pages/creative-agency-delhi.css | 3 | `:root` |
| assets/css/pages/creative-agency-delhi.css | 17 | `*` |
| assets/css/pages/creative-agency-delhi.css | 17 | `*::before` |
| assets/css/pages/creative-agency-delhi.css | 17 | `*::after` |
| assets/css/pages/creative-agency-delhi.css | 18 | `html` |
| assets/css/pages/creative-agency-delhi.css | 20 | `body` |
| assets/css/pages/creative-agency-delhi.css | 30 | `::selection` |
| assets/css/pages/creative-agency-delhi.css | 31 | `*` |
| assets/css/pages/creative-agency-delhi.css | 33 | `img` |
| assets/css/pages/creative-agency-delhi.css | 34 | `a` |
| assets/css/pages/creative-agency-delhi.css | 37 | `::-webkit-scrollbar` |
| assets/css/pages/creative-agency-delhi.css | 38 | `::-webkit-scrollbar-track` |
| assets/css/pages/creative-agency-delhi.css | 39 | `::-webkit-scrollbar-thumb` |
| assets/css/pages/creative-agency-delhi.css | 52 | `nav` |
| assets/css/pages/creative-agency-delhi.css | 1314 | `a:focus-visible` |
| assets/css/pages/creative-agency-delhi.css | 1314 | `button:focus-visible` |
| assets/css/pages/creative-agency-delhi.css | 1 | `*` |
| assets/css/pages/creative-agency-delhi.css | 1 | `*::before` |
| assets/css/pages/creative-agency-delhi.css | 1 | `*::after` |
| assets/css/pages/creative-agency-delhi.css | 1530 | `[style*="grid-template-columns:repeat(auto-fit"]` |
| assets/css/pages/discovery.css | 2 | `:root` |
| assets/css/pages/discovery.css | 11 | `*` |
| assets/css/pages/discovery.css | 11 | `*::before` |
| assets/css/pages/discovery.css | 11 | `*::after` |
| assets/css/pages/discovery.css | 12 | `*` |
| assets/css/pages/discovery.css | 13 | `html` |
| assets/css/pages/discovery.css | 14 | `body` |
| assets/css/pages/discovery.css | 22 | `::selection` |
| assets/css/pages/discovery.css | 23 | `a` |
| assets/css/pages/discovery.css | 24 | `img` |
| assets/css/pages/discovery.css | 26 | `::-webkit-scrollbar` |
| assets/css/pages/discovery.css | 27 | `::-webkit-scrollbar-track` |
| assets/css/pages/discovery.css | 28 | `::-webkit-scrollbar-thumb` |
| assets/css/pages/discovery.css | 31 | `nav` |
| assets/css/pages/discovery.css | 1 | `*` |
| assets/css/pages/discovery.css | 1 | `*::before` |
| assets/css/pages/discovery.css | 1 | `*::after` |
| assets/css/pages/home.css | 3 | `:root` |
| assets/css/pages/home.css | 17 | `*` |
| assets/css/pages/home.css | 17 | `*::before` |
| assets/css/pages/home.css | 17 | `*::after` |
| assets/css/pages/home.css | 18 | `html` |
| assets/css/pages/home.css | 20 | `body` |
| assets/css/pages/home.css | 30 | `::selection` |
| assets/css/pages/home.css | 31 | `*` |
| assets/css/pages/home.css | 33 | `img` |
| assets/css/pages/home.css | 34 | `a` |
| assets/css/pages/home.css | 37 | `::-webkit-scrollbar` |
| assets/css/pages/home.css | 38 | `::-webkit-scrollbar-track` |
| assets/css/pages/home.css | 39 | `::-webkit-scrollbar-thumb` |
| assets/css/pages/home.css | 52 | `nav` |
| assets/css/pages/home.css | 1322 | `a:focus-visible` |
| assets/css/pages/home.css | 1322 | `button:focus-visible` |
| assets/css/pages/home.css | 1 | `*` |
| assets/css/pages/home.css | 1 | `*::before` |
| assets/css/pages/home.css | 1 | `*::after` |
| assets/css/pages/home.css | 1515 | `[style*="grid-template-columns:repeat(auto-fit"]` |
| assets/css/pages/sprint.css | 2 | `:root` |
| assets/css/pages/sprint.css | 11 | `*` |
| assets/css/pages/sprint.css | 11 | `*::before` |
| assets/css/pages/sprint.css | 11 | `*::after` |
| assets/css/pages/sprint.css | 12 | `*` |
| assets/css/pages/sprint.css | 13 | `html` |
| assets/css/pages/sprint.css | 14 | `body` |
| assets/css/pages/sprint.css | 19 | `::selection` |
| assets/css/pages/sprint.css | 20 | `a` |
| assets/css/pages/sprint.css | 21 | `img` |
| assets/css/pages/sprint.css | 22 | `::selection` |
| assets/css/pages/sprint.css | 24 | `::-webkit-scrollbar` |
| assets/css/pages/sprint.css | 25 | `::-webkit-scrollbar-track` |
| assets/css/pages/sprint.css | 26 | `::-webkit-scrollbar-thumb` |
| assets/css/pages/sprint.css | 29 | `nav` |
| assets/css/pages/sprint.css | 1 | `*` |
| assets/css/pages/sprint.css | 1 | `*::before` |
| assets/css/pages/sprint.css | 1 | `*::after` |
| assets/css/pages/website.css | 2 | `:root` |
| assets/css/pages/website.css | 11 | `*` |
| assets/css/pages/website.css | 11 | `*::before` |
| assets/css/pages/website.css | 11 | `*::after` |
| assets/css/pages/website.css | 12 | `*` |
| assets/css/pages/website.css | 13 | `html` |
| assets/css/pages/website.css | 14 | `body` |
| assets/css/pages/website.css | 22 | `::selection` |
| assets/css/pages/website.css | 23 | `a` |
| assets/css/pages/website.css | 24 | `img` |
| assets/css/pages/website.css | 27 | `nav` |
| assets/css/pages/website.css | 1 | `*` |
| assets/css/pages/website.css | 1 | `*::before` |
| assets/css/pages/website.css | 1 | `*::after` |
| assets/css/tokens.css | 1 | `:root` |
| css/base.css | 1 | `*` |
| css/base.css | 1 | `*::before` |
| css/base.css | 1 | `*::after` |
| css/base.css | 3 | `html` |
| css/base.css | 10 | `body` |
| css/base.css | 20 | `::selection` |
| css/base.css | 25 | `*` |
| css/base.css | 27 | `img` |
| css/base.css | 28 | `a` |
| css/base.css | 30 | `::-webkit-scrollbar` |
| css/base.css | 31 | `::-webkit-scrollbar-track` |
| css/base.css | 32 | `::-webkit-scrollbar-thumb` |
| css/base.css | 49 | `a:focus-visible` |
| css/base.css | 49 | `button:focus-visible` |
| css/base.css | 1 | `*` |
| css/base.css | 1 | `*::before` |
| css/base.css | 1 | `*::after` |
| css/creative-agency-delhi.css | 24 | `</script><br>  <script type="application/ld+json">` |
| css/creative-agency-delhi.css | 64 | `</script><br>  <script type="application/ld+json">` |
| css/creative-agency-delhi.css | 135 | `</script><br><br>  <style><br>  body` |
| css/creative-agency-delhi.css | 135 | `body > div` |
| css/creative-agency-delhi.css | 135 | `body > canvas` |
| css/creative-agency-delhi.css | 143 | `*` |
| css/creative-agency-delhi.css | 143 | `*::before` |
| css/creative-agency-delhi.css | 143 | `*::after` |
| css/creative-agency-delhi.css | 144 | `html` |
| css/creative-agency-delhi.css | 145 | `body` |
| css/creative-agency-delhi.css | 157 | `body::before` |
| css/creative-agency-delhi.css | 256 | `::-webkit-scrollbar` |
| css/creative-agency-delhi.css | 257 | `::-webkit-scrollbar-track` |
| css/creative-agency-delhi.css | 258 | `::-webkit-scrollbar-thumb` |
| css/creative-agency-delhi.css | 302 | `nav` |
| css/creative-agency-delhi.css | 1 | `nav` |
| css/creative-agency-delhi.css | 921 | `body` |
| css/creative-agency-delhi.css | 926 | `nav` |
| css/creative-agency-delhi.css | 938 | `body` |
| css/creative-agency-delhi.css | 938 | `body > div` |
| css/creative-agency-delhi.css | 938 | `svg` |
| css/creative-agency-delhi.css | 938 | `section` |
| css/creative-agency-delhi.css | 990 | `body` |
| css/creative-agency-delhi.css | 995 | `nav` |
| css/creative-agency-delhi.css | 1010 | `nav` |
| css/creative-agency-delhi.css | 1076 | `body` |
| css/creative-agency-delhi.css | 1167 | `function gtag()` |
| css/creative-agency-delhi.css | 1168 | `gtag('consent', 'default',` |
| css/creative-agency-delhi.css | 1174 | `gtag('config', 'G-QL85WYN3S0',` |
| css/creative-agency-delhi.css | 2328 | `">We proposed a speculative shift: black‑and‑white portrait series of real users, long‑form YouTube essays on sound culture, and a limited “Legacy” line with zero logos — just material and memory.</p><br>    </div><br>  </div><br></div><br><!-- ══════════════════════════════════════════════════════════════════<br>     JAVASCRIPT<br>══════════════════════════════════════════════════════════════════════ --><br><script><br>(function ()` |
| inline:404.html#style-1 | 2 | `:root` |
| inline:404.html#style-1 | 10 | `*` |
| inline:404.html#style-1 | 16 | `html` |
| inline:404.html#style-1 | 20 | `body` |
| inline:ai-disclosure.html#style-1 | 2 | `*` |
| inline:ai-disclosure.html#style-1 | 2 | `*::before` |
| inline:ai-disclosure.html#style-1 | 2 | `*::after` |
| inline:ai-disclosure.html#style-1 | 3 | `:root` |
| inline:ai-disclosure.html#style-1 | 8 | `*` |
| inline:ai-disclosure.html#style-1 | 9 | `html` |
| inline:ai-disclosure.html#style-1 | 10 | `body` |
| inline:ai-disclosure.html#style-1 | 46 | `nav` |
| inline:ai-disclosure.html#style-1 | 53 | `nav a` |
| inline:ai-disclosure.html#style-1 | 54 | `a` |
| inline:audit-results.html#style-1 | 2 | `*` |
| inline:audit-results.html#style-1 | 2 | `*::before` |
| inline:audit-results.html#style-1 | 2 | `*::after` |
| inline:audit-results.html#style-1 | 3 | `:root` |
| inline:audit-results.html#style-1 | 15 | `html` |
| inline:audit-results.html#style-1 | 16 | `body` |
| inline:audit-results.html#style-1 | 17 | `::selection` |
| inline:audit-results.html#style-1 | 18 | `*` |
| inline:audit-results.html#style-1 | 19 | `img` |
| inline:audit-results.html#style-1 | 20 | `a` |
| inline:audit-results.html#style-1 | 21 | `::-webkit-scrollbar` |
| inline:audit-results.html#style-1 | 22 | `::-webkit-scrollbar-track` |
| inline:audit-results.html#style-1 | 23 | `::-webkit-scrollbar-thumb` |
| inline:audit-results.html#style-1 | 26 | `nav` |
| inline:blog/why-execution-matters.html#style-1 | 2 | `:root` |
| inline:blog/why-execution-matters.html#style-1 | 3 | `body` |
| inline:blog/why-execution-matters.html#style-1 | 4 | `a` |
| inline:blog/why-execution-matters.html#style-1 | 5 | `h1` |
| inline:blog/why-execution-matters.html#style-1 | 6 | `p` |
| inline:blog.html#style-1 | 2 | `*` |
| inline:blog.html#style-1 | 2 | `*::before` |
| inline:blog.html#style-1 | 2 | `*::after` |
| inline:blog.html#style-1 | 4 | `:root` |
| inline:blog.html#style-1 | 16 | `html` |
| inline:blog.html#style-1 | 17 | `body` |
| inline:blog.html#style-1 | 26 | `::selection` |
| inline:blog.html#style-1 | 27 | `*` |
| inline:blog.html#style-1 | 28 | `img` |
| inline:blog.html#style-1 | 29 | `a` |
| inline:blog.html#style-1 | 31 | `::-webkit-scrollbar` |
| inline:blog.html#style-1 | 32 | `::-webkit-scrollbar-track` |
| inline:blog.html#style-1 | 33 | `::-webkit-scrollbar-thumb` |
| inline:blog.html#style-1 | 36 | `nav` |
| inline:blog.html#style-1 | 486 | `a:focus-visible` |
| inline:blog.html#style-1 | 486 | `button:focus-visible` |
| inline:blog.html#style-1 | 1 | `*` |
| inline:blog.html#style-1 | 1 | `*::before` |
| inline:blog.html#style-1 | 1 | `*::after` |
| inline:feedback.html#style-1 | 3 | `:root` |
| inline:feedback.html#style-1 | 17 | `*` |
| inline:feedback.html#style-1 | 17 | `*::before` |
| inline:feedback.html#style-1 | 17 | `*::after` |
| inline:feedback.html#style-1 | 18 | `html` |
| inline:feedback.html#style-1 | 19 | `body` |
| inline:feedback.html#style-1 | 28 | `::selection` |
| inline:feedback.html#style-1 | 29 | `*` |
| inline:feedback.html#style-1 | 30 | `img` |
| inline:feedback.html#style-1 | 31 | `a` |
| inline:feedback.html#style-1 | 32 | `::-webkit-scrollbar` |
| inline:feedback.html#style-1 | 33 | `::-webkit-scrollbar-track` |
| inline:feedback.html#style-1 | 34 | `::-webkit-scrollbar-thumb` |
| inline:feedback.html#style-1 | 47 | `nav` |
| inline:feedback.html#style-1 | 1 | `html` |
| inline:privacy-policy.html#style-1 | 2 | `*` |
| inline:privacy-policy.html#style-1 | 2 | `*::before` |
| inline:privacy-policy.html#style-1 | 2 | `*::after` |
| inline:privacy-policy.html#style-1 | 3 | `:root` |
| inline:privacy-policy.html#style-1 | 8 | `*` |
| inline:privacy-policy.html#style-1 | 9 | `html` |
| inline:privacy-policy.html#style-1 | 10 | `body` |
| inline:privacy-policy.html#style-1 | 40 | `nav` |
| inline:privacy-policy.html#style-1 | 47 | `nav a` |
| inline:privacy-policy.html#style-1 | 48 | `a` |
| inline:refund-policy.html#style-1 | 2 | `*` |
| inline:refund-policy.html#style-1 | 2 | `*::before` |
| inline:refund-policy.html#style-1 | 2 | `*::after` |
| inline:refund-policy.html#style-1 | 3 | `:root` |
| inline:refund-policy.html#style-1 | 8 | `*` |
| inline:refund-policy.html#style-1 | 9 | `html` |
| inline:refund-policy.html#style-1 | 10 | `body` |
| inline:refund-policy.html#style-1 | 48 | `nav` |
| inline:refund-policy.html#style-1 | 55 | `nav a` |
| inline:refund-policy.html#style-1 | 56 | `a` |
| inline:terms-of-use.html#style-1 | 2 | `*` |
| inline:terms-of-use.html#style-1 | 2 | `*::before` |
| inline:terms-of-use.html#style-1 | 2 | `*::after` |
| inline:terms-of-use.html#style-1 | 3 | `:root` |
| inline:terms-of-use.html#style-1 | 7 | `*` |
| inline:terms-of-use.html#style-1 | 8 | `html` |
| inline:terms-of-use.html#style-1 | 9 | `body` |
| inline:terms-of-use.html#style-1 | 33 | `nav` |
| inline:terms-of-use.html#style-1 | 40 | `nav a` |
| inline:terms-of-use.html#style-1 | 41 | `a` |

## Risk Assessment

| Risk | Assessment | Mitigation |
| --- | --- | --- |
| visual regression | low for migrated blocks because CSS was moved verbatim and linked at the same document position | browser screenshot comparison recommended for every production route |
| JavaScript regression | low because JS files and script tags were not changed | exercise nav, chat, sticky banner, forms, and validation states |
| form regression | low because form and intl-tel-input override blocks were retained in place | submit flows and phone input dropdown should be manually checked |
| conversion flow regression | low-to-medium until live integrations are tested | do not submit production forms during visual QA unless explicitly authorized |

## Verification Performed

| Check | Result |
| --- | --- |
| Protected legacy file | `css/creative-agency-delhi.css` SHA-256 matched the original archive |
| JavaScript files | All JS SHA-256 hashes matched the original archive |
| Local stylesheet links | No missing local stylesheet links detected after migration |
| Browser computed-style smoke test | `audit.html`, `discovery.html`, `brand-foundation-sprint.html`, `websites-digital-experiences.html`, and `creative-agency-delhi.html` matched on sampled computed styles after fonts settled |
| Home computed-style smoke test | All sampled CSS properties matched; one heading top value differed by 0.05px after fonts settled |
| Form/ITI smoke test | Migrated form pages retained expected form, phone input, and `.iti` wrapper presence |
| Browser console smoke test | No non-resource error logs observed on migrated routes tested locally |
