<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import "../assets/main.css";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user")); 
const teams = ref([]); 
const errorMessage = ref("");

async function fetchRanking() {
  try {
    const response = await fetch("http://localhost:3000/ranking");
    if (!response.ok) {
      throw new Error("Impossible de récupérer le classement");
    }
    const data = await response.json();
    teams.value = data;
    console.log(teams.value);
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération du classement.";
    console.error(error);
  }
}

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

onMounted(() => {
  fetchRanking();
});

</script>

<template>
  <div class="container">
    <div class="sidebar">
      <div class="app-name">Metrolympiades</div>

      <div v-if="user">
        <div class="team-name">Équipe : {{ user.team.name }}</div>
        <router-link to="/leaderboard">
            <i class="fa-solid fa-ranking-star"></i> Classement général
        </router-link>
        <router-link to="#">
            <i class="fas fa-users"></i> Mon équipe
        </router-link>
        <router-link to="#">
            <i class="fas fa-calendar-alt"></i> Mes matchs
        </router-link>
        <button @click="logout">
            <i class="fa-solid fa-right-from-bracket"></i> Se déconnecter
        </button>
      </div>

      <div v-else>
        <router-link to="/login">
            <i class="fa-solid fa-right-to-bracket"></i> Se connecter
        </router-link>
      </div>
    </div>

    <div class="main-content">
      <h1>Classement Général</h1>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Équipe</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(team, index) in teams" :key="team.id">
            <td>{{ index + 1 }}</td>
            <td>{{ team.team }}</td>
            <td>{{ team.points }} pts</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
