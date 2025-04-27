<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Sidebar from "../components/Sidebar.vue";

import "../assets/leaderboard.css";

import { useRouter } from "vue-router";

const user = JSON.parse(localStorage.getItem("user"));
const teams = ref([]);
const teamsInfo = ref([]);
const errorMessage = ref("");
const isSidebarOpen = ref(false);
const isDesktop = ref(window.innerWidth > 768);

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
    console.log(teamsInfo.value[0]);
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des équipes.";
  }
}

function goToTeamMatches(team) {
  const completeTeamInfo = teamsInfo.value.find((t) => t.name === team.team);
  if (completeTeamInfo) {
    router.push({
      name: "teamMatches",
      params: { id: completeTeamInfo.id },
    });
  } else {
    errorMessage.value = "Informations de l'équipe non trouvées.";
  }
}

function handleResize() {
  isDesktop.value = window.innerWidth > 768;
  if (isDesktop.value) {
    isSidebarOpen.value = false;
  }
}

onMounted(() => {
  fetchRanking();
  fetchTeams();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

function toggleSidebar() {
  console.log("Toggle sidebar");
  isSidebarOpen.value = !isSidebarOpen.value;
  isDesktop.value = window.innerWidth > 768;
  console.log("window width:", window.innerWidth);
  console.log("Sidebar state:", isSidebarOpen.value);
  console.log("Is desktop:", isDesktop.value);
}

</script>

<template>
  <div class="container">
    <button class="burger-btn" v-if="!isSidebarOpen && !isDesktop" @click="toggleSidebar">
      <i class="fa-solid fa-bars"></i>
    </button>

    <Sidebar
      v-show="isSidebarOpen || isDesktop"
      :user="user"
    >
    <button class="close-btn" @click="toggleSidebar">
      <i class="fa-solid fa-xmark"></i>
    </button>
    </Sidebar>

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
                <button
                  class="view-matches-button"
                  @click="goToTeamMatches(team)"
                >
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
