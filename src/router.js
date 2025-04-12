import {createRouter, createWebHistory} from "vue-router"; 
import RegisterPage from "./pages/RegisterPage.vue";
import LeaderBoardPage from "./pages/LeaderBoardPage.vue";
import LoginPage from "./pages/LoginPage.vue";
import GamesPage from "./pages/GamesPage.vue";
import GamePage from "./pages/GamePage.vue";
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
        component: GamesPage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/game",
        name: "game",
        component: GamePage,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: "/team",
        name: "team",
        component: Team,
        meta: {
            requiresAuth: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, _, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;