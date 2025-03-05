<script setup>
import { ref, computed } from 'vue';
import Reservations from '@/components/Reservations.vue';
import router from '@/router';

//-------------VARIABLES
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
//Primero comprobamos que no se pueda entrar a esta vista si no es CLIENTE
if (!cliente.value || cliente.value.rol != 'cliente') {
    router.push('/');
}

let reservasActuales = ref(null);
let email = cliente.value.email;

const paginaActual = ref(1);
const reservasPorPagina = ref(2);

// Se calculan las reservas que se mostrarán en la tabla en función de la página actual
const reservasPaginadas = computed(() => {
    const start = (paginaActual.value - 1) * reservasPorPagina.value;
    const end = start + reservasPorPagina.value;
    return reservasActuales.value ? reservasActuales.value.slice(start, end) : [];
});

// Se calcula el número total de páginas en función del número de reservas y de reservas por página
const totalPaginas = computed(() => {
    return reservasActuales.value ? Math.ceil(reservasActuales.value.length / reservasPorPagina.value) : 0;
});

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

//-------------FUNCIONES
function obtenerReservas(emailUsuario) {

    fetch(`/api/api.php/reservas?email=${emailUsuario}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reservas del usuario:', data);
            let fechaActual = new Date();
            //Primero ordenamos las reservas de data según la fecha más próxima a la actual
            data.sort((a, b) => new Date(a.ruta_fecha) - new Date(b.ruta_fecha));
            //Ahora filtramos las reservas actuales (cuya fecha es superior a la actual)
            reservasActuales.value = data.filter(elem => new Date(elem.ruta_fecha) >= fechaActual);
        })
        .catch(error => console.error('Error:', error));

}

/**
 * Función llamada desde el emit del componente REservations (tarjetas con las reservas actuales)
 * para actualizarel listado de reservas general (ocurre después del borrado)
 */
function actualizarReservasActuales() {
    obtenerReservas(cliente.value.email);
}

//Llamada principal al abrir la página del cliente
obtenerReservas(cliente.value.email);

</script>

<template>
    <div class="container">
        <h2 class="text-center mt-4 mb-4">Rutas reservadas</h2>
        
        <div v-if="reservasActuales" class="d-flex flex-column align-items-center">
            <Reservations 
                @actualizar-reservas="actualizarReservasActuales" 
                :reservas="reservasPaginadas"
                :valoracion="false">
            </Reservations>

            <div class="d-flex flex-column align-items-center gap-3 mt-4" v-if="reservasActuales.length > 0">
                <nav aria-label="Navegación de páginas">
                    <ul class="pagination mb-0">
                        <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                            <button class="page-link" aria-label="Pasar a la página anterior" @click="pagAnterior" :disabled="paginaActual === 1">
                                <span>&laquo;</span>
                            </button>
                        </li>
                        
                        <li v-for="pagina in totalPaginas" 
                            :key="pagina" 
                            class="page-item"
                            :class="{ active: pagina === paginaActual }">
                            <button class="page-link" @click="setPagina(pagina)">{{ pagina }}</button>
                        </li>
                        
                        <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                            <button class="page-link" aria-label="Pasar a la página siguiente" @click="pagSiguiente" :disabled="paginaActual === totalPaginas">
                                <span>&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <select v-model="reservasPorPagina" class="form-select" style="width: auto;">
                    <option :value="2">2 por página</option>
                    <option :value="4">4 por página</option>
                    <option :value="8">8 por página</option>
                </select>
            </div>
        </div>
    </div>
</template>

<style scoped>
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

.page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
}

.form-select {
    border-color: #DC4C64;
    color: #DC4C64;
    width: 120px !important;
}

.form-select:focus {
    border-color: #DC4C64;
    box-shadow: 0 0 0 0.25rem rgba(220, 76, 100, 0.25);
}
</style>