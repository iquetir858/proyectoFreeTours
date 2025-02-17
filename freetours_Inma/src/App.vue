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
const usuarioLogeado=ref();

function updateSessionData(user) {
  usuarioLogeado.value = user;
  //if (user) localStorage.setItem('session', JSON.stringify(user));
  //else localStorage.removeItem('session');
}
</script>

<template>
  <div class="layout">
    <Header :loggedUser="usuarioLogeado" @logout="updateSessionData" title="Web FreeTours"></Header>
    <!--Si la página es el home o login, no debería haber navbar??-->
    <NavBar :usuario="usuarioLogeado">    </NavBar>

    <RouterView @loggedIn="updateSessionData" />
    <Footer />
  </div>
</template>

<style scoped>
:global(body) {
  background-color: rgb(238, 238, 238);
}

.layout {
  display: flex;
  flex-direction: column;
  min-width: 100vh;
  height: 100vh;
}
</style>
