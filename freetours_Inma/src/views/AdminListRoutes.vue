<script setup>
import { ref } from 'vue';

let rutasBD = ref();

function obtenerRutas() {
    //Obtenemos todas las rutas
    //fetch('http://localhost/api/api.php/rutas', {
    fetch('/api/api.php/rutas', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Rutas:', data);
            console.log(data);
            rutasBD.value = data;
        })
        .catch(error => console.error('Error Listado Rutas:', error));

}
obtenerRutas();

function borrarRuta(id){

}



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
                    <th scope="col">Asistentes</th> <!--Si es menor de 10, salta warning-->
                    <th scope="col">Guía</th>
                    <th scope="col">Duplicado</th>
                    <th scope="col">Cancelación</th>
                </tr>
            </thead>
            <tbody>
                <!--HACER QUE NO SE PUEDA MODIFICAR EL ADMIN-->
                <tr v-for="ruta in rutasBD" :key="ruta.id">
                    <td>{{ ruta.id }}</td>
                    <td>{{ ruta.titulo }}</td>
                    <td>{{ ruta.asistentes }}</td>
                    <td>
                        {{ ruta.guia_nombre }} +
                        <!--Meter aquí un el guía según la ruta-->
                        <!--ESTO HAY QUE IMPLEMENTARLO-->
                        <select v-model="ruta.guia_nombre" @focus="alert('hola')" @change="cambiarGuia(ruta.id)">
                            <option value="admin">Admin</option><!--Aquídeberían ser los guias disponibles en esa fecha-->
                        </select>
                    </td>
                    <td>
                        <button class="btn" aria-label="Duplicar la ruta actual en otra fecha">Duplicar</button>
                    </td>
                    <td>
                        <!--Mostrar modal de confirmación de la cancelación-->
                        <button @click.prevent="borrarRuta(ruta.id)" class="btn btnBorrado" aria-label="Cancelar la ruta">Cancelar</button>
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