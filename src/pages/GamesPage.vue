<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";

import "../assets/games.css";

const user = JSON.parse(localStorage.getItem("user"));
const errorMessage = ref("");

const matchs = ref([]);

async function fetchMatchs() {
  try {
    const response = await fetch("http://localhost:3000/matches/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    if (!response.ok) {
        throw new Error("Impossible de récupérer les matchs");
    }
    const data = await response.json();
    matchs.value = data;
    console.log("matchs : " + JSON.stringify(matchs.value));
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des matchs ";
    console.error(error.message);
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

onMounted(() => {
  fetchMatchs();
});

</script>

<template>
  <div class="container">
    <Sidebar :user="user"/>

    <div class="main-content">
        <h1>Mes matchs</h1>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <div class="matches-container">
        <div v-for="match in matchs" :key="match.id" class="match-card">
            
          <div class="match-header">
            <span class="match-type">{{ match.activity }}</span>
            <span class="match-time">{{ formatDate(match.startedAt) }}</span>
          </div>
          <div class="match-teams">
            <div class="team">
              <span class="team-name">{{ match.team1 }}</span>
              <span class="team-score">{{ match.team1Score }}</span>
            </div>
            <div class="team">
              <span class="team-name">{{ match.team2 }}</span>
              <span class="team-score">{{ match.team2Score }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>
