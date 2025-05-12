<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from './firebase/config';

const router = useRouter();
const isAuthenticated = ref(false);
const user = ref(null);

// Computed property for user initials
const userInitials = computed(() => {
  if (!user.value) return '';
  return user.value.displayName
    ? user.value.displayName.split(' ').map(n => n[0]).join('')
    : user.value.email[0].toUpperCase();
});

// Auth state listener
auth.onAuthStateChanged((userData) => {
  user.value = userData;
  isAuthenticated.value = !!userData;
});

// Logout function
const logout = async () => {
  try {
    await auth.signOut();
    router.push('/login');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
</script>

<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="primary">
      <b-container>
        <b-navbar-brand to="/">TPForum</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item to="/">Accueil</b-nav-item>
            <b-nav-item to="/categories">Catégories</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto">
            <template v-if="!isAuthenticated">
              <b-nav-item to="/login">Connexion</b-nav-item>
              <b-nav-item to="/register">Inscription</b-nav-item>
            </template>
            <template v-else>
              <b-nav-item to="/create-discussion">Créer une discussion</b-nav-item>
              <b-nav-item-dropdown right>
                <template #button-content>
                  <b-avatar size="sm" :text="userInitials"></b-avatar>
                </template>
                <b-dropdown-item to="/profile">Profil</b-dropdown-item>
                <b-dropdown-item @click="logout">Déconnexion</b-dropdown-item>
              </b-nav-item-dropdown>
            </template>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>

    <b-container class="mt-4">
      <router-view></router-view>
    </b-container>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
