<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
});

const router = useRouter();

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}
</script>

<template>
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
</template>