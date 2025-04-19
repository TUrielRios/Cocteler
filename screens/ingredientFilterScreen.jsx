"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { getLocalImage } from "../utils/imageMapping"
import BottomNavigation from "../components/BottomNavigation"
import cocktailsData from "../data/api.json"

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

export default function IngredientFilterScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const [searchText, setSearchText] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [matchingCocktails, setMatchingCocktails] = useState([])
  const [popularIngredients, setPopularIngredients] = useState([])

  // Extract all unique ingredients from cocktails data
  useEffect(() => {
    const allIngredients = new Set()
    cocktailsData.forEach((cocktail) => {
      cocktail.ingredients.forEach((ingredient) => {
        allIngredients.add(ingredient.name.toLowerCase())
      })
    })

    // Set some popular ingredients
    setPopularIngredients([
      "Gin",
      "Vodka",
      "Rum",
      "Tequila",
      "Whiskey",
      "Lime",
      "Lemon",
      "Orange",
      "Mint",
      "Soda",
      "Vermouth",
      "Grenadine",
      "Sugar",
      "Aperol",
      "Prosecco",
    ])
  }, [])

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
  }, [selectedIngredients])

  // Add an ingredient to the selected list
  const addIngredient = (ingredient) => {
    if (!selectedIngredients.includes(ingredient) && ingredient.trim() !== "") {
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

  // Render an ingredient chip
  const renderIngredientChip = (ingredient, isSelected = false) => {
    return (
      <TouchableOpacity
        key={ingredient}
        style={[
          styles.ingredientChip,
          isSelected
            ? { backgroundColor: "#FF6B6B" }
            : { backgroundColor: "#FFF5F5", borderColor: "#FFCACA", borderWidth: 1 },
        ]}
        onPress={() => (isSelected ? removeIngredient(ingredient) : addIngredient(ingredient))}
      >
        <Ionicons
          name={getIngredientIcon(ingredient)}
          size={16}
          color={isSelected ? "#FFFFFF" : "#FF6B6B"}
          style={styles.ingredientIcon}
        />
        <Text style={[styles.ingredientChipText, isSelected ? { color: "#FFFFFF" } : { color: "#4A3F41" }]}>
          {ingredient}
        </Text>
        {isSelected && <Ionicons name="close-circle" size={16} color="#FFFFFF" style={styles.chipIcon} />}
      </TouchableOpacity>
    )
  }

  // Render a cocktail card
  const renderCocktailCard = (cocktail) => {
    // Get the local image for the cocktail
    const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    // Calculate how many ingredients the user has
    const cocktailIngredients = cocktail.ingredients.map((i) => i.name.toLowerCase())
    const userHasIngredients = selectedIngredients.filter((selected) =>
      cocktailIngredients.some((ingredient) => ingredient.toLowerCase().includes(selected.toLowerCase())),
    ).length

    const percentComplete = Math.round((userHasIngredients / cocktailIngredients.length) * 100)

    return (
      <TouchableOpacity
        key={cocktail.id}
        style={styles.cocktailCard}
        onPress={() => navigation.navigate("CocktailDetail", { cocktail })}
      >
        <TexturedBackground textureType="subtle" style={styles.cocktailCardBg}>
          <Image source={cocktailImage} style={styles.cocktailCardImage} resizeMode="contain" />
          <View style={styles.cocktailCardContent}>
            <Text style={styles.cocktailCardName}>{cocktail.name}</Text>
            <View style={styles.cocktailCardDetails}>
              <View style={styles.cocktailCardDetail}>
                <Ionicons name="wine-outline" size={14} color="#FF6B6B" />
                <Text style={styles.cocktailCardDetailText}>{cocktail.category}</Text>
              </View>
              <View style={styles.cocktailCardDetail}>
                <Ionicons name="list-outline" size={14} color="#FF6B6B" />
                <Text style={styles.cocktailCardDetailText}>{cocktail.ingredients.length} ingredients</Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${percentComplete}%` }]} />
            </View>
            <Text style={styles.progressText}>{percentComplete}% match</Text>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View Recipe</Text>
            </TouchableOpacity>
          </View>
        </TexturedBackground>
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with textured background */}
        <TexturedBackground textureType="pinkLight" style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Mix Your Cocktail</Text>
            <Text style={styles.headerSubtitle}>Find recipes with ingredients you have</Text>
          </View>
          <View style={styles.headerImageContainer}>
            <Image
              source={getLocalImage("../assets/images/cocktails/aperolSpritz.png")}
              style={styles.headerImage}
              resizeMode="contain"
            />
          </View>
        </TexturedBackground>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#AAAAAA" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search ingredients..."
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={() => searchText.trim() && addIngredient(searchText)}
              returnKeyType="done"
              placeholderTextColor="#AAAAAA"
            />
            {searchText.trim() && (
              <TouchableOpacity onPress={() => addIngredient(searchText)} style={styles.addButton}>
                <Ionicons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search results */}
        {searchText.length > 0 && getFilteredIngredients().length > 0 && (
          <View style={styles.searchResults}>
            {getFilteredIngredients().map((ingredient) => (
              <TouchableOpacity
                key={ingredient}
                style={styles.searchResultItem}
                onPress={() => addIngredient(ingredient)}
              >
                <Ionicons name={getIngredientIcon(ingredient)} size={20} color="#FF6B6B" />
                <Text style={styles.searchResultText}>{ingredient}</Text>
                <Ionicons name="add-circle" size={20} color="#FF6B6B" style={styles.addIcon} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Selected ingredients */}
        <View style={styles.selectedIngredientsContainer}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Your ingredients</Text>
            {selectedIngredients.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{selectedIngredients.length}</Text>
              </View>
            )}
          </View>
          <View style={styles.selectedIngredientsCard}>
            {selectedIngredients.length > 0 ? (
              <View style={styles.ingredientChipsContainer}>
                {selectedIngredients.map((ingredient) => renderIngredientChip(ingredient, true))}
              </View>
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="basket-outline" size={40} color="#FFCACA" />
                <Text style={styles.emptyStateText}>Add ingredients to see what cocktails you can make</Text>
              </View>
            )}
          </View>
        </View>

        {/* Popular ingredients */}
        <View style={styles.popularIngredientsContainer}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="star" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>Popular ingredients</Text>
          </View>
          <TexturedBackground textureType="subtle" style={styles.popularIngredientsCard}>
            <View style={styles.ingredientChipsContainer}>
              {popularIngredients
                .slice(0, 10)
                .map((ingredient) => !selectedIngredients.includes(ingredient) && renderIngredientChip(ingredient))}
            </View>
          </TexturedBackground>
        </View>

        {/* Matching cocktails */}
        {selectedIngredients.length > 0 && (
          <View style={styles.matchingCocktailsContainer}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="wine" size={20} color="#FF6B6B" />
              <Text style={styles.sectionTitle}>
                {matchingCocktails.length > 0
                  ? `Cocktails you can make (${matchingCocktails.length})`
                  : "No matching cocktails found"}
              </Text>
            </View>
            {matchingCocktails.length > 0 ? (
              <View style={styles.cocktailsGrid}>
                {matchingCocktails.map((cocktail) => renderCocktailCard(cocktail))}
              </View>
            ) : (
              <View style={styles.noMatchContainer}>
                <TexturedBackground textureType="pinkLight" style={styles.noMatchBg}>
                  <Ionicons name="wine-outline" size={50} color="#FF6B6B" />
                  <Text style={styles.noMatchTitle}>No matches found</Text>
                  <Text style={styles.noMatchText}>Try adding more ingredients to find matching cocktails</Text>
                </TexturedBackground>
              </View>
            )}
          </View>
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
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    height: 190,
    borderRadius: 30,
  },
  headerContent: {
    flex: 1,
    justifyContent: "center",
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
  headerImageContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: 270,
    height: 270,
    transform: [{ rotate: "15deg" }],
    
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
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
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  addIcon: {
    marginLeft: 10,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    marginLeft: 8,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
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
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  selectedIngredientsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  selectedIngredientsCard: {
    backgroundColor: "#FFFFFF",
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
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
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
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
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
  matchingCocktailsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  cocktailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cocktailCard: {
    width: cardWidth,
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
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    height: 240,
  },
  cocktailCardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cocktailCardContent: {
    width: "100%",
    alignItems: "center",
  },
  cocktailCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 5,
    textAlign: "center",
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.2,
  },
  cocktailCardDetails: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  cocktailCardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  cocktailCardDetailText: {
    fontSize: 12,
    color: "#6B5E62",
    marginLeft: 3,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    width: "100%",
    marginBottom: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#6B5E62",
    marginBottom: 10,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  viewButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
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
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.3,
  },
  noMatchText: {
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
