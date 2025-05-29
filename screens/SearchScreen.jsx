"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { getLocalImage } from "../utils/imageMapping"
import BottomNavigation from "../components/BottomNavigation"
import StarRating from "../components/StarRating"
import FavoriteButton from "../components/FavoriteButton"
// Cambiar la importación directa de cocktailsData
// import cocktailsData from "../api.json"
import { LinearGradient } from "expo-linear-gradient"
// Por la importación desde el contexto de idioma
import { useLanguage } from "../context/LanguageContext"

const { width } = Dimensions.get("window")
const cardWidth = width * 0.7 // Card width for horizontal scroll

// Replace the lightenColor function with this new function that creates a very soft tint
const createSoftTint = (color, intensity = 0.15) => {
  // If color is not in hex format or not provided, return white
  if (!color || !color.startsWith("#")) {
    return "#FFFFFF"
  }

  // Remove the # if it exists
  color = color.replace("#", "")

  // Parse the hex values
  let r = Number.parseInt(color.substring(0, 2), 16)
  let g = Number.parseInt(color.substring(2, 4), 16)
  let b = Number.parseInt(color.substring(4, 6), 16)

  // Create a very soft tint by mixing with white
  r = Math.round(255 - (255 - r) * intensity)
  g = Math.round(255 - (255 - g) * intensity)
  b = Math.round(255 - (255 - b) * intensity)

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}

export default function SearchScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [categories, setCategories] = useState([])
  // Y luego en el componente, cambiar:
  // const { t } = useLanguage()
  const { t, cocktailsData } = useLanguage()

  useEffect(() => {
    // Create category data
    const categoryData = [
      {
        id: "party",
        title: t("partyCategory"),
        description: t("partyDescription"),
        icon: "wine",
        filter: (cocktail) =>
          cocktail.occasion &&
          cocktail.occasion.some((occ) => ["evening", "celebration", "social gathering"].includes(occ.toLowerCase())),
      },
      {
        id: "brunch",
        title: t("brunchCategory"),
        description: t("brunchDescription"),
        icon: "sunny",
        filter: (cocktail) =>
          cocktail.occasion && cocktail.occasion.some((occ) => ["brunch", "afternoon"].includes(occ.toLowerCase())),
      },
      {
        id: "summer",
        title: t("summerCategory"),
        description: t("summerDescription"),
        icon: "ice-cream",
        filter: (cocktail) =>
          cocktail.occasion && cocktail.occasion.some((occ) => ["summer", "beach"].includes(occ.toLowerCase())),
      },
      {
        id: "easy",
        title: t("easyCategory"),
        description: t("easyDescription"),
        icon: "timer",
        filter: (cocktail) =>
          cocktail.difficulty === "Easy" || (cocktail.preparationTime && cocktail.preparationTime.includes("3")),
      },
      {
        id: "citrus",
        title: t("citrusCategory"),
        description: t("citrusDescription"),
        icon: "nutrition",
        filter: (cocktail) => cocktail.category === "Citrus",
      },
      {
        id: "classic",
        title: t("classicCategory"),
        description: t("classicDescription"),
        icon: "book",
        filter: (cocktail) => cocktail.category === "Classic",
      },
      {
        id: "exotic",
        title: t("exoticCategory"),
        description: t("exoticDescription"),
        icon: "globe",
        filter: (cocktail) => cocktail.category === "Exotic",
      },
      {
        id: "sweet",
        title: t("sweetCategory"),
        description: t("sweetDescription"),
        icon: "cafe",
        filter: (cocktail) => cocktail.taste && cocktail.taste.sweet >= 3,
      },
      {
        id: "sophisticated",
        title: t("sophisticatedCategory"),
        description: t("sophisticatedDescription"),
        icon: "diamond",
        filter: (cocktail) => {
          const alcoholContent = Number.parseInt(cocktail.alcoholContent)
          return !isNaN(alcoholContent) && alcoholContent > 20
        },
      },
      {
        id: "lowcal",
        title: t("lowcalCategory"),
        description: t("lowcalDescription"),
        icon: "leaf",
        filter: (cocktail) => cocktail.calories < 180,
      },
    ]

    // Process each category to add its cocktails
    const processedCategories = categoryData.map((category) => {
      const filteredCocktails = cocktailsData.filter(category.filter)
      return {
        ...category,
        cocktails: filteredCocktails,
      }
    })

    // Only keep categories that have cocktails
    setCategories(processedCategories.filter((cat) => cat.cocktails.length > 0))
  }, [cocktailsData, t])

  // Handle search
  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([])
      return
    }

    const results = cocktailsData.filter(
      (cocktail) =>
        cocktail.name.toLowerCase().includes(searchText.toLowerCase()) ||
        cocktail.category.toLowerCase().includes(searchText.toLowerCase()) ||
        (cocktail.ingredients &&
          cocktail.ingredients.some((ing) => ing.name.toLowerCase().includes(searchText.toLowerCase()))),
    )

    setSearchResults(results)
  }, [searchText, cocktailsData])

  // Update the renderCocktailCard function to use white to soft tint gradient
  const renderCocktailCard = ({ item }) => {
    // Get the local image for the cocktail
    const localImagePath = item.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    // Get the background color from the cocktail data or use a default
    const baseColor = item.backgroundColor || "#F9F9F9"
    // Create a very soft tint for the gradient
    const softTint = createSoftTint(baseColor, 0.3)

    return (
      <TouchableOpacity
        style={styles.cocktailCard}
        onPress={() => navigation.navigate("CocktailDetail", { cocktail: item })}
      >
        <LinearGradient
          colors={["#FFFFFF", softTint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cocktailCardBg}
        >
          <View style={styles.cocktailCardFooter}>
            <FavoriteButton cocktailId={item.id} size={18} />
          </View>
          <Image source={cocktailImage} style={styles.cocktailCardImage} resizeMode="contain" />
          <View style={styles.cocktailCardContent}>
            <Text style={styles.cocktailCardName}>{item.name}</Text>
            <Text style={styles.cocktailCardCategory}>{item.category}</Text>
            <StarRating rating={item.rating} size={14} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Render a category section
  const renderCategorySection = (category) => {
    if (category.cocktails.length === 0) return null

    return (
      <View key={category.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryIconContainer}>
            <Ionicons name={category.icon} size={18} color="#FFFFFF" />
          </View>
          <View style={styles.categoryTitleContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryDescription}>{category.description}</Text>
          </View>
        </View>

        <FlatList
          data={category.cocktails}
          renderItem={renderCocktailCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cocktailsListContent}
        />
      </View>
    )
  }

  // Update the search results rendering to also use white to soft tint gradients
  const renderSearchResults = () => {
    if (searchText.trim() === "") return null

    return (
      <View style={styles.searchResultsContainer}>
        <Text style={styles.searchResultsTitle}>
          {searchResults.length > 0 ? `Found ${searchResults.length} results` : "No results found"}
        </Text>

        {searchResults.length > 0 ? (
          <View style={styles.searchResultsGrid}>
            {searchResults.map((cocktail) => {
              // Get the background color from the cocktail data or use a default
              const baseColor = cocktail.backgroundColor || "#F9F9F9"
              // Create a very soft tint for the gradient
              const softTint = createSoftTint(baseColor, 0.3)

              return (
                <TouchableOpacity
                  key={cocktail.id}
                  style={styles.searchResultCard}
                  onPress={() => navigation.navigate("CocktailDetail", { cocktail })}
                >
                  <LinearGradient
                    colors={["#FFFFFF", softTint]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.searchResultCardBg}
                  >
                    <Image
                      source={getLocalImage(cocktail.imageLocal?.replace("require('", "").replace("')", ""))}
                      style={styles.searchResultCardImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.searchResultCardName}>{cocktail.name}</Text>
                    <Text style={styles.searchResultCardCategory}>{cocktail.category}</Text>
                    <FavoriteButton cocktailId={cocktail.id} size={18} style={styles.searchResultFavorite} />
                  </LinearGradient>
                </TouchableOpacity>
              )
            })}
          </View>
        ) : (
          <TexturedBackground textureType="pinkLight" style={styles.noResultsContainer}>
            <Ionicons name="search-outline" size={50} color="#FF6B6B" />
            <Text style={styles.noResultsText}>
              {t("noResults")} "{searchText}"
            </Text>
            <Text style={styles.noResultsSubtext}>{t("tryDifferent")}</Text>
          </TexturedBackground>
        )}
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <TexturedBackground textureType="pinkLight" style={styles.header}>
          <Text style={styles.headerTitle}>{t("discover")}</Text>
          <Text style={styles.headerSubtitle}>{t("findPerfectCocktail")}</Text>
        </TexturedBackground>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#AAAAAA" />
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchPlaceholder")}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
              placeholderTextColor="#AAAAAA"
            />
            {searchText.trim() !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#AAAAAA" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search Results or Categories */}
        {searchText.trim() !== "" ? (
          renderSearchResults()
        ) : (
          <View style={styles.categoriesContainer}>{categories.map(renderCategorySection)}</View>
        )}

        {/* Extra padding at bottom for navigation */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomNavigation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5", // Soft pink background
  },
  scrollContent: {
    paddingBottom: 100,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -25,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#4A3F41",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  clearButton: {
    padding: 5,
  },
  categoriesContainer: {
    paddingTop: 20,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  categoryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.3,
  },
  categoryDescription: {
    fontSize: 12,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  cocktailsListContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  cocktailCard: {
    width: 170,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cocktailCardBg: {
    borderRadius: 15,
    padding: 15,
    height: 250,
    position: "relative",
  },
  cocktailCardImage: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
  },
  cocktailCardContent: {
    flex: 1,
  },
  cocktailCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A3F41",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  cocktailCardCategory: {
    fontSize: 10,
    color: "#6B5E62",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  cocktailCardFooter: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  searchResultCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultCardBg: {
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    height: 160,
    position: "relative",
  },
  searchResultCardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  searchResultCardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  searchResultCardCategory: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
  },
  searchResultFavorite: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  noResultsContainer: {
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 5,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.3,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  bottomPadding: {
    height: 80,
  },
})
