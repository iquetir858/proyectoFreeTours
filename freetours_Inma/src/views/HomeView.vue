<script setup>
import Card from '@/components/Card.vue';
import { ref, computed } from 'vue';

let rutasDisponibles = ref([]);
let localidad = ref();
let fecha = ref();
let mensajeFecha = ref();

const paginaActual = ref(1);
const rutasPorPagina = ref(4);

// Generamos las rutas que habrán en la pagina actual
const rutasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * rutasPorPagina.value;
  const fin = inicio + rutasPorPagina.value;
  return rutasDisponibles.value.slice(inicio, fin);
});

// Calculamos el total de páginas que habrá
const numPaginas = computed(() => {
  return Math.ceil(rutasDisponibles.value.length / rutasPorPagina.value);
});

function pagSiguiente() {
  if (paginaActual.value < numPaginas.value) {
    paginaActual.value++;
  }
}

function pagAnterior() {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
}

function setPagina(pagina) {
  paginaActual.value = pagina;
}

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
  paginaActual.value = 1;
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
  paginaActual.value = 1;
  obtenerRutasDisponibles();
  fecha.value = '';
  localidad.value = '';
  mensajeFecha.value = '';
}

</script>

<template>
  <div class="text-black d-flex flex-column align-items-center justify-content-center">
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
    <Card v-if="rutasDisponibles.length > 0" :propRutas="rutasPaginadas"></Card>
    <!--Clase 'lead': https://getbootstrap.com/docs/5.0/content/typography/ -->
    <div v-else class="container lead bg-secondary text-white mt-2 text-center">No existen rutas para dicha fecha</div>

    <!-- Pagination controls -->
    <nav v-if="rutasDisponibles.length > rutasPorPagina" aria-label="Navegación de páginas" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <a class="page-link" href="#" @click.prevent="pagAnterior" aria-label="Anterior">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li v-for="page in numPaginas" :key="page" class="page-item" :class="{ active: paginaActual === page }">
          <a class="page-link" href="#" @click.prevent="setPagina(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === numPaginas }">
          <a class="page-link" href="#" @click.prevent="pagSiguiente" aria-label="Siguiente">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
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

.pagination .page-link {
  color: rgb(32, 13, 13);
}

.pagination .page-item.active .page-link {
  background-color: rgb(236, 166, 177);
  border-color: rgb(236, 166, 177);
  color: rgb(32, 13, 13);
}

.pagination .page-link:hover {
  background-color: rgb(32, 13, 13);
  color: rgb(236, 166, 177);
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
}
</style>