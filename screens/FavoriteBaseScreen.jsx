"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, Animated } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useOnboarding } from "../context/OnboardingContext"
import { useLanguage } from "../context/LanguageContext"
import { LinearGradient } from "expo-linear-gradient"

const { width } = Dimensions.get("window")
const cardWidth = (width - 60) / 2 // Two cards per row with margins

export default function FavoriteBaseScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { updatePreferences } = useOnboarding()
  const { t } = useLanguage()
  const [selectedBase, setSelectedBase] = useState(null)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Base spirit options
  const baseOptions = [
    {
      id: "gin",
      name: t("gin"),
      description: t("ginDescription"),
    },
    {
      id: "vodka",
      name: t("vodka"),
      description: t("vodkaDescription"),
    },
    {
      id: "rum",
      name: t("rum"),
      description: t("rumDescription"),
    },
    {
      id: "tequila",
      name: t("tequila"),
      description: t("tequilaDescription"),
    },
    {
      id: "whiskey",
      name: t("whiskey"),
      description: t("whiskeyDescription"),
    },
    {
      id: "any",
      name: t("any"),
      description: t("anyDescription"),
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

  // Handle continue button press
  const handleContinue = () => {
    if (selectedBase) {
      updatePreferences({ favoriteBase: selectedBase })
      navigation.navigate("OccasionPreferences")
    }
  }

  // Render a base option card
  const renderBaseCard = (base) => {
    const isSelected = selectedBase === base.id

    return (
      <TouchableOpacity
        key={base.id}
        style={[styles.baseCard, isSelected && styles.baseCardSelected]}
        onPress={() => setSelectedBase(base.id)}
      >
        <View style={[styles.baseIconContainer, isSelected && styles.baseIconContainerSelected]}>
          <Image source={{ uri: base.icon }} style={styles.baseIcon} />
        </View>
        <Text style={[styles.baseName, isSelected && styles.baseNameSelected]}>{base.name}</Text>
        <Text style={[styles.baseDescription, isSelected && styles.baseDescriptionSelected]}>{base.description}</Text>
        {isSelected && (
          <View style={styles.checkmarkContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient colors={["#A8CABA", "#5D8466"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <Text style={styles.headerTitle}>{t("favoriteBase")}</Text>
        <Text style={styles.headerSubtitle}>{t("preferredSpirit")}</Text>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/128/2738/2738639.png" }} style={styles.headerIcon} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.instructionContainer}>
            <Ionicons name="information-circle" size={24} color="#5D8466" style={styles.instructionIcon} />
            <Text style={styles.instructionText}>{t("selectFavoriteBase")}</Text>
          </View>

          <View style={styles.baseGrid}>{baseOptions.map(renderBaseCard)}</View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, !selectedBase && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={!selectedBase}
            >
              <LinearGradient
                colors={selectedBase ? ["#5D8466", "#7DA990"] : ["#CCCCCC", "#AAAAAA"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.continueButtonText}>{t("continue")}</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
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
    shadowColor: "#5D8466",
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
  },
  baseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  baseCard: {
    width: cardWidth,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  baseCardSelected: {
    backgroundColor: "#5D8466",
    borderColor: "#5D8466",
  },
  baseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  baseIconContainerSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  baseIcon: {
    width: 30,
    height: 30,
  },
  baseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 5,
  },
  baseNameSelected: {
    color: "#FFFFFF",
  },
  baseDescription: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
  },
  baseDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  checkmarkContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#5D8466",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    opacity: 0.8,
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
    backgroundColor: "#5D8466",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
})
