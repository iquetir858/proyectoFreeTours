<script setup>
import Card from '@/components/Card.vue';
import { ref } from 'vue';

let rutas = ref([
  { imagen: 'https://s2.wklcdn.com/image_267/8023824/165381351/104033852.400x300.jpg', nombre: 'Ruta Histórica', localidad: 'Jaén', fecha: '2025-02-10' },
  { imagen: 'https://www.losmundosdeceli.com/wp-content/uploads/2018/12/ruta-granada-acera-darro.jpg', nombre: 'Ruta Cultural', localidad: 'Granada', fecha: '2025-02-12' },
  { imagen: 'https://www.guiategalicia.com/wp-content/uploads/2017/06/fullsizerender-2.jpg', nombre: 'Ruta Nocturna', localidad: 'Galicia', fecha: '2025-02-14' },
  { imagen: 'https://www.comunidad.madrid/sites/default/files/styles/imagen_enlace_opcional/public/iglesia_parroquial_de_san_salvador_en_leganes_01.jpg?itok=w7jAtBKN', nombre: 'Ruta Iglesia Salvador', localidad: 'Leganés', fecha: '2025-02-26' }
]);
</script>

<template>
  <main class="text-black d-flex flex-column align-items-center justify-content-center">
    <!--Meter aquí un carrusel o algo así-->
    <div id="divBusqueda">
      <h3>¡Realiza una búsqueda para ver nuestras rutas disponibles!</h3>
      <label for="localidadBusqueda" class="me-2">Localidad:</label>
      <!--Cambiar esto a un select?-->
      <input type="text" name="localidadBusqueda" placeholder="Localidad de búsqueda..." class="me-5">

      <label for="fechaBusqueda" class="me-2">Fecha:</label>
      <input type="date" name="fechaBusqueda">
    </div>
    <Card :propRutas="rutas"></Card>

  </main>
</template>

<style scoped></style>