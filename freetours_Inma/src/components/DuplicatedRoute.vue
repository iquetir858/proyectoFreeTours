<script setup>
import { ref, onMounted } from 'vue';

//------------------------------EMITS Y PROPS DE EVENTOS
const props = defineProps({
    ruta: Object, //Ruta que se envía para duplicar
});
const emit = defineEmits(["cerrarModal", "actualizarRutas"]);
//const emit = defineEmits(["duplicarRuta", "cerrarModal"]);

//-------------------------------VARIABLES
let modalDuplicar = null;
let nuevaFecha = ref('');
let guiasDisponibles = ref([]);
let idGuiaSeleccionado = ref(null);
let exitoDuplicar = ref('');
let errorDuplicar = ref('');

onMounted(() => {
    //(Pongo , { backdrop: 'static' } para evitar que al clickar fuera del modal no funcione)
    if (!modalDuplicar) modalDuplicar = new bootstrap.Modal(document.getElementById('modalDuplicar'), { backdrop: 'static' });
    modalDuplicar.show();
});


//------------------------------ FUNCIONES

/**
 * Función que obtiene los guías disponibles en la nueva fecha seleccionada 
 * durante el duplicado de la ruta (no puede ser la fecha original)
 */
function obtenerGuiasBD() {
    if (nuevaFecha.value != props.ruta.fecha) { //NO SE PUEDE ASIGNAR LA MISMA FECHA ANTERIOR
        try {
            //fetch('http://localhost/api/api.php/usuarios', {
            fetch(`/api/api.php/asignaciones?fecha=${nuevaFecha.value}`, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    guiasDisponibles.value = data;
                    console.log("Guías disponibles (DUPLICADO RUTA): " + JSON.stringify(guiasDisponibles.value));
                    errorDuplicar.value = '';
                })
                .catch(errMsg => {
                    console.log("Error (obtención asignaciones): " + errMsg);
                    guiasDisponibles.value = [];
                    errorDuplicar.value = `(Error guias duplicado) :${errMsg}`;
                    exitoDuplicar.value = '';
                }
                );
        } catch (err) {
            //error.value = 'Error al cargar los datos';
            console.log("Error Obtención Guías: " + err);
            errorDuplicar.value = `(Error guias duplicado) :${errMsg}`;
            exitoDuplicar.value = '';
            guiasDisponibles.value = [];

        }
    } else {
        errorDuplicar.value = `La fecha no puede ser la original (${props.ruta.fecha})`;
        exitoDuplicar.value = '';
        nuevaFecha.value = null;
    }
}


function duplicarRuta() {
    //Se debe comprobar si se han elegido fecha y ruta 
    //HAY QUE HACER COMPROBACIONES DE LOS INPUTS!!!!
    //función que realice las comprobaciones?
    //Hasta que no haya una fecha seleccionada no se puede elegir un guía

    console.log(props.ruta);

    if (!nuevaFecha.value || !idGuiaSeleccionado.value) {
        console.log("Debe seleccionar una fecha y un guía");
        errorDuplicar.value = "Seleccione una fecha y un guía";
    } else {

        //Creamos una nueva ruta (copia de la anterior) cambiando la fecha y el guía
        let nuevaRuta = {
            ...props.ruta,
            fecha: nuevaFecha.value,
            guia_id: idGuiaSeleccionado.value
        };

        //SE hace el fetch de creación de nueva ruta
        fetch('/api/api.php/rutas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaRuta)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta:', data);
                if (data.status == 'success') {
                    exitoDuplicar.value = data.message;
                    errorDuplicar.value = '';
                    emit('actualizarRutas');
                } else {
                    errorDuplicar.value = data.message;;
                    exitoDuplicar.value = '';
                }
                setTimeout(() => {
                    exitoDuplicar.value = '';
                    errorDuplicar.value = '';
                    cerrarModal();
                }, 3000);
            })
            .catch(error => {
                console.error('Error (Duplicar ruta):', error);
                errorDuplicar.value = data.message;
                exitoDuplicar.value = '';
            });
    }
}

function cerrarModal() {
    modalDuplicar.hide();
    emit("cerrarModal"); //Se emite para que se actualice la tabla de rutas
}
</script>

<template>
    <div class="modal fade" id="modalDuplicar" tabindex="-1" aria-labelledby="duplicarModalLabel">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="duplicarModalLabel">Duplicar Ruta</h5>
                    <button type="button" @click="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p>Duplicando la ruta: <strong>{{ props.ruta.titulo }}</strong></p>

                    <label for="fechaNueva" class="form-label">Nueva Fecha:
                        <span>(Debe ser distinta a <strong>{{ props.ruta.fecha }}</strong>)</span>
                    </label>
                    <input type="date" id="fechaNueva" name="fechaNueva" class="form-control" v-model="nuevaFecha"
                        required @change="obtenerGuiasBD">

                    <label for="selectGuia" class="form-label mt-2">
                        Asignar guía: <span>(Tras seleccionar fecha)</span>
                    </label>
                    <select id="selectGuia" name="selectGuia" class="form-select" v-model="idGuiaSeleccionado"
                        :disabled="!nuevaFecha">
                        <option value="" disabled>Selecciona un guía</option>
                        <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}
                        </option>
                    </select>

                    <!--Mensaje éxito/error-->
                    <div class="mt-2 mensaje">
                        <p v-if="exitoDuplicar != ''" class="text-success">{{ exitoDuplicar }}</p>
                        <p v-if="errorDuplicar != ''" class="text-danger">{{ errorDuplicar }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btnBorrado" type="button" @click.prevent="cerrarModal"
                        aria-label="Cerrar modal de duplicado">Cancelar</button>
                    <button class="btn btn-primary" type="button" aria-label="Duplicar ruta seleccionada"
                        @click.prevent="duplicarRuta">Duplicar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-content {
    padding: 1rem;
}

span {
    color: var(--rojo);
    font-style: italic;
}

.mensaje {
    font-weight: 600;
}
</style>
