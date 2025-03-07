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

.btnBorrado, .btnCancelar {
  color: var(--blanco);
  background-color: var(--rojo);
  border: 1px solid var(--rojo);
}

.btnBorrado:hover,.btnCancelar:hover {
  background-color: var(--blanco);
  color: var(--rojo);
  border: 1px solid var(--rojo);
}

/**
Amarillo oscuro:
Amarillo clarito:
Marrón claro:#501a1a
Marrón oscuro:
Rojo botones borrado: var(--rojo)
*/
</style>