<script setup>
import Card from '@/components/Card.vue';
import { ref } from 'vue';

let rutasDisponibles = ref([]);
let localidad = ref();
let fecha = ref();


//Función que hace la petición a la base de datos para obtener
//las rutas generales
function obtenerRutasDisponibles() {

  //fetch('http://localhost/api/api.php/rutas', {
  fetch('/api/api.php/rutas', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      //Filtramos las rutas para que sólo salgan aquellas que sean de fechas futuras
      rutasDisponibles.value = data.filter(ruta => new Date(ruta.fecha) > new Date());
    })
    .catch(error => console.error('Error:', error));
}
obtenerRutasDisponibles();


/**
 * Función que realiza la búsqueda de una ruta según una fecha y/o localidad
 */
function busquedaFiltro() {

  if (fecha) {
    fetch(`/api/api.php/rutas?fecha=${fecha.value}&localidad=${localidad.value}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log(fecha.value);

        console.log('Rutas filtradas:', data);
        rutasDisponibles.value = data;
      })
      .catch(error => console.error('Error en búsqueda de ruta con filtro:', error));

  }
}

/**
 * Función que elimina los filtros aplicados, muestra toda las rutas disponibles de nuevo
 * y elimina los valores de los inputs de localidad y fecha
 */
function borrarFiltros() {
  obtenerRutasDisponibles();
  fecha.value = '';
  localidad.value = '';
}

</script>

<template>
  <main class="text-black d-flex flex-column align-items-center justify-content-center">
    <!--Meter aquí un carrusel o algo así-->


    <div id="divBusqueda">
      <h3>¡Realiza una búsqueda para ver nuestras rutas disponibles!</h3>
      <!--Formulario de búsqueda de rutas-->
      <form action="" class="d-flex flex-row align-items-center justify-content-evenly">
        <label for="localidadBusqueda" class="me-2">Localidad:</label>
        <!--Cambiar esto a un select?-->
        <input v-model="localidad" type="text" name="localidadBusqueda" placeholder="Introduce una localidad"
          class="me-5">

        <label for="fechaBusqueda" class="me-2">Fecha:</label>
        <input v-model="fecha" type="date" name="fechaBusqueda">

        <button @click.prevent="busquedaFiltro" class="btn ms-2 btnBusqueda" aria-label="Realizar búsqueda de rutas">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <button @click.prevent="borrarFiltros" class="btn btnBusqueda ms-2"
          aria-label="Eliminar filtros aplicados">X</button>

      </form>
    </div>
    <Card v-if="rutasDisponibles.length > 0" :propRutas="rutasDisponibles"></Card>
    <div v-else class="container bg-secondary text-white mt-2">No existen rutas para dicha fecha</div>

  </main>
</template>

<style scoped>
input {
  border-radius: 5px;
}

.btn {
  color: rgb(32, 13, 13);
  font-weight: bold;
  background-color: rgb(236, 166, 177);
  border: 1px solid rgb(236, 166, 177);
}

.btn:hover {
  background-color: rgb(32, 13, 13);
  color: rgb(236, 166, 177);
  border: 1px solid white;
}
</style>