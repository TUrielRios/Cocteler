"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { getLocalImage } from "../utils/imageMapping"
import { useOnboarding } from "../context/OnboardingContext"
import cocktailsData from "../data/api.json"

// Get screen dimensions
const { width } = Dimensions.get("window")
const cardWidth = width - 40 // Card width with margins

export default function HomeScreen({ navigation }) {
  const [cocktails, setCocktails] = useState([])
  const [featuredCocktail, setFeaturedCocktail] = useState(null)
  const [activeTab, setActiveTab] = useState("Recommended")
  const insets = useSafeAreaInsets()
  const { userPreferences } = useOnboarding()

  // Tabs for filtering
  const tabs = ["Recommended", "Popular", "Newest"]

  useEffect(() => {
    // Get the featured cocktail (Union Square)
    const featured = cocktailsData.find((cocktail) => cocktail.name === "Union Square")
    setFeaturedCocktail(featured)

    // Get the rest of the cocktails
    const otherCocktails = cocktailsData.filter((cocktail) => cocktail.name !== "Union Square")
    setCocktails(otherCocktails)
  }, [])

  // Filter cocktails based on active tab
  const getFilteredCocktails = () => {
    switch (activeTab) {
      case "Popular":
        return [...cocktails].sort((a, b) => b.rating - a.rating)
      case "Newest":
        return [...cocktails].reverse()
      case "Recommended":
      default:
        return cocktails
    }
  }

  // Generate star rating component
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color="#FF6B6B" style={styles.star} />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#FF6B6B" style={styles.star} />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFCACA" style={styles.star} />)
    }

    return stars
  }

  // Render category item
  const renderCategoryItem = (icon, label, backgroundColor) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIcon, { backgroundColor }]}>
        <Image source={{ uri: icon }} style={styles.categoryIconImage} />
      </View>
      <Text style={styles.categoryText}>{label}</Text>
    </TouchableOpacity>
  )

  // Render featured cocktail
  const renderFeaturedCocktail = () => {
    if (!featuredCocktail) return null

    // Get the local image for the featured cocktail
    const localImagePath = featuredCocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    return (
      <TouchableOpacity
        style={styles.featuredContainer}
        onPress={() => navigation.navigate("CocktailDetail", { cocktail: featuredCocktail })}
      >
        <TexturedBackground textureType="pinkLight" style={styles.featuredBackground}>
          <View style={styles.featuredContent}>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredName}>{featuredCocktail.name}</Text>
              <View style={styles.ratingContainer}>{renderStars(featuredCocktail.rating)}</View>
            </View>
            <Image source={cocktailImage} style={styles.featuredImage} resizeMode="contain" />
          </View>
        </TexturedBackground>
      </TouchableOpacity>
    )
  }

  // Render tab bar
  const renderTabBar = () => (
    <View style={styles.tabBarContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  // Render cocktail card
  const renderCocktailCard = (cocktail) => {
    // Define background colors based on cocktail type
    const getBgColor = (name) => {
      if (name === "Aperol Spritz") return "#FFF5E9"
      if (name === "Dry Martini") return "#E5F7F7"
      if (name === "Mojito") return "#E9F7EF"
      return "#F9F9F9"
    }

    // Get the local image for the cocktail
    const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    return (
      <TouchableOpacity
        key={cocktail.id}
        style={styles.cocktailCard}
        onPress={() => navigation.navigate("CocktailDetail", { cocktail })}
      >
        <TexturedBackground
          textureType="subtle"
          style={[styles.cocktailCardBg, { backgroundColor: getBgColor(cocktail.name) }]}
        >
          <View style={styles.cocktailCardContent}>
            <View style={styles.cocktailCardInfo}>
              <Text style={styles.cocktailCardName}>{cocktail.name}</Text>
              <View style={styles.ratingContainer}>{renderStars(cocktail.rating)}</View>
            </View>
            <Text style={styles.cocktailCardPrice}>${cocktail.price}</Text>
          </View>
          <Image source={cocktailImage} style={styles.cocktailCardImage} resizeMode="contain" />
        </TexturedBackground>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello {userPreferences.name ? userPreferences.name : "Cocktail Lover"}!</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        {/* Featured Cocktail */}
        {renderFeaturedCocktail()}

        {/* Categories */}
        <View style={styles.categoryContainer}>
          {renderCategoryItem("https://cdn-icons-png.flaticon.com/128/6866/6866599.png", "Citrus", "#FFEBE5")}
          {renderCategoryItem("https://cdn-icons-png.flaticon.com/128/2738/2738730.png", "Beer", "#F5E6D8")}
          {renderCategoryItem("https://cdn-icons-png.flaticon.com/128/2405/2405862.png", "Exotic", "#FFE8E8")}
          {renderCategoryItem("https://cdn-icons-png.flaticon.com/128/2372/2372152.png", "Vegan", "#E5F7ED")}
        </View>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Cocktail List */}
        <View style={styles.cocktailsContainer}>
          {getFilteredCocktails().map((cocktail) => renderCocktailCard(cocktail))}
        </View>

        {/* Extra padding at bottom for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F0", // Soft pink background as in the image
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B5E62", // Muted purple-gray color from the image
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredBackground: {
    width: "100%",
    height: 180,
    borderRadius: 20,
  },
  featuredContent: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
  },
  featuredTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  featuredName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3F41", // Dark purple from the image
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  featuredImage: {
    width: 150,
    height: 150,
    position: "absolute",
    right: -20,
    bottom: -20,
    transform: [{ rotate: "15deg" }],
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  categoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  categoryItem: {
    alignItems: "center",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconImage: {
    width: 24,
    height: 24,
  },
  categoryText: {
    fontSize: 12,
    color: "#6B5E62", // Muted purple-gray color from the image
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0E0E0",
  },
  tabItem: {
    marginRight: 25,
    paddingBottom: 10,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF6B6B",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#B0A0A0", // Muted color for inactive tabs
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  activeTabText: {
    color: "#4A3F41", // Dark color for active tab
    fontWeight: "600",
  },
  cocktailsContainer: {
    paddingHorizontal: 20,
  },
  cocktailCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cocktailCardBg: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    borderRadius: 15,
  },
  cocktailCardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
  },
  cocktailCardInfo: {
    flex: 1,
  },
  cocktailCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41", // Dark purple from the image
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  cocktailCardPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5E62", // Muted purple-gray color from the image
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  cocktailCardImage: {
    width: 80,
    height: 80,
    marginRight: 5,
  },
  bottomPadding: {
    height: 60,
  },
})
