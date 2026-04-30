import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const { width: SW } = Dimensions.get('window');

const GOLD = '#D4AF37';
const CREAM = 'rgba(255,245,225,0.7)';
const WARM = 'rgba(255,250,240,0.6)';
const GOLD_L = 'rgba(212,175,55,0.5)';

function Stem({ x, h, delay, type, color }) {
  const grow = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const bloom = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(grow, { toValue: 1, duration: 1200, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();
    Animated.sequence([
      Animated.delay(delay + 800),
      Animated.spring(bloom, { toValue: 1, useNativeDriver: true, friction: 4, tension: 40 }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(sway, { toValue: 1, duration: 2800 + (delay % 1000), useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(sway, { toValue: -1, duration: 2800 + (delay % 1000), useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(sway, { toValue: 0, duration: 1400, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);

  const rot = sway.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-3deg', '0deg', '3deg'] });
  const w = type === 'thin' ? 1.2 : 1.8;

  const renderHead = () => {
    if (type === 'dandelion') {
      return (
        <View style={s.dHead}>
          <View style={[s.dCenter, { backgroundColor: color }]} />
          {[0,45,90,135,180,225,270,315].map(a => (
            <View key={a} style={[s.dLine, { transform: [{ rotate: `${a}deg` }] }]}>
              <View style={[s.dLineI, { backgroundColor: color }]} />
              <View style={[s.dDot, { backgroundColor: color }]} />
            </View>
          ))}
        </View>
      );
    }
    if (type === 'wildflower') {
      return (
        <View style={s.wHead}>
          {[0,72,144,216,288].map(a => (
            <View key={a} style={[s.petal, { backgroundColor: color, opacity: 0.45, transform: [{ rotate: `${a}deg` }, { translateY: -6 }] }]} />
          ))}
          <View style={[s.wCenter, { backgroundColor: color }]} />
        </View>
      );
    }
    if (type === 'bud') {
      return (
        <View style={s.budC}>
          <View style={[s.budO, { backgroundColor: color, opacity: 0.5 }]} />
          <View style={[s.budO2, { backgroundColor: color, opacity: 0.3 }]} />
        </View>
      );
    }
    return <View style={[s.dotH, { backgroundColor: color, opacity: type === 'dot' ? 0.6 : 0.4 }]} />;
  };

  return (
    <Animated.View style={[s.stemC, { left: x, height: h, transform: [{ scaleY: grow }, { rotate: rot }] }]}>
      <View style={[s.stemL, { width: w, backgroundColor: color, opacity: 0.4 }]} />
      <Animated.View style={[s.headC, { transform: [{ scale: bloom }] }]}>{renderHead()}</Animated.View>
      {h > 70 && (
        <>
          <View style={[s.leaf, { bottom: h * 0.3, left: -3, transform: [{ rotate: '-35deg' }], backgroundColor: color, opacity: 0.2 }]} />
          <View style={[s.leaf, { bottom: h * 0.5, right: -3, transform: [{ rotate: '35deg' }], backgroundColor: color, opacity: 0.18 }]} />
        </>
      )}
    </Animated.View>
  );
}

function Seed({ dx, dy, delay }) {
  const fy = useRef(new Animated.Value(0)).current;
  const fx = useRef(new Animated.Value(0)).current;
  const op = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(op, { toValue: 0.5, duration: 800, useNativeDriver: true }),
    ]).start();
    Animated.loop(Animated.sequence([
      Animated.delay(delay % 1000),
      Animated.timing(fy, { toValue: -35, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(fy, { toValue: 0, duration: 4000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
    ])).start();
    Animated.loop(Animated.sequence([
      Animated.delay(delay % 800),
      Animated.timing(fx, { toValue: 12, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      Animated.timing(fx, { toValue: -12, duration: 3000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
    ])).start();
  }, []);

  return (
    <Animated.View style={[s.seed, { left: dx, bottom: dy, opacity: op, transform: [{ translateY: fy }, { translateX: fx }] }]}>
      <View style={s.seedB} />
      <View style={s.seedF1} />
      <View style={s.seedF2} />
    </Animated.View>
  );
}

// Generate evenly-spaced flowers across any screen width
function generateFlowers(screenWidth) {
  const types = ['dandelion', 'wildflower', 'bud', 'thin', 'dot', 'dandelion', 'wildflower', 'bud'];
  const colors = [WARM, GOLD, CREAM, GOLD_L, WARM, GOLD, CREAM, GOLD];
  const spacing = 14; // dense spacing
  const count = Math.ceil(screenWidth / spacing) + 2;
  const flowers = [];
  for (let i = 0; i < count; i++) {
    const typeIdx = i % types.length;
    const h = 55 + Math.sin(i * 1.3) * 40 + Math.cos(i * 0.7) * 25;
    flowers.push({
      x: i * spacing + (Math.sin(i * 2.1) * 4),
      h: Math.max(45, Math.min(160, h)),
      d: (i * 70) % 600,
      t: types[typeIdx],
      c: colors[typeIdx],
    });
  }
  return flowers;
}

function generateSeeds(screenWidth) {
  const count = Math.max(8, Math.ceil(screenWidth / 100));
  const seeds = [];
  for (let i = 0; i < count; i++) {
    seeds.push({
      x: (i / count) * screenWidth + Math.sin(i * 3) * 20,
      y: 80 + Math.sin(i * 1.7) * 50,
      d: 800 + i * 300,
    });
  }
  return seeds;
}

export default function FlowerDecoration({ height = 180 }) {
  const flowers = generateFlowers(SW);
  const seeds = generateSeeds(SW);

  return (
    <View style={[s.container, { height }]}>
      <View style={s.ground}>
        <View style={s.gL1} />
        <View style={s.gL2} />
        <View style={s.gL3} />
      </View>
      {flowers.map((f, i) => <Stem key={i} x={f.x} h={f.h} delay={f.d} type={f.t} color={f.c} />)}
      {seeds.map((sd, i) => <Seed key={i} dx={sd.x} dy={sd.y} delay={sd.d} />)}
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: '100%', position: 'relative', overflow: 'visible' },
  ground: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 16 },
  gL1: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: 'rgba(212,175,55,0.15)' },
  gL2: { position: 'absolute', bottom: 5, left: 0, right: 0, height: 1, backgroundColor: 'rgba(212,175,55,0.08)' },
  gL3: { position: 'absolute', bottom: 10, left: 0, right: 0, height: 1, backgroundColor: 'rgba(212,175,55,0.04)' },
  stemC: { position: 'absolute', bottom: 0, alignItems: 'center', transformOrigin: 'bottom center' },
  stemL: { flex: 1, borderRadius: 1 },
  leaf: { position: 'absolute', width: 7, height: 3.5, borderRadius: 3 },
  headC: { position: 'absolute', top: -2, alignItems: 'center', justifyContent: 'center' },
  dHead: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  dCenter: { width: 3.5, height: 3.5, borderRadius: 2, position: 'absolute' },
  dLine: { position: 'absolute', width: 1, height: 10, alignItems: 'center', transformOrigin: 'bottom center' },
  dLineI: { width: 0.5, height: 8, borderRadius: 0.5, opacity: 0.5 },
  dDot: { width: 2, height: 2, borderRadius: 1, opacity: 0.7, marginTop: -1 },
  wHead: { width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  petal: { position: 'absolute', width: 4.5, height: 7, borderRadius: 2.5 },
  wCenter: { width: 3.5, height: 3.5, borderRadius: 2, opacity: 0.7 },
  budC: { alignItems: 'center', justifyContent: 'center' },
  budO: { width: 4.5, height: 7, borderRadius: 2.5 },
  budO2: { position: 'absolute', width: 3.5, height: 6, borderRadius: 2.5, transform: [{ rotate: '30deg' }] },
  dotH: { width: 3, height: 3, borderRadius: 1.5 },
  seed: { position: 'absolute', alignItems: 'center' },
  seedB: { width: 2, height: 2, borderRadius: 1, backgroundColor: GOLD, opacity: 0.5 },
  seedF1: { position: 'absolute', width: 0.5, height: 5, backgroundColor: GOLD, opacity: 0.3, top: -5 },
  seedF2: { position: 'absolute', width: 0.5, height: 4, backgroundColor: GOLD, opacity: 0.2, top: -4, left: 2, transform: [{ rotate: '35deg' }] },
});
