"use client"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create context
const FavoritesContext = createContext()

// Storage key
const FAVORITES_STORAGE_KEY = "@cocktail_app_favorites"

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites))
        }
      } catch (error) {
        console.error("Failed to load favorites from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
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

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, isLoading }}>
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
