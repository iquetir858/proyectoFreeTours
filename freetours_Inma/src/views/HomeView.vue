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
const totalPaginas = computed(() => {
  return Math.ceil(rutasDisponibles.value.length / rutasPorPagina.value);
});

function pagSiguiente() {
  if (paginaActual.value < totalPaginas.value) {
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
    <div class="hero-section container-fluid mb-5">
      <div class="overlay"></div>
      <video autoplay muted loop playsinline class="hero-video">
        <source src="../assets/videos/flow.mp4" type="video/mp4">
        <source src="../assets/videos/flow.ogv" type="video/ogv">
        Tu navegador no soporta este video
      </video>
      <div class="hero-content text-center">
        <h1 class="display-4 fw-bold">Descubre el mundo con PurrfectTours</h1>
        <p class="lead">Explora destinos únicos con guías locales apasionados</p>
      </div>
    </div>

    <div id="divBusqueda">
      <h3>¡Realiza una búsqueda para ver nuestras rutas disponibles!</h3>
      <!--Formulario de búsqueda de rutas-->
      <form action="" class="d-flex flex-row align-items-center justify-content-evenly m-4">
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
    <div v-else class="container lead bg-secondary text-white mt-2 mb-4 text-center">No existen rutas para dicha fecha</div>

    <nav v-if="rutasDisponibles.length > rutasPorPagina" aria-label="Navegación de páginas" class="mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
          <a class="page-link" href="#" @click.prevent="pagAnterior" aria-label="Anterior">
            <span>&laquo;</span>
          </a>
        </li>
        <li v-for="pagina in totalPaginas" :key="pagina" class="page-item" :class="{ active: paginaActual === pagina }">
          <a class="page-link" href="#" @click.prevent="setPagina(pagina)">{{ pagina }}</a>
        </li>
        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
          <a class="page-link" href="#" @click.prevent="pagSiguiente" aria-label="Siguiente">
            <span>&raquo;</span>
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

.hero-section {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.hero-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.hero-content h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.hero-content p {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 1.25rem;
}

@media (max-width: 768px) {
  .hero-section {
    height: 50vh;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-content p {
    font-size: 1.1rem;
  }
}
</style>