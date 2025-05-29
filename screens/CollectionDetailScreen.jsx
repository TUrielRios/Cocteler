"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Animated, FlatList, Modal } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getLocalImage } from "../utils/imageMapping"
import StarRating from "../components/StarRating"
import { useFavorites } from "../context/FavoritesContext"
import { useLanguage } from "../context/LanguageContext"

const { width, height } = Dimensions.get("window")
const cardWidth = (width - 50) / 2 // Two cards per row with margins

export default function CollectionDetailScreen({ route, navigation }) {
  const { collection } = route.params
  const insets = useSafeAreaInsets()
  const { addToCollection, removeFromCollection, isInCollection } = useFavorites()
  const { cocktailsData, t } = useLanguage()
  const [collectionCocktails, setCollectionCocktails] = useState([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [availableCocktails, setAvailableCocktails] = useState([])

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const headerHeight = useRef(new Animated.Value(200)).current
  const scrollY = useRef(new Animated.Value(0)).current

  // Get collection cocktails whenever collection changes
  useEffect(() => {
    const cocktails = cocktailsData.filter((cocktail) => collection.cocktails.includes(cocktail.id))
    setCollectionCocktails(cocktails)

    // Get available cocktails for adding to collection
    const available = cocktailsData.filter((cocktail) => !collection.cocktails.includes(cocktail.id))
    setAvailableCocktails(available)

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
  }, [collection, cocktailsData])

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  })

  // Handle adding cocktail to collection
  const handleAddToCollection = (cocktailId) => {
    addToCollection(collection.id, cocktailId)
    setIsAddModalVisible(false)

    // Update the local state
    const cocktail = cocktailsData.find((c) => c.id === cocktailId)
    setCollectionCocktails((prev) => [...prev, cocktail])
    setAvailableCocktails((prev) => prev.filter((c) => c.id !== cocktailId))
  }

  // Handle removing cocktail from collection
  const handleRemoveFromCollection = (cocktailId) => {
    removeFromCollection(collection.id, cocktailId)

    // Update the local state
    setCollectionCocktails((prev) => prev.filter((c) => c.id !== cocktailId))
    const cocktail = cocktailsData.find((c) => c.id === cocktailId)
    setAvailableCocktails((prev) => [...prev, cocktail])
  }

  // Render a cocktail card
  const renderCocktailCard = (cocktail) => {
    // Get the local image for the cocktail
    const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    return (
      <View key={cocktail.id} style={styles.cocktailCard}>
        <LinearGradient
          colors={["#FFFFFF", "#F9F9F9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.cocktailCardBg}
        >
          <TouchableOpacity
            style={styles.cocktailCardContent}
            onPress={() => navigation.navigate("CocktailDetail", { cocktail })}
          >
            <Image source={cocktailImage} style={styles.cocktailCardImage} resizeMode="contain" />
            <Text style={styles.cocktailCardName}>{cocktail.name}</Text>
            <Text style={styles.cocktailCardCategory}>{cocktail.category}</Text>
            <View style={styles.cocktailCardRating}>
              <StarRating rating={cocktail.rating} size={14} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromCollection(cocktail.id)}>
            <Ionicons name="close-circle" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    )
  }

  // Render a cocktail item in the add modal
  const renderAddCocktailItem = ({ item }) => {
    // Get the local image for the cocktail
    const localImagePath = item.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    return (
      <TouchableOpacity style={styles.addCocktailItem} onPress={() => handleAddToCollection(item.id)}>
        <Image source={cocktailImage} style={styles.addCocktailImage} resizeMode="contain" />
        <View style={styles.addCocktailInfo}>
          <Text style={styles.addCocktailName}>{item.name}</Text>
          <Text style={styles.addCocktailCategory}>{item.category}</Text>
        </View>
        <View style={styles.addCocktailAction}>
          <Ionicons name="add-circle" size={24} color={collection.color} />
        </View>
      </TouchableOpacity>
    )
  }

  // Render empty state
  const renderEmptyState = () => {
    return (
      <View style={styles.emptyStateContainer}>
        <Ionicons name="wine-outline" size={60} color={collection.color} />
        <Text style={styles.emptyStateTitle}>{t("noCocktailsYet")}</Text>
        <Text style={styles.emptyStateText}>{t("addCocktailsToCollection")}</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: collection.color }]}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Text style={styles.addButtonText}>{t("addCocktails")}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Render add cocktail modal
  const renderAddModal = () => (
    <Modal
      visible={isAddModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsAddModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#FFFFFF", "#F9F9F9"]} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("addToCollection")}</Text>
              <TouchableOpacity onPress={() => setIsAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B5E62" />
              </TouchableOpacity>
            </View>

            {availableCocktails.length > 0 ? (
              <FlatList
                data={availableCocktails}
                renderItem={renderAddCocktailItem}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.addCocktailList}
              />
            ) : (
              <View style={styles.noMoreCocktails}>
                <Text style={styles.noMoreCocktailsText}>{t("allCocktailsAdded")}</Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Animated header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <Text style={styles.headerTitle}>{collection.name}</Text>
      </Animated.View>

      {/* Back button */}
      <TouchableOpacity style={[styles.backButton, { top: insets.top + 10 }]} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Collection header */}
        <Animated.View
          style={[
            styles.collectionHeader,
            {
              transform: [{ scale: headerScale }],
            },
          ]}
        >
          <LinearGradient
            colors={[collection.color, adjustColor(collection.color, -30)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.collectionHeaderBg}
          >
            <View style={styles.collectionIconContainer}>
              <Ionicons name={collection.icon} size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.collectionName}>{collection.name}</Text>
            <Text style={styles.collectionDescription}>{collection.description || t("collectionDescription")}</Text>
            <Text style={styles.collectionCount}>
              {collectionCocktails.length} {collectionCocktails.length === 1 ? t("cocktail") : t("cocktails")}
            </Text>
          </LinearGradient>
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Collection actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: collection.color }]}
              onPress={() => setIsAddModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>{t("addCocktails")}</Text>
            </TouchableOpacity>
          </View>

          {/* Cocktails grid */}
          {collectionCocktails.length > 0 ? (
            <View style={styles.cocktailsGrid}>{collectionCocktails.map(renderCocktailCard)}</View>
          ) : (
            renderEmptyState()
          )}

          {/* Extra padding at bottom for navigation */}
          <View style={styles.bottomPadding} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Add Cocktail Modal */}
      {renderAddModal()}
    </View>
  )
}

// Helper function to darken/lighten a color
function adjustColor(color, amount) {
  return color
  // This is a simplified version - in a real app, you'd implement proper color adjustment
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
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
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  collectionHeader: {
    height: 200,
    marginBottom: 20,
  },
  collectionHeaderBg: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  collectionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  collectionName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  collectionDescription: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  collectionCount: {
    fontSize: 14,
    color: "#FFFFFF",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 5,
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
    height: 200,
    position: "relative",
  },
  cocktailCardContent: {
    alignItems: "center",
  },
  cocktailCardImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  cocktailCardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginBottom: 4,
  },
  cocktailCardCategory: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 8,
  },
  cocktailCardRating: {
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    marginVertical: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 20,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4A3F41",
  },
  addCocktailList: {
    paddingBottom: 20,
  },
  addCocktailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  addCocktailImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  addCocktailInfo: {
    flex: 1,
  },
  addCocktailName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A3F41",
    marginBottom: 4,
  },
  addCocktailCategory: {
    fontSize: 12,
    color: "#6B5E62",
  },
  addCocktailAction: {
    paddingLeft: 10,
  },
  noMoreCocktails: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noMoreCocktailsText: {
    fontSize: 16,
    color: "#6B5E62",
    textAlign: "center",
  },
  bottomPadding: {
    height: 80,
  },
})
