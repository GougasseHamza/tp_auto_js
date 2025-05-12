<template>
  <div class="profile-container">
    <b-card>
      <h2>Profil utilisateur</h2>

      <b-form @submit.prevent="updateProfile" class="mt-4">
        <b-form-group label="Nom d'utilisateur" label-for="displayName">
          <b-form-input
            id="displayName"
            v-model="form.displayName"
            type="text"
            required
            placeholder="Votre nom d'utilisateur"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            disabled
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Nouveau mot de passe" label-for="newPassword">
          <b-form-input
            id="newPassword"
            v-model="form.newPassword"
            type="password"
            placeholder="Laissez vide pour ne pas changer"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Confirmer le nouveau mot de passe" label-for="confirmPassword">
          <b-form-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirmez le nouveau mot de passe"
          ></b-form-input>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="submitting"
        >
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Mise à jour en cours...' : 'Mettre à jour le profil' }}
        </b-button>
      </b-form>

      <hr class="my-4">

      <h3>Statistiques</h3>
      <b-row class="mt-3">
        <b-col md="4">
          <b-card class="text-center">
            <h4>{{ userDiscussions.length }}</h4>
            <p class="text-muted mb-0">Discussions</p>
          </b-card>
        </b-col>
        <b-col md="4">
          <b-card class="text-center">
            <h4>{{ userReplies.length }}</h4>
            <p class="text-muted mb-0">Réponses</p>
          </b-card>
        </b-col>
        <b-col md="4">
          <b-card class="text-center">
            <h4>{{ totalViews }}</h4>
            <p class="text-muted mb-0">Vues totales</p>
          </b-card>
        </b-col>
      </b-row>

      <hr class="my-4">

      <h3>Mes discussions récentes</h3>
      <template v-if="userDiscussions.length === 0">
        <b-alert variant="info" show class="mt-3">
          Vous n'avez pas encore créé de discussions.
        </b-alert>
      </template>
      <template v-else>
        <b-list-group class="mt-3">
          <b-list-group-item
            v-for="discussion in userDiscussions"
            :key="discussion.id"
            :to="`/discussion/${discussion.id}`"
            class="d-flex justify-content-between align-items-center"
          >
            {{ discussion.title }}
            <small class="text-muted">
              {{ formatDate(discussion.createdAt) }}
            </small>
          </b-list-group-item>
        </b-list-group>
      </template>
    </b-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDiscussionsStore } from '../stores/discussions'
import { useRepliesStore } from '../stores/replies'
import { useAuthStore } from '../stores/auth'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const discussionsStore = useDiscussionsStore()
const repliesStore = useRepliesStore()
const authStore = useAuthStore()

const form = ref({
  displayName: '',
  email: '',
  newPassword: '',
  confirmPassword: ''
})

const submitting = ref(false)

const userDiscussions = computed(() => {
  return discussionsStore.discussions
    .filter(d => d.userId === authStore.currentUser?.uid)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const userReplies = computed(() => {
  return repliesStore.replies
    .filter(r => r.userId === authStore.currentUser?.uid)
})

const totalViews = computed(() => {
  return userDiscussions.value.reduce((sum, d) => sum + d.viewsCount, 0)
})

const formatDate = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

const updateProfile = async () => {
  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas')
    return
  }

  submitting.value = true
  try {
    // TODO: Implement profile update
    alert('Profil mis à jour avec succès')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Erreur lors de la mise à jour du profil')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    await discussionsStore.fetchDiscussions()
    await repliesStore.fetchReplies()
    
    if (authStore.currentUser) {
      form.value.displayName = authStore.currentUser.displayName || ''
      form.value.email = authStore.currentUser.email || ''
    }
  } catch (error) {
    console.error('Error loading profile data:', error)
  }
})
</script>

<style scoped>
.profile-container {
  padding: 1rem;
}
</style> 