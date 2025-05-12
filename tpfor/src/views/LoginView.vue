<template>
  <div class="login-container">
    <b-card class="login-card" title="Connexion">
      <b-form @submit.prevent="handleLogin">
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

        <div class="d-flex justify-content-between align-items-center mt-3">
          <b-button variant="link" @click="$router.push('/register')">
            Créer un compte
          </b-button>
          <b-button variant="link" @click="handleResetPassword">
            Mot de passe oublié ?
          </b-button>
        </div>

        <b-button
          type="submit"
          variant="primary"
          class="w-100 mt-3"
          :disabled="loading"
        >
          <b-spinner small v-if="loading"></b-spinner>
          {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
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
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  if (!form.value.email) {
    error.value = 'Veuillez entrer votre email pour réinitialiser votre mot de passe'
    return
  }

  loading.value = true
  error.value = null
  try {
    await authStore.resetPassword(form.value.email)
    error.value = 'Un email de réinitialisation a été envoyé à votre adresse'
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
}

.login-card {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}
</style> 