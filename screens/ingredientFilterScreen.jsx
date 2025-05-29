"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Animated,
  Platform,
  FlatList,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getLocalImage } from "../utils/imageMapping"
import BottomNavigation from "../components/BottomNavigation"
// Cambiar la importación directa de cocktailsData
// import cocktailsData from "../api.json"
import StarRating from "../components/StarRating"
import FavoriteButton from "../components/FavoriteButton"
// Por la importación desde el contexto de idioma
import { useLanguage } from "../context/LanguageContext"

const { width } = Dimensions.get("window")
const cardWidth = (width - 60) / 2 // Two cards per row with margins

// Ingredient icons mapping
const ingredientIcons = {
  gin: "flask-outline",
  vodka: "wine-outline",
  rum: "beer-outline",
  tequila: "wine-outline",
  whiskey: "wine-outline",
  lime: "nutrition-outline",
  lemon: "nutrition-outline",
  orange: "nutrition-outline",
  mint: "leaf-outline",
  soda: "water-outline",
  vermouth: "wine-outline",
  grenadine: "color-fill-outline",
  sugar: "cube-outline",
  aperol: "wine-outline",
  prosecco: "wine-outline",
  // Default icon for anything not specified
  default: "ellipse-outline",
}

// Ingredient colors for visual variety
const ingredientColors = [
  ["#FF6B6B", "#FF8E8E"], // Red
  ["#4ECDC4", "#6EE7B7"], // Teal
  ["#A78BFA", "#C4B5FD"], // Purple
  ["#F59E0B", "#FBBF24"], // Amber
  ["#60A5FA", "#93C5FD"], // Blue
  ["#EC4899", "#F472B6"], // Pink
]

export default function IngredientFilterScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [matchingCocktails, setMatchingCocktails] = useState([])
  const [popularIngredients, setPopularIngredients] = useState([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false)
  const accordionHeight = useRef(new Animated.Value(0)).current
  // Y luego en el componente, cambiar:
  // const { t } = useLanguage()
  const { t, cocktailsData } = useLanguage()

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const searchBarAnim = useRef(new Animated.Value(0)).current
  const scrollY = useRef(new Animated.Value(0)).current

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  // Extract all unique ingredients from cocktails data
  useEffect(() => {
    const allIngredients = new Set()
    cocktailsData.forEach((cocktail) => {
      cocktail.ingredients.forEach((ingredient) => {
        allIngredients.add(ingredient.name.toLowerCase())
      })
    })

    // Set popular ingredients with translations
    setPopularIngredients([
      t("gin"),
      t("vodka"),
      t("rum"),
      t("tequila"),
      t("whiskey"),
      t("lime"),
      t("lemon"),
      t("orange"),
      t("mint"),
      t("soda"),
      t("vermouth"),
      t("grenadine"),
      t("sugar"),
      t("aperol"),
      t("prosecco"),
    ])

    // Entrance animation
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
  }, [cocktailsData, t])

  // Filter cocktails based on selected ingredients
  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setMatchingCocktails([])
      return
    }

    const filtered = cocktailsData.filter((cocktail) => {
      // Check if all selected ingredients are in this cocktail
      const cocktailIngredients = cocktail.ingredients.map((i) => i.name.toLowerCase())
      return selectedIngredients.every((selected) =>
        cocktailIngredients.some((ingredient) => ingredient.toLowerCase().includes(selected.toLowerCase())),
      )
    })

    setMatchingCocktails(filtered)
  }, [selectedIngredients, cocktailsData])

  // Add an ingredient to the selected list
  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient) && ingredient.trim() !== "") {
      // Animate the search bar
      Animated.sequence([
        Animated.timing(searchBarAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(searchBarAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start()

      setSelectedIngredients([...selectedIngredients, ingredient])
      setSearchText("")
    }
  }

  // Remove an ingredient from the selected list
  const removeIngredient = (ingredient) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item !== ingredient))
  }

  // Filter popular ingredients based on search text
  const getFilteredIngredients = () => {
    if (!searchText) return []
    return popularIngredients.filter(
      (ingredient) =>
        ingredient.toLowerCase().includes(searchText.toLowerCase()) && !selectedIngredients.includes(ingredient),
    )
  }

  // Get icon for ingredient
  const getIngredientIcon = (ingredient) => {
    const key = ingredient.toLowerCase()
    for (const [name, icon] of Object.entries(ingredientIcons)) {
      if (key.includes(name)) {
        return icon
      }
    }
    return ingredientIcons.default
  }

  // Get color for ingredient
  const getIngredientColor = (ingredient) => {
    // Use the first character of the ingredient name to determine color
    const index = ingredient.charCodeAt(0) % ingredientColors.length
    return ingredientColors[index]
  }

  // Render an ingredient chip
  const renderIngredientChip = (ingredient, isSelected = false) => {
    const colors = getIngredientColor(ingredient)

    return (
      <TouchableOpacity
        key={ingredient}
        style={[
          styles.ingredientChip,
          isSelected
            ? { backgroundColor: colors[0] }
            : { backgroundColor: "#FFF5F5", borderColor: colors[0], borderWidth: 1 },
        ]}
        onPress={() => (isSelected ? removeIngredient(ingredient) : addIngredient(ingredient))}
      >
        <Ionicons
          name={getIngredientIcon(ingredient)}
          size={16}
          color={isSelected ? "#FFFFFF" : colors[0]}
          style={styles.ingredientIcon}
        />
        <Text style={[styles.ingredientChipText, isSelected ? { color: "#FFFFFF" } : { color: "#4A3F41" }]}>
          {ingredient}
        </Text>
        {isSelected && <Ionicons name="close-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />}
      </TouchableOpacity>
    )
  }

  // Create a soft tint from a color
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

  // Toggle accordion expansion
  const toggleAccordion = () => {
    const toValue = isAccordionExpanded ? 0 : 1

    Animated.timing(accordionHeight, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start()

    setIsAccordionExpanded(!isAccordionExpanded)
  }

  // Render a cocktail card in the same style as SearchScreen
  const renderCocktailCard = ({ item }) => {
    // Get the local image for the cocktail
    const localImagePath = item.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    // Get the background color from the cocktail data or use a default
    const baseColor = item.backgroundColor || "#F9F9F9"
    // Create a very soft tint for the gradient
    const softTint = createSoftTint(baseColor, 0.3)

    // Calculate how many ingredients the user has
    const cocktailIngredients = item.ingredients.map((i) => i.name.toLowerCase())
    const userHasIngredients = selectedIngredients.filter((selected) =>
      cocktailIngredients.some((ingredient) => ingredient.toLowerCase().includes(selected.toLowerCase())),
    ).length

    const percentComplete = Math.round((userHasIngredients / cocktailIngredients.length) * 100)

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
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>
                {percentComplete}% {t("match")}
              </Text>
            </View>
          </View>
        </LinearGradient>
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
        <Text style={styles.headerTitle}>{t("mixYourCocktail")}</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        {/* Header with gradient background */}
        <LinearGradient
          colors={["#FF9A9E", "#FECFEF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{t("mixYourCocktail")}</Text>
            <Text style={styles.headerSubtitle}>{t("findRecipes")}</Text>
          </View>
          <View style={styles.headerImageContainer}>
            <Image
              source={getLocalImage("../assets/images/cocktails/aperolSpritz.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        {/* Search bar */}
        <Animated.View
          style={[
            styles.searchContainer,
            {
              transform: [
                {
                  scale: searchBarAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.03],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
            <Ionicons name="search" size={20} color={isSearchFocused ? "#FF6B6B" : "#AAAAAA"} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("searchIngredients")}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => searchText.trim() && addIngredient(searchText)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              returnKeyType="done"
              placeholderTextColor="#AAAAAA"
            />
            {searchText.trim() && (
              <TouchableOpacity onPress={() => addIngredient(searchText)} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Search results */}
        {searchText.length > 0 && getFilteredIngredients().length > 0 && (
          <View style={styles.searchResults}>
            {getFilteredIngredients().map((ingredient) => (
              <TouchableOpacity
                key={ingredient}
                style={styles.searchResultItem}
                onPress={() => addIngredient(ingredient)}
              >
                <Ionicons name={getIngredientIcon(ingredient)} size={20} color={getIngredientColor(ingredient)[0]} />
                <Text style={styles.searchResultText}>{ingredient}</Text>
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={getIngredientColor(ingredient)[0]}
                  style={styles.addIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected ingredients */}
        <View style={styles.selectedIngredientsContainer}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={["#FF6B6B", "#FF8E8E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionIconContainer}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>{t("yourIngredients")}</Text>
            {selectedIngredients.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{selectedIngredients.length}</Text>
              </View>
            )}
          </View>
          <LinearGradient
            colors={["#FFFFFF", "#F9F9F9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.selectedIngredientsCard}
          >
            {selectedIngredients.length > 0 ? (
              <View style={styles.ingredientChipsContainer}>
                {selectedIngredients.map((ingredient) => renderIngredientChip(ingredient, true))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="basket-outline" size={40} color="#FFCACA" />
                <Text style={styles.emptyStateText}>{t("addIngredients")}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Popular ingredients */}
        <View style={styles.popularIngredientsContainer}>
          <View style={styles.sectionTitleContainer}>
            <LinearGradient
              colors={["#F59E0B", "#FBBF24"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sectionIconContainer}
            >
              <Ionicons name="star" size={20} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>{t("popularIngredients")}</Text>
          </View>
          <LinearGradient
            colors={["#FFFFFF", "#F9F9F9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.popularIngredientsCard}
          >
            <View style={styles.ingredientChipsContainer}>
              {popularIngredients
                .slice(0, 10)
                .map((ingredient) => !selectedIngredients.includes(ingredient) && renderIngredientChip(ingredient))}
            </View>
          </LinearGradient>
        </View>

        {/* Matching cocktails */}
        {selectedIngredients.length > 0 && (
          <View style={styles.matchingCocktailsContainer}>
            <TouchableOpacity style={styles.accordionHeader} onPress={toggleAccordion}>
              <View style={styles.sectionTitleContainer}>
                <LinearGradient
                  colors={["#4ECDC4", "#6EE7B7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sectionIconContainer}
                >
                  <Ionicons name="wine" size={20} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.sectionTitle}>
                  {matchingCocktails.length > 0
                    ? `${t("cocktailsYouCanMake")} (${matchingCocktails.length})`
                    : t("noMatchingCocktailsFound")}
                </Text>
              </View>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: accordionHeight.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                }}
              >
                <Ionicons name="chevron-down" size={24} color="#4A3F41" />
              </Animated.View>
            </TouchableOpacity>

            <Animated.View
              style={{
                maxHeight: accordionHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1000],
                }),
                overflow: "hidden",
                opacity: accordionHeight,
              }}
            >
              {matchingCocktails.length > 0 ? (
                <FlatList
                  data={matchingCocktails}
                  renderItem={renderCocktailCard}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cocktailsListContent}
                />
              ) : (
                <View style={styles.noMatchContainer}>
                  <LinearGradient
                    colors={["#FFF5F5", "#FFE6E6"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.noMatchBg}
                  >
                    <Ionicons name="wine-outline" size={50} color="#FF6B6B" />
                    <Text style={styles.noMatchTitle}>{t("noMatchesFound")}</Text>
                    <Text style={styles.noMatchText}>{t("tryAddingMore")}</Text>
                  </LinearGradient>
                </View>
              )}
            </Animated.View>
          </View>
        )}

        {/* Extra padding at bottom for navigation */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>

      <BottomNavigation />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 160,
    overflow: "hidden",
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  headerImageContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 120,
    height: 120,
    transform: [{ rotate: "15deg" }],
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: -25,
    zIndex: 10,
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
  searchBarFocused: {
    borderWidth: 1,
    borderColor: "#FF6B6B",
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#4A3F41",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
  },
  searchResults: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  searchResultText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#4A3F41",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  addIcon: {
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.3,
  },
  countBadge: {
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  countBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  selectedIngredientsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  selectedIngredientsCard: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 100,
  },
  ingredientChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  ingredientChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  ingredientIcon: {
    marginRight: 5,
  },
  ingredientChipText: {
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.2,
  },
  chipIcon: {
    marginLeft: 5,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    marginTop: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.2,
  },
  popularIngredientsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  popularIngredientsCard: {
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    alignItems: "center",
  },
  cocktailCardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4A3F41",
    marginBottom: 4,
    textAlign: "center",
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
  cocktailsListContent: {
    paddingVertical: 15,
    paddingLeft: 5,
    paddingRight: 20,
  },
  matchBadge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  matchBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingRight: 10,
  },
  noMatchContainer: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 15,
  },
  matchingCocktailsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  cocktailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  noMatchContainer: {
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noMatchBg: {
    padding: 30,
    alignItems: "center",
    borderRadius: 15,
  },
  noMatchTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    marginTop: 15,
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.3,
  },
  noMatchText: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    letterSpacing: 0.2,
  },
  bottomPadding: {
    height: 80,
  },
})
