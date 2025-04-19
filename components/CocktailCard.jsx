import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function CocktailCard({ cocktail, onPress }) {
  // Generate star rating component
  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating - fullStars >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color="#FF6B6B" style={styles.star} />)
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#FF6B6B" style={styles.star} />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFCACA" style={styles.star} />)
    }

    return stars
  }

  // Define background colors based on cocktail type
  const getBgColor = (name) => {
    if (name === "Aperol Spritz") return "#FFF5E9"
    if (name === "Dry Martini") return "#E5F7F7"
    if (name === "Mojito") return "#E9F7EF"
    return "#F9F9F9"
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageBackground
        source={{ uri: "https://v0.blob.com/texture-subtle.png" }}
        style={[styles.background, { backgroundColor: getBgColor(cocktail.name) }]}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.content}>
          <View style={styles.info}>
            <Text style={styles.name}>{cocktail.name}</Text>
            <View style={styles.ratingContainer}>{renderStars(cocktail.rating)}</View>
          </View>
          <Text style={styles.price}>${cocktail.price}</Text>
        </View>
        <Image source={{ uri: cocktail.image }} style={styles.image} resizeMode="contain" />
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  background: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backgroundImage: {
    borderRadius: 15,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41", // Dark purple from the image
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    marginRight: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B5E62", // Muted purple-gray color from the image
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 5,
  },
})
