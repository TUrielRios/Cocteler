"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getLocalImage } from "../utils/imageMapping"
import { useOnboarding } from "../context/OnboardingContext"
import { useFavorites } from "../context/FavoritesContext"
import { useLanguage } from "../context/LanguageContext"
import TexturedBackground from "../components/TexturedBackground"

// Get screen dimensions
const { width } = Dimensions.get("window")
const cardWidth = width - 40 // Card width with margins

// Category data
const categories = [
  {
    id: "citrus",
    name: "Citrus",
    icon: "nutrition-outline",
    gradient: ["#FF9E7A", "#FFCA80"],
    description: "Zesty & refreshing",
  },
  {
    id: "beer",
    name: "Beer",
    icon: "beer-outline",
    gradient: ["#60A5FA", "#93C5FD"],
    description: "Hoppy & malty",
  },
  {
    id: "exotic",
    name: "Exotic",
    icon: "globe-outline",
    gradient: ["#A78BFA", "#C4B5FD"],
    description: "Unique flavors",
  },
  {
    id: "vegan",
    name: "Vegan",
    icon: "leaf-outline",
    gradient: ["#34D399", "#6EE7B7"],
    description: "Plant-based",
  },
]

export default function HomeScreen({ navigation }) {
  const [cocktails, setCocktails] = useState([])
  const [featuredCocktail, setFeaturedCocktail] = useState(null)
  const [activeTab, setActiveTab] = useState("Recommended")
  const [selectedCategory, setSelectedCategory] = useState(null)
  const insets = useSafeAreaInsets()
  const { userPreferences } = useOnboarding()
  const { favorites } = useFavorites()
  const { cocktailsData, t } = useLanguage()

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const fadeAnim = useRef(new Animated.Value(0)).current
  const categoryAnimations = useRef(categories.map(() => new Animated.Value(0))).current

  // Tabs for filtering
  const tabs = ["Recommended", "Popular", "Newest"]

  useEffect(() => {
    // Get the featured cocktail (Union Square)
    const featured = cocktailsData.find((cocktail) => cocktail.name === "Union Square")
    setFeaturedCocktail(featured)

    // Get the rest of the cocktails
    const otherCocktails = cocktailsData.filter((cocktail) => cocktail.name !== "Union Square")
    setCocktails(otherCocktails)

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Staggered animation for categories
    Animated.stagger(
      100,
      categoryAnimations.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ),
    ).start()
  }, [cocktailsData])

  // Filter cocktails based on active tab and limit to 5
  const getFilteredCocktails = () => {
    let filtered = [...cocktails]

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter((cocktail) => {
        if (selectedCategory === "citrus") return cocktail.category === "Citrus" || cocktail.category === "Cítrico"
        if (selectedCategory === "beer") return cocktail.name.toLowerCase().includes("beer")
        if (selectedCategory === "exotic") return cocktail.category === "Exotic" || cocktail.category === "Exótico"
        if (selectedCategory === "vegan") return !cocktail.ingredients.some((i) => i.name.includes("Cream"))
        return true
      })
    }

    // Apply tab filter
    switch (activeTab) {
      case "Popular":
        filtered = filtered.sort((a, b) => b.rating - a.rating)
        break
      case "Newest":
        filtered = filtered.reverse()
        break
      case "Recommended":
      default:
        // For recommended, prioritize based on user preferences if available
        if (userPreferences.tastePreferences) {
          filtered = filtered.sort((a, b) => {
            // Simple algorithm to match user preferences with cocktail taste profiles
            if (a.taste && b.taste) {
              const aScore =
                Math.abs(a.taste.sweet - userPreferences.tastePreferences.sweet) +
                Math.abs(a.taste.sour - userPreferences.tastePreferences.sour) +
                Math.abs(a.taste.bitter - userPreferences.tastePreferences.bitter) +
                Math.abs(a.taste.spicy - userPreferences.tastePreferences.spicy)

              const bScore =
                Math.abs(b.taste.sweet - userPreferences.tastePreferences.sweet) +
                Math.abs(b.taste.sour - userPreferences.tastePreferences.sour) +
                Math.abs(b.taste.bitter - userPreferences.tastePreferences.bitter) +
                Math.abs(b.taste.spicy - userPreferences.tastePreferences.spicy)

              return aScore - bScore // Lower score means better match
            }
            return 0
          })
        }
        break
    }

    // Limit to 5 cocktails
    return filtered.slice(0, 5)
  }

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  // Handle category selection
  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId)
  }

  // Render category item with animated appearance
  const renderCategoryItem = (category, index) => (
    <Animated.View
      key={category.id}
      style={{
        opacity: categoryAnimations[index],
        transform: [
          {
            translateY: categoryAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[styles.categoryItem, selectedCategory === category.id && styles.categoryItemSelected]}
        onPress={() => handleCategoryPress(category.id)}
      >
        <LinearGradient
          colors={category.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.categoryIcon}
        >
          <Ionicons name={category.icon} size={24} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.categoryTextContainer}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
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
        <LinearGradient
          colors={["#FF9A9E", "#FECFEF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredBackground}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredTextContainer}>
              <Text style={styles.featuredLabel}>{t("featuredCocktail")}</Text>
              <Text style={styles.featuredName}>{featuredCocktail.name}</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={`star-${star}`}
                    name={
                      star <= Math.floor(featuredCocktail.rating)
                        ? "star"
                        : star <= featuredCocktail.rating + 0.5
                          ? "star-half"
                          : "star-outline"
                    }
                    size={16}
                    color="#FFFFFF"
                    style={styles.star}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.featuredButton}>
                <Text style={styles.featuredButtonText}>{t("viewRecipe")}</Text>
              </TouchableOpacity>
            </View>
            <Image source={cocktailImage} style={styles.featuredImage} resizeMode="contain" />
          </View>
        </LinearGradient>
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
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{t(tab.toLowerCase())}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )

  // Replace the renderCocktailCard function with this version that uses the original design
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
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons
                    key={`star-${star}`}
                    name={
                      star <= Math.floor(cocktail.rating)
                        ? "star"
                        : star <= cocktail.rating + 0.5
                          ? "star-half"
                          : "star-outline"
                    }
                    size={14}
                    color="#FF6B6B"
                    style={styles.star}
                  />
                ))}
              </View>
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
      {/* Animated header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Cocktails</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnim }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{t("hello")}</Text>
            <Text style={styles.userName}>{userPreferences.name ? userPreferences.name : "Cocktail Lover"}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.defaultProfileIcon}>
              <Ionicons name="person-outline" size={24} color="#A78BFA" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Featured Cocktail */}
        {renderFeaturedCocktail()}

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("categories")}</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>{t("seeAll")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
          {categories.map((category, index) => renderCategoryItem(category, index))}
        </ScrollView>

        {/* Tab Bar */}
        {renderTabBar()}

        {/* Cocktail List */}
        <View style={styles.cocktailsContainer}>
          {getFilteredCocktails().map((cocktail) => renderCocktailCard(cocktail))}
        </View>

        {/* Extra padding at bottom for navigation */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5", // Soft pink background
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
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
    fontSize: 16,
    color: "#6B5E62", // Muted purple-gray color
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4A3F41", // Dark purple
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  defaultProfileIcon: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F0EAFF",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
  featuredLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  featuredName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF", // White text for contrast
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  featuredImage: {
    width: 150,
    height: 150,
    position: "absolute",
    right: -20,
    bottom: -20,
    transform: [{ rotate: "15deg" }],
  },
  featuredButton: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  featuredButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A3F41",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  categoryContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryItemSelected: {
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 2,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  categoryDescription: {
    fontSize: 12,
    color: "#6B5E62",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  tabBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 25,
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
  // Update the cocktail card styles to match the original design
  // Replace these style definitions in the styles object
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
    height: 80,
  },
})
