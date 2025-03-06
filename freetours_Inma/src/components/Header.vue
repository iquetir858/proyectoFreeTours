<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRoute } from 'vue-router'

const route = useRoute();
const props = defineProps({
    title: String,
    loggedUser: Object
});
const emit = defineEmits(["logout"]);

function logout() {
    emit('logout');
}
</script>

<template>
    <header class="navbar navbar-expand-sm">
        <div class="container-fluid">
            <RouterLink to="/" class="navbar-brand">
                <img src="../assets/logoGato.png" alt="(Logo)" title="Logo">
                <span class="fs-4 titlePage">{{ title }}</span>
            </RouterLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler"
                aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse flex-row-reverse" id="navbarToggler">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 nav-pills">
                    <li class="nav-item">
                        <!--RouterLink a la vista de AboutView.vue-->
                        <RouterLink to="/about" class="nav-link">
                            Sobre Nosotros
                        </RouterLink>
                    </li>
                    <li class="nav-item" v-if="!loggedUser && route.path != '/login' && route.path != '/register'">
                        <RouterLink to="/login" class="nav-link">
                            Iniciar Sesión
                        </RouterLink>
                    </li>
                    <li class="nav-item" v-if="!loggedUser && route.path != '/login' && route.path != '/register'">
                        <RouterLink to="/register" class="nav-link">
                            Registrarse
                        </RouterLink>
                    </li>
                    <li class="bienvenida nav-item d-flex flex-column"
                        v-if="loggedUser && route.path != '/login' && route.path != '/register'">
                        <!--Intentar poner el nombre en mayúscula-->
                        <span>Bienvenid@, {{ loggedUser.nombre }} ({{ loggedUser.rol }})</span>
                        <button @click="logout" class="btn btnCerrarSesion" aria-label="Cerrar sesión">Cerrar
                            Sesión</button>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<style scoped>
header {
    /* background-color: rgb(236, 166, 177); */
    background-color: #DCAC54;
    /* background-color: #f4e04d; */
    /* https://coolors.co/visualizer/f4e04d-f2ed6f-cee397-8db1ab-587792 */
    /* https://coolors.co/visualizer/ff8811-f4d06f-fff8f0-9dd9d2-392f5a */
    /* https://coolors.co/visualizer/795c5f-a69658-d9b26f-fadf7f-f2e29f */
    /* background-color: #2EC4B6; */
    /* background-color: #801A86; */
}

.titlePage {
    color: #1C0505;
    font-weight: bold;
}

.titlePage:hover {
    color: white;
    text-decoration: underline;
    /* color: orangered; */
}

img {
    width: 2.5em;
    margin: 0 0.2em 0.8em 0.4em;
    height: auto;
}

.nav-link {
    color: #1C0505;
    transition: 0.2 linear;
    margin: 0.2em;
    font-weight: bold;
}

.bienvenida {
    color: #1C0505;
}

.nav-link:hover {
    color: rgb(204, 15, 44);
    text-decoration: underline;
}

.btnCerrarSesion {
    color: white;
    background-color: #1C0505;
    border: 1px solid #1C0505;
}

.btnCerrarSesion:hover {
    background-color: white;
    color: #1C0505;
    font-weight: bold;
}
</style>
