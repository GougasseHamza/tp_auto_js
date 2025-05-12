<template>
  <div class="discussion-container">
    <b-button
      variant="outline-primary"
      class="mb-4"
      @click="$router.push('/')"
    >
      <b-icon-arrow-left></b-icon-arrow-left> Retour aux discussions
    </b-button>

    <template v-if="loading">
      <b-card class="mb-4">
        <b-skeleton animation="wave" width="85%"></b-skeleton>
        <b-skeleton animation="wave" width="55%"></b-skeleton>
        <b-skeleton animation="wave" width="70%"></b-skeleton>
      </b-card>
    </template>

    <template v-else-if="discussion">
      <b-card class="mb-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h2>{{ discussion.title }}</h2>
          <div v-if="isDiscussionOwner" class="btn-group">
            <b-button
              variant="outline-primary"
              size="sm"
              @click="editDiscussion"
            >
              <b-icon-pencil></b-icon-pencil>
            </b-button>
            <b-button
              variant="outline-danger"
              size="sm"
              @click="deleteDiscussion"
            >
              <b-icon-trash></b-icon-trash>
            </b-button>
          </div>
        </div>

        <div class="d-flex align-items-center mb-3">
          <b-avatar
            :text="getInitials(discussion.userName)"
            class="mr-2"
          ></b-avatar>
          <div>
            <strong>{{ discussion.userName }}</strong>
            <div class="text-muted small">
              {{ formatDate(discussion.createdAt) }}
            </div>
          </div>
        </div>

        <div class="discussion-content">
          {{ discussion.content }}
        </div>

        <div class="mt-3 text-muted">
          <small>
            <b-icon-eye></b-icon-eye> {{ discussion.viewsCount }} vues •
            <b-icon-chat></b-icon-chat> {{ discussion.repliesCount }} réponses
          </small>
        </div>
      </b-card>

      <h3 class="mb-4">Réponses</h3>

      <template v-if="replies.length === 0">
        <b-alert variant="info" show>
          Aucune réponse n'a été publiée pour le moment.
        </b-alert>
      </template>

      <template v-else>
        <b-card
          v-for="reply in replies"
          :key="reply.id"
          class="mb-3"
        >
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div class="d-flex align-items-center">
              <b-avatar
                :text="getInitials(reply.userName)"
                class="mr-2"
              ></b-avatar>
              <div>
                <strong>{{ reply.userName }}</strong>
                <div class="text-muted small">
                  {{ formatDate(reply.createdAt) }}
                </div>
              </div>
            </div>
            <div v-if="isReplyOwner(reply)" class="btn-group">
              <b-button
                variant="outline-primary"
                size="sm"
                @click="editReply(reply)"
              >
                <b-icon-pencil></b-icon-pencil>
              </b-button>
              <b-button
                variant="outline-danger"
                size="sm"
                @click="deleteReply(reply.id)"
              >
                <b-icon-trash></b-icon-trash>
              </b-button>
            </div>
          </div>
          <div class="reply-content">
            {{ reply.content }}
          </div>
        </b-card>
      </template>

      <b-card v-if="isAuthenticated" class="mt-4">
        <h4>Ajouter une réponse</h4>
        <b-form @submit.prevent="submitReply">
          <b-form-textarea
            v-model="newReply"
            placeholder="Votre réponse..."
            rows="3"
            required
          ></b-form-textarea>
          <b-button
            type="submit"
            variant="primary"
            class="mt-3"
            :disabled="submitting"
          >
            <b-spinner small v-if="submitting"></b-spinner>
            {{ submitting ? 'Envoi en cours...' : 'Publier la réponse' }}
          </b-button>
        </b-form>
      </b-card>
    </template>

    <b-modal
      v-model="showEditModal"
      title="Modifier la discussion"
      @ok="updateDiscussion"
    >
      <b-form>
        <b-form-group label="Titre">
          <b-form-input
            v-model="editForm.title"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Contenu">
          <b-form-textarea
            v-model="editForm.content"
            rows="5"
            required
          ></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiscussionsStore } from '../stores/discussions'
import { useAuthStore } from '../stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const route = useRoute()
const router = useRouter()
const discussionsStore = useDiscussionsStore()
const authStore = useAuthStore()

const discussion = ref(null)
const replies = ref([])
const loading = ref(true)
const submitting = ref(false)
const newReply = ref('')
const showEditModal = ref(false)
const editForm = ref({
  title: '',
  content: ''
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.currentUser)
const isDiscussionOwner = computed(() => {
  return discussion.value && currentUser.value && 
         discussion.value.userId === currentUser.value.uid
})

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

const isReplyOwner = (reply) => {
  return currentUser.value && reply.userId === currentUser.value.uid
}

const editDiscussion = () => {
  editForm.value = {
    title: discussion.value.title,
    content: discussion.value.content
  }
  showEditModal.value = true
}

const updateDiscussion = async () => {
  try {
    await discussionsStore.updateDiscussion({
      id: discussion.value.id,
      ...editForm.value
    })
    discussion.value = {
      ...discussion.value,
      ...editForm.value
    }
  } catch (error) {
    console.error('Error updating discussion:', error)
  }
}

const deleteDiscussion = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) {
    try {
      await discussionsStore.deleteDiscussion(discussion.value.id)
      router.push('/')
    } catch (error) {
      console.error('Error deleting discussion:', error)
    }
  }
}

const submitReply = async () => {
  if (!newReply.value.trim()) return

  submitting.value = true
  try {
    // TODO: Implement reply creation
    newReply.value = ''
  } catch (error) {
    console.error('Error submitting reply:', error)
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    await discussionsStore.fetchDiscussions()
    discussion.value = discussionsStore.getDiscussionById(route.params.id)
    
    if (discussion.value) {
      await discussionsStore.incrementViews(discussion.value.id)
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error('Error loading discussion:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.discussion-container {
  padding: 1rem;
}

.discussion-content,
.reply-content {
  white-space: pre-line;
}
</style> 