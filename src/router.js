import {createRouter, createWebHistory} from "vue-router"; 
import RegisterPage from "./pages/RegisterPage.vue";

const routes = [
    {
        path: "/",
        name: "register",
        component: RegisterPage
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;