import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProjectCard from '../components/ProjectCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
};

const PROJECTS = [
  {
    id: 1, title: 'Personal Portfolio Website', type: 'Web Application', icon: 'WEB',
    image: require('../assets/projects/project_portfolio.png'),
    description: 'A full-stack personal portfolio built with Laravel and modern CSS. Features an admin dashboard for content management, animated hero sections, and dynamic project showcases.',
    tags: ['Laravel', 'PHP', 'CSS', 'MySQL', 'Blade'],
    features: ['Dynamic content management via admin dashboard', 'Animated hero section with botanical visuals', 'Project & activity gallery with media uploads', 'Responsive design across all devices'],
    status: 'Completed', year: '2025',
  },
  {
    id: 2, title: '', type: 'FestivalFood Ticketing', icon: 'APP',
    image: require('../assets/projects/project_taskapp.png'),
    description: 'A festival food ticketing system is a platform for buying and using food tickets efficiently, reducing queues and improving the event experience.',
    tags: ['Laravel', 'PHP', 'CSS', 'MySQL', 'Blade'],
    features: ['Drag-and-drop task reordering with haptic feedback'],
    status: 'Completed', year: '2025',
  },
  {
    id: 3, title: 'Website Beasiswa FKKI', type: 'Web Application', icon: 'POS',
    image: require('../assets/projects/project_pos.png'),
    description: 'I developed a clean, responsive, and user-friendly frontend website using HTML and CSS, with a well-structured layout and modern design optimized for both desktop and mobile devices.',
    tags: ['HTML', 'CSS'],
    features: ['Key features include a clean and modern UI'],
    status: 'Completed', year: '2024',
  },
  {
    id: 4, title: 'RetiVue', type: 'DeepLearning', type: 'ML', icon: 'AI',
    image: require('../assets/projects/project_ai.png'),
    description: 'This project develops a deep learning–based system to classify diabetic retinopathy from retinal images to support early detection and diagnosis.',
    tags: ['Python', 'TensorFlow', 'Flask', 'NumPy'],
    features: ['Model accuracy visualization'],
    status: 'Completed', year: '2025',
  },
];

const FILTERS = ['All', 'Web App', 'Mobile', 'ML'];

function FloatingShape({ style, delay = 0 }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(floatAnim, { toValue: -6, duration: 3200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3200, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[styles.bgShape, style, { transform: [{ translateY: floatAnim }] }]} />;
}

export default function ProjectScreen() {
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-25)).current;
  const headerScale = useRef(new Animated.Value(0.92)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const statsScale = useRef(new Animated.Value(0.85)).current;
  const [activeFilter, setActiveFilter] = useState(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(headerSlide, { toValue: 0, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.back(1.3)) }),
        Animated.spring(headerScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 50 }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(statsScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 50 }),
      ]),
    ]).start();
  }, []);

  const completedCount = PROJECTS.filter(p => p.status === 'Completed').length;
  const inProgressCount = PROJECTS.filter(p => p.status === 'In Progress').length;

  const filteredProjects = PROJECTS.filter(p => {
    if (activeFilter === 0) return true;
    const fn = FILTERS[activeFilter];
    if (fn === 'Web App') return p.type === 'Web Application';
    if (fn === 'Mobile') return p.type === 'Mobile Application';
    if (fn === 'ML') return p.type === 'Machine Learning';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FloatingShape style={{ top: -30, right: -60, width: 200, height: 200, borderRadius: 100, opacity: 0.05 }} delay={0} />
        <FloatingShape style={{ top: 400, left: -80, width: 240, height: 240, borderRadius: 120, opacity: 0.04 }} delay={800} />

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }, { scale: headerScale }] }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.screenTitle}>Projects</Text>
            <Text style={styles.screenSubtitle}>My Work & Creations</Text>
            <View style={styles.goldBarContainer}>
              <View style={styles.goldBar} />
              <View style={styles.goldBarSmall} />
            </View>
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: contentFade, transform: [{ scale: statsScale }] }]}>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={styles.statValue}>{PROJECTS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <View style={[styles.statGlass, { backgroundColor: 'rgba(212,175,55,0.08)' }]} />
            <Text style={[styles.statValue, { color: COLORS.cream }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: 'rgba(255,245,225,0.8)' }]}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statGlass} />
            <Text style={[styles.statValue, { color: '#8B6020' }]}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </Animated.View>

        {/* Filters - glassmorphism chips */}
        <Animated.View style={[styles.filterRow, { opacity: contentFade }]}>
          {FILTERS.map((f, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveFilter(i)} activeOpacity={0.7}
              style={[styles.filterChip, i === activeFilter && styles.filterChipActive]}>
              <Text style={[styles.filterChipText, i === activeFilter && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Count */}
        <Animated.View style={[styles.countRow, { opacity: contentFade }]}>
          <Text style={styles.countText}>
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </Text>
        </Animated.View>

        {/* Project Grid (2 columns) */}
        <Animated.View style={[styles.projectGrid, { opacity: contentFade }]}>
          {filteredProjects.map((project, index) => (
            <View key={project.id} style={styles.gridItem}>
              <ProjectCard project={project} index={index} isGrid={true} />
            </View>
          ))}
        </Animated.View>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>--</Text>
            <Text style={styles.emptyText}>No projects in this category</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 76, position: 'relative', alignItems: 'center' },
  bgShape: { position: 'absolute', backgroundColor: COLORS.primary, zIndex: 0 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, marginBottom: 20, zIndex: 1,
    maxWidth: 950, width: '100%',
  },
  headerLeft: { flex: 1 },
  screenTitle: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.5 },
  screenSubtitle: { fontSize: 13, color: COLORS.gold, fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },
  goldBarContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  goldBar: { width: 40, height: 3, backgroundColor: COLORS.gold, borderRadius: 2 },
  goldBarSmall: { width: 12, height: 3, backgroundColor: COLORS.gold, borderRadius: 2, marginLeft: 6, opacity: 0.5 },
  headerIconWrap: {
    width: 56, height: 56, borderRadius: 20, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 14, elevation: 10,
  },
  headerIcon: { fontSize: 18, fontWeight: '900', color: COLORS.cream },

  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 18, zIndex: 1, maxWidth: 950, width: '100%', paddingHorizontal: 16 },
  statCard: {
    flex: 1, borderRadius: 18, padding: 14, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    backgroundColor: 'rgba(128,0,0,0.04)',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 4,
    marginHorizontal: 5, overflow: 'hidden',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(10px)' } : {}),
  },
  statCardPrimary: {
    backgroundColor: COLORS.primary, borderColor: COLORS.gold, borderWidth: 1.5,
    shadowColor: COLORS.gold, shadowOpacity: 0.3, shadowRadius: 12,
  },
  statGlass: {
    position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
    backgroundColor: 'rgba(212,175,55,0.05)',
    borderTopRightRadius: 18, borderBottomRightRadius: 18,
  },
  statEmoji: { fontSize: 16, marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  statLabel: { fontSize: 10, color: '#8B6060', fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },

  filterRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 10, zIndex: 1, maxWidth: 950, width: '100%' },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 22,
    backgroundColor: 'rgba(128,0,0,0.04)', borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)', marginRight: 8,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(8px)' } : {}),
  },
  filterChipActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.gold,
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
  },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#8B6060' },
  filterChipTextActive: { color: COLORS.cream },

  countRow: { paddingHorizontal: 24, marginBottom: 8, maxWidth: 950, width: '100%' },
  countText: { fontSize: 11, color: '#A08080', fontWeight: '600', letterSpacing: 0.3 },

  // ─── Grid ───────────────────────────────────────────────
  projectGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16,
    maxWidth: 950,
    width: '100%',
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    marginHorizontal: '1%',
  },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontSize: 14, color: '#8B6060', fontWeight: '600' },
});
