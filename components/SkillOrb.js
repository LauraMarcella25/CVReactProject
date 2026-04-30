import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Easing,
  Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
  goldLight: 'rgba(212,175,55,0.3)',
};

// ─── Floating particle dot ─────────────────────────────────
function Particle({ index, count, parentSize }) {
  const angle = (index / count) * 2 * Math.PI;
  const baseRadius = parentSize / 2 + 14;
  const offsetAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const size = 3 + Math.random() * 3;

  useEffect(() => {
    const delay = (index / count) * 2400;

    // Floating offset
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(offsetAnim, {
          toValue: 1,
          duration: 2400 + index * 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(offsetAnim, {
          toValue: 0,
          duration: 2400 + index * 300,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Twinkle
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.delay(1200),
        Animated.timing(opacityAnim, {
          toValue: 0.15,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const floatY = offsetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const cx = Math.cos(angle) * baseRadius;
  const cy = Math.sin(angle) * baseRadius;

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity: opacityAnim,
          transform: [
            { translateX: cx },
            { translateY: Animated.add(cy, floatY) },
          ],
        },
      ]}
    />
  );
}

// ─── Ring shimmer effect ────────────────────────────────────
function OrbRing({ size, glowAnim }) {
  const ringOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.35],
  });
  const ringScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orbRing,
        {
          width: size + 20,
          height: size + 20,
          borderRadius: (size + 20) / 2,
          opacity: ringOpacity,
          transform: [{ scale: ringScale }],
        },
      ]}
    />
  );
}

// ─── Main SkillOrb ──────────────────────────────────────────
export default function SkillOrb({ skill, index }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.85)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  const ORB_SIZE = 88 + (skill.level / 100) * 18;
  const PARTICLE_COUNT = 6;

  useEffect(() => {
    const delay = index * 200;

    // Entrance pop
    Animated.sequence([
      Animated.delay(delay + 300),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 80,
      }),
    ]).start();

    // Floating – each orb has unique rhythm
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2200 + index * 200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2200 + index * 200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();

    // Glow pulse – intensity based on skill level
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1600 + (100 - skill.level) * 10,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1600 + (100 - skill.level) * 10,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const openModal = () => {
    setModalVisible(true);

    // Orb press spring
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.35,
        useNativeDriver: true,
        friction: 3,
        tension: 200,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }),
    ]).start();

    // Modal entrance
    Animated.parallel([
      Animated.spring(modalScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
        tension: 60,
      }),
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animated progress bar
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: skill.level / 100,
      duration: 1200,
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic),
    }).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(modalScale, {
        toValue: 0.85,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      progressAnim.setValue(0);
    });
  };

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [6, 20],
  });
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.9],
  });

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const levelColor =
    skill.level >= 85
      ? COLORS.gold
      : skill.level >= 75
      ? '#C49A2A'
      : '#A07020';

  return (
    <View style={styles.orbWrapper}>
      <TouchableWithoutFeedback onPress={openModal}>
        <Animated.View
          style={[
            styles.orbOuter,
            {
              width: ORB_SIZE,
              height: ORB_SIZE,
              borderRadius: ORB_SIZE / 2,
              transform: [
                { translateY: floatAnim },
                { scale: scaleAnim },
              ],
              shadowColor: COLORS.gold,
              shadowRadius: glowRadius,
              shadowOpacity: glowOpacity,
              shadowOffset: { width: 0, height: 0 },
            },
          ]}
        >
          {/* Outer ring shimmer */}
          <OrbRing size={ORB_SIZE} glowAnim={glowAnim} />

          {/* Orb body */}
          <View
            style={[
              styles.orbInner,
              { borderRadius: ORB_SIZE / 2 },
            ]}
          >
            {/* Highlight gloss */}
            <View style={styles.orbHighlight} />
            {/* Second subtle highlight */}
            <View style={styles.orbHighlight2} />

            <Text style={styles.orbName}>{skill.name}</Text>
            <Text style={styles.orbLevel}>{skill.level}%</Text>
          </View>

          {/* Particles */}
          <View
            pointerEvents="none"
            style={[
              styles.particleContainer,
              {
                width: ORB_SIZE + 44,
                height: ORB_SIZE + 44,
                borderRadius: (ORB_SIZE + 44) / 2,
              },
            ]}
          >
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
              <Particle
                key={i}
                index={i}
                count={PARTICLE_COUNT}
                parentSize={ORB_SIZE}
              />
            ))}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>

      {/* Label */}
      <Text style={styles.orbLabel}>{skill.experience}</Text>

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Animated.View
            style={[
              styles.modalCard,
              {
                opacity: modalOpacity,
                transform: [{ scale: modalScale }],
              },
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {/* Glassmorphism top accent */}
              <View style={styles.modalGlassTop} />

              {/* Header */}
              <View style={styles.modalHeader}>
                <View
                  style={[
                    styles.modalOrbSmall,
                    { width: 60, height: 60, borderRadius: 30 },
                  ]}
                >
                  <View style={styles.modalOrbHighlight} />
                  <Text style={styles.modalOrbLetter}>
                    {skill.name[0]}
                  </Text>
                </View>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>{skill.name}</Text>
                  <Text style={[styles.modalExp, { color: levelColor }]}>
                    {skill.experience}
                  </Text>
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{skill.level}%</Text>
                  <Text style={styles.statLabel}>Proficiency</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{skill.years}y</Text>
                  <Text style={styles.statLabel}>Experience</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: levelColor }]}>
                    {skill.level >= 85 ? '★★★' : skill.level >= 75 ? '★★' : '★'}
                  </Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Skill Level</Text>
                  <Text style={[styles.progressPct, { color: levelColor }]}>
                    {skill.level}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[
                      styles.progressFill,
                      {
                        width: barWidth,
                        backgroundColor: COLORS.primary,
                      },
                    ]}
                  />
                  {/* Gold knob */}
                  <Animated.View
                    style={[
                      styles.progressKnob,
                      {
                        left: barWidth,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  orbWrapper: {
    alignItems: 'center',
    margin: 14,
    marginBottom: 20,
  },
  orbOuter: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryDark,
    elevation: 14,
    overflow: 'visible',
  },
  orbRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  orbInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    overflow: 'hidden',
  },
  orbHighlight: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: '38%',
    height: '28%',
    borderRadius: 50,
    backgroundColor: 'rgba(255,245,225,0.22)',
    transform: [{ rotate: '-25deg' }],
  },
  orbHighlight2: {
    position: 'absolute',
    bottom: 14,
    right: 10,
    width: '22%',
    height: '18%',
    borderRadius: 50,
    backgroundColor: 'rgba(212,175,55,0.12)',
    transform: [{ rotate: '15deg' }],
  },
  orbName: {
    color: COLORS.cream,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  orbLevel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  orbLabel: {
    fontSize: 10,
    color: '#8B6060',
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  particleContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  particle: {
    position: 'absolute',
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },

  // ─── Modal ──────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(64,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.cream,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 24,
    overflow: 'hidden',
  },
  modalGlassTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalOrbSmall: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  modalOrbHighlight: {
    position: 'absolute',
    top: 6,
    left: 8,
    width: 18,
    height: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,245,225,0.2)',
    transform: [{ rotate: '-20deg' }],
  },
  modalOrbLetter: {
    color: COLORS.cream,
    fontSize: 24,
    fontWeight: '900',
  },
  modalHeaderText: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  modalExp: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },
  statRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.creamDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(128,0,0,0.08)',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    color: '#8B6060',
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(128,0,0,0.15)',
    marginHorizontal: 6,
  },
  progressSection: {
    marginBottom: 22,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: '#8B6060',
    fontWeight: '600',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 14,
    backgroundColor: COLORS.creamDark,
    borderRadius: 7,
    overflow: 'visible',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(128,0,0,0.12)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 7,
  },
  progressKnob: {
    position: 'absolute',
    top: -3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.gold,
    marginLeft: -10,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: COLORS.cream,
  },
  closeBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  closeBtnText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
