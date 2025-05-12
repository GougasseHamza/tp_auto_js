<template>
  <div class="category-container">
    <b-button
      variant="outline-primary"
      class="mb-4"
      @click="$router.push('/')"
    >
      <b-icon-arrow-left></b-icon-arrow-left> Retour aux discussions
    </b-button>

    <h2 class="mb-4">{{ categoryName }}</h2>

    <template v-if="loading">
      <b-card v-for="i in 3" :key="i" class="mb-3">
        <b-skeleton animation="wave" width="85%"></b-skeleton>
        <b-skeleton animation="wave" width="55%"></b-skeleton>
        <b-skeleton animation="wave" width="70%"></b-skeleton>
      </b-card>
    </template>

    <template v-else>
      <b-card
        v-for="discussion in categoryDiscussions"
        :key="discussion.id"
        class="mb-3 discussion-card"
        @click="$router.push(`/discussion/${discussion.id}`)"
      >
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="card-title">{{ discussion.title }}</h5>
            <p class="card-text text-muted">
              Par {{ discussion.userName }} • 
              {{ formatDate(discussion.createdAt) }}
            </p>
          </div>
          <div class="text-right">
            <small class="text-muted">
              <b-icon-eye></b-icon-eye> {{ discussion.viewsCount }} vues<br>
              <b-icon-chat></b-icon-chat> {{ discussion.repliesCount }} réponses
            </small>
          </div>
        </div>
      </b-card>

      <b-alert
        v-if="categoryDiscussions.length === 0"
        variant="info"
        show
      >
        Aucune discussion n'a été trouvée dans cette catégorie.
      </b-alert>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDiscussionsStore } from '../stores/discussions'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const route = useRoute()
const discussionsStore = useDiscussionsStore()

const loading = ref(true)

const categoryName = computed(() => {
  const categories = {
    general: 'Général',
    questions: 'Questions',
    aide: 'Aide',
    annonces: 'Annonces'
  }
  return categories[route.params.id] || 'Catégorie inconnue'
})

const categoryDiscussions = computed(() => {
  return discussionsStore.getDiscussionsByCategory(route.params.id)
})

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

onMounted(async () => {
  try {
    await discussionsStore.fetchDiscussions()
  } catch (error) {
    console.error('Error fetching discussions:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.category-container {
  padding: 1rem;
}

.discussion-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.discussion-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style> 