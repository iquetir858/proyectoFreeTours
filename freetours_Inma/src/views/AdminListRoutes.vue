<script setup>
import { ref, onMounted } from 'vue';

let rutasBD = ref();
let guiasDisponiblesPorFecha = ref({});
//----------------MODAL
let exitoActualizacion = ref('');
let errorActualizacion = ref('');
let modalConfirmacion = null;
onMounted(() => {
    modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
});
function cerrarModal() {
    modalConfirmacion.hide();
}

//----------------FUNCIONES PARA OBTENER RUTAS/GUÍAS
function obtenerRutas() {
    //Obtenemos todas las rutas
    //fetch('http://localhost/api/api.php/rutas', {
    fetch('/api/api.php/rutas', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Rutas:', data);
            rutasBD.value = data;
            cargarGuiasPorFecha();
        })
        .catch(error => console.error('Error (Listado Rutas):', error));

}

/**
 * Función que, dada la fecha de la ruta, almacena en guiasDisponiblesPorFecha
 * todos los guias disponibles en dicha fecha
 * @param fechaRuta 
 */
function obtenerGuiasFecha(fechaRuta) {
    try {
        //fetch('http://localhost/api/api.php/usuarios', {
        fetch(`/api/api.php/asignaciones?fecha=${fechaRuta}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                guiasDisponiblesPorFecha.value[fechaRuta] = data;
                console.log("Guías disponibles en esa fecha: " + JSON.stringify(guiasDisponiblesPorFecha.value));
                //error.value = '';
            })
            .catch(errMsg => {
                //error.value = errMsg;
                console.log("Error (obtención guias disponibles): " + errMsg);
                guiasDisponiblesPorFecha.value[fechaRuta] = []; //Para evitar errores
            }
            );
    } catch (err) {
        //error.value = 'Error al cargar los datos';
        console.log("Error Obtención Guías: " + err);
        guiasDisponiblesPorFecha.value[fechaRuta] = [];


    }
}

/**
 * Función que, una vez se han cargado las rutas disponibles, llama a la función de obtener 
 * los guias disponibles por fecha para acceder a ellos en el select
 */
function cargarGuiasPorFecha() {
    rutasBD.value.forEach(ruta => {
        obtenerGuiasFecha(ruta.fecha);
    });
}

/**
 * Función que se ejecuta cada vez que se cambia el guía en el select e indica que
 * se ha realizado el cambio o ha ocurrido un error
 * @param ruta 
 */
function cambiarGuia(ruta) {
    //Como con el v-model se cambia el valor del id del guia directamente,
    //aquí se realiza un guardado /update en la api
    const asignacionData = {
        ruta_id: ruta.id, //ID de la ruta
        guia_id: ruta.guia_id  //ID del guía
    };


    fetch('/api/api.php/asignaciones', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(asignacionData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta:', data);
            if (data.status == 'success') {
                exitoActualizacion.value = data.message;
                errorActualizacion.value = '';

                //Se actualiza también el nombre del guía
                const guiaSeleccionado = (guiasDisponiblesPorFecha.value[ruta.fecha] || []).find(guia => guia.id === ruta.guia_id);
                if (guiaSeleccionado) {
                    ruta.guia_nombre = guiaSeleccionado.nombre;
                }

                //Luego vuelve a cargar los guias por fecha para que se actualice el valor por defecto del select
                cargarGuiasPorFecha();

            } else {
                exitoActualizacion.value = '';
                errorActualizacion.value = data.message;
            }

            modalConfirmacion.show();
            setTimeout(() => {
                modalConfirmacion.hide();
                errorActualizacion.value = '';
                exitoActualizacion.value = '';
            }, 4000)
        })
        .catch(error => console.error('Error:', error));

}

function borrarRuta(id) {
}

//------------LLAMADAS AL CARGAR LA VISTA
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
                        <!--Meter aquí un el guía según la ruta-->
                        <!--ESTO HAY QUE IMPLEMENTARLO-->
                        <select v-model="ruta.guia_id" @change="cambiarGuia(ruta)">
                            <!-- Opción por defecto en caso de que a la ruta no se le haya asignado un guía-->
                            <option v-if="!ruta.guia_id" :value="null" disabled selected>Sin guía</option>

                            <option v-if="ruta.guia_id" :value="ruta.guia_id || 'Sin guía'">
                                {{ ruta.guia_nombre || 'Sin guía' }}
                            </option>
                            <option v-for="guia in (guiasDisponiblesPorFecha[ruta.fecha] || [])" :key="guia.id"
                                :value="guia.id"> {{ guia.nombre }}</option>
                            <!--Aquí deberían ser los guias disponibles en esa fecha-->
                        </select>
                    </td>
                    <td>
                        <button class="btn" aria-label="Duplicar la ruta actual en otra fecha">Duplicar</button>
                    </td>
                    <td>
                        <!--Mostrar modal de confirmación de la cancelación-->
                        <button @click.prevent="borrarRuta(ruta.id)" class="btn btnBorrado"
                            aria-label="Cancelar la ruta">Cancelar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!--MODAL DE CONFIRMACIÓN DE ACTUALIZACIÓN-->
    <div class="text-success bg-color-success text-black">
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="infoModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered ">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Actualización de guía</h5>
                        <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p v-if="exitoActualizacion != ''" class="text-success">{{ exitoActualizacion }}</p>
                        <p v-else class="text-danger">{{ errorActualizacion }}</p>
                    </div>
                </div>
            </div>
        </div>
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