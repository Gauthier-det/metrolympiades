import {createRouter, createWebHistory} from "vue-router"; 
import RegisterPage from "./pages/RegisterPage.vue";
import LeaderBoardPage from "./pages/LeaderBoardPage.vue";
import LoginPage from "./pages/LoginPage.vue";

const routes = [
    {
        path: "/",
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
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;