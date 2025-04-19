import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"

export default function BottomNavigation() {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const route = useRoute()

  const isActive = (screenName) => {
    return route.name === screenName
  }

  const getIconColor = (screenName) => {
    return isActive(screenName) ? "#FF6B6B" : "#CCCCCC"
  }

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home" size={24} color={getIconColor("Home")} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Search")}>
        <Ionicons name="search" size={24} color={getIconColor("Search")} />
      </TouchableOpacity>

      {/* Center tab with background */}
      <TouchableOpacity style={styles.centerTabItem} onPress={() => navigation.navigate("IngredientFilter")}>
        <View style={styles.centerTabBackground}>
          <Ionicons name="wine" size={28} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Favorites")}>
        <Ionicons name="heart-outline" size={24} color={getIconColor("Favorites")} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate("Cart")}>
        <Ionicons name="cart-outline" size={24} color={getIconColor("Cart")} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 90,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
    zIndex: 100,
  },
  tabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30, // Lift it up above the navigation bar
  },
  centerTabBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6B6B", // Teal color matching the order button
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
})
