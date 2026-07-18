# Design Guardrails

Updated: 2026-07-18

## Typography

- Use Satoshi only.
- Use `assets/css/tokens.css` for font-family and size tokens.
- Keep letter spacing at zero in compact UI and body text.
- Reserve large type for true page heroes.
- Do not use italics in visible website copy.

## Colour

- Ink: `#1A1714`
- Forest: `#394536`
- Moss: `#657158`
- Off-white: `#FAFAF9`
- Warm surface: `#F5F2EA` or the existing token equivalent
- Muted gold: `#B48A4A`, used sparingly

Use the token files instead of adding route-specific colour systems. Purple accents were removed from the current production language and should not be reintroduced without an explicit brand decision.

## Spacing And Layout

- Use shared page gutters and responsive shell widths.
- Keep desktop content broad enough to use the available screen without edge crowding.
- Use stable grid tracks and aspect ratios for media and repeated items.
- Mobile sections should generally use 56 to 76px vertical padding, not desktop spacing compressed onto a phone.
- Do not force mobile heroes to full viewport height when content is shorter.

## Cards

- Use cards only for repeated items, framed tools and forms.
- Maximum corner radius is 8px unless an existing form control uses the pill system.
- Do not place cards inside cards.
- Prefer editorial rows, divided lists and unframed sections when a grid becomes repetitive.

## Buttons

- Primary: solid ink or forest, one clear action per section.
- Secondary: outline or text link.
- Keep touch targets near or above 44px.
- Use icons for familiar icon-only actions and include accessible labels/tooltips.
- Do not make submit buttons full width on desktop unless the form pattern requires it.

## Forms

- Inputs use the established pill shape and shared form styles.
- OTP stays inline with six compact inputs and no modal.
- Keep CAPTCHA immediately before the final submit action.
- Keep country and city selection explicit when location is required.
- Do not alter form names, ids or database payloads for visual reasons.

## Image Direction

- Show real work, interfaces, campaign outputs, people or verified brand systems.
- Use the blue-blazer founder portrait consistently.
- Avoid generic stock business scenes and decorative AI objects.
- Set dimensions or aspect ratios and lazy-load below-the-fold images.
- Alternative text should describe information conveyed, not repeat nearby headings.

## Motion

- Motion supports hierarchy or demonstrates work; it is not decoration.
- Respect `prefers-reduced-motion`.
- Use transform and opacity for lightweight animation.
- Brand film should loop silently by default with a working mute/unmute control.

## Copy

- Voice: intelligent, precise, restrained, commercially aware and founder-led.
- Do not use em dashes, inflated superlatives, generic AI language or unsupported outcomes.
- Separate SQUARGRAPH work from previous founder experience every time.
- Use SQUARGRAPH™ exactly, not an HTML entity displayed as text.

## Prohibited Patterns

- Decorative blobs, bokeh, glassmorphism and unnecessary gradients
- Generic agency illustrations or fake dashboards
- One-note purple, beige, dark-blue or brown palettes
- Huge numbers without evidence
- Fake client marks, ratings, testimonials or metrics
- Multiple competing CTAs in one section
- New CSS frameworks, page builders or heavy animation libraries

## New Component Test

A new component is justified only when it removes meaningful duplication, supports a repeated content type, or enables an interaction not covered by the current system. Extend existing tokens and patterns first.

## Design Freeze

A structural redesign is justified only when the business model, target customer or primary product changes materially; reliable user data shows a conversion failure; or accessibility/technology requires it.

Boredom, a competitor redesign, a temporary campaign, one stakeholder preference, a new reference or an AI design trend are not reasons to redesign the site.
