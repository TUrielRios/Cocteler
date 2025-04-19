"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import TexturedBackground from "../components/TexturedBackground"
import { getLocalImage } from "../utils/imageMapping"
import BottomNavigation from "../components/BottomNavigation"
import StarRating from "../components/StarRating"
import FavoriteButton from "../components/FavoriteButton"
import { useFavorites } from "../context/favoritesContext"
import cocktailsData from "../data/api.json"

const { width } = Dimensions.get("window")
const cardWidth = (width - 50) / 2 // Two cards per row with margins

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { favorites, isLoading } = useFavorites()
  const [favoriteCocktails, setFavoriteCocktails] = useState([])

  // Get favorite cocktails whenever favorites change
  useEffect(() => {
    const cocktails = cocktailsData.filter((cocktail) => favorites.includes(cocktail.id))
    setFavoriteCocktails(cocktails)
  }, [favorites])

  // Render a favorite cocktail card
  const renderFavoriteCard = (cocktail) => {
    // Get the local image for the cocktail
    const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    return (
      <View key={cocktail.id} style={styles.favoriteCard}>
        <TexturedBackground textureType="subtle" style={styles.favoriteCardBg}>
          <TouchableOpacity
            style={styles.favoriteCardContent}
            onPress={() => navigation.navigate("CocktailDetail", { cocktail })}
          >
            <Image source={cocktailImage} style={styles.favoriteCardImage} resizeMode="contain" />
            <Text style={styles.favoriteCardName}>{cocktail.name}</Text>
            <Text style={styles.favoriteCardCategory}>{cocktail.category}</Text>
            <View style={styles.favoriteCardRating}>
              <StarRating rating={cocktail.rating} size={14} />
            </View>
          </TouchableOpacity>
          <FavoriteButton cocktailId={cocktail.id} style={styles.removeButton} />
        </TexturedBackground>
      </View>
    )
  }

  // Render empty state
  const renderEmptyState = () => {
    return (
      <TexturedBackground textureType="pinkLight" style={styles.emptyStateContainer}>
        <Ionicons name="heart-outline" size={60} color="#FF6B6B" />
        <Text style={styles.emptyStateTitle}>No favorites yet</Text>
        <Text style={styles.emptyStateText}>Tap the heart icon on any cocktail to add it to your favorites</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.exploreButtonText}>Explore Cocktails</Text>
        </TouchableOpacity>
      </TexturedBackground>
    )
  }

  // Render loading state
  const renderLoadingState = () => {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <TexturedBackground textureType="pinkLight" style={styles.header}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>Your saved cocktails</Text>
        </TexturedBackground>

        {/* Content */}
        <View style={styles.content}>
          {isLoading ? (
            renderLoadingState()
          ) : favoriteCocktails.length > 0 ? (
            <>
              <View style={styles.favoritesHeader}>
                <Text style={styles.favoritesTitle}>Your Collection</Text>
                <Text style={styles.favoritesCount}>{favoriteCocktails.length} cocktails</Text>
              </View>
              <View style={styles.favoritesGrid}>{favoriteCocktails.map(renderFavoriteCard)}</View>
            </>
          ) : (
            renderEmptyState()
          )}
        </View>

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
    minHeight: "100%",
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
  favoritesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.3,
  },
  favoritesCount: {
    fontSize: 14,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  favoritesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  favoriteCard: {
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
  favoriteCardBg: {
    borderRadius: 15,
    padding: 15,
    height: 200,
    position: "relative",
  },
  favoriteCardContent: {
    alignItems: "center",
  },
  favoriteCardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  favoriteCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginBottom: 4,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.2,
  },
  favoriteCardCategory: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 8,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  favoriteCardRating: {
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  emptyStateContainer: {
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    // In a real app, we would use a custom font
    // fontFamily: "Playfair Display",
    letterSpacing: 0.3,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 20,
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
    paddingHorizontal: 20,
  },
  exploreButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
    letterSpacing: 0.2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B5E62",
    // In a real app, we would use a custom font
    // fontFamily: "Poppins",
  },
  bottomPadding: {
    height: 80,
  },
})
