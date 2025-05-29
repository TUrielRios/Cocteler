"use client"

import { useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, Image } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import TexturedBackground from "../components/TexturedBackground"
import { useLanguage } from "../context/LanguageContext"
import { getLocalImage } from "../utils/imageMapping"


const { width, height } = Dimensions.get("window")

export default function LanguageSelectionScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { changeLanguage } = useLanguage()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const imageAnim = useRef(new Animated.Value(0)).current
  

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      // Agregar la animación para la imagen
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleLanguageSelect = async (language) => {
    await changeLanguage(language)
    navigation.navigate("Welcome")
  }

  return (
    <TexturedBackground textureType="pinkLight" style={[styles.container, { paddingTop: insets.top }]}>
      {/* Logo and title */}
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
      {/* Cocktail image */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            opacity: imageAnim,

          },
        ]}
      >
        <Image
          source={getLocalImage("../assets/images/cocktails/UnionSquare.png")}
          style={styles.cocktailImage}
          resizeMode="contain"
        />
      </Animated.View>
        <Text style={styles.appName}>Cocteler</Text>
      </Animated.View>

      {/* Language selection */}
      <Animated.View
        style={[
          styles.languageContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* <Text style={styles.selectLanguageTitle}>Select your language</Text>
        <Text style={styles.selectLanguageSubtitle}>Selecciona tu idioma</Text> */}

        <View style={styles.languageOptions}>
          {/* English Option */}
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect("en")}>
            <LinearGradient
              colors={["#FF6B6B", "#FF8E8E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.languageOptionBg}
            >
              <View style={styles.flagContainer}>
                <Text style={styles.flagEmoji}>🇺🇸</Text>
              </View>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>English</Text>
                <Text style={styles.languageDescription}>Continue in English</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Spanish Option */}
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageSelect("es")}>
            <LinearGradient
              colors={["#4A90E2", "#357ABD"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.languageOptionBg}
            >
              <View style={styles.flagContainer}>
                <Text style={styles.flagEmoji}>🇦🇷</Text>
              </View>
              <View style={styles.languageInfo}>
                <Text style={styles.languageName}>Español</Text>
                <Text style={styles.languageDescription}>Continuar en español</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>


    </TexturedBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
    imageContainer: {
    width: 220,
    height: 220,
    marginBottom: 10,
  },
  cocktailImage: {
    width: "100%",
    height: "100%",
  },
  appName: {
    fontSize: 32,
    fontWeight: "500",
    color: "#4A3F41",
    marginBottom: 10,
    letterSpacing: 5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  appTagline: {
    fontSize: 18,
    color: "#6B5E62",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  languageContainer: {
    width: "100%",
    alignItems: "center",
  },
  selectLanguageTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 8,
    textAlign: "center",
  },
  selectLanguageSubtitle: {
    fontSize: 16,
    color: "#6B5E62",
    marginBottom: 10,
    textAlign: "center",
  },
  languageOptions: {
    width: "100%",
    gap: 20,
  },
  languageOption: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  languageOptionBg: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  flagContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  flagEmoji: {
    fontSize: 24,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: 50,
    opacity: 0.3,
  },
  decorationImage: {
    width: 80,
    height: 80,
  },
})