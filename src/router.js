import {createRouter, createWebHistory} from "vue-router"; 
import RegisterPage from "./pages/RegisterPage.vue";
import LeaderBoardPage from "./pages/LeaderBoardPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import GamePage from "./pages/GamePage.vue";

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
        path: "/game",
        name: "game",
        component: GamePage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;