"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create context
const FavoritesContext = createContext()

// Storage keys
const FAVORITES_STORAGE_KEY = "@cocktail_app_favorites"
const COLLECTIONS_STORAGE_KEY = "@cocktail_app_collections"

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [collections, setCollections] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites and collections from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
        const storedCollections = await AsyncStorage.getItem(COLLECTIONS_STORAGE_KEY)

        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }

        if (storedCollections) {
          setCollections(JSON.parse(storedCollections))
        } else {
          // Initialize with default collections if none exist
          const defaultCollections = [
            {
              id: "1",
              name: "Party Favorites",
              description: "Perfect cocktails for hosting parties",
              color: "#FF6B6B",
              icon: "people",
              cocktails: [],
            },
            {
              id: "2",
              name: "Date Night",
              description: "Romantic drinks for special evenings",
              color: "#A78BFA",
              icon: "heart",
              cocktails: [],
            },
          ]
          setCollections(defaultCollections)
          await AsyncStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(defaultCollections))
        }
      } catch (error) {
        console.error("Failed to load data from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error("Failed to save favorites to storage", error)
      }
    }

    // Only save if we've finished initial loading
    if (!isLoading) {
      saveFavorites()
    }
  }, [favorites, isLoading])

  // Save collections to AsyncStorage whenever they change
  useEffect(() => {
    const saveCollections = async () => {
      try {
        await AsyncStorage.setItem(COLLECTIONS_STORAGE_KEY, JSON.stringify(collections))
      } catch (error) {
        console.error("Failed to save collections to storage", error)
      }
    }

    // Only save if we've finished initial loading
    if (!isLoading) {
      saveCollections()
    }
  }, [collections, isLoading])

  // Check if a cocktail is favorited
  const isFavorite = (cocktailId) => {
    return favorites.includes(cocktailId)
  }

  // Toggle favorite status
  const toggleFavorite = (cocktailId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(cocktailId)) {
        return prevFavorites.filter((id) => id !== cocktailId)
      } else {
        return [...prevFavorites, cocktailId]
      }
    })
  }

  // Create a new collection
  const createCollection = (collection) => {
    const newCollection = {
      ...collection,
      id: Date.now().toString(),
      cocktails: [],
    }

    setCollections((prevCollections) => [...prevCollections, newCollection])
    return newCollection.id
  }

  // Update an existing collection
  const updateCollection = (id, updates) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection) => (collection.id === id ? { ...collection, ...updates } : collection)),
    )
  }

  // Delete a collection
  const deleteCollection = (id) => {
    setCollections((prevCollections) => prevCollections.filter((collection) => collection.id !== id))
  }

  // Add cocktail to collection
  const addToCollection = (collectionId, cocktailId) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          // Only add if not already in collection
          if (!collection.cocktails.includes(cocktailId)) {
            return {
              ...collection,
              cocktails: [...collection.cocktails, cocktailId],
            }
          }
        }
        return collection
      }),
    )
  }

  // Remove cocktail from collection
  const removeFromCollection = (collectionId, cocktailId) => {
    setCollections((prevCollections) =>
      prevCollections.map((collection) => {
        if (collection.id === collectionId) {
          return {
            ...collection,
            cocktails: collection.cocktails.filter((id) => id !== cocktailId),
          }
        }
        return collection
      }),
    )
  }

  // Check if a cocktail is in a collection
  const isInCollection = (collectionId, cocktailId) => {
    const collection = collections.find((c) => c.id === collectionId)
    return collection ? collection.cocktails.includes(cocktailId) : false
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        collections,
        isFavorite,
        toggleFavorite,
        createCollection,
        updateCollection,
        deleteCollection,
        addToCollection,
        removeFromCollection,
        isInCollection,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

// Custom hook to use the favorites context
export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
