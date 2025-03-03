<script setup>
import DuplicatedRoute from '@/components/DuplicatedRoute.vue';
import Map from '@/components/Map.vue';
import InfoRoute from '@/components/InfoRoute.vue';
import { ref, onMounted, computed } from 'vue';

let rutasBD = ref();
let guiasDisponiblesPorFecha = ref({});
//----------------MODALES
let modalConfirmacion = null;
let modalBorrado = null;
let modalDuplicar = null;
let modalInfo = null;

//--------------Mensajes éxito/error
let exitoActualizacion = ref('');
let errorActualizacion = ref('');
let exitoBorrado = ref('');
let errorBorrado = ref('');

//--------------Variables ruta seleccionada (según botón pulsado)
let rutaSeleccionadaInfo = ref(''); //Id de la ruta seleccionada para mostrar su info
let rutaSeleccionada = ref(''); //Id de la ruta seleccionada para borrar
let rutaSeleccionadaDuplicar = ref(null); //Variable para duplicar ruta

//Variables paginación
const paginaActual = ref(1);
const rutasPorPagina = ref(10);

//Se calculan las rutas que se mostrarán en la tabla en función de la página actual
const rutasPaginadas = computed(() => {
    const inicio = (paginaActual.value - 1) * rutasPorPagina.value;
    const fin = inicio + rutasPorPagina.value;
    return rutasBD.value ? rutasBD.value.slice(inicio, fin) : [];
});

//Se calcula el número total de páginas en función del número de rutas y las rutas por página
const totalPaginas = computed(() => {
    return rutasBD.value ? Math.ceil(rutasBD.value.length / rutasPorPagina.value) : 0;
});

//-------------------Funciones de paginación
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


onMounted(() => {
    modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modalBorrado = new bootstrap.Modal(document.getElementById('modalBorrado'));
    modalDuplicar = new bootstrap.Modal(document.getElementById('modalDuplicar'));
    modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));

});

/**
 * Función que cierra todos los modales y resetea los valores de las rutas seleccionadas
 */
function cerrarModal() {
    modalConfirmacion.hide();
    modalBorrado.hide();
    modalDuplicar.hide();
    modalInfo.hide();
    rutaSeleccionadaDuplicar.value = null; //Para eliminar el valor que tenía antes
    rutaSeleccionadaInfo.value = null; //Para eliminar el valor que tenía antes
}

//------------------------------ FUNCIONES SOBRE RUTAS
function obtenerRutas() {
    //Obtenemos todas las rutas
    //fetch('http://localhost/api/api.php/rutas', {
    fetch('/api/api.php/rutas', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            //console.log('Rutas:', data);
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
                //console.log(data);
                guiasDisponiblesPorFecha.value[fechaRuta] = data;
                //console.log("Guías disponibles en esa fecha: " + JSON.stringify(guiasDisponiblesPorFecha.value));
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

/**
 * Función para borrar la ruta seleccionada
 */
function borrarRuta() {
    let rutaId = rutaSeleccionada.value;
    fetch(`/api/api.php/rutas?id=${rutaId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta:', data)
            if (data.status == 'success') {
                exitoBorrado.value = data.message;
                errorBorrado = '';
                obtenerRutas();
                cargarGuiasPorFecha();

            } else {
                exitoBorrado.value = '';
                errorBorrado = data.message;
            }
            setTimeout(() => {
                modalBorrado.hide();
                exitoBorrado.value = '';
                errorBorrado = '';
            }, 3000);
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Función que muestra el modal de borrado de la ruta seleccionada
 * @param rutaId 
 */
function mostrarModalBorrado(rutaId) {
    modalBorrado.show();
    rutaSeleccionada.value = rutaId;
    console.log("Selecc--> " + rutaSeleccionada.value);

}

/**
 * Función para abrir el modal de duplicado (componente) y pasar la ruta seleccionada
 * @param ruta 
 */
function mostrarModalDuplicado(ruta) {
    rutaSeleccionadaDuplicar.value = ruta;
    //console.log("Estado modal: " + JSON.stringify(modalDuplicar.value));

    if (!modalDuplicar) {
        modalDuplicar = new bootstrap.Modal(document.getElementById('modalDuplicar'));
        modalDuplicar.show();
    }
}

/**
 * Función que muestra el modal con la información de la ruta elegida
 */
function mostrarModalInfo(ruta) {
    rutaSeleccionadaInfo.value = ruta;
    modalInfo.show();
}

//------------LLAMADAS AL CARGAR LA VISTA
obtenerRutas(); 
</script>


<template>
    <h2 class="text-center m-2">Listado de todas las rutas</h2>

    <div id="divTabla" class="m-3 d-flex flex-column align-items-center">
        <table class="table table-light table-striped table-hover text-center mb-3">
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
                <tr v-for="ruta in rutasPaginadas" :key="ruta.id">
                    <td>{{ ruta.id }}</td>
                    <td>
                        {{ ruta.titulo }}
                        <button @click.prevent="mostrarModalInfo(ruta)" class="btn btnMasInfo"
                            aria-label="Información de la ruta">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                    </td>
                    <td>{{ ruta.asistentes }}
                        <span v-if="ruta.asistentes < 10" title="Menos de 10 asistentes">
                            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                        </span>
                    </td>
                    <td>
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
                        <button class="btn" aria-label="Duplicar la ruta actual en otra fecha"
                            @click.prevent="mostrarModalDuplicado(ruta)">Duplicar</button>
                    </td>
                    <td>
                        <!--Mostrar modal de confirmación de la cancelación-->
                        <button @click.prevent="mostrarModalBorrado(ruta.id)" class="btn btnBorrado"
                            aria-label="Cancelar la ruta">Cancelar</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav aria-label="Navegación de páginas" class="mt-3">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                    <button class="page-link" @click="pagAnterior" :disabled="paginaActual === 1">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>

                <li v-for="pagina in totalPaginas" :key="pagina" class="page-item"
                    :class="{ active: pagina === paginaActual }">
                    <button class="page-link" @click="setPagina(pagina)">{{ pagina }}</button>
                </li>

                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                    <button class="page-link" @click="pagSiguiente" :disabled="paginaActual === totalPaginas">
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>

        <div class="mt-2">
            <select v-model="rutasPorPagina" class="form-select form-select-sm" style="width: auto;">
                <option :value="5">5 por página</option>
                <option :value="10">10 por página</option>
                <option :value="15">15 por página</option>
            </select>
        </div>
    </div>

    <!--MODAL DE CONFIRMACIÓN DE ACTUALIZACIÓN-->
    <div class="text-success bg-color-success text-black">
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="infoModalLabel">
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

    <!--MODAL BORRADO-->
    <div class="text-success bg-color-success text-black">
        <div class="modal fade" id="modalBorrado" tabindex="-1" aria-labelledby="infoModalLabel">
            <div class="modal-dialog modal-dialog-centered ">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Borrado de ruta</h5>
                        <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>Vas a borrar esta ruta. ¿Estás seguro?</p>
                        <p v-if="exitoBorrado != ''" class="text-success">{{ exitoBorrado }}</p>
                        <p v-else-if="errorBorrado != ''" class="text-danger">{{ errorBorrado }}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn" type="button" @click.prevent="cerrarModal" data-bs-dismiss="modal"
                            aria-label="Cancelar borrado">Cancelar</button>
                        <button class="btn btnBorrado" type="button" @click="borrarRuta">Borrar ruta</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--MODAL DUPLICADO (Componente)-->
    <DuplicatedRoute v-if="rutaSeleccionadaDuplicar" :ruta="rutaSeleccionadaDuplicar" @cerrarModal="cerrarModal"
        @actualizarRutas="obtenerRutas">
    </DuplicatedRoute>

    <!--MODAL INFORMACIÓN RUTA-->
    <InfoRoute :ruta-seleccionada="rutaSeleccionadaInfo" @cerrar-modal="cerrarModal()"></InfoRoute>
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

.btnMasInfo {
    background: transparent;
    border: none;
    padding: 0;
    color: palevioletred;
    font-size: 1.5em;
}

img {
    width: 100%;
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

/* Estilo de paginación. Los nombres no se pueden cambiar porque se aprovechan las clases de bootstrap */
.pagination {
    margin-bottom: 0;
}

.page-link {
    color: #DC4C64;
    cursor: pointer;
}

.page-item.active .page-link {
    background-color: #DC4C64;
    border-color: #DC4C64;
    color: white;
}

.page-link:hover {
    color: #DC4C64;
    background-color: #f8f9fa;
}

.page-item.active .page-link:hover {
    color: white;
}

.form-select {
    border-color: #DC4C64;
    color: #DC4C64;
}

.form-select:focus {
    border-color: #DC4C64;
    box-shadow: 0 0 0 0.25rem rgba(220, 76, 100, 0.25);
}
</style>