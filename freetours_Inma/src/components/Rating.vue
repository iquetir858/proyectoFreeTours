<script setup>
import { ref, onMounted, computed } from 'vue';

//---------------------PROPS
const props = defineProps({
    idRuta: Object,
    usuarioActual: Object,
});

//---------------------EMITs
const emit = defineEmits(["actualizarReservas"]);


//-----------------------Variables
let existeValoracion = ref(false);
let valoracion = ref(null);
let copiaValoracion = ref({ puntuacion: 1, comentario: '' }); //Por defecto 1 estrellas
let modalRef = ref(null); //Referencia al modal (porque no se puede usar id)
let errorValoracion = ref('');
let exitoValoracion = ref('');



//Variable computada Función para actualizar la visualización de estrellas
let estrellas = computed(() => {
    let estrellasRellenas = '<i class="fa-solid fa-star text-warning"></i>'.repeat(copiaValoracion.value.puntuacion);
    let estrellasVacias = '<i class="fa-regular fa-star text-warning"></i>'.repeat(5 - copiaValoracion.value.puntuacion);
    return estrellasRellenas + estrellasVacias;
});

//------------------------Modales
let modalValoracion = ref(null);
onMounted(() => {
    if (modalRef.value) {
        modalValoracion.value = new bootstrap.Modal(modalRef.value);
    }
});

/**
 * Función que muestra el modal que servirá para actualizar la valoración actual
 * o para crear una nueva. Se realiza una copia de los datos de la valoración original para que no 
 * cambien los datos principales hasta que se actualice/cree la valoración en el modal
 */
function abrirModal() {
    if (valoracion.value) {
        copiaValoracion.value = { ...valoracion.value }; //se clonan los valores
    } else {
        copiaValoracion.value = { puntuacion: 1, comentario: '' };//se inician por defecto
    }

    //Se muestra el modal
    if (modalValoracion.value) {
        modalValoracion.value.show();
    }
}

/**
 * Función que cierra el modal de valoración
 */
function cerrarModal() {
    modalValoracion.value.hide();
}

//-----------------------Funciones
function obtenerValoracionRuta(idRuta) {
    fetch(`/api/api.php/valoraciones?ruta_id=${idRuta}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            //console.log("Valoraciones para esa ruta: " + data);
            //Data serán todas las valoraciones para esa ruta, por lo que tenemos que filtrar por el cliente actual
            const valoracionUsuario = data.find(val => val.cliente_id == props.usuarioActual.id);
            valoracion.value = valoracionUsuario || null;
            existeValoracion.value = !!valoracionUsuario; //guarda true/false

        })
        .catch(error => {
            console.error(`Error al obtener las valoraciones para la ruta ${idRuta}:`, error);
        });
}


/**
 * Función que incrementa el número de estrellas seleccionadas
 * (al modificar el valor de copiaValoracion.puntuacion,se cambia del número de estrellas)
 */
function sumarEstrella() {
    if (copiaValoracion.value.puntuacion < 5) {
        copiaValoracion.value.puntuacion++;
    }
}

/**
 * Función que decrementa el número de estrellas seleccionadas
 * (al modificar el valor de copiaValoracion.puntuacion,se cambia del número de estrellas)
 */
function restarEstrella() {
    if (copiaValoracion.value.puntuacion > 1) {
        copiaValoracion.value.puntuacion--;
    }
}

/**
 * Función que actualiza la valoración actual, guardando los nuevos datos que se 
 * tienen en "copiaValoracion"
 */
function actualizarValoracion() {
    let idValoracion = copiaValoracion.value.valoracion_id;
    let data = {
        estrellas: copiaValoracion.value.puntuacion,
        comentario: copiaValoracion.value.comentario
    };

    fetch(`/api/api.php/valoraciones?id=${idValoracion}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Valoración creada:', data);
            if (data.status == 'success') {
                exitoValoracion.value = data.message;
                errorValoracion.value = '';
                emit('actualizarReservas');
            } else {
                exitoValoracion.value = '';
                errorValoracion.value = data.message;
            }

            setTimeout(() => {
                exitoValoracion.value = '';
                errorValoracion.value = '';
            }, 3000);
        })
        .catch(error => {
            console.error('Error al crear la valoración:', error);
        });

}

//----------------Llamada principal
obtenerValoracionRuta(props.idRuta);
</script>


<template>
    <div id="divValoracion">
        <!--Si ya existe una valoración para esa ruta, se muestra y se podrá modificar-->
        <div v-if="existeValoracion" id="divValoracionActual">
            <p class="mb-0 me-2"><strong>Valoración:</strong></p>
            <div id="estrellas" v-html="estrellas"></div>
            <!--Botón para actualizar valoración existente (sólo puede haber 1 valoración por ruta-cliente pero se puede modificar)-->
            <button @click="abrirModal()" aria-label="Editar valoración actual">Editar</button>
        </div>
        <!--Si no existe valoración, se muestra un botón para crearla (puntuación estrellas + comentario)-->
        <div v-else id="divNuevaValoración">
            <button @click="abrirModal()" aria-label="Valorar ruta">Valorar</button><!--Muestra el modal-->
        </div>
    </div>


    <!--Modal de valoración-->
    <div class="modal fade" ref="modalRef" tabindex="-1" aria-labelledby="exampleModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Valoración reserva pasada</h5>
                    <button type="button" @click.prevent="cerrarModal()" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar modal"></button>
                </div>
                <div class="modal-body">
                    <p v-if="existeValoracion">Valoración actual: <strong>{{ valoracion.puntuacion }}/5</strong></p>
                    <p>Nueva valoración:</p>
                    <div class="d-flex flex-row justify-content-center">
                        <button class="btn" @click="restarEstrella"><i class="fa-solid fa-minus"></i></button>
                        <span v-html="estrellas"></span>
                        <button class="btn" @click="sumarEstrella"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="d-flex flex-column">
                        <label for="comentario">Comentario</label>
                        <textarea v-model="copiaValoracion.comentario" id="comentario"
                            aria-label="Comentario valorando la ruta"
                            placeholder="Por favor, explica brevemente el motivo de tu valoración."></textarea>
                    </div>
                    <p v-if="exitoValoracion.value != ''" class="text-success">{{ exitoValoracion }}</p>
                    <p v-else-if="errorValoracion.value != ''" class="text-danger">{{ errorValoracion }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="cerrarModal()" class="btn" data-bs-dismiss="modal">
                        Cerrar
                    </button>
                    <button class="btn" v-if="existeValoracion" @click.prevent="actualizarValoracion()">Guardar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>