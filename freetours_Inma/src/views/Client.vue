<script setup>
import { ref } from 'vue';
import Reservations from '@/components/Reservations.vue';

/*
Rutas reservadas --> obtener todas las reservas del usuario con fecha >= actual
Rutas pasadas --> Reserva del usuario cuya fecha sea < actual

*/
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let reservasActuales = ref(null);
let reservasPasadas = ref(null);

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
            //Ahora filtramos las reservas según si ya han ocurrido, para poder diferenciar
            //entre aquellas que podemos modificar el num de personas y las que se pueden valorar
            reservasActuales.value = data.filter(elem => new Date(elem.ruta_fecha) >= fechaActual);
            reservasPasadas.value = data.filter(elem => new Date(elem.ruta_fecha) < fechaActual);
        })
        .catch(error => console.error('Error:', error));

}

/**
 * Función llamada desde el emit del componente REservations (tarjetas con las reservas actuales)
 * para actualizarel listado de reservas general (ocurre después del borrado)
 */
function actualizarReservasActuales(){
    obtenerReservas(cliente.value.email);
}

//Llamada principal al abrir la página del cliente
obtenerReservas(cliente.value.email);

</script>

<template>
    <!--Tabla rutas reservadas-->
    <!--Mismo componente que en la pág principal?-->
    <!-- Contenedor principal para las reservas -->
    <h2 class="text-center mt-2">Rutas reservadas</h2>
   <Reservations v-if="reservasActuales" @actualizar-reservas="actualizarReservasActuales" :reservas="reservasActuales" :valoracion="true"></Reservations>


   <h2 class="text-center mt-2">Rutas pasadas</h2>
   <Reservations  v-if="reservasPasadas" :reservas="reservasPasadas" :valoracion="true"></Reservations>

    <!--Tabla rutas realizadas para valorar-->

</template>

<style scoped></style>