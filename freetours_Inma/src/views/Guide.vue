<script setup>
import { ref } from 'vue';

/*

Obtener todas rutas del guía, ORDENADAS POR MÁS RECIENTES
Mostrar info de la guía (sin mapa) Y AÑADIR NÚMERO DE PARTICIPANTES

--Añadir opción de ver qué participantes son (correos) 
y modificar el num que llevan?? (pasar lista)


*/

let guiaLogueado = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //Obtener guía del localStorage
let asignacionesGuia = ref(null);
console.log(guiaLogueado.value);

function obtenerRutasGuia(guiaId) {

    fetch(`/api/api.php/asignaciones?guia_id=${guiaId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Asignaciones del guía:', data);
            asignacionesGuia.value = data;
        })
        .catch(error => console.error('Error:', error));

}

obtenerRutasGuia(guiaLogueado.value.id);


</script>


<template>
    <!--Mirar estilo !!!-->
    <h3>Mis asignaciones</h3>
    <div class="container">
        <div v-for="asignacion in asignacionesGuia" :key="asignacion.ruta_id" class="row card m-2 p-2">
            <div class="col-md-4">
                <img v-bind:src="asignacion.ruta_foto" class="card-img-top img-fluid" :alt="asignacion.ruta_titulo">
            </div>
            <div class="col-md-8 card-body">
                <h5 class="card-title">{{ asignacion.ruta_titulo }}</h5>
                <h6 class="text-secondary">{{ asignacion.ruta_localidad }}</h6>
                <p class="card-text">{{ asignacion.ruta_fecha }}</p>
                <p><strong>Núm. Asistentes:</strong></p>
            </div>
        </div>

    </div>

</template>


<style scoped>
img {
    width: 10rem;
}
</style>