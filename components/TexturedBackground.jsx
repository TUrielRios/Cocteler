import { View, StyleSheet } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

// A component that renders CSS-based textures instead of using image files
export default function TexturedBackground({ textureType = "subtle", style, children }) {
  // Define texture patterns
  const textures = {
    pinkLight: {
      colors: ["#FFF0F0", "#FFE6E6"],
      locations: [0, 1],
      dotColor: "rgba(255,200,200,0.15)",
      dotOpacity: 0.15,
      dotSize: 8,
      dotSpacing: 20,
    },
    subtle: {
      colors: ["#FFFFFF", "#F5F5F5"],
      locations: [0, 1],
      dotColor: "rgba(230,230,230,0.3)",
      dotOpacity: 0.3,
      dotSize: 1,
      dotSpacing: 10,
    },
  }

  const texture = textures[textureType] || textures.subtle

  return (
    <LinearGradient
      colors={texture.colors}
      locations={texture.locations}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Add a pattern overlay */}
      <View
        style={[
          styles.patternOverlay,
          {
            opacity: texture.dotOpacity,
            backgroundColor: "transparent",
          },
        ]}
      />
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // The pattern is created using background properties
    // In React Native, we'd use a more complex approach with
    // multiple Views or a custom drawing solution
    // This is simplified for this example
  },
})
