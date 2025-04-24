"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOnboarding } from "../context/OnboardingContext"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")
const SLIDER_WIDTH = width - 100

// Update the TastePreferencesScreen to handle navigation differently when accessed from Settings

export default function TastePreferencesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets()
  const { updatePreferences, userPreferences } = useOnboarding()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const fromSettings = route.params?.fromSettings

  // Taste preferences state
  const [tastePreferences, setTastePreferences] = useState({
    sweet: 2, // Default middle value
    sour: 2,
    bitter: 2,
    spicy: 2,
  })

  // Animation values for sliders
  const sliderAnims = {
    sweet: useRef(new Animated.Value(2)).current,
    sour: useRef(new Animated.Value(2)).current,
    bitter: useRef(new Animated.Value(2)).current,
    spicy: useRef(new Animated.Value(2)).current,
  }

  // Load existing preferences if coming from settings
  useEffect(() => {
    if (fromSettings) {
      if (userPreferences?.tastePreferences) {
        setTastePreferences(userPreferences.tastePreferences)

        // Update slider animations
        Object.keys(userPreferences.tastePreferences).forEach((key) => {
          if (sliderAnims[key]) {
            sliderAnims[key].setValue(userPreferences.tastePreferences[key])
          }
        })
      }
    }
  }, [fromSettings, userPreferences])

  // Taste icons and colors
  const tasteConfig = {
    sweet: {
      icon: "ice-cream-outline",
      emoji: "🍯",
      gradient: ["#FF9A9E", "#FECFEF"],
      description: "From barely sweet to dessert-like",
    },
    sour: {
      icon: "nutrition-outline",
      emoji: "🍋",
      gradient: ["#96DEDA", "#50C9C3"],
      description: "From subtle tang to mouth-puckering",
    },
    bitter: {
      icon: "leaf-outline",
      emoji: "🌿",
      gradient: ["#A8CABA", "#5D8466"],
      description: "From smooth to intensely bitter",
    },
    spicy: {
      icon: "flame-outline",
      emoji: "🌶️",
      gradient: ["#FF9A9E", "#FF5757"],
      description: "From mild warmth to fiery heat",
    },
  }

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [])

  // Update preference and animate slider
  const updatePreference = (type, value) => {
    setTastePreferences((prev) => ({ ...prev, [type]: value }))

    Animated.spring(sliderAnims[type], {
      toValue: value,
      friction: 7,
      tension: 40,
      useNativeDriver: false,
    }).start()
  }

  // Handle continue button press - update for settings flow
  const handleContinue = () => {
    updatePreferences({ tastePreferences })

    if (fromSettings) {
      // If coming from settings, go back to settings
      navigation.goBack()
    } else {
      // Normal onboarding flow
      navigation.navigate("FavoriteBase")
    }
  }

  // Calculate the width percentage for the fill based on the value (0-5)
  const getWidthPercentage = (value) => {
    return `${(value / 5) * 100}%`
  }

  // Render a taste preference slider
  const renderTasteSlider = (type) => {
    const config = tasteConfig[type]
    const value = tastePreferences[type]

    // Calculate the position for the thumb
    const thumbPosition = sliderAnims[type].interpolate({
      inputRange: [0, 5],
      outputRange: [0, SLIDER_WIDTH],
    })

    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderHeader}>
          <View style={styles.sliderTitleContainer}>
            <Text style={styles.sliderEmoji}>{config.emoji}</Text>
            <View>
              <Text style={styles.sliderTitle}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
              <Text style={styles.sliderDescription}>{config.description}</Text>
            </View>
          </View>
          <View style={styles.sliderValueBadge}>
            <Text style={styles.sliderValueText}>{value}</Text>
          </View>
        </View>

        <View style={styles.sliderTrackContainer}>
          <View style={styles.sliderTrack}>
            {/* Static fill based on current value */}
            <View style={{ width: getWidthPercentage(value), overflow: "hidden", height: "100%" }}>
              <LinearGradient
                colors={config.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.sliderFill}
              />
            </View>

            {/* Animated thumb */}
            <Animated.View
              style={[
                styles.sliderThumb,
                {
                  backgroundColor: config.gradient[0],
                  transform: [{ translateX: thumbPosition }],
                },
              ]}
            >
              <Ionicons name={config.icon} size={16} color="#FFFFFF" />
            </Animated.View>
          </View>

          {/* Slider touch areas */}
          <View style={styles.sliderTouchArea}>
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity key={val} style={styles.sliderTouchPoint} onPress={() => updatePreference(type, val)}>
                <View style={[styles.sliderDot, value >= val && { backgroundColor: config.gradient[0] }]} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sliderLabelsContainer}>
            <Text style={styles.sliderMinLabel}>Less</Text>
            <Text style={styles.sliderMaxLabel}>More</Text>
          </View>
        </View>
      </View>
    )
  }

  // Add a back button when accessed from Settings

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {fromSettings && (
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <LinearGradient colors={["#FF9A9E", "#FECFEF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>Taste Preferences</Text>
        <Text style={styles.headerSubtitle}>Tell us what you like</Text>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/2674/2674883.png" }} style={styles.headerIcon} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.instructionContainer}>
            <Ionicons name="information-circle" size={24} color="#FF6B6B" style={styles.instructionIcon} />
            <Text style={styles.instructionText}>
              Adjust the sliders to tell us your taste preferences. This will help us recommend cocktails you'll love.
            </Text>
          </View>

          {renderTasteSlider("sweet")}
          {renderTasteSlider("sour")}
          {renderTasteSlider("bitter")}
          {renderTasteSlider("spicy")}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E8E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>{fromSettings ? "Save Changes" : "Continue"}</Text>
                <Ionicons
                  name={fromSettings ? "checkmark" : "arrow-forward"}
                  size={20}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
      </View>
    </View>
  )
}

// Add back button styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 110,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
    opacity: 0.9,
  },
  headerIcon: {
    position: "absolute",
    right: 20,
    bottom: -15,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 25,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionIcon: {
    marginRight: 10,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: "#4A3F41",
    lineHeight: 22,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  sliderContainer: {
    marginBottom: 25,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sliderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sliderTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sliderEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  sliderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
  },
  sliderDescription: {
    fontSize: 12,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  sliderValueBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  sliderValueText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  sliderTrackContainer: {
    marginTop: 10,
  },
  sliderTrack: {
    height: 12,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
    position: "relative",
    overflow: "hidden",
  },
  sliderFill: {
    width: "100%",
    height: "100%",
  },
  sliderThumb: {
    position: "absolute",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    top: -12,
    marginLeft: -18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  sliderTouchArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    marginTop: 15,
  },
  sliderTouchPoint: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  sliderLabelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  sliderMinLabel: {
    fontSize: 12,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  sliderMaxLabel: {
    fontSize: 12,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 5,
  },
  progressDotActive: {
    backgroundColor: "#FF6B6B",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})
