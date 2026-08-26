import React, { useEffect, useMemo, useState } from 'react';
import {
  Linking,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as FeatherIcon } from '@expo/vector-icons';

const C = {
  ink: '#1A1714',
  secondary: '#3D3935',
  muted: '#716C66',
  olive: '#394536',
  oliveMid: '#657158',
  oliveLight: '#EDF0EA',
  warm: '#F5F5F3',
  offWhite: '#FAFAF9',
  white: '#FFFFFF',
  border: '#E5E3DF',
  success: '#2F6D4C',
};

const webIconGlyphs = {
  'arrow-up-right': '↗', 'arrow-right': '→', 'file-text': '≡', activity: '↗',
  'message-circle': '◌', compass: '◇', monitor: '▣', aperture: '◎',
  'bar-chart-2': '▥', radio: '◉', 'map-pin': '●', 'chevron-right': '›',
  search: '⌕', check: '✓', layers: '≡', mail: '@', phone: '☎', calendar: '□',
  linkedin: 'in', home: '◆', grid: '▦', folder: '▭', globe: '◎',
};

function Feather({ name, size = 18, color = C.ink }) {
  if (Platform.OS !== 'web') return <FeatherIcon name={name} size={size} color={color} />;
  return <Text style={{ color, fontSize: Math.max(13, size - 1), lineHeight: size + 2, fontWeight: '700' }}>{webIconGlyphs[name] || '•'}</Text>;
}

const engagements = [
  { number: '01', title: 'Discovery Session™', detail: 'Decide what needs attention first.', meta: '30 minutes', path: 'discovery' },
  { number: '02', title: 'Brand Growth Audit™', detail: 'See the gaps the organisation may be too close to notice.', meta: 'Diagnostic', path: 'audit' },
  { number: '03', title: 'Brand Foundation Sprint™', detail: 'Build the foundation required before execution scales.', meta: 'Focused sprint', path: 'brand-foundation-sprint' },
  { number: '04', title: 'Websites & Digital Experiences', detail: 'Create a clearer, more effective digital system.', meta: 'Strategy to launch', path: 'websites-digital-experiences' },
  { number: '05', title: 'Integrated Growth Partnership', detail: 'Connect brand, creative, media and learning.', meta: 'Ongoing', path: 'growth-partner' },
];

const capabilities = [
  ['compass', 'Brand Direction', 'Positioning, messaging, identity logic and narrative systems.'],
  ['monitor', 'Digital Presence', 'Websites, landing pages, UX and conversion experiences.'],
  ['aperture', 'Content & Campaigns', 'Campaign ideas and content shaped by one direction.'],
  ['bar-chart-2', 'Media & Performance', 'Channel planning, funnels and performance learning.'],
  ['radio', 'Influence & Reputation', 'PR, influence and trust-building reputation systems.'],
  ['map-pin', 'Experience & Visibility', 'Physical touchpoints and high-visibility brand presence.'],
];

const projectSteps = ['Brief received', 'Direction aligned', 'In progress', 'Review', 'Delivered'];

function open(path = '') {
  Linking.openURL(`https://squargraph.com/${path}`);
}

function BrandMark({ inverse = false }) {
  return (
    <Image
      source={require('./assets/squargraph-logo.png')}
      accessibilityLabel="SQUARGRAPH™"
      resizeMode="contain"
      style={[styles.originalLogo, inverse && { tintColor: C.white }]}
    />
  );
}

function Pill({ children, dark = false }) {
  return <View style={[styles.pill, dark && styles.pillDark]}><Text style={[styles.pillText, dark && { color: C.white }]}>{children}</Text></View>;
}

function Button({ label, onPress, secondary = false, icon = 'arrow-up-right' }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.buttonSecondary, pressed && { opacity: .75 }]}>
      <Text style={[styles.buttonText, secondary && { color: C.ink }]}>{label}</Text>
      <Feather name={icon} size={17} color={secondary ? C.ink : C.white} />
    </Pressable>
  );
}

function SectionTitle({ eyebrow, title, action, onAction }) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && <Pressable onPress={onAction}><Text style={styles.textLink}>{action} →</Text></Pressable>}
    </View>
  );
}

function Home({ setTab }) {
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[C.olive, '#20281F']} style={styles.hero}>
        <Pill dark>STRATEGY · CREATIVE · MEDIA · GROWTH</Pill>
        <Text style={styles.heroTitle}>One direction for every moving part of your brand.</Text>
        <Text style={styles.heroCopy}>Turn unclear priorities into a connected plan—from positioning and identity to digital, campaigns, media and growth.</Text>
        <View style={styles.heroActions}>
          <Button label="Start a project" onPress={() => open('project-direction/')} />
          <Pressable onPress={() => setTab('services')} style={styles.heroTextButton}>
            <Text style={styles.heroTextButtonLabel}>Explore capabilities</Text>
            <Feather name="arrow-right" size={17} color={C.white} />
          </Pressable>
        </View>
        <View style={styles.signalGrid}>
          {[['01', 'Direction'], ['02', 'Standards'], ['03', 'Coordination']].map(([n, t]) => (
            <View style={styles.signal} key={n}><Text style={styles.signalN}>{n}</Text><Text style={styles.signalT}>{t}</Text></View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <SectionTitle eyebrow="WAYS TO WORK" title="Start where the constraint is clearest." action="See all" onAction={() => setTab('services')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCards}>
          {engagements.slice(0, 3).map(item => <EngagementCard key={item.number} item={item} />)}
        </ScrollView>
      </View>

      <View style={[styles.section, styles.softSection]}>
        <SectionTitle eyebrow="CLIENT SPACE" title="Keep work moving without losing the thread." />
        <View style={styles.featureList}>
          {[
            ['file-text', 'Submit a clear brief', 'Use Project Direction to translate business needs into connected capabilities.'],
            ['activity', 'Follow project progress', 'See the current stage and know what decision is needed next.'],
            ['message-circle', 'Stay close to the studio', 'Move from context to conversation without searching across channels.'],
          ].map(([icon, title, copy]) => (
            <View style={styles.feature} key={title}><View style={styles.iconBox}><Feather name={icon} size={20} color={C.olive} /></View><View style={{ flex: 1 }}><Text style={styles.featureTitle}>{title}</Text><Text style={styles.featureCopy}>{copy}</Text></View></View>
          ))}
        </View>
        <Button label="View projects" onPress={() => setTab('projects')} secondary />
      </View>
    </ScrollView>
  );
}

function EngagementCard({ item }) {
  return (
    <Pressable onPress={() => open(item.path)} style={({ pressed }) => [styles.engagementCard, pressed && { transform: [{ scale: .98 }] }]}>
      <View style={styles.cardTop}><Text style={styles.cardNumber}>{item.number}</Text><Feather name="arrow-up-right" size={19} color={C.olive} /></View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardCopy}>{item.detail}</Text>
      <Text style={styles.cardMeta}>{item.meta.toUpperCase()}</Text>
    </Pressable>
  );
}

function Services() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntro}><Text style={styles.eyebrow}>CAPABILITIES</Text><Text style={styles.pageTitle}>Connected capabilities. One accountable direction.</Text><Text style={styles.pageLead}>Choose a capability or begin with the problem. The system connects the rest.</Text></View>
      <View style={[styles.capGrid, wide && styles.capGridWide]}>
        {capabilities.map(([icon, title, copy], index) => (
          <Pressable key={title} onPress={() => open(`capabilities/#${title.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-')}`)} style={[styles.capCard, wide && { width: '48.5%' }]}>
            <View style={styles.capTop}><View style={styles.iconBox}><Feather name={icon} size={20} color={C.olive} /></View><Text style={styles.capNumber}>0{index + 1}</Text></View>
            <Text style={styles.capTitle}>{title}</Text><Text style={styles.capCopy}>{copy}</Text><Feather name="arrow-right" size={18} color={C.olive} />
          </Pressable>
        ))}
      </View>
      <View style={styles.section}><SectionTitle eyebrow="ENGAGEMENTS" title="Five ways to begin." />{engagements.map(item => <EngagementRow item={item} key={item.number} />)}</View>
    </ScrollView>
  );
}

function EngagementRow({ item }) {
  return (
    <Pressable onPress={() => open(item.path)} style={styles.engagementRow}>
      <Text style={styles.rowNumber}>{item.number}</Text><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.rowCopy}>{item.detail}</Text></View><Feather name="chevron-right" size={21} color={C.oliveMid} />
    </Pressable>
  );
}

function Projects() {
  const [reference, setReference] = useState('SQ-2026-001');
  const [searched, setSearched] = useState(false);
  const valid = reference.trim().length >= 6;
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntro}><Text style={styles.eyebrow}>PROJECT SPACE</Text><Text style={styles.pageTitle}>Know what is moving—and what comes next.</Text><Text style={styles.pageLead}>Enter the reference shared by SQUARGRAPH to preview your project stage.</Text></View>
      <View style={styles.lookupCard}>
        <Text style={styles.inputLabel}>PROJECT REFERENCE</Text>
        <View style={styles.inputRow}><TextInput value={reference} onChangeText={t => { setReference(t); setSearched(false); }} autoCapitalize="characters" placeholder="SQ-2026-001" placeholderTextColor="#99938D" style={styles.input} /><Pressable disabled={!valid} onPress={() => setSearched(true)} style={[styles.lookupButton, !valid && { opacity: .45 }]}><Feather name="search" size={19} color={C.white} /></Pressable></View>
      </View>
      {searched ? (
        <View style={styles.projectCard}>
          <View style={styles.projectHead}><View><Text style={styles.projectLabel}>PROJECT</Text><Text style={styles.projectTitle}>Brand direction system</Text></View><Pill>IN PROGRESS</Pill></View>
          <View style={styles.timeline}>{projectSteps.map((step, i) => <View style={styles.timelineRow} key={step}><View style={[styles.timelineDot, i <= 2 && styles.timelineDotActive]}>{i < 2 && <Feather name="check" size={12} color={C.white} />}</View><View style={{ flex: 1 }}><Text style={[styles.timelineTitle, i > 2 && { color: C.muted }]}>{step}</Text>{i === 2 && <Text style={styles.timelineNote}>Current stage · Next update in 2 days</Text>}</View></View>)}</View>
          <Button label="Open secure dashboard" onPress={() => Linking.openURL('https://os.squargraph.com/app/dashboard')} />
        </View>
      ) : (
        <View style={styles.emptyState}><View style={styles.emptyIcon}><Feather name="layers" size={28} color={C.olive} /></View><Text style={styles.emptyTitle}>Your project will appear here.</Text><Text style={styles.emptyCopy}>Use the reference from your project email. Live data remains inside the secure SQUARGRAPH OS dashboard.</Text></View>
      )}
      <View style={styles.ctaCard}><Text style={styles.ctaTitle}>Starting something new?</Text><Text style={styles.ctaCopy}>Share the constraint, stage and outcome. Project Direction will help identify the right capability mix.</Text><Button label="Submit a project brief" onPress={() => open('project-direction/')} /></View>
    </ScrollView>
  );
}

function Contact() {
  const [note, setNote] = useState('');
  const whatsappUrl = useMemo(() => `https://wa.me/918588897488?text=${encodeURIComponent(note || 'Hi SQUARGRAPH, I would like to discuss a project.')}`, [note]);
  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.pageIntro}><Text style={styles.eyebrow}>CONTACT</Text><Text style={styles.pageTitle}>Clarity before pitch decks.</Text><Text style={styles.pageLead}>Share a short note or choose the channel that works best for you.</Text></View>
      <View style={styles.contactCard}>
        <Text style={styles.inputLabel}>WHAT NEEDS TO MOVE?</Text>
        <TextInput multiline value={note} onChangeText={setNote} placeholder="A short description of the challenge, opportunity or project…" placeholderTextColor="#99938D" style={styles.textArea} />
        <Button label="Continue on WhatsApp" icon="message-circle" onPress={() => Linking.openURL(whatsappUrl)} />
      </View>
      <View style={styles.contactLinks}>
        {[
          ['mail', 'Email the studio', 'hello@squargraph.com', 'mailto:hello@squargraph.com'],
          ['phone', 'Call SQUARGRAPH', '+91 85888 97488', 'tel:+918588897488'],
          ['calendar', 'Schedule a conversation', 'Choose a convenient time', 'https://os.squargraph.com/book'],
          ['linkedin', 'Follow on LinkedIn', 'Studio updates and intelligence', 'https://linkedin.com/company/squargraph'],
        ].map(([icon, title, sub, href]) => (
          <Pressable key={title} onPress={() => Linking.openURL(href)} style={styles.contactRow}><View style={styles.iconBox}><Feather name={icon} size={20} color={C.olive} /></View><View style={{ flex: 1 }}><Text style={styles.contactTitle}>{title}</Text><Text style={styles.contactSub}>{sub}</Text></View><Feather name="arrow-up-right" size={18} color={C.oliveMid} /></Pressable>
        ))}
      </View>
      <Text style={styles.privacyNote}>Your message is only passed to WhatsApp when you tap “Continue on WhatsApp.”</Text>
    </ScrollView>
  );
}

const tabs = [
  ['home', 'Home', 'home'],
  ['services', 'Services', 'grid'],
  ['projects', 'Projects', 'folder'],
  ['contact', 'Contact', 'message-circle'],
];

export default function App() {
  const [tab, setTab] = useState('home');
  const { width } = useWindowDimensions();
  const desktop = Platform.OS === 'web' && width >= 960;
  const [iconsReady, setIconsReady] = useState(Platform.OS === 'web');
  useEffect(() => {
    if (Platform.OS === 'web') return;
    FeatherIcon.loadFont().then(() => setIconsReady(true)).catch(() => setIconsReady(true));
  }, []);
  const screens = { home: <Home setTab={setTab} />, services: <Services />, projects: <Projects />, contact: <Contact /> };
  if (!iconsReady) return <SafeAreaView style={styles.app} />;
  if (desktop) {
    return (
      <SafeAreaView style={styles.desktopApp}>
        <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
        <View style={styles.desktopSidebar}>
          <View style={styles.desktopLogoWrap}><BrandMark /></View>
          <View style={styles.desktopNav}>
            {tabs.map(([key, label, icon]) => {
              const active = tab === key;
              return (
                <Pressable key={key} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => setTab(key)} style={[styles.desktopNavItem, active && styles.desktopNavItemActive]}>
                  <Feather name={icon} size={18} color={active ? C.white : C.secondary} />
                  <Text style={[styles.desktopNavLabel, active && { color: C.white }]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.desktopSidebarBottom}>
            <Text style={styles.desktopSidebarKicker}>NEED DIRECTION?</Text>
            <Text style={styles.desktopSidebarCopy}>Turn an unclear requirement into a connected starting point.</Text>
            <Pressable onPress={() => open('project-direction/')} style={styles.desktopProjectButton}><Text style={styles.desktopProjectButtonText}>Start a project</Text><Feather name="arrow-up-right" size={16} color={C.white} /></Pressable>
          </View>
        </View>
        <View style={styles.desktopMain}>
          <View style={styles.desktopTopbar}>
            <View><Text style={styles.desktopContext}>SQUARGRAPH CLIENT APP</Text><Text style={styles.desktopPageName}>{tabs.find(([key]) => key === tab)?.[1]}</Text></View>
            <View style={styles.desktopTopActions}>
              <Pressable onPress={() => Linking.openURL('https://os.squargraph.com/app/dashboard')} style={styles.desktopTextAction}><Feather name="folder" size={17} color={C.olive} /><Text style={styles.desktopTextActionLabel}>Secure dashboard</Text></Pressable>
              <Pressable accessibilityLabel="Open SQUARGRAPH website" onPress={() => open()} style={styles.headerIcon}><Feather name="globe" size={19} color={C.ink} /></Pressable>
            </View>
          </View>
          <View style={styles.desktopContent}>{screens[tab]}</View>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.app}>
      <StatusBar barStyle="dark-content" backgroundColor={C.offWhite} />
      <View style={styles.header}><BrandMark /><Pressable accessibilityLabel="Open SQUARGRAPH website" onPress={() => open()} style={styles.headerIcon}><Feather name="globe" size={19} color={C.ink} /></Pressable></View>
      <View style={styles.content}>{screens[tab]}</View>
      <View style={styles.tabBar}>{tabs.map(([key, label, icon]) => { const active = tab === key; return <Pressable accessibilityRole="tab" accessibilityState={{ selected: active }} key={key} onPress={() => setTab(key)} style={styles.tab}><Feather name={icon} size={20} color={active ? C.olive : '#8B867F'} /><Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>{active && <View style={styles.tabIndicator} />}</Pressable>; })}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.offWhite },
  desktopApp: { flex: 1, flexDirection: 'row', backgroundColor: C.offWhite },
  desktopSidebar: { width: 252, padding: 22, backgroundColor: C.white, borderRightWidth: 1, borderColor: C.border },
  desktopLogoWrap: { height: 60, justifyContent: 'center', marginBottom: 26 },
  desktopNav: { gap: 7 },
  desktopNavItem: { minHeight: 48, paddingHorizontal: 14, borderRadius: 13, flexDirection: 'row', alignItems: 'center', gap: 12 },
  desktopNavItemActive: { backgroundColor: C.olive },
  desktopNavLabel: { color: C.secondary, fontSize: 14, fontWeight: '700' },
  desktopSidebarBottom: { marginTop: 'auto', padding: 17, borderRadius: 18, backgroundColor: C.oliveLight },
  desktopSidebarKicker: { color: C.oliveMid, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  desktopSidebarCopy: { color: C.secondary, fontSize: 12, lineHeight: 18, marginTop: 8, marginBottom: 15 },
  desktopProjectButton: { minHeight: 42, paddingHorizontal: 13, borderRadius: 11, backgroundColor: C.olive, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  desktopProjectButtonText: { color: C.white, fontSize: 12, fontWeight: '800' },
  desktopMain: { flex: 1, minWidth: 0 },
  desktopTopbar: { height: 82, paddingHorizontal: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.offWhite },
  desktopContext: { color: C.muted, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  desktopPageName: { color: C.ink, fontSize: 20, fontWeight: '700', marginTop: 3 },
  desktopTopActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  desktopTextAction: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.white },
  desktopTextActionLabel: { color: C.ink, fontSize: 12, fontWeight: '700' },
  desktopContent: { flex: 1, maxWidth: 1440, width: '100%', alignSelf: 'center' },
  content: { flex: 1 },
  header: { height: 66, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.border, backgroundColor: C.offWhite },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  originalLogo: { width: 184, height: 28 },
  brandSquare: { width: 30, height: 30, borderRadius: 8, backgroundColor: C.olive, alignItems: 'center', justifyContent: 'center' },
  brandSquareInverse: { backgroundColor: C.white },
  brandGlyph: { color: C.white, fontSize: 15, fontWeight: '800' },
  brandName: { color: C.ink, fontSize: 15, fontWeight: '800', letterSpacing: 1.2 },
  headerIcon: { width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  page: { paddingBottom: 36 },
  hero: { margin: 12, padding: 24, paddingTop: 34, borderRadius: 26, overflow: 'hidden' },
  pill: { alignSelf: 'flex-start', borderRadius: 999, backgroundColor: C.oliveLight, paddingHorizontal: 11, paddingVertical: 6 },
  pillDark: { backgroundColor: 'rgba(255,255,255,.13)', borderWidth: 1, borderColor: 'rgba(255,255,255,.17)' },
  pillText: { color: C.olive, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  heroTitle: { color: C.white, fontSize: 38, lineHeight: 43, letterSpacing: -1.4, fontWeight: '600', marginTop: 24, maxWidth: 650 },
  heroCopy: { color: '#DDE2D9', fontSize: 16, lineHeight: 25, marginTop: 18, maxWidth: 620 },
  heroActions: { marginTop: 28, gap: 12 },
  heroTextButton: { minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroTextButtonLabel: { color: C.white, fontWeight: '700', fontSize: 14 },
  button: { minHeight: 50, backgroundColor: C.olive, borderRadius: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonSecondary: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  buttonText: { color: C.white, fontSize: 14, fontWeight: '800' },
  signalGrid: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,.17)', marginTop: 30, paddingTop: 20, flexDirection: 'row' },
  signal: { flex: 1 }, signalN: { color: '#AAB5A4', fontSize: 10, marginBottom: 6 }, signalT: { color: C.white, fontWeight: '600', fontSize: 13 },
  section: { paddingHorizontal: 20, paddingTop: 36 },
  softSection: { marginTop: 38, paddingBottom: 30, backgroundColor: C.warm },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 22 },
  eyebrow: { color: C.oliveMid, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 9 },
  sectionTitle: { color: C.ink, fontSize: 28, lineHeight: 34, letterSpacing: -.6, fontWeight: '600' },
  textLink: { color: C.olive, fontWeight: '700', paddingBottom: 4 },
  horizontalCards: { gap: 14, paddingRight: 20 },
  engagementCard: { width: 280, minHeight: 250, padding: 20, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' }, cardNumber: { color: C.oliveMid, fontSize: 12, fontWeight: '700' },
  cardTitle: { color: C.ink, fontSize: 22, lineHeight: 27, fontWeight: '600', marginTop: 34 }, cardCopy: { color: C.secondary, fontSize: 14, lineHeight: 21, marginTop: 10, flex: 1 }, cardMeta: { color: C.olive, fontSize: 10, letterSpacing: 1, fontWeight: '800', marginTop: 20 },
  featureList: { gap: 18, marginBottom: 24 }, feature: { flexDirection: 'row', gap: 14 },
  iconBox: { width: 42, height: 42, borderRadius: 13, backgroundColor: C.oliveLight, alignItems: 'center', justifyContent: 'center' },
  featureTitle: { color: C.ink, fontSize: 15, fontWeight: '700', marginBottom: 4 }, featureCopy: { color: C.secondary, fontSize: 13, lineHeight: 19 },
  pageIntro: { paddingHorizontal: 20, paddingTop: 34, paddingBottom: 28 },
  pageTitle: { color: C.ink, fontSize: 35, lineHeight: 41, letterSpacing: -1.1, fontWeight: '600', maxWidth: 680 },
  pageLead: { color: C.secondary, fontSize: 15, lineHeight: 23, marginTop: 15, maxWidth: 620 },
  capGrid: { paddingHorizontal: 20, gap: 12 }, capGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  capCard: { padding: 20, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  capTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, capNumber: { color: C.muted, fontSize: 11, fontWeight: '700' },
  capTitle: { color: C.ink, fontSize: 21, fontWeight: '600', marginTop: 22 }, capCopy: { color: C.secondary, fontSize: 14, lineHeight: 21, marginVertical: 9 },
  engagementRow: { minHeight: 102, flexDirection: 'row', gap: 14, alignItems: 'center', borderTopWidth: 1, borderColor: C.border, paddingVertical: 18 },
  rowNumber: { color: C.oliveMid, fontSize: 11, fontWeight: '700' }, rowTitle: { color: C.ink, fontSize: 16, fontWeight: '700' }, rowCopy: { color: C.secondary, fontSize: 12, lineHeight: 18, marginTop: 5 },
  lookupCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  inputLabel: { color: C.oliveMid, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9 },
  inputRow: { flexDirection: 'row', gap: 10 }, input: { flex: 1, minHeight: 50, borderRadius: 13, borderWidth: 1, borderColor: C.border, paddingHorizontal: 15, color: C.ink, fontSize: 15, fontWeight: '600', backgroundColor: C.offWhite },
  lookupButton: { width: 50, height: 50, borderRadius: 13, backgroundColor: C.olive, alignItems: 'center', justifyContent: 'center' },
  projectCard: { margin: 20, padding: 22, borderRadius: 22, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  projectHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }, projectLabel: { color: C.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 }, projectTitle: { color: C.ink, fontSize: 20, fontWeight: '700', marginTop: 4 },
  timeline: { marginVertical: 28 }, timelineRow: { flexDirection: 'row', gap: 14, minHeight: 60 }, timelineDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.border, alignItems: 'center', justifyContent: 'center' }, timelineDotActive: { backgroundColor: C.olive }, timelineTitle: { color: C.ink, fontSize: 14, fontWeight: '700', marginTop: 3 }, timelineNote: { color: C.oliveMid, fontSize: 12, marginTop: 5 },
  emptyState: { margin: 20, padding: 34, alignItems: 'center', borderRadius: 22, borderWidth: 1, borderStyle: 'dashed', borderColor: '#C9C6C1' }, emptyIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: C.oliveLight, alignItems: 'center', justifyContent: 'center' }, emptyTitle: { color: C.ink, fontSize: 19, fontWeight: '700', marginTop: 18 }, emptyCopy: { color: C.secondary, textAlign: 'center', lineHeight: 21, fontSize: 13, marginTop: 8, maxWidth: 430 },
  ctaCard: { margin: 20, marginTop: 8, padding: 24, borderRadius: 22, backgroundColor: C.oliveLight }, ctaTitle: { color: C.ink, fontSize: 22, fontWeight: '700' }, ctaCopy: { color: C.secondary, fontSize: 14, lineHeight: 21, marginVertical: 12 },
  contactCard: { marginHorizontal: 20, padding: 20, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border },
  textArea: { minHeight: 135, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.offWhite, color: C.ink, padding: 15, fontSize: 14, lineHeight: 21, textAlignVertical: 'top', marginBottom: 14 },
  contactLinks: { marginHorizontal: 20, marginTop: 18, borderRadius: 20, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 13, minHeight: 76, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: C.border }, contactTitle: { color: C.ink, fontSize: 14, fontWeight: '700' }, contactSub: { color: C.muted, fontSize: 12, marginTop: 3 }, privacyNote: { color: C.muted, fontSize: 11, lineHeight: 17, marginHorizontal: 24, marginTop: 14, textAlign: 'center' },
  tabBar: { minHeight: Platform.OS === 'ios' ? 78 : 68, paddingBottom: Platform.OS === 'ios' ? 13 : 5, flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderColor: C.border, backgroundColor: C.white },
  tab: { flex: 1, height: 58, alignItems: 'center', justifyContent: 'center', gap: 4 }, tabLabel: { color: '#8B867F', fontSize: 10, fontWeight: '600' }, tabLabelActive: { color: C.olive, fontWeight: '800' }, tabIndicator: { position: 'absolute', top: 0, width: 22, height: 2, borderRadius: 1, backgroundColor: C.olive },
});
