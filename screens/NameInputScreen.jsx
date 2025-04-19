"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { useOnboarding } from "../context/OnboardingContext"

const { width } = Dimensions.get("window")

export default function NameInputScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { updatePreferences } = useOnboarding()
  const [name, setName] = useState("")

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

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

  const handleContinue = () => {
    if (name.trim()) {
      updatePreferences({ name: name.trim() })
      navigation.navigate("TastePreferences")
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TexturedBackground textureType="pinkLight" style={styles.header}>
        <Text style={styles.headerTitle}>About You</Text>
        <Text style={styles.headerSubtitle}>Let's personalize your experience</Text>
      </TexturedBackground>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >


        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name"
            placeholderTextColor="#AAAAAA"
            value={name}
            onChangeText={setName}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleContinue}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, !name.trim() && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!name.trim()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("TastePreferences")}>
          <Text style={styles.skipButtonText}>Skip this step</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressDot, styles.progressDotActive]} />
        <View style={styles.progressDot} />
        <View style={styles.progressDot} />
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
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A3F41",
    marginBottom: 8,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionContainer: {
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionText: {
    fontSize: 16,
    color: "#4A3F41",
    lineHeight: 24,
    textAlign: "center",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 15,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
  },
  nameInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 18,
    color: "#4A3F41",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  continueButton: {
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
  continueButtonDisabled: {
    backgroundColor: "#CCCCCC",
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
  skipButton: {
    alignItems: "center",
    paddingVertical: 15,
  },
  skipButtonText: {
    color: "#6B5E62",
    fontSize: 16,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
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
