"use client"

import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { getLocalImage } from "../utils/imageMapping"
import { useLanguage } from "../context/LanguageContext"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const imageAnim = useRef(new Animated.Value(0)).current
  const { t } = useLanguage()

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Rotate animation for the cocktail image
  const spin = imageAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "0deg"],
  })

  return (
    <TexturedBackground textureType="pinkLight" style={[styles.container, { paddingTop: insets.top }]}>
      {/* Logo and title */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
      </Animated.View>

      {/* Cocktail image */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: imageAnim,
            transform: [{ rotate: spin }],
          },
        ]}
      >
        <Image
          source={getLocalImage("../assets/images/cocktails/aperolSpritz.png")}
          style={styles.cocktailImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Welcome text */}
      <Animated.View
        style={[
          styles.welcomeContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.welcomeTitle}>{t("welcomeTitle")}</Text>
        <Text style={styles.welcomeText}>{t("welcomeText")}</Text>
      </Animated.View>

      {/* Get started button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate("NameInput")}>
          <Text style={styles.getStartedText}>{t("getStarted")}</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </Animated.View>

      {/* Skip for now */}
      <Animated.View
        style={[
          styles.skipContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("MainTabs")}>
          <Text style={styles.skipText}>{t("skipForNow")}</Text>
        </TouchableOpacity>
      </Animated.View>
    </TexturedBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4A3F41",
    marginBottom: 8,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 16,
    color: "#6B5E62",
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },
  cocktailImage: {
    width: "100%",
    height: "100%",
  },
  welcomeContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 16,
    color: "#6B5E62",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 20,
  },
  getStartedButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  skipContainer: {
    marginTop: 10,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    color: "#6B5E62",
    fontSize: 14,
  },
})
