"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { useOnboarding } from "../context/OnboardingContext"

const { width } = Dimensions.get("window")
const cardWidth = (width - 60) / 2 // Two cards per row with margins

// Base spirit options
const baseOptions = [
  {
    id: "gin",
    name: "Gin",
    icon: "https://cdn-icons-png.flaticon.com/128/920/920582.png",
    description: "Botanical and aromatic",
  },
  {
    id: "vodka",
    name: "Vodka",
    icon: "https://cdn-icons-png.flaticon.com/128/2738/2738638.png",
    description: "Clean and versatile",
  },
  {
    id: "rum",
    name: "Rum",
    icon: "https://cdn-icons-png.flaticon.com/128/2738/2738638.png",
    description: "Sweet and tropical",
  },
  {
    id: "tequila",
    name: "Tequila",
    icon: "https://cdn-icons-png.flaticon.com/128/2738/2738639.png",
    description: "Bold and earthy",
  },
  {
    id: "whiskey",
    name: "Whiskey",
    icon: "https://cdn-icons-png.flaticon.com/128/2738/2738639.png",
    description: "Rich and complex",
  },
  {
    id: "any",
    name: "Any",
    icon: "https://cdn-icons-png.flaticon.com/128/1682/1682987.png",
    description: "I'm open to anything",
  },
]

export default function FavoriteBaseScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { updatePreferences } = useOnboarding()
  const [selectedBase, setSelectedBase] = useState(null)

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
      <TexturedBackground textureType="pinkLight" style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Base</Text>
        <Text style={styles.headerSubtitle}>What's your preferred spirit?</Text>
      </TexturedBackground>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Select your favorite base spirit. We'll use this to recommend cocktails you'll enjoy.
          </Text>
        </View>

        <View style={styles.baseGrid}>{baseOptions.map(renderBaseCard)}</View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.continueButton, !selectedBase && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!selectedBase}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
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
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    textAlign: "center",
  },
  baseGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  baseCard: {
    width: cardWidth,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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
  },
  baseCardSelected: {
    backgroundColor: "#FF6B6B",
  },
  baseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
  },
  baseNameSelected: {
    color: "#FFFFFF",
  },
  baseDescription: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
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
