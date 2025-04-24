"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  TextInput,
  Modal,
  FlatList,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { getLocalImage } from "../utils/imageMapping"
import BottomNavigation from "../components/BottomNavigation"
import StarRating from "../components/StarRating"
import FavoriteButton from "../components/FavoriteButton"
import { useFavorites } from "../context/favoritesContext"
import cocktailsData from "../data/api.json"
import TexturedBackground from "../components/TexturedBackground"

const { width, height } = Dimensions.get("window")
const cardWidth = (width - 50) / 2 // Two cards per row with margins

const createSoftTint = (color, intensity = 0.5) => {
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

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { favorites, collections, createCollection, updateCollection, deleteCollection, isLoading } = useFavorites()
  const [activeTab, setActiveTab] = useState("favorites")
  const [favoriteCocktails, setFavoriteCocktails] = useState([])
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    color: "#FF6B6B",
    icon: "wine",
  })
  const [editingCollection, setEditingCollection] = useState(null)
  const [selectedColor, setSelectedColor] = useState("#FF6B6B")
  const [selectedIcon, setSelectedIcon] = useState("wine")

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current

  // Available colors and icons for collections
  const collectionColors = ["#FF6B6B", "#FF9E7A", "#FFCA80", "#A78BFA", "#60A5FA", "#34D399", "#F472B6", "#6366F1"]

  const collectionIcons = ["wine", "beer", "cafe", "ice-cream", "heart", "people", "star", "flame", "gift", "rocket"]

  // Get favorite cocktails whenever favorites change
  useEffect(() => {
    const cocktails = cocktailsData.filter((cocktail) => favorites.includes(cocktail.id))
    setFavoriteCocktails(cocktails)
  }, [favorites])

  // Handle tab change with animation
  const changeTab = (tab) => {
    // Animate fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tab)

      // Animate tab indicator
      Animated.spring(tabIndicatorPosition, {
        toValue: tab === "favorites" ? 0 : width / 2,
        friction: 8,
        tension: 50,
        useNativeDriver: false,
      }).start()

      // Animate content back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start()
    })
  }

  // Open create collection modal
  const openCreateModal = () => {
    setNewCollection({
      name: "",
      description: "",
      color: "#FF6B6B",
      icon: "wine",
    })
    setSelectedColor("#FF6B6B")
    setSelectedIcon("wine")
    setIsCreateModalVisible(true)
  }

  // Handle create collection
  const handleCreateCollection = () => {
    if (newCollection.name.trim()) {
      createCollection({
        ...newCollection,
        color: selectedColor,
        icon: selectedIcon,
      })
      setIsCreateModalVisible(false)
    }
  }

  // Open edit collection modal
  const openEditModal = (collection) => {
    setEditingCollection(collection)
    setSelectedColor(collection.color)
    setSelectedIcon(collection.icon)
    setIsEditModalVisible(true)
  }

  // Handle update collection
  const handleUpdateCollection = () => {
    if (editingCollection && editingCollection.name.trim()) {
      updateCollection(editingCollection.id, {
        name: editingCollection.name,
        description: editingCollection.description,
        color: selectedColor,
        icon: selectedIcon,
      })
      setIsEditModalVisible(false)
    }
  }

  // Handle delete collection
  const handleDeleteCollection = () => {
    if (editingCollection) {
      deleteCollection(editingCollection.id)
      setIsEditModalVisible(false)
    }
  }

  // Render a favorite cocktail card
  const renderFavoriteCard = (cocktail) => {
    // Get the local image for the cocktail
    const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
    const cocktailImage = getLocalImage(localImagePath)

    // Get the background color from the cocktail data or use a default
    const baseColor = cocktail.backgroundColor || "#F9F9F9"
    // Create a very soft tint for the gradient
    const softTint = createSoftTint(baseColor, 0.3)

    return (
      <View key={cocktail.id} style={styles.favoriteCard}>
        <LinearGradient
          colors={["#FFFFFF", softTint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.favoriteCardBg}
        >
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
        </LinearGradient>
      </View>
    )
  }

  // Render a collection card
  const renderCollectionCard = ({ item }) => {
    const cocktailCount = item.cocktails.length
    const collectionCocktails = cocktailsData.filter((cocktail) => item.cocktails.includes(cocktail.id))

    // Get up to 4 cocktail images for the preview
    const previewImages = collectionCocktails.slice(0, 4).map((cocktail) => {
      const localImagePath = cocktail.imageLocal?.replace("require('", "").replace("')", "")
      return getLocalImage(localImagePath)
    })

    // Fill with placeholder if less than 4 cocktails
    while (previewImages.length < 4) {
      previewImages.push(null)
    }

    return (
      <TouchableOpacity
        style={styles.collectionCard}
        onPress={() => navigation.navigate("CollectionDetail", { collection: item })}
        onLongPress={() => openEditModal(item)}
      >
        <LinearGradient
          colors={[item.color, adjustColor(item.color, -30)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.collectionCardBg}
        >
          <View style={styles.collectionIconContainer}>
            <Ionicons name={item.icon} size={24} color="#FFFFFF" />
          </View>

          <Text style={styles.collectionName}>{item.name}</Text>
          <Text style={styles.collectionDescription} numberOfLines={2}>
            {item.description || `A collection of ${cocktailCount} cocktails`}
          </Text>

          <View style={styles.collectionPreviewContainer}>
            {previewImages.map((image, index) => (
              <View key={index} style={styles.previewImageContainer}>
                {image ? (
                  <Image source={image} style={styles.previewImage} resizeMode="contain" />
                ) : (
                  <View style={styles.emptyPreviewImage} />
                )}
              </View>
            ))}
          </View>

          <Text style={styles.collectionCount}>
            {cocktailCount} {cocktailCount === 1 ? "cocktail" : "cocktails"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  // Render empty state for favorites
  const renderEmptyFavorites = () => {
    return (
      <LinearGradient colors={["#FFF5F5", "#FFE6E6"]} style={styles.emptyStateContainer}>
        <Ionicons name="heart-outline" size={60} color="#FF6B6B" />
        <Text style={styles.emptyStateTitle}>No favorites yet</Text>
        <Text style={styles.emptyStateText}>Tap the heart icon on any cocktail to add it to your favorites</Text>
        <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate("Home")}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E8E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreButtonGradient}
          >
            <Text style={styles.exploreButtonText}>Explore Cocktails</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    )
  }

  // Render empty state for collections
  const renderEmptyCollections = () => {
    return (
      <LinearGradient colors={["#F0F7FF", "#E6F0FF"]} style={styles.emptyStateContainer}>
        <Ionicons name="albums-outline" size={60} color="#60A5FA" />
        <Text style={styles.emptyStateTitle}>No collections yet</Text>
        <Text style={styles.emptyStateText}>
          Create collections to organize your favorite cocktails by theme or occasion
        </Text>
        <TouchableOpacity style={styles.exploreButton} onPress={openCreateModal}>
          <LinearGradient
            colors={["#60A5FA", "#93C5FD"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exploreButtonGradient}
          >
            <Text style={styles.exploreButtonText}>Create Collection</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
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

  // Render create collection modal
  const renderCreateModal = () => (
    <Modal
      visible={isCreateModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsCreateModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#FFFFFF", "#F9F9F9"]} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Collection</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Collection name"
                value={newCollection.name}
                onChangeText={(text) => setNewCollection({ ...newCollection, name: text })}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Describe your collection"
                value={newCollection.description}
                onChangeText={(text) => setNewCollection({ ...newCollection, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorOptions}>
                {collectionColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconOptions}>
                {collectionIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, selectedIcon === icon && { backgroundColor: selectedColor }]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons name={icon} size={24} color={selectedIcon === icon ? "#FFFFFF" : "#6B5E62"} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsCreateModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  { backgroundColor: selectedColor },
                  !newCollection.name.trim() && styles.disabledButton,
                ]}
                onPress={handleCreateCollection}
                disabled={!newCollection.name.trim()}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  )

  // Render edit collection modal
  const renderEditModal = () => (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <LinearGradient colors={["#FFFFFF", "#F9F9F9"]} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Collection</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Collection name"
                value={editingCollection?.name || ""}
                onChangeText={(text) => setEditingCollection({ ...editingCollection, name: text })}
                autoFocus
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                placeholder="Describe your collection"
                value={editingCollection?.description || ""}
                onChangeText={(text) => setEditingCollection({ ...editingCollection, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorOptions}>
                {collectionColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconOptions}>
                {collectionIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[styles.iconOption, selectedIcon === icon && { backgroundColor: selectedColor }]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons name={icon} size={24} color={selectedIcon === icon ? "#FFFFFF" : "#6B5E62"} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCollection}>
                <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createButton,
                  { backgroundColor: selectedColor },
                  !editingCollection?.name?.trim() && styles.disabledButton,
                ]}
                onPress={handleUpdateCollection}
                disabled={!editingCollection?.name?.trim()}
              >
                <Text style={styles.createButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}


      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => changeTab("favorites")} activeOpacity={0.7}>
          <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => changeTab("collections")} activeOpacity={0.7}>
          <Text style={[styles.tabText, activeTab === "collections" && styles.activeTabText]}>Collections</Text>
        </TouchableOpacity>

        {/* Animated Tab Indicator */}
        <Animated.View
          style={[
            styles.tabIndicator,
            {
              left: tabIndicatorPosition,
              width: width / 2,
            },
          ]}
        />
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {isLoading ? (
          renderLoadingState()
        ) : activeTab === "favorites" ? (
          // Favorites Tab
          favoriteCocktails.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.favoritesHeader}>
                <Text style={styles.favoritesCount}>{favoriteCocktails.length} cocktails</Text>
              </View>
              <View style={styles.favoritesGrid}>{favoriteCocktails.map(renderFavoriteCard)}</View>
              <View style={styles.bottomPadding} />
            </ScrollView>
          ) : (
            renderEmptyFavorites()
          )
        ) : (
          // Collections Tab
          <>
            <View style={styles.collectionsHeader}>
              <Text style={styles.collectionsTitle}>Your Collections</Text>
              <TouchableOpacity style={styles.addCollectionButton} onPress={openCreateModal}>
                <Ionicons name="add" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>

            {collections.length > 0 ? (
              <FlatList
                data={collections}
                renderItem={renderCollectionCard}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.collectionsGrid}
                ListFooterComponent={<View style={styles.bottomPadding} />}
              />
            ) : (
              renderEmptyCollections()
            )}
          </>
        )}
      </Animated.View>

      {/* Create Collection Modal */}
      {renderCreateModal()}

      {/* Edit Collection Modal */}
      {renderEditModal()}

      <BottomNavigation />
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
    backgroundColor: "#FFF5F5", // Soft pink background
    margin:15
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3F41",
    marginBottom: 8,
    textTransform:"uppercase",
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
  tabContainer: {
    flexDirection: "row",
    position: "relative",
    height: 70,
    backgroundColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6B5E62",
  },
  activeTabText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    height: 3,
    backgroundColor: "#FF6B6B",
  },
  content: {
    flex: 1,
  },
  favoritesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 0,
    paddingTop: 20,
    marginBottom: 15,
  },
  favoritesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
  },
  favoritesCount: {
    fontSize: 14,
    color: "#6B5E62",
  },
  favoritesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 0,
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
  },
  favoriteCardCategory: {
    fontSize: 12,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 8,
  },
  favoriteCardRating: {
    alignItems: "center",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  collectionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 15,
  },
  collectionsTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
  },
  addCollectionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  collectionsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  collectionCard: {
    width: "100%",
    height: 180,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  collectionCardBg: {
    padding: 20,
    height: "100%",
    position: "relative",
  },
  collectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  collectionName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  collectionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 15,
  },
  collectionPreviewContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  previewImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: 40,
    height: 40,
  },
  emptyPreviewImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  collectionCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  emptyStateContainer: {
    flex: 1,
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A3F41",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B5E62",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  exploreButton: {
    borderRadius: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exploreButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  exploreButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
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
  },
  bottomPadding: {
    height: 80,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B5E62",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#4A3F41",
  },
  textAreaInput: {
    height: 80,
    textAlignVertical: "top",
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  iconOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
  },
  cancelButtonText: {
    color: "#6B5E62",
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    flex: 2,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.5,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF4D4D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
})
