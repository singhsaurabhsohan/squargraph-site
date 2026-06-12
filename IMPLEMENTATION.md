# SQUARGRAPH™ Legal & Trust Layer — Implementation Instructions

Four HTML files are ready to deploy. Below are the exact find-and-replace patches for `index.html` and `audit.html`.

---

## STEP 1 — Deploy the four new pages

Copy these files to your Cloudflare Pages root:

- `privacy-policy.html`  → served at `/privacy-policy`
- `terms-of-use.html`    → served at `/terms-of-use`
- `refund-policy.html`   → served at `/refund-policy`
- `ai-disclosure.html`   → served at `/ai-disclosure`

No routing config needed — Cloudflare Pages serves `.html` files directly at the slug path.

---

## STEP 2 — Update footer links in `index.html`

### Find (existing footer legal links):
```html
        <a href="#" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Terms & Conditions</a>
        <a href="#" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Privacy Policy</a>
        <a href="#" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Refund Policy</a>
```

### Replace with:
```html
        <a href="/terms-of-use" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Terms of Use</a>
        <a href="/privacy-policy" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Privacy Policy</a>
        <a href="/refund-policy" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">Refund Policy</a>
        <a href="/ai-disclosure" style="font-size:11px;color:var(--textmuted);transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--textmuted)'">AI Disclosure</a>
```

---

## STEP 3 — Update audit consent block in `audit.html`

### Find (existing privacy note):
```html
    <p class="privacy-note">🔒 Your data is kept private and never shared. By submitting, you agree to our terms.</p>
```

### Replace with:
```html
    <div class="privacy-note" style="font-size:12px;color:var(--muted);text-align:left;padding:0 32px 20px;line-height:1.65;">

      <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;margin-bottom:14px;">
        <input type="checkbox" id="audit-consent" style="margin-top:3px;accent-color:var(--accent);flex-shrink:0;" />
        <span style="font-size:13px;color:var(--text);font-weight:500;line-height:1.6;">
          I consent to SQUARGRAPH™ Studios collecting, storing, and processing the information submitted in this assessment.
        </span>
      </label>

      <p style="margin-bottom:8px;">🔒 Your information is securely stored and never sold to third parties.</p>

      <p style="margin-bottom:8px;">Brand Quotient™ uses proprietary frameworks, website analysis, automated systems, and AI-assisted evaluation to generate preliminary insights.</p>

      <p style="margin-bottom:8px;">AI-generated analysis is based on available information and analytical models and may not capture every aspect of your business. Recommendations should be considered directional guidance and not professional, legal, financial, or investment advice.</p>

      <p style="margin-bottom:8px;">Human review, strategic validation, and additional analysis may be required before implementing recommendations or making business decisions.</p>

      <p>By submitting this assessment, you agree to our
        <a href="/privacy-policy" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-mid);">Privacy Policy</a>,
        <a href="/terms-of-use" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-mid);">Terms of Use</a>,
        <a href="/refund-policy" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-mid);">Refund Policy</a>, and
        <a href="/ai-disclosure" style="color:var(--accent);text-decoration:none;border-bottom:1px solid var(--accent-mid);">AI Disclosure</a>.
      </p>

    </div>
```

---

## STEP 4 — Add consent validation in `audit.html`

### Find (inside the btnSubmit click handler, the first line after the click event opens):
```javascript
  if (!validateStep(TOTAL_STEPS)) return;
```

### Replace with:
```javascript
  if (!validateStep(TOTAL_STEPS)) return;

  const consentEl = document.getElementById('audit-consent');
  if (consentEl && !consentEl.checked) {
    consentEl.closest('label').style.outline = '2px solid #E53E3E';
    consentEl.closest('label').style.borderRadius = '6px';
    consentEl.closest('label').style.padding = '4px';
    consentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(function() {
      consentEl.closest('label').style.outline = '';
      consentEl.closest('label').style.padding = '';
    }, 3000);
    return;
  }
```

---

## STEP 5 — Update footer in `audit.html`

The `audit.html` page doesn't have a footer. Add this just before `</body>`:

```html
<footer style="border-top:1px solid var(--border);padding:28px 32px;display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center;margin-top:auto;">
  <p style="font-size:12px;color:var(--muted);">© 2026 SQUARGRAPH™ Studios. All rights reserved.</p>
  <div style="display:flex;gap:20px;flex-wrap:wrap;">
    <a href="/privacy-policy" style="font-size:12px;color:var(--muted);text-decoration:none;transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--muted)'">Privacy Policy</a>
    <a href="/terms-of-use" style="font-size:12px;color:var(--muted);text-decoration:none;transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--muted)'">Terms of Use</a>
    <a href="/refund-policy" style="font-size:12px;color:var(--muted);text-decoration:none;transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--muted)'">Refund Policy</a>
    <a href="/ai-disclosure" style="font-size:12px;color:var(--muted);text-decoration:none;transition:color .2s;" onmouseenter="this.style.color='var(--accent)'" onmouseleave="this.style.color='var(--muted)'">AI Disclosure</a>
  </div>
</footer>
```

Place this just before the closing `</body>` tag, after all existing `<script>` blocks.

---

## Summary

| File | Action |
|---|---|
| `privacy-policy.html` | Deploy to root |
| `terms-of-use.html` | Deploy to root |
| `refund-policy.html` | Deploy to root |
| `ai-disclosure.html` | Deploy to root |
| `index.html` | Step 2: update footer links (4 lines) |
| `audit.html` | Step 3: replace privacy-note with full consent block |
| `audit.html` | Step 4: add consent check at top of submit handler |
| `audit.html` | Step 5: add legal footer before `</body>` |
