<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";

import "../assets/main.css";

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

    <Sidebar :user="user" />

    <div class="main-content">
      <h1>Classement Général</h1>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

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
