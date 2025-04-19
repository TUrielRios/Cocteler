import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function FeaturedCocktail({ cocktail, onPress }) {
  // Generate star rating component
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#FF6B6B" style={styles.star} />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FF6B6B" style={styles.star} />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFCACA" style={styles.star} />)
    }

    return stars
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground
        source={{ uri: "https://v0.blob.com/texture-pink-light.png" }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{cocktail.name}</Text>
            <View style={styles.ratingContainer}>{renderStars(cocktail.rating)}</View>
          </View>
          <Image source={{ uri: cocktail.image }} style={styles.image} resizeMode="contain" />
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  background: {
    width: "100%",
    height: 180,
  },
  backgroundImage: {
    borderRadius: 20,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3F41", // Dark purple from the image
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  image: {
    width: 150,
    height: 150,
    position: "absolute",
    right: -20,
    bottom: -20,
    transform: [{ rotate: "15deg" }],
  },
})
