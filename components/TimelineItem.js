import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing, Platform,
} from 'react-native';

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
};

export default function TimelineItem({ item, index, isLast }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const lineHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 300;

    // Card entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        delay,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.3)),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        friction: 5,
        tension: 60,
      }),
    ]).start();

    // Glow pulse on dot
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Timeline line grow effect
    if (!isLast) {
      Animated.timing(lineHeight, {
        toValue: 1,
        duration: 600,
        delay: delay + 400,
        useNativeDriver: false,
        easing: Easing.out(Easing.quad),
      }).start();
    }
  }, []);

  const dotGlow = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 16],
  });
  const dotGlowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });
  const dotScale = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.15, 1],
  });

  // Education-specific icons
  const icons = ['Ed', 'CS', 'Ac', 'Pr'];
  const icon = icons[index % icons.length];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {/* Timeline line + dot */}
      <View style={styles.timelineCol}>
        <Animated.View
          style={[
            styles.dot,
            {
              shadowRadius: dotGlow,
              shadowOpacity: dotGlowOpacity,
              transform: [{ scale: dotScale }],
            },
          ]}
        >
          <View style={styles.dotInner} />
        </Animated.View>
        {!isLast && (
          <Animated.View
            style={[
              styles.line,
              {
                opacity: lineHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.4],
                }),
              },
            ]}
          />
        )}
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Gold accent top line */}
        <View style={styles.cardGoldLine} />

        {/* Glass header section */}
        <View style={styles.cardHeaderBg} />

        {/* Icon + Year row */}
        <View style={styles.cardTopRow}>
          <View style={styles.iconWrap}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View style={styles.yearBadge}>
            <Text style={styles.yearText}>{item.year}</Text>
          </View>
        </View>

        <Text style={styles.school}>{item.school}</Text>
        <View style={styles.majorRow}>
          <View style={styles.majorDot} />
          <Text style={styles.major}>{item.major}</Text>
        </View>
        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 22,
    alignItems: 'flex-start',
  },
  timelineCol: {
    alignItems: 'center',
    width: 34,
    marginRight: 14,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    borderWidth: 2.5,
    borderColor: COLORS.gold,
    zIndex: 10,
  },
  dotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  line: {
    width: 2.5,
    flex: 1,
    minHeight: 40,
    backgroundColor: COLORS.primary,
    marginTop: 4,
    borderRadius: 1.25,
  },
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,245,225,0.8)',
    borderRadius: 20,
    padding: 20,
    paddingTop: 18,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
  },
  cardGoldLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardHeaderBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 2,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(128,0,0,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  yearBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  yearText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  school: {
    fontSize: 19,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  majorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  majorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.gold,
    marginRight: 6,
  },
  major: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.gold,
  },
  description: {
    fontSize: 13,
    color: '#7A5050',
    lineHeight: 21,
    fontWeight: '400',
  },
});
