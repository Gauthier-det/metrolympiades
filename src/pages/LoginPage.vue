<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import "../assets/form.css";

const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");

const isFormValid = computed(() => {
  return !!email.value.trim() && !!password.value.trim();
});

const isLoading = ref(false);

async function login() {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        errorMessage.value = "Email ou mot de passe incorrect.";
      } else {
        errorMessage.value = "Une erreur est survenue. Veuillez réessayer.";
      }
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));
    router.push("/leaderboard");

  } catch (error) {
    console.error("Erreur réseau ou serveur injoignable :", error);
    errorMessage.value = "Une erreur est survenue. Veuillez réessayer.";
  } finally {
    isLoading.value = false;
  }
}


</script>

<template>
  <div class="log-page-container">
    <form @submit.prevent="login" class="form-container">
      <h1 class="form-title">Connexion</h1>
      <input
        type="email"
        id="email"
        name="email"
        required
        v-model="email"
        placeholder="Email"
      />
      <input
        type="password"
        id="password"
        name="password"
        autocomplete="current-password"
        required
        v-model="password"
        placeholder="Mot de passe"
      />
      <button
        type="submit"
        :disabled="!isFormValid || isLoading"
        :class="{ loading: isLoading }"
      >
        Connexion
      </button>

      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <p>
        Pas encore de compte ?
        <router-link to="/register">Je m'inscris</router-link>
      </p>
    </form>
  </div>
</template>
