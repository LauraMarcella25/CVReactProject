import { useEffect, useRef } from 'react';
import {
  Animated, Easing,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TimelineItem from '../components/TimelineItem';

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
};

const EDUCATION_DATA = [
  {
    id: 1,
    school: 'Universitas Bina Nusantara',
    major: 'Computer Science',
    year: '2024 – Present',
    description:
      'Computer Science at BINUS University focuses on developing strong foundations in programming, algorithms, and software engineering, while equipping students with practical skills in areas such as artificial intelligence and data science to build real-world technology solutions.',
  },
  {
    id: 2,
    school: 'SMA Kr. Petra 4',
    major: 'IPA',
    year: '2021 – 2024',
    description:
      'The Science (IPA) program at SMA Kristen Petra 4 builds strong foundations in mathematics and natural sciences while developing analytical thinking and problem-solving skills.',
  },
];

// ─── Floating background shape ─────────────────────────────
function FloatingShape({ style, delay = 0 }) {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 3200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bgShape,
        style,
        { transform: [{ translateY: floatAnim }] },
      ]}
    />
  );
}

export default function EducationScreen() {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-25)).current;
  const headerScale = useRef(new Animated.Value(0.92)).current;
  const quoteFade = useRef(new Animated.Value(0)).current;
  const quoteSlide = useRef(new Animated.Value(20)).current;
  const timelineGlow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header entrance
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.3)),
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 50,
      }),
    ]).start();

    // Quote entrance (delayed)
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(quoteFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(quoteSlide, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]),
    ]).start();

    // Timeline glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(timelineGlow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(timelineGlow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Background shapes */}
        <FloatingShape
          style={{
            top: -30,
            right: -70,
            width: 200,
            height: 200,
            borderRadius: 100,
            opacity: 0.05,
          }}
          delay={0}
        />
        <FloatingShape
          style={{
            top: 300,
            left: -60,
            width: 160,
            height: 160,
            borderRadius: 80,
            opacity: 0.04,
          }}
          delay={600}
        />
        <FloatingShape
          style={{
            top: 600,
            right: -40,
            width: 120,
            height: 120,
            borderRadius: 60,
            opacity: 0.06,
          }}
          delay={1200}
        />
        {/* Gold accent dots */}
        <FloatingShape
          style={{
            top: 100,
            right: 30,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.gold,
            opacity: 0.2,
          }}
          delay={300}
        />


        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerFade,
              transform: [
                { translateY: headerSlide },
                { scale: headerScale },
              ],
            },
          ]}
        >
          <View style={styles.headerAccent} />
          <View style={styles.headerTextWrap}>
            <Text style={styles.screenTitle}>Education</Text>
            <Text style={styles.screenSubtitle}>Academic Journey</Text>
          </View>
          <View style={styles.goldBarAbsolute} />
        </Animated.View>


        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineLabelRow}>
            <View style={styles.timelineLabelLine} />
            <Text style={styles.timelineLabel}>TIMELINE</Text>
            <View style={styles.timelineLabelLine} />
          </View>
          {EDUCATION_DATA.map((item, index) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={index}
              isLast={index === EDUCATION_DATA.length - 1}
            />
          ))}
        </View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 76,
    paddingBottom: 20,
    position: 'relative',
    alignItems: 'center',
  },
  bgShape: {
    position: 'absolute',
    backgroundColor: COLORS.primary,
    zIndex: 0,
  },

  // ─── Header ─────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 22,
    position: 'relative',
    zIndex: 1,
    maxWidth: 850,
    width: '100%',
  },
  headerAccent: {
    width: 4,
    height: 44,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    marginRight: 14,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  headerTextWrap: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.gold,
    fontWeight: '700',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  goldBarAbsolute: {
    position: 'absolute',
    bottom: -8,
    left: 42,
    width: 40,
    height: 3,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },


  // ─── Timeline ───────────────────────────────────────────
  timelineContainer: {
    paddingLeft: 24,
    paddingRight: 20,
    zIndex: 1,
    maxWidth: 850,
    width: '100%',
    alignSelf: 'center',
  },
  timelineLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    paddingLeft: 46,
    paddingRight: 10,
  },
  timelineLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.3)',
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.gold,
    letterSpacing: 3,
    marginHorizontal: 12,
  },
});
