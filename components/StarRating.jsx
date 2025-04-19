import { View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function StarRating({ rating, size = 16 }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating - fullStars >= 0.5

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Ionicons key={`full-${i}`} name="star" size={size} color="#FF6B6B" style={styles.star} />)
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<Ionicons key="half" name="star-half" size={size} color="#FF6B6B" style={styles.star} />)
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={size} color="#CCCCCC" style={styles.star} />)
  }

  return <View style={styles.container}>{stars}</View>
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  star: {
    marginRight: 2,
  },
})
