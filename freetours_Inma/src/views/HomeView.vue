<script setup>
import Card from '@/components/Card.vue';
import { ref } from 'vue';

let rutasDisponibles = ref([]);
let localidad = ref();
let fecha = ref();
let mensajeFecha = ref();

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
  //En caso de que no haya localidad, establecemos su valor a '' para evitar el undefined
  if (!localidad.value) { localidad.value = ''; }
  console.log("Fecha: " + fecha.value);

  if (fecha.value) {
    mensajeFecha.value = ''; //Eliminamos el mensaje 

    fetch(`/api/api.php/rutas?fecha=${fecha.value}&localidad=${localidad.value}`, {
      method: 'GET',
    })
      .then(response => response.json())
      .then(data => {
        console.log(`/api/api.php/rutas?fecha=${fecha.value}&localidad=${localidad.value}`);
        console.log('Rutas filtradas:', data);
        rutasDisponibles.value = data;
      })
      .catch(error => console.error('Error en búsqueda de ruta con filtro:', error));
  } else {
    mensajeFecha.value = 'Por favor, indica una fecha para realizar el filtrado';
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
  mensajeFecha.value = '';
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
        <button @click.prevent="borrarFiltros" class="btn btnBorrado ms-2"
          aria-label="Eliminar filtros aplicados">X</button>

      </form>
      <div v-if="mensajeFecha != ''" class="text-danger text-center">{{ mensajeFecha }}</div>
    </div>
    <Card v-if="rutasDisponibles.length > 0" :propRutas="rutasDisponibles"></Card>
    <!--Clase 'lead': https://getbootstrap.com/docs/5.0/content/typography/ -->
    <div v-else class="container lead bg-secondary text-white mt-2 text-center">No existen rutas para dicha fecha</div>

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


.btnBorrado {
    color: white;
    background-color: #DC4C64;
    border: 1px solid #DC4C64;
}

.btnBorrado:hover {
    background-color: white;
    color: #DC4C64;
    border: 1px solid #DC4C64;
}

</style>