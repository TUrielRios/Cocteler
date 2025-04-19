
import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Create context
const OnboardingContext = createContext()

// Storage keys
const ONBOARDING_COMPLETED_KEY = "@cocktail_app_onboarding_completed"
const USER_PREFERENCES_KEY = "@cocktail_app_user_preferences"

export const OnboardingProvider = ({ children }) => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userPreferences, setUserPreferences] = useState({
    name: "",
    tastePreferences: {
      sweet: 0,
      sour: 0,
      bitter: 0,
      spicy: 0,
    },
    favoriteBase: "",
    occasions: [],
  })

  // Load onboarding status and preferences from AsyncStorage on mount
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY)
        if (completed === "true") {
          setOnboardingCompleted(true)

          // Load user preferences if onboarding is completed
          const storedPreferences = await AsyncStorage.getItem(USER_PREFERENCES_KEY)
          if (storedPreferences) {
            setUserPreferences(JSON.parse(storedPreferences))
          }
        }
      } catch (error) {
        console.error("Failed to load onboarding status", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOnboardingStatus()
  }, [])

  // Complete onboarding and save preferences
  const completeOnboarding = async (preferences) => {
    try {
      const updatedPreferences = { ...userPreferences, ...preferences }
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true")
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences))

      setUserPreferences(updatedPreferences)
      setOnboardingCompleted(true)
    } catch (error) {
      console.error("Failed to save onboarding status", error)
    }
  }

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      const updatedPreferences = { ...userPreferences, ...preferences }
      await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences))
      setUserPreferences(updatedPreferences)
    } catch (error) {
      console.error("Failed to update preferences", error)
    }
  }

  // Reset onboarding (for testing)
  const resetOnboarding = async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY)
      await AsyncStorage.removeItem(USER_PREFERENCES_KEY)
      setOnboardingCompleted(false)
      setUserPreferences({
        name: "",
        tastePreferences: {
          sweet: 0,
          sour: 0,
          bitter: 0,
          spicy: 0,
        },
        favoriteBase: "",
        occasions: [],
      })
    } catch (error) {
      console.error("Failed to reset onboarding", error)
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        onboardingCompleted,
        userPreferences,
        completeOnboarding,
        updatePreferences,
        resetOnboarding,
        isLoading,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

// Custom hook to use the onboarding context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
