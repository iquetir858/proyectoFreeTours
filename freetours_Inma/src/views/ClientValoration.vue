<script setup>
import { ref, computed } from 'vue';
import Reservations from '@/components/Reservations.vue';

//-------------VARIABLES
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let email = cliente.value.email;
let reservasPasadas = ref(null);

const paginaActual = ref(1);
const reservasPorPagina = ref(2);

// Computed properties for pagination
const reservasPaginadas = computed(() => {
    const start = (paginaActual.value - 1) * reservasPorPagina.value;
    const end = start + reservasPorPagina.value;
    return reservasPasadas.value ? reservasPasadas.value.slice(start, end) : [];
});

const totalPaginas = computed(() => {
    return reservasPasadas.value ? Math.ceil(reservasPasadas.value.length / reservasPorPagina.value) : 0;
});

// Pagination functions
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
            //Filtramos reservas pasadas
            reservasPasadas.value = data.filter(elem => new Date(elem.ruta_fecha) < fechaActual);
        })
        .catch(error => console.error('Error:', error));
}

//Llamada principal al abrir la página del cliente
obtenerReservas(email);


</script>

<template>
    <h2 class="text-center mt-2">Rutas pasadas</h2>
    <div v-if="reservasPasadas" class="d-flex flex-column align-items-center">
        <Reservations :reservas="reservasPaginadas" :valoracion="true"
            :usuarioActual="cliente" @actualizar-reservas="obtenerReservas(email)"></Reservations>

        <div class="d-flex flex-column align-items-center gap-3 mt-4" v-if="reservasPasadas.length > 0">
            <nav aria-label="Navegación de páginas">
                <ul class="pagination mb-0">
                    <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                        <button class="page-link" @click="pagAnterior" :disabled="paginaActual === 1">
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
                        <button class="page-link" @click="pagSiguiente" :disabled="paginaActual === totalPaginas">
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