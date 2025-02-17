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
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom text-white">
        <RouterLink to="/"
            class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none text-white">
            <img src="../assets/logo.png" alt="(Logo)" title="Logo">
            <span class="fs-4 titlePage">{{ title }}</span>
        </RouterLink>

        <ul class="nav nav-pills">
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
            <li class="bienvenida nav-item d-flex flex-column" v-if="loggedUser && route.path != '/login' && route.path != '/register'">
                <!--Intentar poner el nombre en mayúscula-->
                <span>Bienvenid@, {{ loggedUser.nombre }} ({{ loggedUser.rol }})</span>
                <button @click="logout" class="btn btn-danger">Cerrar Sesión</button>
            </li>
        </ul>


    </header>
</template>

<style scoped>
header {
    background-color: rgb(236, 166, 177);
}

.titlePage {
    color: rgb(22, 11, 11);
    font-weight: bold;
}

.titlePage:hover {
    color: white;
}

img {
    width: 35px;
    height: auto;
}

.nav-link {
    color: rgb(22, 11, 11);
    transition: 0.2 linear;
    margin: 0.2em;
    font-weight: bold;
}

.bienvenida{
    color: rgb(22, 11, 11);
}

.nav-link:hover {
    color: rgb(204, 15, 44);
    text-decoration: underline;
}
</style>
