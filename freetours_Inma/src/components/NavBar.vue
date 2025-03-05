<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps({
    usuario: Object
});
</script>

<template>
    <nav v-if="usuario && route.path != 'login' && route.path != 'register'"
        class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler ms-3" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse ms-3" id="navbarSupportedContent">
            <!--Vistas del admin-->
            <ul v-if="usuario?.rol == 'admin'" class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/admin">Gestión Usuarios</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/admin/crear-ruta">Crear Ruta</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/admin/listar-rutas">Listado Rutas</RouterLink>
                </li>
            </ul>
            <!--Vistas del guía-->
            <ul v-if="usuario?.rol == 'guia'" class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/guide">Mis Asignaciones</RouterLink>
                </li>
            </ul>
            <!--Vistas del cliente-->
            <ul v-if="usuario?.rol == 'cliente'" class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/client">Mis Reservas</RouterLink>
                </li>
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/client/rutas-pasadas">Rutas Pasadas</RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped></style>