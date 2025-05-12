<template>
  <div class="register-container">
    <b-card class="register-card" title="Inscription">
      <b-form @submit.prevent="handleRegister">
        <b-form-group label="Nom d'utilisateur" label-for="displayName">
          <b-form-input
            id="displayName"
            v-model="form.displayName"
            type="text"
            required
            placeholder="Entrez votre nom d'utilisateur"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Email" label-for="email">
          <b-form-input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="Entrez votre email"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Mot de passe" label-for="password">
          <b-form-input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="Entrez votre mot de passe"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Confirmer le mot de passe" label-for="confirmPassword">
          <b-form-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirmez votre mot de passe"
          ></b-form-input>
        </b-form-group>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <b-button variant="link" @click="$router.push('/login')">
            Déjà un compte ? Se connecter
          </b-button>
        </div>

        <b-button
          type="submit"
          variant="primary"
          class="w-100 mt-3"
          :disabled="loading"
        >
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
        </b-button>

        <b-alert
          v-if="error"
          variant="danger"
          show
          class="mt-3"
        >
          {{ error }}
        </b-alert>
      </b-form>
    </b-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas'
    return
  }

  loading.value = true
  error.value = null
  try {
    await authStore.register({
      email: form.value.email,
      password: form.value.password,
      displayName: form.value.displayName
    })
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
}

.register-card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style> 