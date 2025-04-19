"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { getLocalImage } from "../utils/imageMapping"
import { useFavorites } from "../context/favoritesContext"

// Get screen dimensions
const { width, height } = Dimensions.get("window")

export default function CocktailDetailScreen({ route, navigation }) {
  const { cocktail } = route.params
  const insets = useSafeAreaInsets()
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(cocktail.id)

  // Get the local image for the cocktail
  const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
  const cocktailImage = getLocalImage(localImagePath)

  // State for active tab
  const [activeTab, setActiveTab] = useState("Description")

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  // Tabs for the sidebar
  const tabs = ["Description", "Ingredients", "Similar"]

  // Generate star rating component
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={18} color="#FF6B6B" style={styles.star} />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={18} color="#FF6B6B" style={styles.star} />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#CCCCCC" style={styles.star} />)
    }

    return stars
  }

  // Render the sidebar tabs
  const renderSidebar = () => (
    <View style={styles.sidebar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.sidebarTab, activeTab === tab && styles.sidebarTabActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text
            style={[
              styles.sidebarTabText,
              activeTab === tab && styles.sidebarTabTextActive,
              { transform: [{ rotate: "-90deg" }] },
            ]}
          >
            {tab}
          </Text>
          {activeTab === tab && <View style={styles.sidebarTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  )

  // Render the description content
  const renderDescription = () => (
    <View style={styles.contentSection}>
      <Text style={styles.descriptionText}>{cocktail.description}</Text>

      {cocktail.story && (
        <View style={styles.storySection}>
          <Text style={styles.sectionTitle}>The Story</Text>
          <Text style={styles.storyText}>{cocktail.story}</Text>
        </View>
      )}

      {cocktail.taste && (
        <View style={styles.tasteSection}>
          <Text style={styles.sectionTitle}>Taste Profile</Text>
          <View style={styles.tasteGrid}>
            <View style={styles.tasteItem}>
              <View style={[styles.tasteBar, { height: cocktail.taste.sweet * 10 }]} />
              <Text style={styles.tasteLabel}>Sweet</Text>
            </View>
            <View style={styles.tasteItem}>
              <View style={[styles.tasteBar, { height: cocktail.taste.sour * 10 }]} />
              <Text style={styles.tasteLabel}>Sour</Text>
            </View>
            <View style={styles.tasteItem}>
              <View style={[styles.tasteBar, { height: cocktail.taste.bitter * 10 }]} />
              <Text style={styles.tasteLabel}>Bitter</Text>
            </View>
            <View style={styles.tasteItem}>
              <View style={[styles.tasteBar, { height: cocktail.taste.spicy * 10 }]} />
              <Text style={styles.tasteLabel}>Spicy</Text>
            </View>
          </View>
        </View>
      )}

      {cocktail.occasion && (
        <View style={styles.occasionSection}>
          <Text style={styles.sectionTitle}>Perfect For</Text>
          <View style={styles.tagContainer}>
            {cocktail.occasion.map((occasion, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{occasion}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )

  // Render the ingredients content
  const renderIngredients = () => (
    <View style={styles.contentSection}>
      <View style={styles.ingredientsGrid}>
        {cocktail.ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientCard}>
            <View style={styles.ingredientIconContainer}>
              <Image source={{ uri: ingredient.icon }} style={styles.ingredientIcon} />
            </View>
            <Text style={styles.ingredientName}>{ingredient.name}</Text>
            <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.preparationSection}>
        <Text style={styles.sectionTitle}>Preparation</Text>
        <Text style={styles.preparationText}>{cocktail.preparation}</Text>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Glass Type</Text>
            <Text style={styles.detailValue}>{cocktail.glassType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Garnish</Text>
            <Text style={styles.detailValue}>{cocktail.garnish}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Alcohol Content</Text>
            <Text style={styles.detailValue}>{cocktail.alcoholContent}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Calories</Text>
            <Text style={styles.detailValue}>{cocktail.calories} cal</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Difficulty</Text>
            <Text style={styles.detailValue}>{cocktail.difficulty}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Prep Time</Text>
            <Text style={styles.detailValue}>{cocktail.preparationTime}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  // Render similar cocktails content (placeholder)
  const renderSimilar = () => (
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Similar Cocktails</Text>
      <Text style={styles.emptyStateText}>
        Based on your taste preferences, you might also enjoy these cocktails with similar flavor profiles.
      </Text>

      {/* This would be populated with actual similar cocktails data */}
      <View style={styles.similarPlaceholder}>
        <Ionicons name="wine-outline" size={40} color="#CCCCCC" />
        <Text style={styles.similarPlaceholderText}>Coming soon</Text>
      </View>
    </View>
  )

  // Render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Ingredients":
        return renderIngredients()
      case "Similar":
        return renderSimilar()
      case "Description":
      default:
        return renderDescription()
    }
  }

  // Render the tip section if available
  const renderTip = () => {
    if (!cocktail.tips) return null

    return (
      <View style={styles.tipContainer}>
        <View style={styles.tipMarker} />
        <Text style={styles.tipText}>{cocktail.tips}</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: cocktail.backgroundColor || "#E5F7F7" }]}>
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
        <Text style={styles.headerTitle}>{cocktail.name}</Text>
      </Animated.View>

      {/* Back button */}
      <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#4A3F41" />
      </TouchableOpacity>

      {/* Favorite button in header */}
      <TouchableOpacity
        style={[styles.headerFavoriteButton, { top: insets.top + 10 }]}
        onPress={() => toggleFavorite(cocktail.id)}
      >
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={24}
          color={isFavorited ? "#FF6B6B" : "#4A3F41"}
        />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Cocktail image */}
        <View style={[styles.imageContainer, { marginTop: insets.top + 20 }]}>
          <Image source={cocktailImage} style={styles.cocktailImage} resizeMode="contain" />
        </View>

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* Cocktail name and rating */}
          <Text style={styles.cocktailName}>{cocktail.name}</Text>
          <View style={styles.ratingContainer}>{renderStars(cocktail.rating)}</View>

          {/* Main content with sidebar */}
          <View style={styles.mainContentContainer}>
            {renderSidebar()}
            <View style={styles.tabContent}>{renderActiveTabContent()}</View>
          </View>

          {/* Tip section */}
          {renderTip()}

          {/* Favorite button */}
          <TouchableOpacity
            style={[styles.favoriteButton, isFavorited && styles.favoriteButtonActive]}
            onPress={() => toggleFavorite(cocktail.id)}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={20}
              color="#FFFFFF"
              style={styles.favoriteButtonIcon}
            />
            <Text style={styles.favoriteButtonText}>{isFavorited ? "Remove from Favorites" : "Add to Favorites"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: "rgba(255,255,255,0.9)",
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
  backButton: {
    position: "absolute",
    left: 15,
    zIndex: 110,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerFavoriteButton: {
    position: "absolute",
    right: 15,
    zIndex: 110,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 280,
  },
  cocktailImage: {
    width: 280,
    height: 280,
  },
  contentContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    minHeight: height * 0.6,
  },
  cocktailName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A3F41",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  star: {
    marginRight: 3,
  },
  mainContentContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  sidebar: {
    width: 40,
    marginRight: 15,
  },
  sidebarTab: {
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    position: "relative",
  },
  sidebarTabActive: {
    backgroundColor: "transparent",
  },
  sidebarTabText: {
    color: "#CCCCCC",
    fontWeight: "500",
    fontSize: 12,
    width: 100,
    textAlign: "center",
  },
  sidebarTabTextActive: {
    color: "#4A3F41",
    fontWeight: "600",
  },
  sidebarTabIndicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    width: 3,
    height: 20,
    backgroundColor: "#FF6B6B",
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    transform: [{ translateY: -10 }],
  },
  tabContent: {
    flex: 1,
  },
  contentSection: {
    marginBottom: 25,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B5E62",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 10,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  storySection: {
    marginBottom: 20,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B5E62",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  tasteSection: {
    marginBottom: 20,
  },
  tasteGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
    alignItems: "flex-end",
  },
  tasteItem: {
    alignItems: "center",
    width: "22%",
  },
  tasteBar: {
    width: 20,
    backgroundColor: "#FF6B6B",
    borderRadius: 10,
    marginBottom: 5,
  },
  tasteLabel: {
    fontSize: 12,
    color: "#6B5E62",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  occasionSection: {
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "#6B5E62",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  ingredientsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  ingredientCard: {
    width: "30%",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E5F7F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientIcon: {
    width: 25,
    height: 25,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A3F41",
    textAlign: "center",
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  ingredientAmount: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  preparationSection: {
    marginBottom: 25,
  },
  preparationText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B5E62",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    width: "48%",
  },
  detailLabel: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 5,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  detailValue: {
    fontSize: 14,
    color: "#4A3F41",
    fontWeight: "500",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  emptyStateText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#6B5E62",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  similarPlaceholder: {
    height: 150,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  similarPlaceholderText: {
    marginTop: 10,
    fontSize: 14,
    color: "#AAAAAA",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  tipContainer: {
    backgroundColor: "#F9F9F9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 25,
    flexDirection: "row",
  },
  tipMarker: {
    width: 3,
    height: "100%",
    backgroundColor: "#FF6B6B",
    borderRadius: 3,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#6B5E62",
    lineHeight: 20,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  favoriteButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  favoriteButtonActive: {
    backgroundColor: "#E05050",
  },
  favoriteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  favoriteButtonIcon: {
    marginRight: 8,
  },
})
