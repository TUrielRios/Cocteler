"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, Image, Animated, Dimensions } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useOnboarding } from "../context/OnboardingContext"
import { useLanguage } from "../context/LanguageContext"

const { width } = Dimensions.get("window")

export default function SettingsScreen({ navigation }) {
  const insets = useSafeAreaInsets()
  const { userPreferences, resetOnboarding } = useOnboarding()
  const { language, changeLanguage, t } = useLanguage()

  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [saveIngredientsEnabled, setSaveIngredientsEnabled] = useState(true)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(30)).current
  const scrollY = useRef(new Animated.Value(0)).current

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  })

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Handle reset onboarding
  const handleResetOnboarding = () => {
    resetOnboarding()
    // Now we can directly navigate to Welcome since it's always in the stack
    navigation.navigate("Welcome")
  }

  // Render a setting item with a switch
  const renderSwitchSetting = ({ icon, title, description, value, onValueChange, color = "#FF6B6B" }) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: `${color}80` }}
        thumbColor={value ? color : "#FFFFFF"}
        ios_backgroundColor="#E0E0E0"
      />
    </View>
  )

  // Render a setting item with a chevron (for navigation)
  const renderNavigationSetting = ({ icon, title, description, onPress, color = "#FF6B6B", badge }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingAction}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
      </View>
    </TouchableOpacity>
  )

  // Render a danger setting item
  const renderDangerSetting = ({ icon, title, description, onPress }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={[styles.settingIconContainer, { backgroundColor: "#FF4D4D" }]}>
        <Ionicons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: "#FF4D4D" }]}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <View style={styles.settingAction}>
        <Ionicons name="alert-circle" size={20} color="#FF4D4D" />
      </View>
    </TouchableOpacity>
  )

  // Render language selector
  const renderLanguageSelector = () => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIconContainer, { backgroundColor: "#4ECDC4" }]}>
        <Ionicons name="language" size={22} color="#FFFFFF" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{t("language")}</Text>
        <Text style={styles.settingDescription}>{t("selectLanguage")}</Text>
      </View>
      <View style={styles.languageSelector}>
        <TouchableOpacity
          style={[styles.languageOption, language === "en" && styles.languageOptionSelected]}
          onPress={() => changeLanguage("en")}
        >
          <Text style={[styles.languageText, language === "en" && styles.languageTextSelected]}>{t("english")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.languageOption, language === "es" && styles.languageOptionSelected]}
          onPress={() => changeLanguage("es")}
        >
          <Text style={[styles.languageText, language === "es" && styles.languageTextSelected]}>{t("spanish")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Animated header */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            opacity: headerOpacity,
            paddingTop: insets.top,
          },
        ]}
      >
        <Text style={styles.headerTitle}>{t("settings")}</Text>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnim, transform: [{ translateY }] }}
      >
        {/* Header */}
        <LinearGradient
          colors={["#A78BFA", "#C4B5FD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>{t("settings")}</Text>
          <Text style={styles.headerSubtitle}>{t("customizeExperience")}</Text>
          <Image
            source={{ uri: "https://cdn-icons-png.flaticon.com/128/2099/2099058.png" }}
            style={styles.headerIcon}
          />
        </LinearGradient>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.defaultProfileIcon}>
              <Ionicons name="person-outline" size={40} color="#A78BFA" />
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userPreferences.name || "Cocktail Lover"}</Text>
            {/* <Text style={styles.profileEmail}>user@example.com</Text>
            <TouchableOpacity style={styles.editProfileTextButton}>
              <Text style={styles.editProfileText}>{t("editProfile")}</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t("preferences")}</Text>

          {renderSwitchSetting({
            icon: "notifications-outline",
            title: t("notifications"),
            description: t("receiveUpdates"),
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
          })}

          {/* {renderSwitchSetting({
            icon: "moon-outline",
            title: t("darkMode"),
            description: t("switchTheme"),
            value: darkModeEnabled,
            onValueChange: setDarkModeEnabled,
            color: "#6366F1",
          })} */}

          {renderSwitchSetting({
            icon: "save-outline",
            title: t("saveIngredients"),
            description: t("rememberIngredients"),
            value: saveIngredientsEnabled,
            onValueChange: setSaveIngredientsEnabled,
            color: "#34D399",
          })}

          {renderLanguageSelector()}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t("account")}</Text>

          {/* {renderNavigationSetting({
            icon: "person-outline",
            title: t("personalInfo"),
            description: t("updateProfile"),
            onPress: () => {},
            color: "#60A5FA",
          })} */}

          {renderNavigationSetting({
            icon: "wine-outline",
            title: t("tastePreferences"),
            description: t("updateFlavor"),
            onPress: () => navigation.navigate("TastePreferences", { fromSettings: true }),
            color: "#FF6B6B",
          })}

          {/* {renderNavigationSetting({
            icon: "lock-closed-outline",
            title: t("privacySettings"),
            description: t("manageData"),
            onPress: () => {},
            color: "#8B5CF6",
          })} */}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t("about")}</Text>

          {renderNavigationSetting({
            icon: "information-circle-outline",
            title: t("appInfo"),
            description: t("version"),
            onPress: () => {},
            color: "#F59E0B",
          })}

          {renderNavigationSetting({
            icon: "help-circle-outline",
            title: t("helpSupport"),
            description: t("faqContact"),
            onPress: () => {},
            color: "#10B981",
            badge: "New",
          })}

          {renderNavigationSetting({
            icon: "star-outline",
            title: t("rateApp"),
            description: t("tellUs"),
            onPress: () => {},
            color: "#F97316",
          })}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>{t("advanced")}</Text>

          {renderNavigationSetting({
            icon: "refresh-outline",
            title: t("resetPreferences"),
            description: t("resetToDefault"),
            onPress: () => {},
            color: "#6B7280",
          })}

          {renderDangerSetting({
            icon: "refresh-circle-outline",
            title: t("resetOnboarding"),
            description: t("welcomeScreens"),
            onPress: handleResetOnboarding,
          })}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LinearGradient
            colors={["#FF6B6B", "#FF8E8E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutGradient}
          >
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" style={styles.logoutIcon} />
            <Text style={styles.logoutText}>{t("logOut")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Cocktail App v1.0.0</Text>
          <Text style={styles.copyrightText}>{t("copyright")}</Text>
        </View>

        {/* Extra padding at bottom for navigation */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5", // Soft pink background
  },
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.95)",
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
  },
  scrollContent: {
    paddingBottom: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
    overflow: "hidden",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  headerIcon: {
    position: "absolute",
    right: 20,
    bottom: -15,
    width: 80,
    height: 80,
    opacity: 0.3,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 20,
  },
  defaultProfileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F0EAFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#A78BFA",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B5E62",
    marginBottom: 8,
  },
  editProfileTextButton: {
    alignSelf: "flex-start",
  },
  editProfileText: {
    fontSize: 14,
    color: "#A78BFA",
    fontWeight: "500",
  },
  settingsSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A3F41",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4A3F41",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: "#6B5E62",
  },
  settingAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  languageSelector: {
    flexDirection: "row",
  },
  languageOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#F0F0F0",
    marginLeft: 8,
  },
  languageOptionSelected: {
    backgroundColor: "#4ECDC4",
  },
  languageText: {
    fontSize: 12,
    color: "#6B5E62",
  },
  languageTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
    color: "#6B5E62",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 10,
    color: "#6B5E62",
    opacity: 0.7,
  },
  bottomPadding: {
    height: 80,
  },
})
