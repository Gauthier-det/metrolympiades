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

function login() {
    isLoading.value = true;
    
    fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            email: email.value,  
            password: password.value,
        }),
    })
    .then((res) => {
        if (!res.ok) {
            return res.json().then((data) => {
                if (data.message === "Invalid email or password") {
                    errorMessage.value = "Mot de passe ou email incorrect.";
                }
                throw new Error(data.message);
            });
        }
        return res.json();
    })
    .then((data) => {
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/leaderboard");
    })
    .catch((err) => {
        console.error(err);
    })
    .finally(() => {
        isLoading.value = false;
    });
}
</script>

<template>
  <form @submit.prevent="login" class="form-container">
    <h1 style="margin-bottom: 1rem">Connexion</h1>
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
    <button type="submit" :disabled="!isFormValid || isLoading" :class="{ loading: isLoading }">
      Connexion
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <p>Pas encore de compte ? <router-link to="/">Je m'inscris</router-link></p>

  </form>
</template>
