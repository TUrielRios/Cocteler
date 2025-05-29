"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Animated, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOnboarding } from "../context/OnboardingContext"
import { useLanguage } from "../context/LanguageContext"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")

export default function OccasionPreferencesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { completeOnboarding } = useOnboarding()
  const { t } = useLanguage()
  const [selectedOccasions, setSelectedOccasions] = useState([])

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Occasion options
  const occasionOptions = [
    {
      id: "evening",
      name: t("evening"),
      icon: "moon-outline",
    },
    {
      id: "celebration",
      name: t("celebration"),
      icon: "gift-outline",
    },
    {
      id: "brunch",
      name: t("brunch"),
      icon: "sunny-outline",
    },
    {
      id: "dinner",
      name: t("dinner"),
      icon: "restaurant-outline",
    },
    {
      id: "party",
      name: t("party"),
      icon: "people-outline",
    },
    {
      id: "date",
      name: t("dateNight"),
      icon: "heart-outline",
    },
    {
      id: "casual",
      name: t("casual"),
      icon: "home-outline",
    },
    {
      id: "summer",
      name: t("summer"),
      icon: "umbrella-outline",
    },
  ]

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Toggle occasion selection
  const toggleOccasion = (id) => {
    setSelectedOccasions((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // Handle finish button press
  const handleFinish = () => {
    // Get the occasion names from the selected IDs
    const occasionNames = selectedOccasions.map((id) => occasionOptions.find((option) => option.id === id).name)

    completeOnboarding({ occasions: occasionNames })
    navigation.navigate("MainTabs")
  }

  // Render an occasion option
  const renderOccasionOption = (option) => {
    const isSelected = selectedOccasions.includes(option.id)

    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.occasionOption, isSelected && styles.occasionOptionSelected]}
        onPress={() => toggleOccasion(option.id)}
      >
        <Ionicons name={option.icon} size={24} color={isSelected ? "#FFFFFF" : "#6B5E62"} style={styles.occasionIcon} />
        <Text style={[styles.occasionName, isSelected && styles.occasionNameSelected]}>{option.name}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.checkIcon} />}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#FF9A9E", "#FF6B6B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>{t("occasions")}</Text>
        <Text style={styles.headerSubtitle}>{t("whenEnjoyCocktails")}</Text>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/2674/2674883.png" }} style={styles.headerIcon} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.instructionContainer}>
            <Ionicons name="information-circle" size={24} color="#FF6B6B" style={styles.instructionIcon} />
            <Text style={styles.instructionText}>{t("selectOccasions")}</Text>
          </View>

          <View style={styles.occasionsContainer}>{occasionOptions.map(renderOccasionOption)}</View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E8E"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.finishButtonText}>{t("finish")}</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("MainTabs")}>
            <Text style={styles.skipButtonText}>{t("skipThisStep")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
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
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
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
    textAlign: "center",
  },
  occasionsContainer: {
    marginBottom: 30,
  },
  occasionOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  occasionOptionSelected: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  occasionIcon: {
    marginRight: 15,
  },
  occasionName: {
    fontSize: 16,
    color: "#4A3F41",
    flex: 1,
  },
  occasionNameSelected: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  checkIcon: {
    marginLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  finishButton: {
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
  finishButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  skipButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginBottom: 30,
  },
  skipButtonText: {
    color: "#6B5E62",
    fontSize: 16,
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
