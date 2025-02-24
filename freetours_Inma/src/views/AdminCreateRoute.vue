<script setup>
import { ref } from 'vue';
import Map from '@/components/Map.vue';

let guiasDisponibles = ref(); //Se cogen mediante una llamada a la api
let nuevaRuta = ref({});

/**
 * Función para obtener los guías almacenados, filtrando los usuarios 
 * de la Base de Datos por rol
 * -----ARREGLAR EL MOSTRAR ERRORES!!! IMPLEMENTARLO -----
 */
function obtenerGuiasBD() {
    try {
        //fetch('http://localhost/api/api.php/usuarios', {
        fetch('/api/api.php/usuarios', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                guiasDisponibles.value = data.filter(user => user.rol == 'guia');
                console.log(JSON.stringify(guiasDisponibles.value));

                //console.log("Data: " + JSON.stringify(data));
                //console.log("usuariosBD: " + JSON.stringify(usuariosBD));
                //error.value = '';
            })
            .catch(errMsg => {
                //error.value = errMsg;
            }
            );
    } catch (err) {
        //error.value = 'Error al cargar los datos';
        console.log(err);
        
    }
}
obtenerGuiasBD();

//Función que almacena los valores de latitud y longitud del emit del mapa
function setLatitudLongitud(lat, lon) {
    nuevaRuta.value.latitud = lat;
    nuevaRuta.value.longitud = lon;
}

//Función para almacenar el guía elegido (su id) para la ruta
function actualizarGuia(id) {
    nuevaRuta.value.guia_id = id;
}

function crearRuta() {
    //Primero HAY QUE COMPROBAR LOS DATOS
    console.log(nuevaRuta.value);


    //Creación de la ruta

    //fetch('http://localhost/api/api.php/rutas', {
    fetch('/api/api.php/rutas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaRuta.value)
    })
        .then(response => response.json())
        .then(data => console.log('Respuesta:', data))
        .catch(error => console.error('Error:', error));
}

</script>


<template>

    <div id="divRuta" class="container mt-4">
        <form class="card p-5 shadow-lg mb-5">

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="titulo" class="form-label">Título de la Ruta:</label>
                    <input type="text" class="form-control" id="titulo" v-model="nuevaRuta.titulo"
                        placeholder="Escribe aquí el nombre...">
                </div>
                <div class="col-md-6">
                    <label for="localidad" class="form-label">Localidad:</label>
                    <input type="text" class="form-control" id="localidad" v-model="nuevaRuta.localidad"
                        placeholder="Indica la localidad...">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="fecha" class="form-label">Fecha:</label>
                    <input type="date" class="form-control" id="fecha" v-model="nuevaRuta.fecha">
                </div>
                <div class="col-md-6">
                    <label for="hora" class="form-label">Hora:</label>
                    <input type="time" class="form-control" id="hora" v-model="nuevaRuta.hora">
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="foto" class="form-label">Foto:</label>
                    <input type="text" class="form-control" id="foto" v-model="nuevaRuta.foto" placeholder="URL">
                </div>
                <div class="col-md-6">
                    <label for="guia" class="form-label">Asignar guía:</label>
                    <select class="form-select" v-model="nuevaRuta.guia_id">
                        <option value="" disabled>Selecciona un guía</option>
                        <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea class="form-control" id="descripcionRuta" v-model="nuevaRuta.descripcion" rows="3"
                    placeholder="Describe brevemente la ruta."></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Punto de encuentro:</label>
                <Map id="mapa" @enviar-coordenadas="setLatitudLongitud"></Map>
            </div>

            <button type="submit" class="btn" @click.prevent="crearRuta">
                Crear Ruta
            </button>
        </form>
    </div>

</template>

<style>
textarea {
    resize: none;
}

.btn {
    color: rgb(32, 13, 13);
    font-weight: bold;
    background-color: rgb(236, 166, 177);
    border: 1px solid rgb(236, 166, 177);
}

.btn:hover {
    background-color: rgb(32, 13, 13);
    border: 1px solid rgb(32, 13, 13);
    color: rgb(236, 166, 177);
}
</style>