<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import "../assets/form.css";

const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const teamname = ref("");
const errorMessage = ref("");

const isFormValid = computed(() => {
  return !!username.value.trim() && !!email.value.trim() && !!password.value.trim() &&!!teamname.value.trim();
});

const isLoading = ref(false);

function register() {
    isLoading.value = true;
    errorMessage.value = "";

    fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            email: email.value,  
            username: username.value,
            password: password.value,
            teamName: teamname.value
        }),
    })
    .then((res) => {
        if (!res.ok) {
            return res.json().then((data) => {
                if (data.message === "User already exists") {
                    errorMessage.value = "Cet utilisateur existe déjà.";
                }else{
                    errorMessage.value = "Une erreur s'est produite. Veuillez réessayer.";
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
  <form @submit.prevent="register">
    <h1 style="margin-bottom: 1rem">Inscription</h1>
    <input
      type="text"
      id="username"
      name="username"
      required
      v-model="username"
      placeholder="Nom d'utilisateur"
    />
    <input
      type="text"
      id="teamname"
      name="teamname"
      required
      v-model="teamname"
      placeholder="Nom d'équipe"
    />
    <input
      type="email"
      id="email"
      name="email"
      autocomplete="email"
      required
      v-model="email"
      placeholder="Email"
    />
    <input
      type="password"
      id="password"
      name="password"
      autocomplete="new-password"
      required
      v-model="password"
      placeholder="Mot de passe"
    />
    <button type="submit" :disabled="!isFormValid || isLoading" :class="{ loading: isLoading }">
      Créer un compte
    </button>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    
    <router-link to="/login">Je possède déjà un compte</router-link>
  </form>
</template>