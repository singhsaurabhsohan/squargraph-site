import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'index.html');
let html = await readFile(file, 'utf8');

const nav = await readFile(path.join(root, 'components/navigation.html.reference'), 'utf8');
const footer = await readFile(path.join(root, 'components/footer.html.reference'), 'utf8');
const resolvedNav = nav.replace(/\{\{[A-Z_]+\}\}/g, '');

const architectureSections = `
<section class="architecture-trust" aria-label="Studio facts">
  <div class="architecture-shell architecture-trust-grid">
    <div><span>Founder-led</span><p>One accountable strategic centre.</p></div>
    <div><span>New Delhi</span><p>Working across markets and touchpoints.</p></div>
    <div><span>8+ years</span><p>Integrated brand and marketing experience.</p></div>
    <div><span>Strategy through execution</span><p>Supported by a controlled delivery ecosystem.</p></div>
  </div>
</section>

<section id="work" class="home-section architecture-section architecture-section--white">
  <div class="architecture-shell">
    <div class="architecture-heading fade-up"><div><p class="section-eyebrow">Selected Work</p><h2>Strategy made visible.</h2></div><p>Selected work across brand systems, campaigns, digital experiences and communication.</p></div>
    <div class="architecture-work-grid" data-home-work-grid>
      <article class="architecture-work-card"><div class="architecture-work-media"><img src="/squargraph-brand-image.webp" alt="SQUARGRAPH brand system and visual identity" width="720" height="450" loading="lazy" decoding="async" /></div><div class="architecture-work-body"><p class="architecture-card-meta">Brand · Digital</p><h3>SQUARGRAPH™ Brand System</h3><p>A self-initiated identity and digital system designed to hold one strategic idea across the studio's public touchpoints.</p><a class="text-link" href="/studio/" data-sq-event="work_card_click">View context</a></div></article>
      <article class="architecture-work-card"><div class="architecture-work-media architecture-work-media--system" aria-hidden="true"></div><div class="architecture-work-body"><p class="architecture-card-meta">Campaigns · Content</p><h3>Perception, in Motion</h3><p>A studio brand film that turns the idea of deliberate perception into a concise moving narrative.</p><a class="text-link" href="/work/#squargraph-work" data-sq-event="work_card_click">View context</a></div></article>
      <article class="architecture-work-card"><div class="architecture-work-media architecture-work-media--system" aria-hidden="true"></div><div class="architecture-work-body"><p class="architecture-card-meta">Digital · Brand</p><h3>Project Direction</h3><p>A guided experience that translates unclear business problems into connected capability direction.</p><a class="text-link" href="/project-direction/" data-sq-event="work_card_click">View context</a></div></article>
      <article class="architecture-work-card"><div class="architecture-work-media"><img src="/assets/images/partners/partner-specialist-depth.webp" alt="Connected specialist teams working within a shared growth system" width="720" height="450" loading="lazy" decoding="async" /></div><div class="architecture-work-body"><p class="architecture-card-meta">Digital · Experience</p><h3>Growth Ecosystem Partner Experience</h3><p>A focused application journey for specialists and studios joining a controlled delivery ecosystem.</p><a class="text-link" href="/partners/" data-sq-event="work_card_click">View context</a></div></article>
    </div>
    <div class="architecture-section-action"><a class="text-link" href="/work/" data-sq-event="work_card_click">Explore Selected Work</a></div>
  </div>
</section>

<section id="capabilities" class="home-section architecture-section">
  <div class="architecture-shell">
    <div class="architecture-heading fade-up"><div><p class="section-eyebrow">Capability System</p><h2>The connected surfaces where brands are built.</h2></div><p>Six capability territories, each shaped to strengthen the same perception and business objective.</p></div>
    <div class="architecture-capability-list">
      <a href="/capabilities/#brand-direction" data-sq-event="capability_click"><span>01</span><h3>Brand Direction</h3><p>Positioning, messaging, identity logic and founder-led narrative systems.</p><b aria-hidden="true">→</b></a>
      <a href="/capabilities/#digital-presence" data-sq-event="capability_click"><span>02</span><h3>Digital Presence</h3><p>Websites, landing pages, UX and conversion-focused digital experiences.</p><b aria-hidden="true">→</b></a>
      <a href="/capabilities/#content-campaigns" data-sq-event="capability_click"><span>03</span><h3>Content &amp; Campaigns</h3><p>Campaign ideas and content formats shaped by one creative direction.</p><b aria-hidden="true">→</b></a>
      <a href="/capabilities/#media-performance" data-sq-event="capability_click"><span>04</span><h3>Media &amp; Performance</h3><p>Channel planning, audience logic, funnels and performance learning.</p><b aria-hidden="true">→</b></a>
      <a href="/capabilities/#influence-reputation" data-sq-event="capability_click"><span>05</span><h3>Influence &amp; Reputation</h3><p>PR, influence, podcasts and reputation systems that build trust.</p><b aria-hidden="true">→</b></a>
      <a href="/capabilities/#experience-visibility" data-sq-event="capability_click"><span>06</span><h3>Experience &amp; Visibility</h3><p>OOH, activations, physical touchpoints and high-visibility presence.</p><b aria-hidden="true">→</b></a>
    </div>
    <div class="architecture-section-action"><a class="text-link" href="/capabilities/" data-sq-event="capability_click">Explore All Capabilities</a></div>
  </div>
</section>

<section id="approach" class="home-section architecture-section architecture-section--dark">
  <div class="architecture-shell">
    <div class="architecture-heading fade-up"><div><p class="section-eyebrow">How We Work</p><h2>What breaks. How we bring it back into alignment.</h2></div><p>We diagnose the source of drift, define the direction and keep every next decision accountable to it.</p></div>
    <div class="architecture-method-grid">
      <div class="architecture-method-column"><p class="architecture-card-meta">What breaks</p><article><span>01</span><div><h3>Fragmentation</h3><p>Separate teams solve separate tasks without a shared view of the brand.</p></div></article><article><span>02</span><div><h3>Noise</h3><p>More activity creates visibility without a clearer reason to choose.</p></div></article><article><span>03</span><div><h3>Drift</h3><p>Short-term execution slowly changes what the brand means.</p></div></article></div>
      <div class="architecture-method-column"><p class="architecture-card-meta">How we work</p><article><span>01</span><div><h3>Read</h3><p>Identify perception gaps and communication breaks.</p></div></article><article><span>02</span><div><h3>Define</h3><p>Set the strategy, message and creative standard.</p></div></article><article><span>03</span><div><h3>Align</h3><p>Bring the necessary capabilities into one system.</p></div></article><article><span>04</span><div><h3>Sharpen</h3><p>Use market response to improve the next decision.</p></div></article></div>
    </div>
    <div class="architecture-section-action"><a class="text-link text-link--light" href="/studio/#approach">See Our Operating Approach</a></div>
  </div>
</section>

<section id="Engagements" class="home-section architecture-section architecture-section--white">
  <div class="architecture-shell">
    <div class="architecture-heading fade-up"><div><p class="section-eyebrow">Ways to Work</p><h2>Start where the constraint is clearest.</h2></div><p>Five focused ways to move from uncertainty to direction, foundation, delivery or ongoing growth.</p></div>
    <div class="architecture-engagement-list">
      <a href="/discovery" data-sq-event="discovery_session_click"><span>01</span><div><h3>Discovery Session™</h3><p>When the next move needs a focused strategic conversation.</p></div><strong>30 minutes</strong><b aria-hidden="true">→</b></a>
      <a href="/audit" data-sq-event="audit_start_click"><span>02</span><div><h3>Brand Growth Audit™</h3><p>When activity is moving but the core contradiction is unclear.</p></div><strong>Diagnosis</strong><b aria-hidden="true">→</b></a>
      <a href="/brand-foundation-sprint" data-sq-event="engagement_click"><span>03</span><div><h3>Brand Foundation Sprint™</h3><p>When positioning, message and identity need a working foundation.</p></div><strong>Focused sprint</strong><b aria-hidden="true">→</b></a>
      <a href="/websites-digital-experiences" data-sq-event="engagement_click"><span>04</span><div><h3>Website &amp; Digital Experience™</h3><p>When the digital experience weakens perception or action.</p></div><strong>Strategy to launch</strong><b aria-hidden="true">→</b></a>
      <a href="/growth-partner" data-sq-event="engagement_click"><span>05</span><div><h3>Integrated Growth Partnership</h3><p>When multiple touchpoints need an ongoing operating rhythm.</p></div><strong>Ongoing</strong><b aria-hidden="true">→</b></a>
    </div>
    <div class="architecture-section-action"><a class="text-link" href="/engagements/" data-sq-event="engagement_click">Compare Engagements</a></div>
  </div>
</section>

<section class="home-section architecture-section architecture-founder">
  <div class="architecture-shell architecture-founder-grid">
    <figure><img src="/saurabh-sohan-singh-founder-squargraph.webp" alt="Saurabh Sohan Singh, Founder and Creative Strategist of SQUARGRAPH" width="620" height="620" loading="lazy" decoding="async" /></figure>
    <div><p class="section-eyebrow">The Founder</p><h2>Saurabh Sohan Singh</h2><p class="architecture-founder-role">Founder &amp; Creative Strategist</p><h3>Built by understanding how brands move in the real world.</h3><p>Saurabh brings more than eight years of integrated brand and marketing experience, including work with INNOCEAN Worldwide India on the Hyundai India mandate. His experience spans campaigns, content, influence, reputation and digital experience.</p><p>Today, he leads SQUARGRAPH™ with a focus on strategic clarity, creative discipline, market perception and long-term brand value.</p><div class="architecture-founder-links"><a class="text-link" href="/saurabh-sohan-singh" data-sq-event="founder_profile_click">Meet the Founder</a><a class="text-link" href="https://linkedin.com/in/saurabhsohansingh" target="_blank" rel="noopener noreferrer">LinkedIn</a><a class="text-link" href="mailto:saurabh@squargraph.com">Email</a></div></div>
  </div>
</section>

<section id="intelligence" class="home-section architecture-section architecture-section--white">
  <div class="architecture-shell">
    <div class="architecture-heading fade-up"><div><p class="section-eyebrow">Intelligence</p><h2>Signals we study before execution.</h2></div><p>A growing knowledge system about how brands are seen, compared, trusted and remembered.</p></div>
    <div class="architecture-intelligence-grid" data-home-intelligence-grid>
      <article class="architecture-intel-card"><p class="architecture-card-meta">Study</p><h3>boAt Brand Quotient</h3><p>A study of communication maturity in a youth electronics brand moving into its next phase.</p><a class="text-link" href="/intelligence#study-boat-brand-quotient" data-sq-event="intelligence_article_click">Read intelligence</a></article>
      <article class="architecture-intel-card"><p class="architecture-card-meta">Signal</p><h3>AI and execution cost</h3><p>When execution becomes cheaper, positioning becomes a more important source of distinction.</p><a class="text-link" href="/intelligence" data-sq-event="intelligence_article_click">Read intelligence</a></article>
      <article class="architecture-intel-card"><p class="architecture-card-meta">Observation</p><h3>Perception leaves clues</h3><p>Market behaviour, language and visible choices reveal where brand meaning is strengthening or drifting.</p><a class="text-link" href="/intelligence" data-sq-event="intelligence_article_click">Read intelligence</a></article>
    </div>
    <div class="architecture-section-action"><a class="text-link" href="/intelligence">Explore Intelligence</a></div>
  </div>
</section>

`;

html = html.replace(/\s*<meta name="keywords"[^>]*>\s*/i, '\n');
html = html.replace(/<nav id="nav"[\s\S]*?<\/nav>\s*<div id="mob-menu"[\s\S]*?<\/div>/, resolvedNav.trim());
html = html.replace('<a href="#contact" class="btn-primary">Start a Conversation</a>', '<a href="/project-direction/" class="btn-primary" data-sq-event="project_direction_start">Start a Project</a>');
html = html.replace('<a href="#capabilities" class="btn-outline">Explore Capabilities</a>', '<a href="/work/" class="btn-outline" data-sq-event="work_card_click">Explore Our Work</a>');
html = html.replace(/<section id="capabilities"[\s\S]*?(?=<section id="contact")/, architectureSections);
html = html.replace(/<footer class="site-footer"[\s\S]*?<\/footer>/, footer.trim());
if (!html.includes('/assets/js/home-previews.js')) {
  html = html.replace('</body>', '<script src="/assets/js/home-previews.js?v=20260718-architecture"></script>\n</body>');
}

await writeFile(file, html, 'utf8');
console.log('Homepage architecture sections rebuilt.');
