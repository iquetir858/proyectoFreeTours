<script setup>
import Card from '@/components/Card.vue';
import { ref } from 'vue';

/*
let rutas = ref([
  { imagen: 'https://s2.wklcdn.com/image_267/8023824/165381351/104033852.400x300.jpg', titulo: 'Ruta Histórica', localidad: 'Jaén', fecha: '2025-02-10' },
  { imagen: 'https://www.losmundosdeceli.com/wp-content/uploads/2018/12/ruta-granada-acera-darro.jpg', titulo: 'Ruta Cultural', localidad: 'Granada', fecha: '2025-02-12' },
  { imagen: 'https://www.guiategalicia.com/wp-content/uploads/2017/06/fullsizerender-2.jpg', titulo: 'Ruta Nocturna', localidad: 'Galicia', fecha: '2025-02-14' },
  { imagen: 'https://www.comunidad.madrid/sites/default/files/styles/imagen_enlace_opcional/public/iglesia_parroquial_de_san_salvador_en_leganes_01.jpg?itok=w7jAtBKN', titulo: 'Ruta Iglesia Salvador', localidad: 'Leganés', fecha: '2025-02-26' }
]);*/

let rutasDisponibles = ref();

//Función que hace la petición a la base de datos para obtener
//las rutas generales
function obtenerRutasDisponibles() {

  //fetch('http://localhost/api/api.php/rutas', {
  fetch('api/api.php/rutas', {
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
        <input type="text" name="localidadBusqueda" placeholder="Introduce una localidad" class="me-5">

        <label for="fechaBusqueda" class="me-2">Fecha:</label>
        <input type="date" name="fechaBusqueda">

        <button class="btn ms-2 btnBusqueda" aria-label="Realizar búsqueda de rutas">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

      </form>
    </div>
    <Card v-if="rutasDisponibles" :propRutas="rutasDisponibles"></Card>

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