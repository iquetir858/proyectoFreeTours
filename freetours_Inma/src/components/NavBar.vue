<script setup>

import { ref } from 'vue';

//Datos del usuario que vendrían del padre, para mostrar unas opciones
//u otras según el rol del usuario
const props = defineProps({
    usuario: Object
});
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
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
                <!--<li v-if="props.userData?.role == 'profe'" class="nav-item active">
                    <a class="nav-link" href="#">Preguntas </a>
                </li>-->
            </ul>

            <ul v-if="usuario?.rol == 'guia'" class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/">Ver Rutas</RouterLink>
                </li>
            </ul>

            <ul v-if="usuario?.rol == 'cliente'" class="navbar-nav mr-auto">
                <li class="nav-item">
                    <RouterLink class="nav-link" to="/client">Mis reservas</RouterLink>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
/*
NO FUNCIONA EL CAMBIO DE ESTILO

nav{
    background-color: rgb(32, 13, 13);
    font-weight: bold;
}*/
</style>