<script setup>
import { ref } from 'vue';
import Map from '@/components/Map.vue';

let guiasDisponibles = ref(); //Se cogen mediante una llamada a la api


/**
 * Función para obtener los guías almacenados, filtrando los usuarios 
 * de la Base de Datos por rol
 * -----ARREGLAR EL MOSTRAR ERRORES!!! IMPLEMENTARLO -----
 */
function obtenerGuiasBD() {
    try {
        fetch('http://localhost/api/api.php/usuarios', {
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
    }
}
obtenerGuiasBD();

</script>


<template>
    <div id="divRuta">
        <form action="">
            <label for="nombreRuta">Nombre Ruta:</label>
            <input type="text" name="nombreRuta" placeholder="Escribe aquí el nombre...">

            <label for="localidad">Localidad:</label>
            <input type="text" name="localidad" placeholder="Indica la localidad...">

            <label for="descripcion">Descripción: </label>
            <textarea name="descripcion" id="descripcionRuta" placeholder="Describe brevemente la ruta."></textarea>

            <label for="foto">Foto:</label>
            <input type="text" name="foto" id="foto" placeholder="URL">

            <!--Asignación de guía: Cambiar a un componente ??-->
            <label for="guia">Asignar guía:</label>
            <select>
                <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}</option>
            </select>

            <label for="fecha">Fecha:</label>
            <input type="date" name="fecha">

            <label for="hora">Hora:</label>
            <input type="time" name="hora">

            <label for="mapa">Punto de encuentro</label>
            <!--Introducir aquí mapa de -->
            <Map></Map>

            <button aria-label="Crear la ruta" type="submit" class="btn">Crear Ruta</button>
        </form>
    </div>
</template>

<style>
textarea {
    resize: none;
}

.btn {
    color: rgb(22, 11, 11);
    font-weight: bold;
    background-color: rgb(236, 166, 177);
    border: 1px solid rgb(236, 166, 177);
}

.btn:hover {
    background-color: white;
    border: 1px solid rgb(22, 11, 11);
}

</style>