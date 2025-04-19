<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";

import "../assets/game.css";

const router = useRouter();
const user = JSON.parse(localStorage.getItem("user"));
const teams = ref([]);
const activities = ref([]);
const opponent = ref("");
const selectedOpponentName = computed(() => {
  const selectedTeam = teams.value.find((team) => team.id === opponent.value);
  return selectedTeam ? selectedTeam.name : "Aucun adversaire sélectionné";
});
const activity = ref("");
const time = ref("");
const scoreUserTeam = ref(0);
const scoreOpponentTeam = ref(0);
const errorMessage = ref("");
const isFormValid = computed(() => {
  return (
    !!opponent.value &&
    !!activity.value &&
    !!time.value &&
    !!scoreUserTeam.value >= 0 &&
    !!scoreOpponentTeam.value >= 0
  );
});

async function fetchTeams() {
  try {
    const response = await fetch("http://localhost:3000/teams");
    if (!response.ok) {
      throw new Error("Impossible de récupérer les équipes.");
    }
    const data = await response.json();
    teams.value = data
      .filter((team) => team.id !== user.team.id)
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log(teams.value);
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des équipes.";
    console.error(error);
  }
}

async function fetchActivities() {
  try {
    const response = await fetch("http://localhost:3000/activities");
    if (!response.ok) {
      throw new Error("Impossible de récupérer les activités.");
    }
    const data = await response.json();
    activities.value = data.sort((a, b) => a.name.localeCompare(b.name));
    console.log(teams.value);
  } catch (error) {
    errorMessage.value = "Erreur lors de la récupération des activités.";
    console.error(error);
  }
}

function postMatch() {
  fetch("http://localhost:3000/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify({
      team2Id: opponent.value,
      activityId: activity.value,
      startedAt:
        new Date().toISOString().split("T")[0] + "T" + time.value + ":00Z",
      team1Score: scoreUserTeam.value,
      team2Score: scoreOpponentTeam.value,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then((data) => {
          if (data.message === "Invalid match parameters") {
            errorMessage.value = "Paramètres de match invalides.";
            console.log(data.message);
          } else if (data.message === "Match already exists") {
            errorMessage.value =
              "Un match contre cet adversaire pour cette activité existe déjà.";
            console.log(data.message);
          } else {
            console.log("Erreur inconnue :", data.message);
          }
          throw new Error(data.message);
        });
      }
      return res.json();
    })
    .then(() => {
      router.push("/games");
    })
    .catch((err) => {
      console.error(err);
    });
}

onMounted(() => {
  fetchTeams();
  fetchActivities();
});
</script>

<template>
  <div class="container">
    <Sidebar :user="user" />
    <form class="main-content" @submit.prevent="postMatch">
      <h1>Nouveau match</h1>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <div class="game-main-container">
        <div class="game-input-container">
          <p>Adversaire</p>
          <select name="opponent" id="opponent" v-model="opponent" required>
            <option value="" disabled selected hidden>
              Sélectionner une équipe
            </option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>

        <div class="game-input-container">
          <p>Activité</p>
          <select name="activity" id="activity" v-model="activity" required>
            <option value="" disabled selected hidden>
              Sélectionner une activité
            </option>
            <option v-for="act in activities" :key="act.id" :value="act.id">
              {{ act.name }}
            </option>
          </select>
        </div>

        <div class="game-input-container">
          <p>Heure de début</p>
          <input type="time" id="time" name="time" v-model="time" required />
        </div>

        <h2>Scores finaux</h2>
        <div class="game-input-container">
          <p>
            Mon équipe : <strong>{{ user.team.name }}</strong>
          </p>
          <input
            type="number"
            id="scoreUserTeam"
            name="scoreUserTeam"
            v-model="scoreUserTeam"
            min="0"
          />
        </div>
        <div class="game-input-container">
          <p>
            Adversaire : <strong>{{ selectedOpponentName }}</strong>
          </p>
          <input
            type="number"
            id="scoreOpponentTeam"
            name="scoreOpponentTeam"
            v-model="scoreOpponentTeam"
            min="0"
          />
        </div>

        <button class="game-button" type="submit" :disabled="!isFormValid">
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>
