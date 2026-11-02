(() => {
  const section = document.getElementById('elsewhere');
  if (!section) return;
  async function refresh() {
    section.querySelectorAll('.home-directory-rating').forEach(node => node.remove());
    try {
      const response = await fetch('/api/ratings', { signal: AbortSignal.timeout(7000) });
      if (!response.ok) return;
      const data = await response.json();
      if (!Array.isArray(data.ratings)) return;
      for (const rating of data.ratings) {
        if (rating.provider !== 'trustpilot' || typeof rating.score !== 'number' || !Number.isFinite(rating.score) || rating.score <= 0 || rating.score > 5 || !Number.isSafeInteger(rating.count) || rating.count < 1) continue;
        const link = section.querySelector('[data-rating-provider="trustpilot"]');
        if (!link || link.querySelector('.home-directory-rating')) continue;
        const text = document.createElement('span');
        text.className = 'home-directory-rating';
        text.textContent = `${rating.score.toFixed(1)} / 5 · ${rating.count.toLocaleString()} ${rating.count === 1 ? 'review' : 'reviews'}`;
        link.querySelector('img').after(text);
      }
    } catch { /* No rating labels or empty placeholders on failure. */ }
  }
  let loaded = false;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (loaded || !entries.some(entry => entry.isIntersecting)) return;
      loaded = true; observer.disconnect(); refresh();
    });
    observer.observe(section);
  } else { loaded = true; refresh(); }
  document.addEventListener('visibilitychange', () => { if (loaded && !document.hidden) refresh(); });
  setInterval(() => { if (loaded && !document.hidden) refresh(); }, 3600000);
})();
