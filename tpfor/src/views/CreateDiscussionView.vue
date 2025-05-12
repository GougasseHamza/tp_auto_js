<template>
  <div class="create-discussion-container">
    <b-button
      variant="outline-primary"
      class="mb-4"
      @click="$router.push('/')"
    >
      <b-icon-arrow-left></b-icon-arrow-left> Retour aux discussions
    </b-button>

    <b-card>
      <h2>Créer une nouvelle discussion</h2>

      <b-form @submit.prevent="submitDiscussion" class="mt-4">
        <b-form-group label="Titre" label-for="title">
          <b-form-input
            id="title"
            v-model="form.title"
            type="text"
            required
            placeholder="Titre de la discussion"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Catégorie" label-for="category">
          <b-form-select
            id="category"
            v-model="form.categoryId"
            :options="categories"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group label="Contenu" label-for="content">
          <b-form-textarea
            id="content"
            v-model="form.content"
            rows="10"
            required
            placeholder="Contenu de la discussion"
          ></b-form-textarea>
        </b-form-group>

        <b-button
          type="submit"
          variant="primary"
          :disabled="submitting"
        >
          <b-spinner small v-if="submitting"></b-spinner>
          {{ submitting ? 'Création en cours...' : 'Créer la discussion' }}
        </b-button>
      </b-form>
    </b-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDiscussionsStore } from '../stores/discussions'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const discussionsStore = useDiscussionsStore()
const authStore = useAuthStore()

const form = ref({
  title: '',
  categoryId: '',
  content: ''
})

const submitting = ref(false)

const categories = [
  { value: 'general', text: 'Général' },
  { value: 'questions', text: 'Questions' },
  { value: 'aide', text: 'Aide' },
  { value: 'annonces', text: 'Annonces' }
]

const submitDiscussion = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) return

  submitting.value = true
  try {
    const discussionId = await discussionsStore.createDiscussion({
      title: form.value.title,
      content: form.value.content,
      categoryId: form.value.categoryId,
      userId: authStore.currentUser.uid,
      userName: authStore.currentUser.displayName
    })
    router.push(`/discussion/${discussionId}`)
  } catch (error) {
    console.error('Error creating discussion:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.create-discussion-container {
  padding: 1rem;
}
</style> 