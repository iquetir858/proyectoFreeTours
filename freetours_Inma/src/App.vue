<script setup>
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router'
const route = useRoute();

//Habría que controlar cuando se inicia sesión y se cierra con un emit desde el hijo y tener un dato
// de sesión reactivo para pasarlo a la barra de navegación como props
//const session = ref(JSON.parse(localStorage.getItem('session')));
//const session = ref(JSON.parse(localStorage.getItem('session')));
//const usuarioLogeado = ref();
const usuarioLogeado = ref(JSON.parse(localStorage.getItem('usuarioLogeado')));

function updateSessionData(user) {
  usuarioLogeado.value = user;
  if (usuarioLogeado.value) localStorage.setItem('usuarioLogeado', JSON.stringify(user));
  else localStorage.removeItem('usuarioLogeado');
}
</script>

<template>
  <div class="layout">
    <Header :loggedUser="usuarioLogeado" @logout="updateSessionData" title="PurrfectTours"></Header>
    <!--Si la página es el home o login, no debería haber navbar??-->
    <NavBar v-if="usuarioLogeado" :usuario="usuarioLogeado"> </NavBar>

    <RouterView @loggedIn="updateSessionData" />
    <Footer />
  </div>
</template>

<style scoped>
:global(body) {
  background-color: rgb(250, 244, 246);
}

.layout {
  display: flex;
  flex-direction: column;
  min-width: 100vh;
  height: 120vh;
}


</style>