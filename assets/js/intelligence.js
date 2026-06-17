/* ============================================================
   SQUARGRAPH™ Intelligence — Content Engine
   Fetches assets/data/intelligence.json and renders:
     - Brand Studies      (type: "study")
     - Market Signals     (type: "signal")
     - Strategic Studies  (type: "article")
     - Observations       (type: "observation")

   Single source of truth: intelligence.json
   Adding/editing an entry there is the only thing required
   to change what appears on the page — no HTML edits.

   Brand Studies and Strategic Studies are deliberately kept
   as separate content types and separate filters. They are
   not merged into one generic "Studies" bucket.

   Media support (v2):
     Each entry may optionally include a media field:
       media: { type: "image"|"video"|"none", url: "", alt: "" }
     Omitting the field is equivalent to media.type = "none".
     Media renders automatically — no HTML edits required.
   ============================================================ */

(function () {
  "use strict";

  var DATA_URL = "/assets/data/intelligence.json";
  var state = { entries: [], activeFilter: "all" };

  // Each filter maps to exactly one content type. "all" shows everything.
  var FILTER_TYPE_MAP = {
    all: null,
    study: ["study"],
    article: ["article"],
    signal: ["signal"],
    observation: ["observation"]
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    fetch(DATA_URL, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load intelligence.json (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        // published:false entries are drafts — excluded entirely, at the source.
        var all = (data.entries || []).filter(function (e) { return e.published !== false; });
        state.entries = sortEntries(all);
        renderAll();
        bindFilters();
      })
      .catch(function (err) {
        console.error("[Intelligence] ", err);
        renderError();
      });
  }

  /* ---------- sorting: featured first, then date desc ---------- */
  function sortEntries(entries) {
    return entries.slice().sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      var da = a.date ? new Date(a.date).getTime() : 0;
      var db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
  }

  function byType(types) {
    return state.entries.filter(function (e) {
      return types.indexOf(e.type) !== -1;
    });
  }

  /* ---------- master render ---------- */
  function renderAll() {
    renderStudies();
    renderSignals();
    renderArticles();
    renderObservations();
    applyFilter(state.activeFilter);
  }

  function renderError() {
    var ids = ["studies-feed", "signals-feed", "articles-feed", "observations-feed"];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = '<p class="intel-feed-error">Unable to load Intelligence content right now.</p>';
    });
  }

  /* ============================================================
     MEDIA — shared renderer
     Handles image, video (embed + native), and none/absent.

     Placement:
       - study:       above the three-column bq-card-body
       - signal:      above the card body, full-bleed to card edge
       - article:     above the row content (16:9, constrained width)
       - observation: not rendered (observations stay text-only)
     ============================================================ */
  function mediaHTML(item, context) {
    var m = item.media;
    if (!m || !m.type || m.type === "none") return "";
    if (m.type === "image") return mediaImage(m, context);
    if (m.type === "video") return mediaVideo(m, context);
    return "";
  }

  function mediaImage(m, context) {
    return (
      '<div class="intel-media intel-media--image intel-media--' + context + '">' +
        '<img src="' + esc(m.url) + '" alt="' + esc(m.alt || "") + '" loading="lazy" decoding="async" class="intel-media__img" />' +
      '</div>'
    );
  }

  function mediaVideo(m, context) {
    var url = m.url || "";
    var isEmbed = url.indexOf("youtube.com/embed") !== -1 ||
                  url.indexOf("youtu.be") !== -1 ||
                  url.indexOf("vimeo.com") !== -1;

    if (isEmbed) {
      return (
        '<div class="intel-media intel-media--video intel-media--embed intel-media--' + context + '">' +
          '<iframe src="' + esc(url) + '" title="' + esc(m.alt || "Video") + '" ' +
            'frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
            'allowfullscreen loading="lazy" class="intel-media__iframe"></iframe>' +
        '</div>'
      );
    }

    return (
      '<div class="intel-media intel-media--video intel-media--native intel-media--' + context + '">' +
        '<video src="' + esc(url) + '" title="' + esc(m.alt || "Video") + '" ' +
          'controls preload="metadata" class="intel-media__video"></video>' +
      '</div>'
    );
  }

  /* ============================================================
     BRAND STUDIES  (type: "study")
     Media sits between the card header and the three-column body.
     ============================================================ */
  function renderStudies() {
    var root = document.getElementById("studies-feed");
    if (!root) return;
    var items = byType(["study"]);
    if (!items.length) { root.innerHTML = emptyState("No brand studies published yet."); return; }
    root.innerHTML = items.map(studyCardHTML).join("");
  }

  function studyCardHTML(item) {
    var isProgress = item.status === "in-progress";
    var statusHTML = isProgress
      ? '<span class="bq-card-status bq-card-status--progress"><span class="bq-progress-dot"></span>Analysis in progress</span>'
      : '<span class="bq-card-status bq-card-status--published">Published · ' + formatDate(item.date, "month-year") + "</span>";

    var brandHTML = item.brandLogo
      ? '<div class="bq-card-brand"><img src="' + esc(item.brandLogo) + '" alt="' + esc(item.brandName || "") + '" height="20" style="max-width:130px;object-fit:contain;filter:brightness(0);opacity:0.6;" loading="lazy" /></div>'
      : "";

    var blocks = "";
    blocks += bqBlock("Tension", item.tension, isProgress);
    if (!isProgress) {
      blocks += bqBlock("Observation", item.observation, false);
      blocks += bqBlock("Implication", item.implication, false);
    }

    return (
      '<article class="bq-card' + (isProgress ? " bq-card--progress" : "") + ' fade-up" data-entry-type="study" id="study-' + esc(item.slug) + '">' +
        '<div class="bq-card-header">' +
          '<div class="bq-card-meta">' +
            '<span class="bq-card-type">Brand Quotient Analysis</span>' +
            '<span class="bq-card-sector">' + esc(item.category) + "</span>" +
            statusHTML +
          "</div>" +
          brandHTML +
        "</div>" +
        mediaHTML(item, "study") +
        '<div class="bq-card-body">' + blocks + "</div>" +
        byline(item, !isProgress) +
      "</article>"
    );
  }

  function bqBlock(label, text, muted) {
    if (!text) return "";
    return (
      '<div class="bq-card-block">' +
        '<p class="bq-card-label">' + label + "</p>" +
        '<p class="bq-card-text' + (muted ? " bq-card-text--muted" : "") + '">' + esc(text) + "</p>" +
      "</div>"
    );
  }

  /* ============================================================
     MARKET SIGNALS  (type: "signal")
     Media sits above the signal number/date, full-bleed to card edge.
     ============================================================ */
  function renderSignals() {
    var root = document.getElementById("signals-feed");
    if (!root) return;
    var items = byType(["signal"]);
    if (!items.length) { root.innerHTML = emptyState("No market signals yet."); return; }
    root.innerHTML = items.map(signalCardHTML).join("");
  }

  function signalCardHTML(item) {
    var allSignals = state.entries.filter(function (e) { return e.type === "signal"; });
    var num = "Signal " + String(allSignals.indexOf(item) + 1).padStart(3, "0");
    var tags = (item.tags || []).map(function (t) {
      return '<span class="signal-tag">' + esc(t) + "</span>";
    }).join("");

    return (
      '<div class="signal-card' + (item.media && item.media.type && item.media.type !== "none" ? " signal-card--has-media" : "") + ' fade-up" data-entry-type="signal">' +
        mediaHTML(item, "signal") +
        '<p class="signal-num">' + num + "</p>" +
        '<p class="signal-date">' + formatDate(item.date, "month-year") + "</p>" +
        '<p class="signal-text">' + esc(item.excerpt) + "</p>" +
        '<div class="signal-tags">' + tags + "</div>" +
        byline(item, false) +
      "</div>"
    );
  }

  /* ============================================================
     STRATEGIC STUDIES  (type: "article")
     Media sits between the meta column and the text content,
     spanning the content column only.
     ============================================================ */
  function renderArticles() {
    var root = document.getElementById("articles-feed");
    if (!root) return;
    var items = byType(["article"]);
    if (!items.length) { root.innerHTML = emptyState("No strategic studies yet."); return; }
    root.innerHTML = items.map(articleRowHTML).join("");
  }

  function articleRowHTML(item) {
    var isProgress = item.status === "in-progress";
    var dateLabel = isProgress ? "Coming" : formatDate(item.date, "month-year");

    if (isProgress) {
      return (
        '<div class="study-row study-row--progress fade-up" data-entry-type="article">' +
          '<div class="study-row-meta">' +
            '<span class="study-row-cat">' + esc(item.category) + "</span>" +
            '<span class="study-row-date">' + dateLabel + "</span>" +
          "</div>" +
          '<div class="study-row-content">' +
            '<h3 class="study-row-title" style="color:var(--textmuted);">' + esc(item.title) + "</h3>" +
            '<p class="study-row-excerpt" style="color:var(--textmuted);">' + esc(item.excerpt) + "</p>" +
          "</div>" +
          '<span class="study-row-arrow" style="color:var(--bordergray);">→</span>' +
        "</div>"
      );
    }

    return (
      '<a href="' + esc(item.url || "#") + '" class="study-row fade-up" data-entry-type="article">' +
        '<div class="study-row-meta">' +
          '<span class="study-row-cat">' + esc(item.category) + "</span>" +
          '<span class="study-row-date">' + dateLabel + "</span>" +
        "</div>" +
        '<div class="study-row-content">' +
          mediaHTML(item, "article") +
          '<h3 class="study-row-title">' + esc(item.title) + "</h3>" +
          '<p class="study-row-excerpt">' + esc(item.excerpt) + "</p>" +
          byline(item, false) +
        "</div>" +
        '<span class="study-row-arrow">→</span>' +
      "</a>"
    );
  }

  /* ============================================================
     OBSERVATIONS  (type: "observation")
     Observations are field notes — text only, no media rendered.
     ============================================================ */
  function renderObservations() {
    var root = document.getElementById("observations-feed");
    if (!root) return;
    var items = byType(["observation"]);
    if (!items.length) { root.innerHTML = emptyState("No field notes yet."); return; }
    root.innerHTML = items.map(observationRowHTML).join("");
  }

  function observationRowHTML(item) {
    return (
      '<div class="observation-entry fade-up" data-entry-type="observation">' +
        '<p class="observation-date">' + formatDate(item.date, "long") + "</p>" +
        '<div>' +
          '<p class="observation-text">' + esc(item.excerpt) + "</p>" +
          byline(item, false) +
        "</div>" +
      "</div>"
    );
  }

  /* ============================================================
     BYLINE — shared author / reading-time strip
     ============================================================ */
  function byline(item, withTopBorder) {
    if (!item.author && !item.readingTime) return "";
    var parts = [];
    if (item.author) parts.push(esc(item.author));
    if (item.readingTime) parts.push(esc(item.readingTime));
    return (
      '<p class="intel-byline' + (withTopBorder ? " intel-byline--bordered" : "") + '">' +
        parts.join(" · ") +
      "</p>"
    );
  }

  /* ============================================================
     FILTERS — All / Studies / Articles / Signals / Observations
     ============================================================ */
  function bindFilters() {
    var bar = document.getElementById("intel-filter-bar");
    if (!bar) return;
    var buttons = bar.querySelectorAll("[data-filter]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        state.activeFilter = filter;
        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("intel-filter-active", active);
          b.setAttribute("aria-selected", active ? "true" : "false");
        });
        applyFilter(filter);
      });
    });
  }

  function applyFilter(filter) {
    var sections = document.querySelectorAll("[data-feed-section]");
    var allowedTypes = FILTER_TYPE_MAP[filter];

    sections.forEach(function (section) {
      var sectionType = section.getAttribute("data-feed-section");
      var visible = filter === "all" || (allowedTypes && allowedTypes.indexOf(sectionType) !== -1);
      section.style.display = visible ? "" : "none";
    });
  }

  /* ---------- helpers ---------- */
  function emptyState(msg) {
    return '<p class="intel-feed-empty">' + esc(msg) + "</p>";
  }

  function esc(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(dateStr, format) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    if (format === "month-year") return months[d.getUTCMonth()] + " " + d.getUTCFullYear();
    if (format === "long") return d.getUTCDate() + " " + months[d.getUTCMonth()] + " " + d.getUTCFullYear();
    return dateStr;
  }
})();
