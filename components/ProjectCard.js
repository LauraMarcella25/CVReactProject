import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Image, StyleSheet, Animated, TouchableWithoutFeedback,
  Modal, TouchableOpacity, ScrollView, Easing, Dimensions, Platform,
} from 'react-native';



const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
};

// Gradient-like color map for project thumbnails
const THUMB_COLORS = {
  'Web Application': ['#8B2252', '#6D0F1F'],
  'Mobile Application': ['#2D5A3D', '#1A3A25'],
  'Machine Learning': ['#2A3D6D', '#1A2545'],
};

export default function ProjectCard({ project, index, isGrid = false }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(30)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const delay = index * 120;
    Animated.parallel([
      Animated.timing(cardFade, { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 600, delay, useNativeDriver: true, easing: Easing.out(Easing.back(1.1)) }),
    ]).start();
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, friction: 5 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, friction: 5 }),
    ]).start();
    openModal();
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.parallel([
      Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, friction: 5, tension: 50 }),
      Animated.timing(modalOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.9, duration: 200, useNativeDriver: true }),
    ]).start(() => setModalVisible(false));
  };

  const statusColor = project.status === 'Completed' ? COLORS.primary : '#8B6020';
  const thumbColor = THUMB_COLORS[project.type] || THUMB_COLORS['Web Application'];

  // ─── Grid Card Layout ──────────────────────────────────
  if (isGrid) {
    return (
      <>
        <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }], width: '100%' }}>
          <TouchableWithoutFeedback onPress={handlePress}>
            <Animated.View style={[styles.gridCard, { transform: [{ scale: scaleAnim }] }]}>
              {/* Glass overlay */}
              <View style={styles.gridGlass} />

              {/* Thumbnail area */}
              <View style={[styles.gridThumb, { backgroundColor: thumbColor[0] }]}>
                <View style={[styles.gridThumbOverlay, { backgroundColor: thumbColor[1] }]} />
                {project.image ? (
                  <Image source={project.image} style={styles.gridThumbImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.gridThumbIcon}>{project.icon}</Text>
                )}
                {/* Status dot */}
                <View style={[styles.gridStatusDot, { backgroundColor: project.status === 'Completed' ? '#4CAF50' : COLORS.gold }]} />
                {/* Type label */}
                <View style={styles.gridTypeLabel}>
                  <Text style={styles.gridTypeLabelText}>{project.type.split(' ')[0]}</Text>
                </View>
              </View>

              {/* Content */}
              <View style={styles.gridContent}>
                <Text style={styles.gridTitle} numberOfLines={2}>{project.title}</Text>
                <Text style={styles.gridDesc} numberOfLines={2}>{project.description}</Text>

                {/* Tags */}
                <View style={styles.gridTags}>
                  {project.tags.slice(0, 2).map((tag, i) => (
                    <View key={i} style={styles.gridTag}>
                      <Text style={styles.gridTagText}>{tag}</Text>
                    </View>
                  ))}
                  {project.tags.length > 2 && (
                    <View style={[styles.gridTag, styles.gridTagMore]}>
                      <Text style={styles.gridTagText}>+{project.tags.length - 2}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>

        {/* Modal - shared */}
        {renderModal()}
      </>
    );
  }

  // ─── List Card Layout (fallback) ───────────────────────
  function renderModal() {
    return (
      <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalCard, { opacity: modalOpacity, transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalGoldLine} />
            <View style={styles.modalGlassTop} />

            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                {project.image ? (
                  <Image source={project.image} style={styles.modalImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.modalIcon}>{project.icon}</Text>
                )}
              </View>
              <View style={styles.modalHeaderText}>
                <Text style={styles.modalTitle}>{project.title}</Text>
                <Text style={styles.modalType}>{project.type}</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
              <Text style={styles.modalDesc}>{project.description}</Text>

              <Text style={styles.sectionLabel}>Technologies</Text>
              <View style={styles.tagsWrap}>
                {project.tags.map((tag, i) => (
                  <View key={i} style={styles.modalTag}>
                    <Text style={styles.modalTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {project.features && (
                <>
                  <Text style={styles.sectionLabel}>Key Features</Text>
                  {project.features.map((f, i) => (
                    <View key={i} style={styles.featureRow}>
                      <View style={styles.featureIcon}>
                        <Text style={styles.featureNumber}>{i + 1}</Text>
                      </View>
                      <Text style={styles.featureText}>{f}</Text>
                    </View>
                  ))}
                </>
              )}

              <View style={styles.statusRow}>
                <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                  <Text style={styles.statusText}>{project.status}</Text>
                </View>
                {project.year && (
                  <View style={styles.yearBadge}>
                    <Text style={styles.yearBadgeText}>{project.year}</Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
              <View style={styles.closeBtnGlass} />
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  return (
    <>
      <Animated.View style={{ opacity: cardFade, transform: [{ translateY: cardSlide }] }}>
        <TouchableWithoutFeedback onPress={handlePress}>
          <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.goldAccentLine} />
            <View style={styles.cardGlassHeader} />
            <View style={styles.cardHeader}>
              <View style={styles.projectIconWrap}>
                {project.image ? (
                  <Image source={project.image} style={styles.listCardImage} resizeMode="cover" />
                ) : (
                  <Text style={styles.projectIcon}>{project.icon}</Text>
                )}
              </View>
              <View style={styles.headerText}>
                <Text style={styles.projectTitle} numberOfLines={1}>{project.title}</Text>
                <View style={styles.typeRow}>
                  <View style={styles.typeDot} />
                  <Text style={styles.projectType}>{project.type}</Text>
                </View>
              </View>
              <View style={[styles.statusDotList, { backgroundColor: project.status === 'Completed' ? '#4CAF50' : COLORS.gold }]} />
            </View>
            <Text style={styles.projectDesc} numberOfLines={2}>{project.description}</Text>
            <View style={styles.tagsRow}>
              {project.tags.slice(0, 3).map((tag, i) => (
                <View key={i} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
              ))}
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.yearLabel}>{project.year}</Text>
              <View style={styles.tapHintRow}>
                <Text style={styles.tapHint}>View Details</Text>
                <Text style={styles.tapArrow}> →</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
      {renderModal()}
    </>
  );
}

const styles = StyleSheet.create({
  // ─── Grid Card ──────────────────────────────────────────
  gridCard: {
    backgroundColor: 'rgba(255,245,225,0.85)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    shadowColor: '#800000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
  },
  gridGlass: {
    position: 'absolute', top: 0, right: 0,
    width: '40%', height: '100%',
    backgroundColor: 'rgba(212,175,55,0.04)',
    zIndex: 0,
  },
  gridThumb: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  gridThumbOverlay: {
    position: 'absolute', top: 0, right: 0,
    width: '50%', height: '100%', opacity: 0.5,
  },
  gridThumbIcon: {
    fontSize: 28, zIndex: 2, fontWeight: '900', color: 'rgba(255,245,225,0.9)', letterSpacing: 1,
  },
  gridThumbImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gridStatusDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 3,
  },
  gridTypeLabel: {
    position: 'absolute', bottom: 8, left: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  gridTypeLabelText: {
    fontSize: 11, fontWeight: '700', color: 'rgba(255,245,225,0.9)', letterSpacing: 0.3,
  },
  gridContent: {
    padding: 14, paddingTop: 12,
  },
  gridTitle: {
    fontSize: 15, fontWeight: '800', color: '#800000', letterSpacing: 0.2, marginBottom: 6,
  },
  gridDesc: {
    fontSize: 12, color: '#7A5050', lineHeight: 18, marginBottom: 10,
  },
  gridTags: {
    flexDirection: 'row', flexWrap: 'wrap',
  },
  gridTag: {
    backgroundColor: 'rgba(128,0,0,0.08)',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5,
    marginRight: 6, marginBottom: 4,
    borderWidth: 0.5, borderColor: 'rgba(128,0,0,0.12)',
  },
  gridTagMore: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderColor: 'rgba(212,175,55,0.3)',
  },
  gridTagText: {
    color: '#800000', fontSize: 11, fontWeight: '700',
  },

  // ─── List Card ──────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(255,245,225,0.85)',
    borderRadius: 22, marginHorizontal: 16, marginVertical: 8,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.2)',
    shadowColor: '#800000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 14, elevation: 8,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(12px)' } : {}),
  },
  goldAccentLine: { height: 3, backgroundColor: COLORS.gold },
  cardGlassHeader: {
    position: 'absolute', top: 3, left: 0, right: 0, height: 56,
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 8,
  },
  projectIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginRight: 12, shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 6,
    overflow: 'hidden',
  },
  projectIcon: { fontSize: 16, fontWeight: '800', color: COLORS.cream },
  listCardImage: {
    width: 48, height: 48, borderRadius: 16,
  },
  headerText: { flex: 1 },
  projectTitle: { fontSize: 16, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.3 },
  typeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  typeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.gold, marginRight: 5 },
  projectType: { fontSize: 11, color: COLORS.gold, fontWeight: '700' },
  statusDotList: {
    width: 10, height: 10, borderRadius: 5,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 4,
  },
  projectDesc: { fontSize: 13, color: '#7A5050', lineHeight: 20, paddingHorizontal: 14, marginBottom: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 14, marginBottom: 4 },
  tag: {
    backgroundColor: 'rgba(128,0,0,0.08)', borderRadius: 12,
    paddingHorizontal: 11, paddingVertical: 5, marginRight: 6, marginBottom: 6,
    borderWidth: 0.5, borderColor: 'rgba(128,0,0,0.12)',
  },
  tagText: { color: '#800000', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 12, paddingTop: 6, borderTopWidth: 1, borderTopColor: 'rgba(128,0,0,0.06)',
  },
  yearLabel: { fontSize: 11, color: '#8B6060', fontWeight: '600' },
  tapHintRow: { flexDirection: 'row', alignItems: 'center' },
  tapHint: { fontSize: 11, color: COLORS.gold, fontWeight: '700' },
  tapArrow: { fontSize: 12, color: COLORS.gold, fontWeight: '700' },

  // ─── Modal ──────────────────────────────────────────────
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(64,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalCard: {
    backgroundColor: 'rgba(255,245,225,0.95)', borderRadius: 28,
    maxHeight: '85%', width: '100%', maxWidth: 420,
    padding: 24, paddingTop: 14, overflow: 'hidden',
    borderWidth: 1.5, borderColor: COLORS.gold,
    shadowColor: '#800000', shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35, shadowRadius: 30, elevation: 28,
    ...(Platform.OS === 'web' ? { backdropFilter: 'blur(20px)' } : {}),
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: 'rgba(128,0,0,0.15)',
    borderRadius: 2, alignSelf: 'center', marginBottom: 14,
  },
  modalGoldLine: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 3, backgroundColor: COLORS.gold,
  },
  modalGlassTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 80,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  modalIconWrap: {
    width: 58, height: 58, borderRadius: 20, backgroundColor: COLORS.primary,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
    shadowColor: COLORS.gold, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 14, elevation: 8,
    overflow: 'hidden',
  },
  modalIcon: { fontSize: 20, fontWeight: '800', color: COLORS.cream },
  modalImage: {
    width: 58, height: 58, borderRadius: 20,
  },
  modalHeaderText: { flex: 1 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.3 },
  modalType: { fontSize: 13, color: COLORS.gold, fontWeight: '700', marginTop: 3 },
  modalScroll: { maxHeight: 380 },
  modalDesc: { fontSize: 14, color: '#7A5050', lineHeight: 22, marginBottom: 20 },
  sectionLabel: {
    fontSize: 12, fontWeight: '800', color: COLORS.primary,
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10,
  },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 18 },
  modalTag: {
    backgroundColor: 'rgba(128,0,0,0.08)', borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, marginBottom: 6,
    borderWidth: 0.5, borderColor: 'rgba(128,0,0,0.12)',
  },
  modalTagText: { color: '#800000', fontSize: 11, fontWeight: '700' },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  featureIcon: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(128,0,0,0.1)', justifyContent: 'center',
    alignItems: 'center', marginRight: 10, marginTop: 1,
  },
  featureNumber: { fontSize: 10, fontWeight: '900', color: COLORS.primary },
  featureText: { fontSize: 13, color: '#7A5050', lineHeight: 20, flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 8 },
  statusBadge: {
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginRight: 12,
    shadowColor: '#800000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  statusText: { color: COLORS.cream, fontSize: 12, fontWeight: '800', letterSpacing: 0.3 },
  yearBadge: {
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5,
    backgroundColor: 'rgba(128,0,0,0.08)', borderWidth: 1, borderColor: 'rgba(128,0,0,0.15)',
  },
  yearBadgeText: { fontSize: 12, color: '#8B6060', fontWeight: '700' },
  closeBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 14,
    alignItems: 'center', marginTop: 18, overflow: 'hidden',
    shadowColor: '#800000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 10,
  },
  closeBtnGlass: {
    position: 'absolute', top: 0, right: 0,
    width: '50%', height: '100%',
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  closeBtnText: { color: COLORS.cream, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
});
