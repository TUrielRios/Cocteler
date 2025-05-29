"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import englishData from "../data/api.json"
import spanishData from "../data/api_español.json"

// Create context
const LanguageContext = createContext()

// Storage key
const LANGUAGE_STORAGE_KEY = "@cocktail_app_language"

// Translations for static UI text
const translations = {
  en: {
    // Onboarding
    appName: "Cocktail",
    appTagline: "Your personal mixologist",
    welcomeTitle: "Welcome to Cocteler",
    welcomeText: "Discover, create and enjoy the perfect cocktails tailored to your taste preferences.",
    getStarted: "Get Started",
    skipForNow: "Skip for now",
    aboutYou: "About You",
    personalizeExperience: "Let's personalize your experience",
    nameInstruction: "What should we call you? This helps us personalize your cocktail recommendations.",
    yourName: "Your Name",
    enterYourName: "Enter your name",
    skipThisStep: "Skip this step",
    favoriteBase: "Favorite Base",
    preferredSpirit: "What's your preferred spirit?",
    selectFavoriteBase: "Select your favorite base spirit. We'll use this to recommend cocktails you'll enjoy.",
    gin: "Gin",
    ginDescription: "Botanical and aromatic",
    vodka: "Vodka",
    vodkaDescription: "Clean and versatile",
    rum: "Rum",
    rumDescription: "Sweet and tropical",
    tequila: "Tequila",
    tequilaDescription: "Bold and earthy",
    whiskey: "Whiskey",
    whiskeyDescription: "Rich and complex",
    any: "Any",
    anyDescription: "I'm open to anything",
    occasions: "Occasions",
    whenEnjoyCocktails: "When do you enjoy cocktails?",
    selectOccasions:
      "Select the occasions when you typically enjoy cocktails. This helps us recommend the perfect drinks for your lifestyle.",
    evening: "Evening",
    celebration: "Celebration",
    brunch: "Brunch",
    dinner: "Dinner",
    party: "Party",
    dateNight: "Date Night",
    casual: "Casual",
    summer: "Summer",
    finish: "Finish",
    noCocktailsYet: "No cocktails yet",
    addCocktailsToCollection: "Add cocktails to your collection",
    addToCollection: "Add to Collection",
    addCocktails: "Add Cocktails",
    allCocktailsAdded: "You've added all available cocktails to this collection",
    collectionDescription: "A collection of cocktails",
    cocktail: "cocktail",
    cocktails: "cocktails",
    home: "Home",
    search: "Search",
    favorites: "Favorites",
    profile: "Profile",
    noFavorites: "No favorites yet",
    addFavorites: "Add your favorite cocktails",
    settings: "Settings",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    cancel: "Cancel",
    logoutConfirmation: "Logout Confirmation",
    
    // Taste Preferences Screen
    tastePreferences: "Taste Preferences",
    tellUsWhatYouLike: "Tell us what you like",
    adjustSliders:
      "Adjust the sliders to tell us your taste preferences. This will help us recommend cocktails you'll love.",
    less: "Less",
    more: "More",
    saveChanges: "Save Changes",
    continue: "Continue",
    sweet: "Sweet",
    sweetDescription: "From barely sweet to dessert-like",
    sour: "Sour",
    sourDescription: "From subtle tang to mouth-puckering",
    bitter: "Bitter",
    bitterDescription: "From smooth to intensely bitter",
    spicy: "Spicy",
    spicyDescription: "From mild warmth to fiery heat",
    
    // Home Screen
    hello: "Hello,",
    featuredCocktail: "Featured Cocktail",
    viewRecipe: "View Recipe",
    categories: "Categories",
    seeAll: "See All",
    recommended: "Recommended",
    popular: "Popular",
    newest: "Newest",

    // Search Screen
    discover: "Discover",
    findPerfectCocktail: "Find your perfect cocktail",
    searchPlaceholder: "Search cocktails, ingredients...",
    noResults: "No results found",
    tryDifferent: "Try a different search term",

    // Ingredient Filter Screen
    mixYourCocktail: "Mix Your Cocktail",
    findRecipes: "Find recipes with ingredients you have",
    searchIngredients: "Search ingredients...",
    yourIngredients: "Your ingredients",
    addIngredients: "Add ingredients to see what cocktails you can make",
    popularIngredients: "Popular ingredients",
    cocktailsYouCanMake: "Cocktails you can make",
    noMatchesFound: "No matches found",
    tryAddingMore: "Try adding more ingredients to find matching cocktails",
    match: "match",

    // Favorites Screen
    myCocktails: "My Cocktails",
    savedDrinks: "Your saved drinks and collections",
    favorites: "Favorites",
    collections: "Collections",
    yourFavorites: "Your Favorites",
    cocktails: "cocktails",
    noFavoritesYet: "No favorites yet",
    tapHeart: "Tap the heart icon on any cocktail to add it to your favorites",
    exploreCocktails: "Explore Cocktails",
    noCollectionsYet: "No collections yet",
    createCollections: "Create collections to organize your favorite cocktails by theme or occasion",
    createCollection: "Create Collection",

    // Settings Screen
    settings: "Settings",
    customizeExperience: "Customize your experience",
    editProfile: "Edit Profile",
    preferences: "Preferences",
    notifications: "Notifications",
    receiveUpdates: "Receive updates about new cocktails and features",
    darkMode: "Dark Mode",
    switchTheme: "Switch to dark theme",
    saveIngredients: "Save Ingredients",
    rememberIngredients: "Remember ingredients you have at home",
    account: "Account",
    personalInfo: "Personal Information",
    updateProfile: "Update your profile details",
    tastePreferences: "Taste Preferences",
    updateFlavor: "Update your flavor preferences",
    privacySettings: "Privacy Settings",
    manageData: "Manage your data and privacy",
    about: "About",
    appInfo: "App Information",
    version: "Version 1.0.0",
    helpSupport: "Help & Support",
    faqContact: "FAQs and contact information",
    rateApp: "Rate the App",
    tellUs: "Tell us what you think",
    advanced: "Advanced",
    resetPreferences: "Reset Preferences",
    resetToDefault: "Reset all app preferences to default",
    resetOnboarding: "Reset Onboarding",
    welcomeScreens: "Go through the welcome screens again",
    language: "Language",
    selectLanguage: "Select your preferred language",
    english: "English",
    spanish: "Spanish",
    logOut: "Log Out",
    copyright: "© 2025 Cocktail App. All rights reserved.",

    // Cocktail Detail
    ingredients: "Ingredients",
    preparation: "Preparation",
    similar: "Similar",
    theStory: "The Story",
    tasteProfile: "Taste Profile",
    perfectFor: "Perfect For",
    glassType: "Glass Type",
    garnish: "Garnish",
    alcoholContent: "Alcohol Content",
    calories: "Calories",
    difficulty: "Difficulty",
    prepTime: "Prep Time",
    addToFavorites: "Add to Favorites",
    removeFromFavorites: "Remove from Favorites",

    // Categorías en SearchScreen
    partyCategory: "Let's party with these cocktails",
    partyDescription: "Perfect for evening gatherings and celebrations",
    brunchCategory: "Perfect for Brunch",
    brunchDescription: "Start your day with these delightful mixes",
    summerCategory: "Summer Refreshments",
    summerDescription: "Cool down with these refreshing cocktails",
    easyCategory: "Quick & Easy Mixes",
    easyDescription: "Simple cocktails ready in minutes",
    citrusCategory: "Citrus Delights",
    citrusDescription: "Zesty and refreshing citrus flavors",
    classicCategory: "Classic Cocktails",
    classicDescription: "Timeless recipes everyone should know",
    exoticCategory: "Exotic Adventures",
    exoticDescription: "Unique flavors from around the world",
    sweetCategory: "Sweet Sensations",
    sweetDescription: "For those with a sweet tooth",
    sophisticatedCategory: "For the Sophisticated",
    sophisticatedDescription: "Strong and elegant cocktails",
    lowcalCategory: "Low-Calorie Options",
    lowcalDescription: "Lighter cocktails under 180 calories",

    // Ingredientes en IngredientFilterScreen
    gin: "Gin",
    vodka: "Vodka",
    rum: "Rum",
    tequila: "Tequila",
    whiskey: "Whiskey",
    lime: "Lime",
    lemon: "Lemon",
    orange: "Orange",
    mint: "Mint",
    soda: "Soda",
    vermouth: "Vermouth",
    grenadine: "Grenadine",
    sugar: "Sugar",
    aperol: "Aperol",
    prosecco: "Prosecco",

    // Colecciones en FavoritesScreen
    yourCollections: "Your Collections",
    noCollectionsYet: "No collections yet",
    createCollectionsDescription: "Create collections to organize your favorite cocktails by theme or occasion",
    createCollection: "Create Collection",
    editCollection: "Edit Collection",
    name: "Name",
    collectionNamePlaceholder: "Collection name",
    descriptionOptional: "Description (optional)",
    describeCollectionPlaceholder: "Describe your collection",
    color: "Color",
    icon: "Icon",
    cancel: "Cancel",
    create: "Create",
    update: "Update",

    // Community Screen
    community: "Community",
    discoverCommunityCreations: "Discover and share cocktail creations",
    all: "All",
    popular: "Popular",
    mine: "Mine",
    by: "by",
    dayAgo: "1 day ago",
    daysAgo: "days ago",
    hourAgo: "1 hour ago",
    hoursAgo: "hours ago",
    minuteAgo: "1 minute ago",
    minutesAgo: "minutes ago",
    justNow: "just now",
    createCocktail: "Create Cocktail",
    publish: "Publish",
    cocktailName: "Cocktail Name",
    enterCocktailName: "Enter a name for your cocktail",
    description: "Description",
    describeCocktail: "Describe your cocktail creation",
    ingredient: "Ingredient",
    addIngredient: "Add Ingredient",
    step: "Step",
    addStep: "Add Step",
    image: "Image",
    addPhoto: "Add Photo",
    error: "Error",
    success: "Success",
    errorLoadingData: "Error loading data. Please try again.",
    pleaseCompleteAllFields: "Please complete all required fields.",
    cocktailPublishedSuccessfully: "Your cocktail has been published successfully!",
    errorSavingCocktail: "Error saving your cocktail. Please try again.",
    noPersonalCocktails: "You haven't created any cocktails yet",
    noCocktailsFound: "No cocktails found",
    createYourFirst: "Create Your First Cocktail",
    communityRecipe: "Community Recipe",
    comments: "Comments",
    addComment: "Add a comment...",
    anonymousUser: "Anonymous User",
  },
  es: {
    // Onboarding
    appName: "Cocktail",
    appTagline: "Tu mixólogo personal",
    welcomeTitle: "Bienvenido a Cocteler",
    welcomeText: "Descubre, crea y disfruta los cócteles perfectos adaptados a tus preferencias de sabor.",
    getStarted: "Comenzar",
    skipForNow: "Omitir por ahora",
    aboutYou: "Acerca de Ti",
    personalizeExperience: "Personalicemos tu experiencia",
    nameInstruction: "¿Cómo deberíamos llamarte? Esto nos ayuda a personalizar tus recomendaciones de cócteles.",
    yourName: "Tu Nombre",
    enterYourName: "Ingresa tu nombre",
    skipThisStep: "Omitir este paso",
    favoriteBase: "Base Favorita",
    preferredSpirit: "¿Cuál es tu licor preferido?",
    selectFavoriteBase: "Selecciona tu licor base favorito. Lo usaremos para recomendarte cócteles que disfrutarás.",
    gin: "Ginebra",
    ginDescription: "Botánico y aromático",
    vodka: "Vodka",
    vodkaDescription: "Limpio y versátil",
    rum: "Ron",
    rumDescription: "Dulce y tropical",
    tequila: "Tequila",
    tequilaDescription: "Audaz y terroso",
    whiskey: "Whisky",
    whiskeyDescription: "Rico y complejo",
    any: "Cualquiera",
    anyDescription: "Estoy abierto a cualquier cosa",
    occasions: "Ocasiones",
    whenEnjoyCocktails: "¿Cuándo disfrutas los cócteles?",
    selectOccasions:
      "Selecciona las ocasiones en las que típicamente disfrutas cócteles. Esto nos ayuda a recomendar las bebidas perfectas para tu estilo de vida.",
    evening: "Noche",
    celebration: "Celebración",
    brunch: "Brunch",
    dinner: "Cena",
    party: "Fiesta",
    dateNight: "Cita Romántica",
    casual: "Casual",
    summer: "Verano",
    finish: "Finalizar",
    noCocktailsYet: "Aún no hay cócteles",
    addCocktailsToCollection: "Añade cócteles a tu colección",
    addToCollection: "Añadir a Colección",
    addCocktails: "Añadir Cócteles",
    allCocktailsAdded: "Has añadido todos los cócteles disponibles a esta colección",
    collectionDescription: "Una colección de cócteles",
    cocktail: "cóctel",
    cocktails: "cócteles",
    home: "Inicio",
    search: "Buscar",
    favorites: "Favoritos",
    profile: "Perfil",
    noFavorites: "Aún no hay favoritos",
    addFavorites: "Añade tus cócteles favoritos",
    settings: "Ajustes",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    logout: "Cerrar sesión",
    confirmLogout: "¿Estás seguro de que quieres cerrar sesión?",
    cancel: "Cancelar",
    logoutConfirmation: "Confirmación de cierre de sesión",
    
    // Taste Preferences Screen
    tastePreferences: "Preferencias de Sabor",
    tellUsWhatYouLike: "Dinos lo que te gusta",
    adjustSliders:
      "Ajusta los controles deslizantes para indicarnos tus preferencias de sabor. Esto nos ayudará a recomendarte cócteles que te encantarán.",
    less: "Menos",
    more: "Más",
    saveChanges: "Guardar Cambios",
    continue: "Continuar",
    sweet: "Dulce",
    sweetDescription: "Desde apenas dulce hasta parecido a un postre",
    sour: "Ácido",
    sourDescription: "Desde un toque sutil hasta muy ácido",
    bitter: "Amargo",
    bitterDescription: "Desde suave hasta intensamente amargo",
    spicy: "Picante",
    spicyDescription: "Desde calor suave hasta ardor intenso",
    
    // Home Screen
    hello: "Hola,",
    featuredCocktail: "Cóctel Destacado",
    viewRecipe: "Ver Receta",
    categories: "Categorías",
    seeAll: "Ver Todo",
    recommended: "Recomendados",
    popular: "Populares",
    newest: "Más Nuevos",

    // Search Screen
    discover: "Descubrir",
    findPerfectCocktail: "Encuentra tu cóctel perfecto",
    searchPlaceholder: "Buscar cócteles, ingredientes...",
    noResults: "No se encontraron resultados",
    tryDifferent: "Intenta con un término diferente",

    // Ingredient Filter Screen
    mixYourCocktail: "Mezcla tu Cóctel",
    findRecipes: "Encuentra recetas con los ingredientes que tienes",
    searchIngredients: "Buscar ingredientes...",
    yourIngredients: "Tus ingredientes",
    addIngredients: "Agrega ingredientes para ver qué cócteles puedes hacer",
    popularIngredients: "Ingredientes populares",
    cocktailsYouCanMake: "Cócteles que puedes hacer",
    noMatchesFound: "No se encontraron coincidencias",
    tryAddingMore: "Intenta agregar más ingredientes para encontrar cócteles",
    match: "coincidencia",

    // Favorites Screen
    myCocktails: "Mis Cócteles",
    savedDrinks: "Tus bebidas y colecciones guardadas",
    favorites: "Favoritos",
    collections: "Colecciones",
    yourFavorites: "Tus Favoritos",
    cocktails: "cócteles",
    noFavoritesYet: "Aún no hay favoritos",
    tapHeart: "Toca el ícono de corazón en cualquier cóctel para agregarlo a tus favoritos",
    exploreCocktails: "Explorar Cócteles",
    noCollectionsYet: "Aún no hay colecciones",
    createCollections: "Crea colecciones para organizar tus cócteles favoritos por tema u ocasión",
    createCollection: "Crear Colección",

    // Settings Screen
    settings: "Configuración",
    customizeExperience: "Personaliza tu experiencia",
    editProfile: "Editar Perfil",
    preferences: "Preferencias",
    notifications: "Notificaciones",
    receiveUpdates: "Recibe actualizaciones sobre nuevos cócteles y funciones",
    darkMode: "Modo Oscuro",
    switchTheme: "Cambiar a tema oscuro",
    saveIngredients: "Guardar Ingredientes",
    rememberIngredients: "Recordar los ingredientes que tienes en casa",
    account: "Cuenta",
    personalInfo: "Información Personal",
    updateProfile: "Actualiza los detalles de tu perfil",
    tastePreferences: "Preferencias de Sabor",
    updateFlavor: "Actualiza tus preferencias de sabor",
    privacySettings: "Configuración de Privacidad",
    manageData: "Administra tus datos y privacidad",
    about: "Acerca de",
    appInfo: "Información de la App",
    version: "Versión 1.0.0",
    helpSupport: "Ayuda y Soporte",
    faqContact: "Preguntas frecuentes e información de contacto",
    rateApp: "Califica la App",
    tellUs: "Cuéntanos qué piensas",
    advanced: "Avanzado",
    resetPreferences: "Restablecer Preferencias",
    resetToDefault: "Restablecer todas las preferencias a valores predeterminados",
    resetOnboarding: "Restablecer Introducción",
    welcomeScreens: "Volver a ver las pantallas de bienvenida",
    language: "Idioma",
    selectLanguage: "Selecciona tu idioma preferido",
    english: "Inglés",
    spanish: "Español",
    logOut: "Cerrar Sesión",
    copyright: "© 2025 Cocktail App. Todos los derechos reservados.",

    // Cocktail Detail
    ingredients: "Ingredientes",
    preparation: "Preparación",
    similar: "Similares",
    theStory: "La Historia",
    tasteProfile: "Perfil de Sabor",
    perfectFor: "Perfecto Para",
    glassType: "Tipo de Vaso",
    garnish: "Decoración",
    alcoholContent: "Contenido de Alcohol",
    calories: "Calorías",
    difficulty: "Dificultad",
    prepTime: "Tiempo de Preparación",
    addToFavorites: "Agregar a Favoritos",
    removeFromFavorites: "Quitar de Favoritos",

    // Categorías en SearchScreen
    partyCategory: "Cócteles para fiestas",
    partyDescription: "Perfectos para reuniones nocturnas y celebraciones",
    brunchCategory: "Perfectos para el Brunch",
    brunchDescription: "Comienza tu día con estas deliciosas mezclas",
    summerCategory: "Refrescos de Verano",
    summerDescription: "Refréscate con estos cócteles refrescantes",
    easyCategory: "Mezclas Rápidas y Fáciles",
    easyDescription: "Cócteles simples listos en minutos",
    citrusCategory: "Delicias Cítricas",
    citrusDescription: "Sabores cítricos refrescantes",
    classicCategory: "Cócteles Clásicos",
    classicDescription: "Recetas atemporales que todos deberían conocer",
    exoticCategory: "Aventuras Exóticas",
    exoticDescription: "Sabores únicos de todo el mundo",
    sweetCategory: "Sensaciones Dulces",
    sweetDescription: "Para los amantes de lo dulce",
    sophisticatedCategory: "Para los Sofisticados",
    sophisticatedDescription: "Cócteles fuertes y elegantes",
    lowcalCategory: "Opciones Bajas en Calorías",
    lowcalDescription: "Cócteles ligeros con menos de 180 calorías",

    // Ingredientes en IngredientFilterScreen
    gin: "Ginebra",
    vodka: "Vodka",
    rum: "Ron",
    tequila: "Tequila",
    whiskey: "Whisky",
    lime: "Lima",
    lemon: "Limón",
    orange: "Naranja",
    mint: "Menta",
    soda: "Soda",
    vermouth: "Vermut",
    grenadine: "Granadina",
    sugar: "Azúcar",
    aperol: "Aperol",
    prosecco: "Prosecco",

    // Colecciones en FavoritesScreen
    yourCollections: "Tus Colecciones",
    noCollectionsYet: "Aún no hay colecciones",
    createCollectionsDescription: "Crea colecciones para organizar tus cócteles favoritos por tema u ocasión",
    createCollection: "Crear Colección",
    editCollection: "Editar Colección",
    name: "Nombre",
    collectionNamePlaceholder: "Nombre de la colección",
    descriptionOptional: "Descripción (opcional)",
    describeCollectionPlaceholder: "Describe tu colección",
    color: "Color",
    icon: "Icono",
    cancel: "Cancelar",
    create: "Crear",
    update: "Actualizar",

    // Community Screen
    community: "Comunidad",
    discoverCommunityCreations: "Descubre y comparte creaciones de cócteles",
    all: "Todos",
    popular: "Populares",
    mine: "Míos",
    by: "por",
    dayAgo: "hace 1 día",
    daysAgo: "días atrás",
    hourAgo: "hace 1 hora",
    hoursAgo: "horas atrás",
    minuteAgo: "hace 1 minuto",
    minutesAgo: "minutos atrás",
    justNow: "justo ahora",
    createCocktail: "Crear Cóctel",
    publish: "Publicar",
    cocktailName: "Nombre del Cóctel",
    enterCocktailName: "Ingresa un nombre para tu cóctel",
    description: "Descripción",
    describeCocktail: "Describe tu creación de cóctel",
    ingredient: "Ingrediente",
    addIngredient: "Añadir Ingrediente",
    step: "Paso",
    addStep: "Añadir Paso",
    image: "Imagen",
    addPhoto: "Añadir Foto",
    error: "Error",
    success: "Éxito",
    errorLoadingData: "Error al cargar datos. Por favor, inténtalo de nuevo.",
    pleaseCompleteAllFields: "Por favor completa todos los campos requeridos.",
    cocktailPublishedSuccessfully: "¡Tu cóctel ha sido publicado exitosamente!",
    errorSavingCocktail: "Error al guardar tu cóctel. Por favor, inténtalo de nuevo.",
    noPersonalCocktails: "Aún no has creado ningún cóctel",
    noCocktailsFound: "No se encontraron cócteles",
    createYourFirst: "Crea Tu Primer Cóctel",
    communityRecipe: "Receta de la Comunidad",
    comments: "Comentarios",
    addComment: "Añadir un comentario...",
    anonymousUser: "Usuario Anónimo",
  },
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en")
  const [cocktailsData, setCocktailsData] = useState(englishData)
  const [isLoading, setIsLoading] = useState(true)

  // Load language preference from AsyncStorage on mount
  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
        if (storedLanguage) {
          setLanguage(storedLanguage)
          setCocktailsData(storedLanguage === "en" ? englishData : spanishData)
        }
      } catch (error) {
        console.error("Failed to load language preference", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadLanguagePreference()
  }, [])

  // Change language and save preference
  const changeLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
      setLanguage(lang)
      setCocktailsData(lang === "en" ? englishData : spanishData)
    } catch (error) {
      console.error("Failed to save language preference", error)
    }
  }

  // Get translation for a key
  const t = (key) => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        cocktailsData,
        t,
        isLoading,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}