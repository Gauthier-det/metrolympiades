<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Sidebar from "../components/Sidebar.vue";


const router = useRouter();

const user = JSON.parse(localStorage.getItem("user"));

const teammates = ref([]);
const teams = ref([]);
const errorMessage = ref("");
const teamName = ref("");
const updateMessage = ref("");

async function fetchTeam() {
  try {
    const response = await fetch("http://localhost:3000/teams/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Une erreur est survenue lors de la récupération de l'équipe");
    }

    const data = await response.json();

    if (!data) {
      errorMessage.value = "Aucune équipe trouvée pour cet utilisateur.";
      teams.value = {};
      teamName.value = "";
      teammates.value = [];
      return;
    }

    teams.value = data;
    teamName.value = data.name || "";
    teammates.value = [];

    if (!Array.isArray(data.members) || data.members.length === 0) {
      errorMessage.value = "Votre équipe n'a actuellement aucun membre.";
      return;
    } else {
      errorMessage.value = "";
    }
    
    console.log(teams.value);
    showTeammates();
    console.log(teams.value);
  } catch (error) {
    errorMessage.value = "Une erreur est survenue lors de la récupération de l'équipe";
    console.error(error);
  }
}

function showTeammates() {
  teams.value.members.forEach((teammate) => {
    teammates.value.push(teammate);
  });
}

function updateTeam() {
  if (teamName.value.trim() === "") {
    errorMessage.value = "Le nom de l'équipe ne peut pas être vide.";
    return;
  }
  const members = teammates.value.filter((teammate) => teammate.trim() !== "");

  const updatedTeam = {
    name: teamName.value,
    members: members,
  };

  fetch("http://localhost:3000/teams/me", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    },
    body: JSON.stringify(updatedTeam),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Équipe mise à jour :", data);
      updateMessage.value = "Équipe mise à jour avec succès !";
      errorMessage.value = "";
    })
    .catch((error) => {
      console.error("Erreur lors de la mise à jour de l'équipe :", error);
    });
}

function addTeammate() {
  teammates.value.push("");
  updateMessage.value = "";
}

onMounted(() => {
  fetchTeam();
});

function removeTeammate(index) {
  teammates.value.splice(index, 1);
  updateTeam();
}
</script>

<template>
  <div class="container">
    <Sidebar :user="user" />
    <div class="main-content">
      <div class="header">
        <h1>Mon équipe !</h1>
        <button @click="updateTeam">Enregistrer</button>
      </div>

      
      <div class ="center-container">

      <form class="form-container">
        <label class="label" for="teamname">Nom de l'équipe :</label>
        
        <input
          type="text"
          id="teamname"
          name="teamname"
          placeholder="Nom d'équipe"
          v-model="teamName"
        />
        <label v-if="errorMessage" class="error-message">{{
          errorMessage
        }}</label>
        <label class="label" for="teammember">Membres de l'équipe :</label>
        
        <div id="teammates-list">
          <input
            type="text"
            v-model="user.username"
          />
          <div v-for="(teammate, index) in teammates" :key="index" class="teammate">
            <input
              type="text"
              v-model="teammates[index]"
              placeholder="Nom du coéquipier"
            />
            <button
              type="button"
              @click="removeTeammate(index)"
              class="remove-btn"
            >
              X
            </button>
          </div>
        </div>
        <input
          type="button"
          value="Ajouter un coéquipier"
          @click="addTeammate"
        />
        <label v-if="updateMessage" class="success-message">{{
          updateMessage
        }}</label>
      </form>
    </div>
    </div>
  </div>
</template>
