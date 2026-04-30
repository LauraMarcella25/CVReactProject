import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
};

export default function SkillBar({ skill, index }) {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 150;

    // Entrance
    Animated.sequence([
      Animated.delay(delay + 300),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 500, useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0, duration: 500, useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
      ]),
    ]).start();

    // Fill bar
    Animated.sequence([
      Animated.delay(delay + 600),
      Animated.timing(fillAnim, {
        toValue: skill.level / 100,
        duration: 1200,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1, duration: 1800, useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0, duration: 1800, useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const barWidth = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const levelColor =
    skill.level >= 85 ? COLORS.gold :
    skill.level >= 75 ? '#C49A2A' : '#A07020';

  const iconMap = {
    'React': 'Re',
    'React Native': 'RN',
    'Laravel': 'Lv',
    'Python': 'Py',
    'UI/UX': 'UX',
    'JavaScript': 'JS',
    'PHP': 'HP',
    'CSS': 'CS',
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Glass card */}
      <View style={styles.glassCard}>
        {/* Glass overlay */}
        <View style={styles.glassOverlay} />

        {/* Top row: icon + name + percentage */}
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>{iconMap[skill.name] || '--'}</Text>
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.skillName}>{skill.name}</Text>
            <Text style={styles.skillExp}>{skill.experience}</Text>
          </View>
          <View style={styles.percentWrap}>
            <Animated.Text
              style={[styles.percentText, { color: levelColor }]}
            >
              {skill.level}%
            </Animated.Text>
            <Text style={styles.yearsText}>{skill.years}y exp</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={styles.trackContainer}>
          <View style={styles.track}>
            <Animated.View
              style={[
                styles.fill,
                { width: barWidth },
              ]}
            >
              {/* Inner gradient effect */}
              <View style={styles.fillGradient} />
              {/* Shine effect */}
              <View style={styles.fillShine} />
            </Animated.View>

            {/* Gold knob */}
            <Animated.View
              style={[
                styles.knob,
                {
                  left: barWidth,
                  shadowOpacity: glowOpacity,
                },
              ]}
            />
          </View>

          {/* Track markers */}
          <View style={styles.markers}>
            {[25, 50, 75].map(m => (
              <View key={m} style={[styles.marker, { left: `${m}%` }]} />
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 14,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  glassCard: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(128,0,0,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
    shadowColor: '#800000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  glassOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    backgroundColor: 'rgba(212,175,55,0.04)',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(128,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },
  icon: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  nameCol: {
    flex: 1,
  },
  skillName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#800000',
    letterSpacing: 0.3,
  },
  skillExp: {
    fontSize: 13,
    color: '#D4AF37',
    fontWeight: '600',
    marginTop: 1,
  },
  percentWrap: {
    alignItems: 'flex-end',
  },
  percentText: {
    fontSize: 24,
    fontWeight: '900',
  },
  yearsText: {
    fontSize: 12,
    color: '#8B6060',
    fontWeight: '600',
    marginTop: 1,
  },
  trackContainer: {
    position: 'relative',
  },
  track: {
    height: 12,
    backgroundColor: 'rgba(128,0,0,0.08)',
    borderRadius: 5,
    overflow: 'visible',
    position: 'relative',
    borderWidth: 0.5,
    borderColor: 'rgba(128,0,0,0.1)',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: '#800000',
    overflow: 'hidden',
    position: 'relative',
  },
  fillGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: 'rgba(212,175,55,0.35)',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  fillShine: {
    position: 'absolute',
    top: 1,
    left: 4,
    right: 4,
    height: 3,
    backgroundColor: 'rgba(255,245,225,0.2)',
    borderRadius: 2,
  },
  knob: {
    position: 'absolute',
    top: -3,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4AF37',
    marginLeft: -8,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFF5E1',
  },
  markers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 10,
  },
  marker: {
    position: 'absolute',
    top: 2,
    width: 1,
    height: 6,
    backgroundColor: 'rgba(128,0,0,0.06)',
    borderRadius: 0.5,
  },
});
