import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ProfileScreen from './screens/ProfileScreen';
import EducationScreen from './screens/EducationScreen';
import ProjectScreen from './screens/ProjectScreen';

const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Design Tokens ──────────────────────────────────────────
const COLORS = {
  primary: '#800000',
  primaryDark: '#6D0F1F',
  cream: '#FFF5E1',
  creamDark: '#F5E6D3',
  gold: '#D4AF37',
  goldLight: 'rgba(212,175,55,0.25)',
  text: '#4A0000',
  shadow: 'rgba(109,15,31,0.35)',
};

// ─── Custom Top Tab Bar ─────────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const barEntrance = useRef(new Animated.Value(-80)).current;

  useEffect(() => {
    // Entrance animation (slide down from top)
    Animated.spring(barEntrance, {
      toValue: 0,
      useNativeDriver: true,
      friction: 6,
      tension: 50,
    }).start();

    // Gold border pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: false,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, []);

  const labels = ['Profile', 'Education', 'Projects'];

  const borderColor = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(212,175,55,0.2)', 'rgba(212,175,55,0.6)'],
  });

  return (
    <View style={styles.tabBarWrapper}>
      <Animated.View
        style={[
          styles.tabBar,
          {
            transform: [{ translateY: barEntrance }],
            borderColor,
          },
        ]}
      >
        {/* Logo */}
        <Text style={styles.navLogo}>LMP.</Text>

        {/* Tab Items */}
        <View style={styles.tabItemsRow}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                activeOpacity={0.7}
                style={[styles.tabItem, isFocused && styles.tabItemActive]}
              >
                <Text
                  style={[
                    styles.tabLabel,
                    isFocused && styles.tabLabelFocused,
                  ]}
                >
                  {labels[index]}
                </Text>
                {isFocused && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Main App ───────────────────────────────────────────────
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" backgroundColor={COLORS.primary} />
        <NavigationContainer>
          <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
          >
            <Tab.Screen name="Profile" component={ProfileScreen} />
            <Tab.Screen name="Education" component={EducationScreen} />
            <Tab.Screen name="Projects" component={ProjectScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 0,
    paddingHorizontal: 24,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
    borderBottomWidth: 1.5,
  },
  navLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.cream,
    letterSpacing: 1,
    marginRight: 32,
  },
  tabItemsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  tabLabel: {
    fontSize: 14,
    color: 'rgba(255,245,225,0.6)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tabLabelFocused: {
    color: COLORS.gold,
    fontWeight: '800',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
});
