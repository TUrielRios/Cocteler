"use client"

import { TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useFavorites } from "../context/FavoritesContext"

export default function FavoriteButton({ cocktailId, size = 22, style = {} }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFavorited = isFavorite(cocktailId)

  const handlePress = () => {
    toggleFavorite(cocktailId)
  }

  return (
    <TouchableOpacity style={[styles.favoriteButton, style]} onPress={handlePress}>
      <Ionicons
        name={isFavorited ? "heart" : "heart-outline"}
        size={size}
        color={isFavorited ? "#FF6B6B" : "#AAAAAA"}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
})
