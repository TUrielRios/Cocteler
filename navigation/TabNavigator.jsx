"use client"
import { View, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import HomeScreen from "../screens/HomeScreen"
import SearchScreen from "../screens/SearchScreen"
import IngredientFilterScreen from "../screens/ingredientFilterScreen"
import FavoritesScreen from "../screens/FavoritesScreen"
import SettingsScreen from "../screens/SettingsScreen"

const Tab = createBottomTabNavigator()

export default function TabNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60 + Math.max(insets.bottom, 10),
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 5,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="home" size={24} color={focused ? "#FF6B6B" : "#CCCCCC"} />,
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="search" size={24} color={focused ? "#FF6B6B" : "#CCCCCC"} />,
        }}
      />
      <Tab.Screen
        name="IngredientFilterTab"
        component={IngredientFilterScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerTabBackground}>
              <Ionicons name="wine" size={28} color="#FFFFFF" />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="heart-outline" size={24} color={focused ? "#FF6B6B" : "#CCCCCC"} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="settings-outline" size={24} color={focused ? "#FF6B6B" : "#CCCCCC"} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  centerTabBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF6B6B", // main color matching the focus button
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginTop: -30, // Lift it up above the navigation bar
  },
})
