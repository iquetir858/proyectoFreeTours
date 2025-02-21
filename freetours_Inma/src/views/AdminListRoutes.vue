<script setup>
import { ref } from 'vue';

const rutasBD = ref();

function obtenerRutas() {
    //Obtenemos todas las rutas
    fetch('http://localhost/api/api.php/rutas', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Rutas:', data);
            rutasBD.value = data;

        })
        .catch(error => console.error('Error:', error));

}
obtenerRutas();





</script>

<template>
    <h2 class="text-center m-2">Listado de todas las rutas</h2>

    <div id="divTabla" class="m-3 d-flex justify-content-center">
        <table class="table table-light table-striped table-hover text-center">
            <caption class="text-center">Listado de rutas</caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Ruta</th> <!--Poner en esta columna el titulo y un modal de info??-->
                    <th scope="col">Participantes</th>
                    <th scope="col">Límite</th>
                    <th scope="col">Guía</th>
                    <th scope="col">Cancelación</th>
                </tr>
            </thead>
            <tbody>
                <!--HACER QUE NO SE PUEDA MODIFICAR EL ADMIN-->
                <tr v-for="ruta in rutasBD" :key="ruta.id">
                    <td>{{ ruta.id }}</td>
                    <td>{{ ruta.titulo }}</td>
                    <td>{{ ruta.asistentes }}</td> <!--Hay que contar el num de reservas y tal-->
                    <td>10</td>
                    <td>
                        {{ ruta.guia_nombre }} +
                        <!--Meter aquí un el guía según la ruta-->
                        <!--Añadir un + que lleve a un componente para el cambio o reselección del guía-->
                    </td>
                    <td>
                        <!--Mostrar modal de confirmación de la cancelación-->
                        <button class="btn btnBorrado" aria-label="Cancelar la ruta">Cancelar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
th {
    text-transform: uppercase;
}


table {
    max-width: 80%;
    overflow-y: scroll;
    border: 2px solid rgb(236, 166, 177);
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