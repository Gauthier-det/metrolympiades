import {createRouter, createWebHistory} from "vue-router"; 
import RegisterPage from "./pages/RegisterPage.vue";
import LeaderBoardPage from "./pages/LeaderBoardPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import GamesPage from "./pages/GamesPage.vue";
import Team from "./pages/TeamPage.vue";

const routes = [
    {
        path: "/",
        redirect: "/leaderboard"
    },
    {
        path: "/register",
        name: "register",
        component: RegisterPage
    },
    {
        path: "/login",
        name: "login",
        component: LoginPage
    },
    {
        path: "/leaderboard",
        name: "leaderboard",
        component: LeaderBoardPage
    },
    {
        path: "/games",
        name: "games",
        component: GamesPage
    },
    {
        path: "/team",
        name: "team",
        component: Team
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;