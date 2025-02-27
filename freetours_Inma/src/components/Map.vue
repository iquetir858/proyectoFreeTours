<!--EJEMPLO DE USO DE LA LIBRERÍA LEAFLET-->
<!--Para añadirla al proyecto : npm install leaflet-->
<template>
    <div v-if="!ruta"> <!--Si no hay ruta, se crea un buscador de ubicación-->
        <!--<input v-model="address" @keyup.enter="searchLocation" placeholder="Buscar dirección" class="input" />-->
        <div class="d-flex flex-row mb-2">
            <input class="form-control" v-model="address" @keyup.enter="searchLocation"
                placeholder="Buscar dirección" />
            <button @click.prevent="searchLocation" class="btn ms-2" aria-label="Realizar la búsqueda de la dirección">
                <i class="fa-solid fa-magnifying-glass"></i>
            </button>
        </div>
        <div id="map" style="height: 200px; width:100%;"></div>
    </div>
    <div v-else> <!--Si se le pasa una ruta, sólo se mostrará el mapa con la ubicación-->
        <div id="ubicacion" style="height: 200px; width:100%;"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const address = ref('');
let map, marker, mapaUbicacion, marcadorUbicacion;

//Prop para recibir una ruta con latitud y longitud para pintar su ubicación
const props = defineProps({
    ruta: Object
});

//Emit para devolver la latitud y longitud de la búsqueda a la creación de ruta
const emit = defineEmits(["enviarCoordenadas"]);

onMounted(() => {
    if (!props.ruta) {
        map = L.map('map').setView([40.4168, -3.7038], 15); // Madrid por defecto
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    } else {
        crearMapaUbicacion();
    }
});

const searchLocation = async () => {
    if (!address.value) return;
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.
            value)}`
    );
    const data = await response.json();
    if (data.length > 0) {
        let lat = data[0].lat;
        let lon = data[0].lon;
        emit('enviarCoordenadas', lat, lon);
        if (marker) marker.remove();
        marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(address.value)
            .openPopup();
        map.setView([lat, lon], 15);
        ajustarMapa(map);
    } else {
        alert('Dirección no encontrada');
    }
};

function crearMapaUbicacion() {
    if (mapaUbicacion) {
        mapaUbicacion.remove(); //Eliminar mapa anterior si existe (para evitar que se creen múltiples instancias del leaflet)
    }
    //Si se pasa una ruta, directamente se establece el mapa
    if (props.ruta) {
        mapaUbicacion = L.map('ubicacion').setView([props.ruta.latitud, props.ruta.longitud], 15); //Ubicación ruta
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapaUbicacion);
        //Marcador de la ubicación de la ruta
        if (marcadorUbicacion) marcadorUbicacion.remove();
        marcadorUbicacion = L.marker([props.ruta.latitud, props.ruta.longitud])
            .addTo(mapaUbicacion);
            //No coloca bien la localidad
            //.bindPopup(props.ruta.localidad)
            //.openPopup();
    }
    ajustarMapa(mapaUbicacion);
}

/**
 * Función que ajusta el tamaño después de abrir el modal 
 * (Para que no dé el error de que no se muestre la parte derecha)
 * @param mapa mapa a ajustar
 */
function ajustarMapa(mapa) {
    setTimeout(() => {
        mapa.invalidateSize();
    }, 300);
}
</script>

<style>
#map {
    z-index: 0;
}
</style>