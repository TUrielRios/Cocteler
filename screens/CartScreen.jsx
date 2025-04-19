import { View, Text, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import BottomNavigation from "../components/BottomNavigation"

export default function CartScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Cart Screen</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
      <BottomNavigation />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A3F41",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B5E62",
  },
})
