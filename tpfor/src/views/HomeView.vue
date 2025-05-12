<template>
  <div class="home-container">
    <b-row>
      <b-col md="8">
        <h2 class="mb-4">Discussions récentes</h2>
        
        <b-card v-if="loading" class="mb-3">
          <b-skeleton animation="wave" width="85%"></b-skeleton>
          <b-skeleton animation="wave" width="55%"></b-skeleton>
          <b-skeleton animation="wave" width="70%"></b-skeleton>
        </b-card>

        <template v-else>
          <b-card
            v-for="discussion in discussions"
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
            v-if="discussions.length === 0"
            variant="info"
            show
          >
            Aucune discussion n'a été trouvée.
          </b-alert>
        </template>
      </b-col>

      <b-col md="4">
        <b-card class="mb-4">
          <template #header>
            <h5 class="mb-0">Catégories</h5>
          </template>
          <b-list-group>
            <b-list-group-item
              v-for="category in categories"
              :key="category.id"
              :to="`/category/${category.id}`"
              class="d-flex justify-content-between align-items-center"
            >
              {{ category.name }}
              <b-badge variant="primary" pill>{{ category.discussionsCount }}</b-badge>
            </b-list-group-item>
          </b-list-group>
        </b-card>

        <b-card v-if="isAuthenticated">
          <template #header>
            <h5 class="mb-0">Actions rapides</h5>
          </template>
          <b-button
            variant="primary"
            block
            @click="$router.push('/create-discussion')"
          >
            Créer une discussion
          </b-button>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDiscussionsStore } from '../stores/discussions'
import { useAuthStore } from '../stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const discussionsStore = useDiscussionsStore()
const authStore = useAuthStore()

const discussions = ref([])
const loading = ref(true)
const categories = ref([
  { id: 'general', name: 'Général', discussionsCount: 0 },
  { id: 'questions', name: 'Questions', discussionsCount: 0 },
  { id: 'aide', name: 'Aide', discussionsCount: 0 },
  { id: 'annonces', name: 'Annonces', discussionsCount: 0 }
])

const isAuthenticated = computed(() => authStore.isAuthenticated)

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

onMounted(async () => {
  try {
    await discussionsStore.fetchDiscussions()
    discussions.value = discussionsStore.discussions
    
    // Update discussion counts for categories
    categories.value = categories.value.map(category => ({
      ...category,
      discussionsCount: discussionsStore.getDiscussionsByCategory(category.id).length
    }))
  } catch (error) {
    console.error('Error fetching discussions:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.home-container {
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