"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { useOnboarding } from "../context/OnboardingContext"

const { width } = Dimensions.get("window")

// Occasion options
const occasionOptions = [
  {
    id: "evening",
    name: "Evening",
    icon: "moon-outline",
  },
  {
    id: "celebration",
    name: "Celebration",
    icon: "gift-outline",
  },
  {
    id: "brunch",
    name: "Brunch",
    icon: "sunny-outline",
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: "restaurant-outline",
  },
  {
    id: "party",
    name: "Party",
    icon: "people-outline",
  },
  {
    id: "date",
    name: "Date Night",
    icon: "heart-outline",
  },
  {
    id: "casual",
    name: "Casual",
    icon: "home-outline",
  },
  {
    id: "summer",
    name: "Summer",
    icon: "umbrella-outline",
  },
]

export default function OccasionPreferencesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { completeOnboarding } = useOnboarding()
  const [selectedOccasions, setSelectedOccasions] = useState([])

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
      <TexturedBackground textureType="pinkLight" style={styles.header}>
        <Text style={styles.headerTitle}>Occasions</Text>
        <Text style={styles.headerSubtitle}>When do you enjoy cocktails?</Text>
      </TexturedBackground>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Select the occasions when you typically enjoy cocktails. This helps us recommend the perfect drinks for your
            lifestyle.
          </Text>
        </View>

        <View style={styles.occasionsContainer}>{occasionOptions.map(renderOccasionOption)}</View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finish</Text>
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("MainTabs")}>
          <Text style={styles.skipButtonText}>Skip this step</Text>
        </TouchableOpacity>
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
  occasionsContainer: {
    marginBottom: 30,
  },
  occasionOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  occasionOptionSelected: {
    backgroundColor: "#FF6B6B",
  },
  occasionIcon: {
    marginRight: 15,
  },
  occasionName: {
    fontSize: 16,
    color: "#4A3F41",
    flex: 1,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
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
  finishButtonText: {
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
    marginBottom: 30,
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
