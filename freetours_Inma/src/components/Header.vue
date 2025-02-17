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
    <header class="text-white">
        <div class="row">
            <div class="infoWeb col-6">
                <RouterLink to="/"><img src="../assets/logo.png" alt="(Logo)" title="Logo"></RouterLink>
                <h1>{{ title }}</h1>
            </div>
            <!--RouterLink a la vista de AboutView.vue-->
            <div class="infoAbout col-2">
                <RouterLink to="/about">
                    <button>Sobre Nosotros</button>
                </RouterLink>
            </div>
            <div v-if="route.path != '/login' && route.path != '/register'" class="infoInicio col-4">
                <div v-if="loggedUser" class="container text-end">
                    <!--Intentar poner el nombre en mayúscula-->
                    <span>Bienvenid@, {{ loggedUser.nombre }} ({{ loggedUser.rol }})</span>
                    <button @click="logout" class="btn btn-danger">Cerrar Sesión</button>
                </div>
                <div v-else>
                    <RouterLink to="/login">
                        <button>Iniciar Sesión</button>
                    </RouterLink>
                    <RouterLink to="/register">
                        <button>Registrarse</button>
                    </RouterLink>
                </div>
            </div>
        </div>

    </header>
</template>

<style scoped>
header {
    background-color: darkblue;
}

img {
    width: 45px;
    height: auto;
}
</style>
