<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'
import router from './router';
const route = useRoute();

//Habría que controlar cuando se inicia sesión y se cierra con un emit desde el hijo y tener un dato
// de sesión reactivo para pasarlo a la barra de navegación como props
//const session = ref(JSON.parse(localStorage.getItem('session')));
//const session = ref(JSON.parse(localStorage.getItem('session')));
//const usuarioLogeado = ref();
const usuarioLogeado = ref(JSON.parse(localStorage.getItem('usuarioLogeado')));

function updateSessionData(user) {
  usuarioLogeado.value = user;
  if (usuarioLogeado.value) {
    localStorage.setItem('usuarioLogeado', JSON.stringify(user));
  }
  else {
    localStorage.removeItem('usuarioLogeado');
    router.push('/');
  }
}
</script>

<template>
  <div class="layout">
    <Header :loggedUser="usuarioLogeado" @logout="updateSessionData" title="PurrfectTours"></Header>
    <!--Si la página es el login o registro O NO hay usuario logeado, no debería haber navbar-->
    <NavBar v-if="usuarioLogeado && route.path != 'login' && route.path != 'register'" :usuario="usuarioLogeado">
    </NavBar>
    <main>
      <RouterView @loggedIn="updateSessionData" />
    </main>
    <Footer />
  </div>
</template>

<style>
:root {
  --amarillo: #DCAC54;
  --marron: #1C0505;
  --amarilloClaro: #ebac3949;
  --marronClaro: #501a1a;
  --rojo: #DC4C64;
  --blanco: white;
  --sombra: 0 4px 6px rgba(0, 0, 0, 0.1);
}

html {
  scroll-behavior: smooth;
}

.layout {
  display: flex;
  flex-direction: column;
  min-width: min-content;
  min-height: auto;
}

main {
  min-height: 72.5vh;
}

/*Estilo botones generales (si no se les aplica otra clase)*/
.btn {
  color: #1C0505;
  font-weight: bold;
  background-color: var(--amarillo);
  border: 1px solid var(--amarillo);
}

.btn:hover {
  background-color: var(--marron);
  color: var(--amarillo);
  border: 1px solid var(--blanco);
}

/*Estilo botones de Cancelar, Borrar... */
.btnBorrado,
.btnCancelar {
  color: var(--blanco);
  background-color: var(--rojo);
  border: 1px solid var(--rojo);
}

.btnBorrado:hover,
.btnCancelar:hover {
  background-color: var(--blanco);
  color: var(--rojo);
  border: 1px solid var(--rojo);
}

/*Estilo de los botones de mostrar más info 'icono i' de las tablas */
.btnMasInfo {
  background: transparent;
  border: none;
  padding: 0;
  color: var(--amarillo);
  font-size: 1.3em;
}

.btnMasInfo:hover {
  background: transparent;
  border: none;
  color: var(--marron);
}

/*Estilo de la paginación. (No se pueden cambiar los nombres porque se aprovechan las clases de bootstrap*/
.pagination {
  margin-bottom: 0;
}

.page-link {
  color: var(--marron);
  cursor: pointer;
}

.page-item.active .page-link {
  background-color: var(--amarillo);
  border-color: var(--amarilloClaro);
  color: var(--marron);
}

.page-link:hover {
  color: var(--marron);
  background-color: #e9e8e5;
}

.page-item.disabled .page-link {
  color: #7c7d6c;
  pointer-events: none;
}

.form-select {
  border-color: var(--amarillo);
  color: var(--marron);
  width: 120px !important;
}

.form-select:focus {
  border-color: var(--amarilloClaro);
  box-shadow: 0 0 0 0.25rem rgba(231, 213, 75, 0.25);
}
</style>