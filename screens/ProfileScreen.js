import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlowerDecoration from '../components/FlowerDecoration';
import SkillBar from '../components/SkillBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
  dark: '#1A0A0A',
  darkGrad: '#2A0E0E',
};



const SKILLS = [
  { name: 'Machine Learning', level: 90, experience: 'Advanced', years: 1 },
  { name: 'DeepLearning', level: 90, experience: 'Advanced', years: 1 },
  { name: 'Python', level: 90, experience: 'Intermediate', years: 1.5 },
  { name: 'Laravel', level: 85, experience: 'Intermediate', years: 2 },
  { name: 'Go', level: 85, experience: 'Intermediate', years: 1 },
];



// ─── Animated Wave Shape (silk-like flow) ──────────────────
function WaveShape({ style, delay = 0, duration = 8000 }) {
  const drift = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(drift, { toValue: 1, duration, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(drift, { toValue: 0, duration, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay + 500),
        Animated.timing(sway, { toValue: 1, duration: duration * 0.7, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(sway, { toValue: 0, duration: duration * 0.7, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);
  const ty = drift.interpolate({ inputRange: [0, 1], outputRange: [0, -20] });
  const tx = sway.interpolate({ inputRange: [0, 1], outputRange: [0, 15] });
  return <Animated.View style={[styles.waveShape, style, { transform: [{ translateY: ty }, { translateX: tx }] }]} />;
}

// ─── Gold glowing particle ──────────────────────────────────
function GoldParticle({ x, y, size = 4, delay: d = 0 }) {
  const op = useRef(new Animated.Value(0)).current;
  const sc = useRef(new Animated.Value(0.3)).current;
  const fy = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(d),
        Animated.parallel([
          Animated.timing(op, { toValue: 0.9, duration: 800, useNativeDriver: true }),
          Animated.spring(sc, { toValue: 1, useNativeDriver: true, friction: 3 }),
        ]),
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(op, { toValue: 0, duration: 1200, useNativeDriver: true }),
          Animated.timing(sc, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.delay(1200 + (d % 800)),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.delay(d),
        Animated.timing(fy, { toValue: -12, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(fy, { toValue: 0, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);
  return (
    <Animated.View style={[styles.goldParticle, { left: x, top: y, opacity: op, transform: [{ scale: sc }, { translateY: fy }] }]}>
      <View style={[styles.goldParticleCore, { width: size, height: size, borderRadius: size / 2 }]} />
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [gravityOn, setGravityOn] = useState(true);

  const photoFloat = useRef(new Animated.Value(0)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;
  const skillsFade = useRef(new Animated.Value(0)).current;
  const statsFade = useRef(new Animated.Value(0)).current;
  const navFade = useRef(new Animated.Value(0)).current;
  const btnScale1 = useRef(new Animated.Value(1)).current;
  const btnScale2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(photoFloat, { toValue: -16, duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(photoFloat, { toValue: 0, duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 2200, useNativeDriver: false }),
        Animated.timing(glowPulse, { toValue: 0, duration: 2200, useNativeDriver: false }),
      ])
    ).start();
    Animated.sequence([
      Animated.timing(navFade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideIn, { toValue: 0, duration: 800, useNativeDriver: true, easing: Easing.out(Easing.back(1.3)) }),
      ]),
      Animated.timing(skillsFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(statsFade, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const glowRadius = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [10, 30] });
  const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const ringScale = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });

  const pressBtn = (anim) => {
    Animated.sequence([
      Animated.spring(anim, { toValue: 0.93, useNativeDriver: true, friction: 5 }),
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ════════ HERO SECTION ════════ */}
        <View style={styles.heroSection}>
          {/* Background layers */}
          <View style={styles.heroBg} />
          <View style={styles.heroGradOverlay} />

          {/* Abstract wave shapes (silk-like) */}
          <WaveShape style={{ top: '10%', left: '-15%', width: '80%', height: 300, borderRadius: 200, backgroundColor: 'rgba(128,0,0,0.15)', transform: [{ rotate: '-15deg' }] }} delay={0} duration={9000} />
          <WaveShape style={{ top: '30%', right: '-20%', width: '70%', height: 250, borderRadius: 180, backgroundColor: 'rgba(212,175,55,0.06)', transform: [{ rotate: '10deg' }] }} delay={1500} duration={7000} />
          <WaveShape style={{ bottom: '20%', left: '-10%', width: '60%', height: 200, borderRadius: 150, backgroundColor: 'rgba(109,15,31,0.12)', transform: [{ rotate: '25deg' }] }} delay={3000} duration={10000} />
          <WaveShape style={{ top: '5%', right: '-5%', width: '40%', height: 180, borderRadius: 120, backgroundColor: 'rgba(212,175,55,0.04)', transform: [{ rotate: '-8deg' }] }} delay={2000} duration={8500} />

          {/* Gold particles */}
          <GoldParticle x={40} y={60} size={3} delay={0} />
          <GoldParticle x={'15%'} y={'20%'} size={4} delay={600} />
          <GoldParticle x={'70%'} y={'15%'} size={3} delay={1200} />
          <GoldParticle x={'85%'} y={'25%'} size={5} delay={400} />
          <GoldParticle x={'30%'} y={'40%'} size={3} delay={1800} />
          <GoldParticle x={'55%'} y={'10%'} size={4} delay={900} />
          <GoldParticle x={'90%'} y={'50%'} size={3} delay={2200} />
          <GoldParticle x={'10%'} y={'60%'} size={5} delay={1500} />
          <GoldParticle x={'45%'} y={'70%'} size={3} delay={2600} />
          <GoldParticle x={'75%'} y={'65%'} size={4} delay={700} />
          <GoldParticle x={'20%'} y={'75%'} size={3} delay={2000} />
          <GoldParticle x={'60%'} y={'80%'} size={4} delay={1100} />



          {/* ─── Two Column Layout ─── */}
          <Animated.View style={[styles.heroColumns, { opacity: fadeIn, transform: [{ translateY: slideIn }] }]}>
            {/* LEFT: Text content */}
            <View style={styles.heroLeft}>
              {/* Badge */}
              <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>AI & DATA SCIENCE ENTHUSIAST</Text>
              </View>

              {/* Name */}
              <Text style={styles.heroName}>Laura Marcella</Text>
              <Text style={styles.heroNameGold}>Pratama</Text>

              {/* Description */}
              <Text style={styles.heroTagline}>
                Turning data into <Text style={styles.heroTagGold}>insights</Text> and building{' '}
                <Text style={styles.heroTagBold}>intelligent systems</Text> that solve real-world problems.
              </Text>

              {/* Buttons */}
              <View style={styles.heroButtons}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { pressBtn(btnScale1); navigation.navigate('Projects'); }}>
                  <Animated.View style={[styles.btnPrimary, { transform: [{ scale: btnScale1 }] }]}>
                    <Text style={styles.btnPrimaryText}>Explore My Projects</Text>
                    <Text style={styles.btnArrow}> --</Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </View>

            {/* RIGHT: Profile photo */}
            <View style={styles.heroRight}>
              <Animated.View style={[styles.photoWrapper, { transform: [{ translateY: photoFloat }] }]}>
                <Animated.View style={[styles.photoGlowRing, { transform: [{ scale: ringScale }], opacity: glowOpacity }]} />
                <Animated.View style={[styles.photoBorder, { shadowRadius: glowRadius, shadowColor: COLORS.gold, shadowOpacity: 0.8, shadowOffset: { width: 0, height: 0 } }]}>
                  <View style={styles.photoInner}>
                    <Image
                      source={require('../assets/images/profile.png')}
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                  </View>
                </Animated.View>
                <View style={styles.statusRing}><View style={styles.statusRingInner} /></View>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Flowers at bottom */}
          <View style={styles.flowerContainer}>
            <FlowerDecoration height={180} />
          </View>
        </View>


        {/* ════════ LIGHT CONTENT AREA ════════ */}


        {/* Skills Section */}
        <Animated.View style={[styles.skillSection, { opacity: skillsFade }]}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconWrap}>
              <View style={styles.sectionIconDiamond} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Skills</Text>
              <Text style={styles.sectionSubtitle}>My Expertise</Text>
            </View>
          </View>
          {SKILLS.map((skill, index) => (
            <SkillBar key={skill.name} skill={skill} index={index} />
          ))}
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 56, alignItems: 'center' },
  bgShape: { position: 'absolute', backgroundColor: COLORS.primary, zIndex: 0 },



  // ─── Hero Section (Dark) ─────────────────────────────────
  heroSection: {
    minHeight: 550,
    height: '85vh',
    position: 'relative',
    paddingTop: 0,
    paddingBottom: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.dark,
  },
  heroGradOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '60%',
    backgroundColor: COLORS.darkGrad, opacity: 0.5,
  },
  waveShape: { position: 'absolute', zIndex: 1 },
  goldParticle: { position: 'absolute', zIndex: 2 },
  goldParticleCore: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },

  // ─── Hero Columns ────────────────────────────────────────
  heroColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
    zIndex: 3,
    flex: 1,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  heroLeft: {
    flex: 1,
    maxWidth: 520,
    paddingRight: 40,
    justifyContent: 'center',
  },
  heroRight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
  },

  // ─── Badge ───────────────────────────────────────────────
  badge: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,245,225,0.08)',
    borderRadius: 24, paddingHorizontal: 18, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    marginBottom: 16,
  },
  badgeDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: COLORS.gold, marginRight: 8,
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 4,
  },
  badgeText: {
    fontSize: 12, fontWeight: '800', color: COLORS.gold,
    letterSpacing: 2,
  },

  // ─── Name / Tagline ──────────────────────────────────────
  heroName: {
    fontSize: 56, fontWeight: '900', color: COLORS.cream,
    letterSpacing: 1,
  },
  heroNameGold: {
    fontSize: 62, fontWeight: '900', color: COLORS.gold,
    fontStyle: 'italic', marginTop: -6,
  },
  heroTagline: {
    fontSize: 17, color: 'rgba(255,245,225,0.7)',
    lineHeight: 28, marginTop: 20, maxWidth: 500,
  },
  heroTagGold: { color: COLORS.gold, fontWeight: '700' },
  heroTagBold: { fontWeight: '800', color: COLORS.cream },

  // ─── Hero Buttons ────────────────────────────────────────
  heroButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 14,
    flexWrap: 'wrap',
  },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  btnPrimaryText: {
    fontSize: 15, fontWeight: '800', color: COLORS.cream, letterSpacing: 0.3,
  },
  btnArrow: {
    fontSize: 16, color: COLORS.gold, fontWeight: '900',
  },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 13,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },

  btnSecondaryText: {
    fontSize: 15, fontWeight: '700', color: COLORS.cream, letterSpacing: 0.3,
  },

  // ─── Photo ──────────────────────────────────────────────
  photoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoGlowRing: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    borderWidth: 2, borderColor: 'rgba(212,175,55,0.3)',
  },
  photoBorder: {
    width: 170, height: 170, borderRadius: 85,
    backgroundColor: COLORS.gold, padding: 4, elevation: 18,
  },
  photoInner: { flex: 1, borderRadius: 81, overflow: 'hidden' },
  profileImage: { width: '100%', height: '100%', borderRadius: 81 },
  avatarPlaceholder: {
    flex: 1, backgroundColor: COLORS.primaryDark,
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  avatarHighlight: {
    position: 'absolute', top: 10, left: 14,
    width: 30, height: 20, borderRadius: 20,
    backgroundColor: 'rgba(255,245,225,0.12)',
    transform: [{ rotate: '-20deg' }],
  },
  avatarInitials: {
    fontSize: 36, fontWeight: '900', color: COLORS.gold, letterSpacing: 3,
  },
  statusRing: {
    position: 'absolute', bottom: 6, right: 4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#4CAF50', borderWidth: 3,
    borderColor: COLORS.dark,
    shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 6,
    justifyContent: 'center', alignItems: 'center',
  },
  statusRingInner: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#81C784' },

  // ─── Flower container ────────────────────────────────────
  flowerContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
  },

  // ─── Bio ────────────────────────────────────────────────
  bioSection: {
    alignItems: 'center', paddingHorizontal: 28,
    marginTop: 20, marginBottom: 20,
    maxWidth: 800, alignSelf: 'center', width: '100%',
  },
  bioTagsRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
  },
  bioTag: {
    backgroundColor: 'rgba(128,0,0,0.06)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: 'rgba(128,0,0,0.12)',
    marginRight: 8, marginBottom: 6,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}),
  },
  bioTagText: {
    color: COLORS.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.4,
  },

  // ─── Divider ────────────────────────────────────────────
  divider: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 26,
    maxWidth: 800, alignSelf: 'center', width: '100%',
    paddingHorizontal: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(128,0,0,0.12)' },
  dividerDiamond: {
    width: 10, height: 10, backgroundColor: COLORS.gold,
    marginHorizontal: 14, transform: [{ rotate: '45deg' }],
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 4,
  },

  // ─── Skills ─────────────────────────────────────────────
  skillSection: { marginTop: 40, marginBottom: 24, maxWidth: 800, alignSelf: 'center', width: '100%' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 12,
  },
  sectionIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: 'rgba(128,0,0,0.08)',
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  sectionIconDiamond: {
    width: 12, height: 12, backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
  },
  sectionTitle: {
    fontSize: 21, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12, color: COLORS.gold, fontWeight: '700', marginTop: 1,
  },

  // ─── Stats ──────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginTop: 12,
    maxWidth: 800, alignSelf: 'center', width: '100%',
    paddingHorizontal: 16,
  },
  statCard: {
    flex: 1, borderRadius: 20, padding: 20, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    backgroundColor: 'rgba(128,0,0,0.04)',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
    marginHorizontal: 5, overflow: 'hidden',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}),
  },
  statGlass: {
    position: 'absolute', top: 0, right: 0,
    width: '50%', height: '100%',
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderTopRightRadius: 18, borderBottomRightRadius: 18,
  },

  statValue: { fontSize: 28, fontWeight: '900', color: COLORS.primary },
  statLabel: {
    fontSize: 13, color: '#8B6060', fontWeight: '700',
    marginTop: 3, letterSpacing: 0.3,
  },
});