"use client"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useLanguage } from "../context/LanguageContext"
import { useOnboarding } from "../context/OnboardingContext"
import TexturedBackground from "../components/TexturedBackground"

const CommunityDetailScreen = () => {
  const insets = useSafeAreaInsets()
  const navigation = useNavigation()
  const route = useRoute()
  const { t, language } = useLanguage()
  const { userName } = useOnboarding()

  const { cocktail } = route.params
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState("")

  // Obtener los datos según el idioma
  const name = language === "en" ? cocktail.name : cocktail.nameEs
  const description = language === "en" ? cocktail.description : cocktail.descriptionEs
  const ingredients = language === "en" ? cocktail.ingredients : cocktail.ingredientsEs
  const steps = language === "en" ? cocktail.steps : cocktail.stepsEs

  // Comentarios de ejemplo
  const [comments, setComments] = useState([
    {
      id: "comment-1",
      author: "Alex",
      text: "I tried this last weekend and it was amazing! I added a bit more lime juice for extra tanginess.",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "comment-2",
      author: "Jamie",
      text: "Great recipe! What brand of rum do you recommend?",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
  ])

  // Formatear tiempo relativo
  const formatTimeAgo = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return diffDay === 1 ? t("dayAgo") : `${diffDay} ${t("daysAgo")}`
    }
    if (diffHour > 0) {
      return diffHour === 1 ? t("hourAgo") : `${diffHour} ${t("hoursAgo")}`
    }
    if (diffMin > 0) {
      return diffMin === 1 ? t("minuteAgo") : `${diffMin} ${t("minutesAgo")}`
    }
    return t("justNow")
  }

  // Añadir un comentario
  const addComment = () => {
    if (!comment.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      author: userName || t("anonymousUser"),
      text: comment,
      createdAt: new Date().toISOString(),
    }

    setComments([newComment, ...comments])
    setComment("")
  }

  // Manejar el like
  const handleLike = () => {
    setLiked(!liked)
    // En una implementación real, aquí se actualizaría el contador de likes en AsyncStorage
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <TexturedBackground />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("communityRecipe")}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: cocktail.image }} style={styles.cocktailImage} resizeMode="cover" />

        <View style={styles.contentContainer}>
          <Text style={styles.cocktailName}>{name}</Text>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Text style={styles.authorInitial}>{cocktail.author.charAt(0)}</Text>
            </View>
            <Text style={styles.authorName}>
              {t("by")} {cocktail.author}
            </Text>
            <Text style={styles.timeAgo}>{formatTimeAgo(new Date(cocktail.createdAt))}</Text>
          </View>

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color={liked ? "#FF6B6B" : "#666"} />
              <Text style={styles.statText}>{cocktail.likes + (liked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <View style={styles.commentCount}>
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
              <Text style={styles.statText}>{comments.length}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t("description")}</Text>
          <Text style={styles.description}>{description}</Text>

          <Text style={styles.sectionTitle}>{t("ingredients")}</Text>
          <View style={styles.ingredientsList}>
            {ingredients.map((ingredient, index) => (
              <View key={`ing-${index}`} style={styles.ingredientItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t("preparation")}</Text>
          <View style={styles.stepsList}>
            {steps.map((step, index) => (
              <View key={`step-${index}`} style={styles.stepItem}>
                <View style={styles.stepNumberContainer}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>{t("comments")}</Text>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder={t("addComment")}
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={addComment}>
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.commentsList}>
            {comments.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                <View style={styles.commentHeader}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentInitial}>{item.author.charAt(0)}</Text>
                  </View>
                  <View style={styles.commentAuthorInfo}>
                    <Text style={styles.commentAuthor}>{item.author}</Text>
                    <Text style={styles.commentTime}>{formatTimeAgo(new Date(item.createdAt))}</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  shareButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  cocktailImage: {
    width: "100%",
    height: 250,
  },
  contentContainer: {
    padding: 20,
  },
  cocktailName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#26C6B9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  authorInitial: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  authorName: {
    fontSize: 16,
    color: "#666",
  },
  timeAgo: {
    fontSize: 14,
    color: "#999",
    marginLeft: "auto",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  commentCount: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    marginBottom: 20,
  },
  ingredientsList: {
    marginBottom: 20,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#26C6B9",
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 16,
    color: "#444",
  },
  stepsList: {
    marginBottom: 20,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 15,
  },
  stepNumberContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#26C6B9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumber: {
    color: "#FFF",
    fontWeight: "bold",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#26C6B9",
    justifyContent: "center",
    alignItems: "center",
  },
  commentsList: {
    marginBottom: 30,
  },
  commentItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  commentInitial: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentAuthorInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#999",
  },
  commentText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
})

export default CommunityDetailScreen
