import { createRouter, createWebHistory } from "vue-router";
import RegisterPage from "./pages/RegisterPage.vue";
import LeaderBoardPage from "./pages/LeaderBoardPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import GamesPage from "./pages/GamesPage.vue";
import GamePage from "./pages/GamePage.vue";
import Team from "./pages/TeamPage.vue";
import TeamGamesPage from "./pages/TeamGamesPage.vue";

const routes = [
  {
    path: "/",
    redirect: "/leaderboard",
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: LeaderBoardPage,
  },
  {
    path: "/games",
    name: "games",
    component: GamesPage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/game",
    name: "game",
    component: GamePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/team",
    name: "team",
    component: Team,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/team/:id/matches",
    name: "teamMatches",
    component: TeamGamesPage,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

router.afterEach((to) => {
  if (to.name) {
    let pageName = to.name.substring(0, 1).toUpperCase() + to.name.substring(1);
    document.title = `${pageName} - Metrolympiades`;
  } else {
    document.title = "Metrolympiades";
  }
});

export default router;
