<script setup>
import { ref, onMounted } from "vue";
import Sidebar from "../components/Sidebar.vue";

import "../assets/leaderboard.css";

import { useRouter } from "vue-router";

const user = JSON.parse(localStorage.getItem("user"));
const teams = ref([]);
const teamsInfo = ref([]);
const errorMessage = ref("");

const router = useRouter();


async function fetchRanking() {
  try {
    const response = await fetch("http://localhost:3000/ranking");
    if (!response.ok) {
      throw new Error("Impossible de récupérer le classement");
    }
    const data = await response.json();
    teams.value = data;
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération du classement.";
  }
}

async function fetchTeams() {
  try {
    const response = await fetch("http://localhost:3000/teams");
    if (!response.ok) {
      throw new Error("Impossible de récupérer les équipes");
    }
    const data = await response.json();
    teamsInfo.value = data;
    console.log(teamsInfo.value[0])
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des équipes.";
  }
}

function goToTeamMatches(team) {
  const completeTeamInfo = teamsInfo.value.find((t) => t.name === team.team);
  if (completeTeamInfo) {
    router.push({
      name: "teamMatches",
      params: { id: completeTeamInfo.id }
    });
  } else {
    errorMessage.value = "Informations de l'équipe non trouvées.";
  }
}

onMounted(() => {
  fetchRanking();
  fetchTeams();
});
</script>

<template>
  <div class="container">
    <Sidebar :user="user" />
    <div class="main-content">
      <h1>Classement Général</h1>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Équipe</th>
              <th>Points</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(team, index) in teams" :key="team.team">
              <td>{{ index + 1 }}</td>
              <td>{{ team.team }}</td>
              <td>{{ team.points }} pts</td>
              <td>
                <button class="view-matches-button" @click="goToTeamMatches(team)">
                  Voir les matchs
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
