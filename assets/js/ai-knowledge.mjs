// Shared verified answers for the browser and Worker. No invented prices or client claims.
export function getVerifiedReply(messages, knowledge) {
  const question = messages?.at(-1)?.content?.trim() || '';
  const q = question.toLowerCase();
  const route = knowledge?.site_architecture?.start_a_project || 'https://squargraph.com/project-direction/';
  if (!q || /ignore.*(?:rules|instructions)|system prompt|api key|password|<script/i.test(q)) return null;
  if (/^(?:hi|hello|hey|namaste)[!.\s]*$/i.test(q)) {
    return 'Hello, welcome to SQUARGRAPH™. Tell us what your brand needs: strategy, identity, campaigns, films, digital, media, or PR and influencers.';
  }
  if (/\b(?:contact|email|whatsapp|phone|call you|reach you)\b/.test(q) && knowledge?.contact) {
    return `You can contact SQUARGRAPH™ at ${knowledge.contact.email} or on WhatsApp: ${knowledge.contact.whatsapp || 'https://wa.me/918588897488'}.`;
  }
  if (/\b(?:founder|saurabh)\b/.test(q) && knowledge?.founder) {
    return `${knowledge.founder.name} is ${knowledge.founder.role}. Read his official profile: ${knowledge.founder.official_profile}`;
  }
  if (/\b(?:zucero|good sugar)\b/.test(q) && knowledge?.work_transparency?.zucero_scope) return knowledge.work_transparency.zucero_scope;
  if (/(?:what|who) is squargraph|about squargraph/.test(q) && knowledge?.brand) {
    return `SQUARGRAPH™ is ${knowledge.brand.descriptor} based in ${knowledge.brand.location}. ${knowledge.brand.purpose}`;
  }
  const engagements = Array.isArray(knowledge?.engagements) ? knowledge.engagements : [];
  const engagement = engagements.find(item => {
    const name = item.name.toLowerCase();
    return name.includes('discovery') && /\bdiscovery\b/.test(q) ||
      name.includes('brand growth audit') && /\baudit\b|brand quotient/.test(q) ||
      name.includes('brand foundation sprint') && /foundation sprint/.test(q) ||
      name.includes('integrated growth') && /growth partner/.test(q) ||
      name.includes('project direction') && /project direction/.test(q);
  });
  if (engagement) {
    const price = /\b(?:price|cost|fee|charge|how much)\b/.test(q) && engagement.price ? ` Published pricing: ${engagement.price}.` : '';
    return `${engagement.name}: ${engagement.best_for || engagement.process || ''}${price} ${engagement.route}`;
  }
  // "Where should I start?" by itself does not mean the business problem is unclear.
  if (/problem (?:is )?(?:unclear|not clear)|don'?t know where to start|do not know where to start|not sure (?:what|where)|brand (?:feels |is )?weak|kahan se start|samajh nahi/.test(q)) {
    const discovery = engagements.find(item => /discovery/i.test(item.name));
    if (discovery) return `If the underlying problem is unclear, start with the ${discovery.name}. ${discovery.best_for} ${discovery.route}`;
  }
  const capabilities = Array.isArray(knowledge?.capabilities) ? knowledge.capabilities : [];
  const patterns = [
    /\b(?:branding|identity|positioning|brand strategy|rebrand|logo)\b/,
    /\b(?:website|websites|ux|landing page|digital experience)\b/,
    /\b(?:campaign|campaigns|film|films|reels|content|production|advertising|social media)\b/,
    /\b(?:performance|media planning|paid ads|funnel|media buying)\b/,
    /\b(?:pr|public relations|influencer|influencers|reputation|creator|creators)\b/,
    /\b(?:ooh|event|events|activation|activations|experiential)\b/
  ];
  const matched = capabilities.filter((item, index) => patterns[index]?.test(q));
  if (/\b(?:price|cost|fee|charge|how much|budget)\b/.test(q) && matched.length) {
    return `This work has a custom scope. SQUARGRAPH™ confirms pricing after reviewing your requirements; there is no verified fixed price for this request. Share your brief through Project Direction: ${route}`;
  }
  if (matched.length) {
    return `SQUARGRAPH™ can help through ${matched.map(item => item.name).join(' and ')}. ${matched[0].description} Share your requirement through Project Direction so the studio can recommend a custom scope: ${route}`;
  }
  if (/\b(?:services|capabilities)\b|what do you do|what do you offer/.test(q) && capabilities.length) {
    return `SQUARGRAPH™ works across ${capabilities.map(item => item.name).join(', ')}. Explore our capabilities: ${knowledge.site_architecture?.capabilities || 'https://squargraph.com/capabilities/'}`;
  }
  if (/\b(?:hire|start a project|send a brief|discuss a project)\b/.test(q)) {
    return `Start with Project Direction. Share your goal and current context, and SQUARGRAPH™ will review the requirement and recommend the relevant capabilities: ${route}`;
  }
  return null;
}
