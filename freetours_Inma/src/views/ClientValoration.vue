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

let email = cliente.value.email || null;
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
</template>

<style scoped>
</style>