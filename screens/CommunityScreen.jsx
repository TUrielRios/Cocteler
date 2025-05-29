"use client"
import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native"
import { useLanguage } from "../context/LanguageContext"
import { useOnboarding } from "../context/OnboardingContext"
import TexturedBackground from "../components/TexturedBackground"

// Clave para almacenar los cócteles de la comunidad
const COMMUNITY_COCKTAILS_KEY = "@cocktail_app_community"

const CommunityScreen = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const { t, language } = useLanguage()
  const { userName } = useOnboarding()

  const [communityData, setCommunityData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState("all") // "all", "mine", "popular"

  // Estados para el formulario de nuevo cóctel
  const [newCocktail, setNewCocktail] = useState({
    name: "",
    description: "",
    ingredients: [""],
    steps: [""],
    image: null, // En una implementación real, aquí iría la URL de la imagen
  })

  // Cargar datos al iniciar
  useEffect(() => {
    loadCommunityData()
  }, [])

  // Cargar datos de AsyncStorage
  const loadCommunityData = async () => {
    try {
      setIsLoading(true)
      const storedData = await AsyncStorage.getItem(COMMUNITY_COCKTAILS_KEY)

      if (storedData) {
        setCommunityData(JSON.parse(storedData))
      } else {
        // Datos de ejemplo si no hay nada guardado
        const exampleData = generateExampleData()
        await AsyncStorage.setItem(COMMUNITY_COCKTAILS_KEY, JSON.stringify(exampleData))
        setCommunityData(exampleData)
      }
    } catch (error) {
      console.error("Error loading community data:", error)
      Alert.alert(t("error"), t("errorLoadingData"))
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  // Generar datos de ejemplo
  const generateExampleData = () => {
    return [
      {
        id: "comm-1",
        name: "Sunset Breeze",
        author: "Sophia",
        authorId: "user-123",
        description: "A refreshing cocktail with tropical flavors, perfect for summer evenings.",
        ingredients: [
          "60ml white rum",
          "30ml passion fruit juice",
          "15ml lime juice",
          "15ml simple syrup",
          "Soda water",
          "Mint leaves for garnish",
        ],
        steps: [
          "Add rum, passion fruit juice, lime juice, and simple syrup to a shaker with ice.",
          "Shake well and strain into a tall glass filled with ice.",
          "Top with soda water and stir gently.",
          "Garnish with mint leaves.",
        ],
        image: "/placeholder.svg?height=300&width=300",
        likes: 24,
        comments: 5,
        createdAt: new Date().toISOString(),
        nameEs: "Brisa del Atardecer",
        descriptionEs: "Un cóctel refrescante con sabores tropicales, perfecto para las tardes de verano.",
        ingredientsEs: [
          "60ml ron blanco",
          "30ml jugo de maracuyá",
          "15ml jugo de lima",
          "15ml jarabe simple",
          "Agua con gas",
          "Hojas de menta para decorar",
        ],
        stepsEs: [
          "Agrega ron, jugo de maracuyá, jugo de lima y jarabe simple a una coctelera con hielo.",
          "Agita bien y cuela en un vaso alto lleno de hielo.",
          "Completa con agua con gas y revuelve suavemente.",
          "Decora con hojas de menta.",
        ],
      },
      {
        id: "comm-2",
        name: "Urban Spice",
        author: "Marcus",
        authorId: "user-456",
        description: "A sophisticated cocktail with a spicy kick, great for evening gatherings.",
        ingredients: [
          "50ml bourbon",
          "20ml ginger liqueur",
          "15ml lemon juice",
          "10ml honey syrup",
          "2 dashes aromatic bitters",
          "Cinnamon stick for garnish",
        ],
        steps: [
          "Combine bourbon, ginger liqueur, lemon juice, honey syrup, and bitters in a mixing glass with ice.",
          "Stir until well-chilled.",
          "Strain into a rocks glass over a large ice cube.",
          "Garnish with a cinnamon stick.",
        ],
        image: "/placeholder.svg?height=300&width=300",
        likes: 18,
        comments: 3,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        nameEs: "Especia Urbana",
        descriptionEs: "Un cóctel sofisticado con un toque picante, ideal para reuniones nocturnas.",
        ingredientsEs: [
          "50ml bourbon",
          "20ml licor de jengibre",
          "15ml jugo de limón",
          "10ml jarabe de miel",
          "2 gotas de amargos aromáticos",
          "Rama de canela para decorar",
        ],
        stepsEs: [
          "Combina bourbon, licor de jengibre, jugo de limón, jarabe de miel y amargos en un vaso mezclador con hielo.",
          "Revuelve hasta que esté bien frío.",
          "Cuela en un vaso de rocas sobre un cubo de hielo grande.",
          "Decora con una rama de canela.",
        ],
      },
      {
        id: "comm-3",
        name: "Velvet Cloud",
        author: "Elena",
        authorId: "user-789",
        description: "A creamy, dreamy cocktail that's like dessert in a glass.",
        ingredients: [
          "45ml vanilla vodka",
          "30ml coffee liqueur",
          "30ml heavy cream",
          "15ml maple syrup",
          "Pinch of sea salt",
          "Cocoa powder for garnish",
        ],
        steps: [
          "Add all ingredients except cocoa powder to a shaker with ice.",
          "Shake vigorously until well-chilled and frothy.",
          "Strain into a chilled coupe glass.",
          "Dust with cocoa powder.",
        ],
        image: "/placeholder.svg?height=300&width=300",
        likes: 32,
        comments: 7,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        nameEs: "Nube de Terciopelo",
        descriptionEs: "Un cóctel cremoso y soñador que es como un postre en una copa.",
        ingredientsEs: [
          "45ml vodka de vainilla",
          "30ml licor de café",
          "30ml crema espesa",
          "15ml jarabe de arce",
          "Pizca de sal marina",
          "Cacao en polvo para decorar",
        ],
        stepsEs: [
          "Agrega todos los ingredientes excepto el cacao en polvo a una coctelera con hielo.",
          "Agita vigorosamente hasta que esté bien frío y espumoso.",
          "Cuela en una copa coupe fría.",
          "Espolvorea con cacao en polvo.",
        ],
      },
    ]
  }

  // Guardar un nuevo cóctel
  const saveCocktail = async () => {
    // Validación básica
    if (!newCocktail.name.trim() || !newCocktail.description.trim()) {
      Alert.alert(t("error"), t("pleaseCompleteAllFields"))
      return
    }

    if (newCocktail.ingredients.some((ing) => !ing.trim()) || newCocktail.steps.some((step) => !step.trim())) {
      Alert.alert(t("error"), t("pleaseCompleteAllFields"))
      return
    }

    try {
      const newCocktailData = {
        ...newCocktail,
        id: `comm-${Date.now()}`,
        author: userName || t("anonymousUser"),
        authorId: "current-user", // En una implementación real, aquí iría el ID del usuario
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        image: "/placeholder.svg?height=300&width=300", // Imagen de placeholder
        // Versiones en español (en una implementación real, esto se manejaría mejor)
        nameEs: newCocktail.name,
        descriptionEs: newCocktail.description,
        ingredientsEs: [...newCocktail.ingredients],
        stepsEs: [...newCocktail.steps],
      }

      const updatedData = [newCocktailData, ...communityData]
      await AsyncStorage.setItem(COMMUNITY_COCKTAILS_KEY, JSON.stringify(updatedData))
      setCommunityData(updatedData)

      // Resetear el formulario
      setNewCocktail({
        name: "",
        description: "",
        ingredients: [""],
        steps: [""],
        image: null,
      })

      setModalVisible(false)
      Alert.alert(t("success"), t("cocktailPublishedSuccessfully"))
    } catch (error) {
      console.error("Error saving cocktail:", error)
      Alert.alert(t("error"), t("errorSavingCocktail"))
    }
  }

  // Dar like a un cóctel
  const likeCocktail = async (id) => {
    try {
      const updatedData = communityData.map((cocktail) =>
        cocktail.id === id ? { ...cocktail, likes: cocktail.likes + 1 } : cocktail,
      )

      await AsyncStorage.setItem(COMMUNITY_COCKTAILS_KEY, JSON.stringify(updatedData))
      setCommunityData(updatedData)
    } catch (error) {
      console.error("Error liking cocktail:", error)
    }
  }

  // Filtrar cócteles
  const getFilteredCocktails = () => {
    switch (filter) {
      case "mine":
        return communityData.filter((cocktail) => cocktail.authorId === "current-user")
      case "popular":
        return [...communityData].sort((a, b) => b.likes - a.likes)
      default:
        return communityData
    }
  }

  // Añadir un nuevo ingrediente al formulario
  const addIngredient = () => {
    setNewCocktail({
      ...newCocktail,
      ingredients: [...newCocktail.ingredients, ""],
    })
  }

  // Añadir un nuevo paso al formulario
  const addStep = () => {
    setNewCocktail({
      ...newCocktail,
      steps: [...newCocktail.steps, ""],
    })
  }

  // Actualizar un ingrediente
  const updateIngredient = (text, index) => {
    const updatedIngredients = [...newCocktail.ingredients]
    updatedIngredients[index] = text
    setNewCocktail({
      ...newCocktail,
      ingredients: updatedIngredients,
    })
  }

  // Actualizar un paso
  const updateStep = (text, index) => {
    const updatedSteps = [...newCocktail.steps]
    updatedSteps[index] = text
    setNewCocktail({
      ...newCocktail,
      steps: updatedSteps,
    })
  }

  // Eliminar un ingrediente
  const removeIngredient = (index) => {
    if (newCocktail.ingredients.length > 1) {
      const updatedIngredients = [...newCocktail.ingredients]
      updatedIngredients.splice(index, 1)
      setNewCocktail({
        ...newCocktail,
        ingredients: updatedIngredients,
      })
    }
  }

  // Eliminar un paso
  const removeStep = (index) => {
    if (newCocktail.steps.length > 1) {
      const updatedSteps = [...newCocktail.steps]
      updatedSteps.splice(index, 1)
      setNewCocktail({
        ...newCocktail,
        steps: updatedSteps,
      })
    }
  }

  // Renderizar un cóctel de la comunidad
  const renderCocktailItem = ({ item }) => {
    const name = language === "en" ? item.name : item.nameEs
    const description = language === "en" ? item.description : item.descriptionEs

    return (
      <TouchableOpacity
        style={styles.cocktailCard}
        onPress={() => navigation.navigate("CommunityDetail", { cocktail: item })}
      >
        <Image source={{ uri: item.image }} style={styles.cocktailImage} resizeMode="cover" />
        <View style={styles.cocktailInfo}>
          <Text style={styles.cocktailName}>{name}</Text>
          <Text style={styles.authorName}>
            {t("by")} {item.author}
          </Text>
          <Text style={styles.cocktailDescription} numberOfLines={2}>
            {description}
          </Text>
          <View style={styles.cocktailStats}>
            <TouchableOpacity style={styles.likeButton} onPress={() => likeCocktail(item.id)}>
              <Ionicons name="heart-outline" size={18} color="#FF6B6B" />
              <Text style={styles.likeCount}>{item.likes}</Text>
            </TouchableOpacity>
            <View style={styles.commentCount}>
              <Ionicons name="chatbubble-outline" size={16} color="#666" />
              <Text style={styles.commentText}>{item.comments}</Text>
            </View>
            <Text style={styles.timeAgo}>{formatTimeAgo(new Date(item.createdAt))}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  // Formatear tiempo relativo
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return diffDay === 1 ? t("dayAgo") : `${diffDay} ${t("daysAgo")}`
    }
    if (diffHour > 0) {
      return diffHour === 1 ? t("hourAgo") : `${diffHour} ${t("hoursAgo")}`
    }
    if (diffMin > 0) {
      return diffMin === 1 ? t("minuteAgo") : `${diffMin} ${t("minutesAgo")}`
    }
    return t("justNow")
  }

  // Renderizar el formulario de nuevo cóctel
  const renderNewCocktailForm = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{t("createCocktail")}</Text>
          <TouchableOpacity onPress={saveCocktail}>
            <Text style={styles.publishButton}>{t("publish")}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <Text style={styles.formLabel}>{t("cocktailName")}</Text>
          <TextInput
            style={styles.textInput}
            placeholder={t("enterCocktailName")}
            value={newCocktail.name}
            onChangeText={(text) => setNewCocktail({ ...newCocktail, name: text })}
          />

          <Text style={styles.formLabel}>{t("description")}</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder={t("describeCocktail")}
            multiline
            numberOfLines={4}
            value={newCocktail.description}
            onChangeText={(text) => setNewCocktail({ ...newCocktail, description: text })}
          />

          <Text style={styles.formLabel}>{t("ingredients")}</Text>
          {newCocktail.ingredients.map((ingredient, index) => (
            <View key={`ing-${index}`} style={styles.ingredientRow}>
              <TextInput
                style={[styles.textInput, styles.ingredientInput]}
                placeholder={`${t("ingredient")} ${index + 1}`}
                value={ingredient}
                onChangeText={(text) => updateIngredient(text, index)}
              />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeIngredient(index)}>
                <Ionicons name="remove-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
            <Ionicons name="add-circle" size={20} color="#26C6B9" />
            <Text style={styles.addButtonText}>{t("addIngredient")}</Text>
          </TouchableOpacity>

          <Text style={styles.formLabel}>{t("preparation")}</Text>
          {newCocktail.steps.map((step, index) => (
            <View key={`step-${index}`} style={styles.stepRow}>
              <View style={styles.stepNumberContainer}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.stepInput]}
                placeholder={`${t("step")} ${index + 1}`}
                multiline
                value={step}
                onChangeText={(text) => updateStep(text, index)}
              />
              <TouchableOpacity style={styles.removeButton} onPress={() => removeStep(index)}>
                <Ionicons name="remove-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addStep}>
            <Ionicons name="add-circle" size={20} color="#26C6B9" />
            <Text style={styles.addButtonText}>{t("addStep")}</Text>
          </TouchableOpacity>

          <View style={styles.imageUploadSection}>
            <Text style={styles.formLabel}>{t("image")}</Text>
            <TouchableOpacity style={styles.imageUploadButton}>
              <Ionicons name="camera" size={24} color="#26C6B9" />
              <Text style={styles.imageUploadText}>{t("addPhoto")}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </Modal>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TexturedBackground />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("community")}</Text>
        <Text style={styles.headerSubtitle}>{t("discoverCommunityCreations")}</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === "all" && styles.activeFilter]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>{t("all")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "popular" && styles.activeFilter]}
          onPress={() => setFilter("popular")}
        >
          <Text style={[styles.filterText, filter === "popular" && styles.activeFilterText]}>{t("popular")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === "mine" && styles.activeFilter]}
          onPress={() => setFilter("mine")}
        >
          <Text style={[styles.filterText, filter === "mine" && styles.activeFilterText]}>{t("mine")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getFilteredCocktails()}
        renderItem={renderCocktailItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true)
          loadCommunityData()
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wine" size={60} color="#CCCCCC" />
            <Text style={styles.emptyText}>{filter === "mine" ? t("noPersonalCocktails") : t("noCocktailsFound")}</Text>
            {filter === "mine" && (
              <TouchableOpacity style={styles.createFirstButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.createFirstButtonText}>{t("createYourFirst")}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      {renderNewCocktailForm()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
  },
  activeFilter: {
    backgroundColor: "#FF6B6B",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
  },
  activeFilterText: {
    color: "#FFF",
    fontWeight: "500",
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  cocktailCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cocktailImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  cocktailInfo: {
    flex: 1,
    padding: 12,
  },
  cocktailName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  authorName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  cocktailDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  cocktailStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  likeCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  commentCount: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  commentText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
    marginLeft: "auto",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#26C6B9",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  publishButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#26C6B9",
  },
  formContainer: {
    padding: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ingredientInput: {
    flex: 1,
    marginRight: 10,
  },
  removeButton: {
    padding: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 15,
  },
  addButtonText: {
    fontSize: 16,
    color: "#26C6B9",
    marginLeft: 5,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#26C6B9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumber: {
    color: "#FFF",
    fontWeight: "bold",
  },
  stepInput: {
    flex: 1,
    marginRight: 10,
  },
  imageUploadSection: {
    marginTop: 10,
    marginBottom: 20,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    borderStyle: "dashed",
    padding: 20,
  },
  imageUploadText: {
    fontSize: 16,
    color: "#26C6B9",
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  createFirstButton: {
    backgroundColor: "#26C6B9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  createFirstButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
})

export default CommunityScreen
