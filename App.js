import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { View, ActivityIndicator } from "react-native"

import { FavoritesProvider } from "./context/favoritesContext"
import { OnboardingProvider, useOnboarding } from "./context/OnboardingContext"
import TabNavigator from "./navigation/TabNavigator"
import CocktailDetailScreen from "./screens/CocktailDetailScreen"
import WelcomeScreen from "./screens/WelcomeScreen"
import NameInputScreen from "./screens/NameInputScreen"
import TastePreferencesScreen from "./screens/TastePreferenceScreen"
import FavoriteBaseScreen from "./screens/FavoriteBaseScreen"
import OccasionPreferencesScreen from "./screens/OcassionPreferencesScreen"

const Stack = createStackNavigator()

// Navigation container with onboarding check
function AppNavigator() {
  const { onboardingCompleted, isLoading } = useOnboarding()

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF5F5" }}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        // Onboarding flow
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="NameInput" component={NameInputScreen} />
          <Stack.Screen name="TastePreferences" component={TastePreferencesScreen} />
          <Stack.Screen name="FavoriteBase" component={FavoriteBaseScreen} />
          <Stack.Screen name="OccasionPreferences" component={OccasionPreferencesScreen} />
        </>
      ) : null}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="CocktailDetail"
        component={CocktailDetailScreen}
        options={{
          cardStyle: { backgroundColor: "transparent" },
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <OnboardingProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <AppNavigator />
          </NavigationContainer>
        </OnboardingProvider>
      </FavoritesProvider>
    </SafeAreaProvider>
  )
}
