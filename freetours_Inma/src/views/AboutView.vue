<script setup>
import { ref, computed, onMounted } from 'vue';
import Cat from '@/components/Cat.vue';

//-------------------Variables video
const medio = ref(null);
const play = ref("▶"); // Valor inicial del botón de play

const playIcon = computed(() => (play.value === "▶" ? "fas fa-play" : "fas fa-pause"));
let volumenActual = ref('');

onMounted(() => {
  if (medio.value) {
    actualizarVolumen();
  }
});

//--------------------------FUNCIONES
/**
 * Función para actualizar el valor del volumenActual, que se modifica al bajar y subir el volumen
 */
function actualizarVolumen() {
  if (medio.value) {
    volumenActual.value = Math.round(medio.value.volume * 100) + '%';
  }
}

/**
 * Función para darle a play o parar el video
 */
function accionPlay() {
  if (!medio.value.paused && !medio.value.ended) {
    medio.value.pause();
    play.value = "▶";
  } else {
    medio.value.play();
    play.value = "||";
  }
}

/**
 * Función para reiniciar el video
 */
function accionReiniciar() {
  //Usar propiedad .currentTime
  //Reproducir el vídeo
  //Cambiar el valor del botón a ||
  medio.value.currentTime = 0;
  medio.value.play();
  play.value = '||';
}

/**
 * Función para darle echar hacia atrás el video
 */
function accionRetrasar() {
  //Contemplar que no existen valores negativos
  medio.value.currentTime = Math.max(medio.value.currentTime - 5, 0);
}

/**
 * Función para adelantar el video
 */
function accionAdelantar() {
  medio.value.currentTime = Math.min(medio.value.currentTime + 5, medio.value.duration);
}

/**
 * Función para silenciar el video
 */
function accionSilenciar() {
  //Utilizar medio.muted = true; o medio.muted = false;
  medio.value.muted = !medio.value.muted;
}

/**
 * Función para subir el volumen del video
 */
function accionMasVolumen() {
  //Contemplar que el valor máximo de volumen es 1
  medio.value.volume = Math.min(medio.value.volume + 0.1, 1);
  actualizarVolumen();
}

/**
 * Función para bajar el volumen del video
 */
function accionMenosVolumen() {
  //Contemplar que el valor mínimo de volumen es 0
  medio.value.volume = Math.max(medio.value.volume - 0.1, 0);
  actualizarVolumen();
}

</script>

<template>
  <div class="info container py-5">

    <!-- Sobre nosotros -->
    <div class="row align-items-center g-4 mb-5">
      <div class="col-12 col-lg-12">
        <div class="p-4 bg-white rounded-4 shadow-sm hover-up">
          <h2 class="display-6 fw-bold position-relative mb-4">Sobre nosotros</h2>
          <p class="lead" id="textoAbout">
            ¿Alguna vez has deseado poder visitar todos los rincones del mundo y conocer el lugar de la mano de guías
            que lo conozcan de primera mano?
            Pues en <span class="fw-semibold">PurrfectTours</span> apostamos por el concepto de 'free tours'
            para vivir dicha experiencia.
          </p>
          <p class="lead mt-2">Para ello, ayudamos a establecer contanto entre viajeros inteligentes con lugañeros,
            guías residentes y proveedores de tours económicos alrededor del mundo, de forma que cualquiera
            pueda disfrutar de rutas auténticas y enriquecedoras sin preocuparse de gastar demasiado.

          </p>
          <Cat></Cat>
        </div>
      </div>
    </div>

    <!-- Nuestro Equipo -->
    <!--API DE LOS AVATARES DE PERFIL: https://avatar-placeholder.iran.liara.run/-->
    <div class="row g-4 mb-5">
      <div class="col-12 text-center mb-1">
        <h2 class="display-6 fw-bold">Nuestro Equipo</h2>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/81" alt="" aria-hidden="true"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">María García</h3>
            <p class="work mb-2">CEO & Fundadora</p>
            <p class="text-muted small">Apasionada por los viajes y la cultura local. Con más de 10 años de experiencia
              en el sector turístico.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/24" alt="" aria-hidden="true"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">Carlos Rodríguez</h3>
            <p class="work mb-2">Director de Operaciones</p>
            <p class="text-muted small">Experto en logística y gestión de experiencias turísticas inolvidables.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/63" alt="" aria-hidden="true"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">Laura Martínez</h3>
            <p class="work mb-2">Coordinadora de Guías</p>
            <p class="text-muted small">Responsable de formar y coordinar nuestra red de guías locales.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/38" alt="" aria-hidden="true"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">David Torres</h3>
            <p class="work mb-2">Desarrollo de Producto</p>
            <p class="text-muted small">Creador de experiencias únicas y rutas innovadoras.</p>
          </div>
        </div>
      </div>
    </div>



    <!-- Nuestros valores -->
    <div class="row g-4">
      <div class="col-12 text-center mb-1">
        <h2 class="display-6 fw-bold">Nuestros Valores</h2>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm hover-up">
          <div class="card-body text-center p-4">
            <i class="fas fa-heart fs-1 mb-3 work"></i>
            <h3 class="h4 fw-bold">Pasión</h3>
            <p class="text-muted">Amamos lo que hacemos y transmitimos esa pasión en cada tour.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm hover-up">
          <div class="card-body text-center p-4">
            <i class="fas fa-handshake fs-1 mb-3 work"></i>
            <h3 class="h4 fw-bold">Autenticidad</h3>
            <p class="text-muted">Experiencias reales con guías locales que conocen cada rincón.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm hover-up">
          <div class="card-body text-center p-4">
            <i class="fas fa-globe fs-1 mb-3 work"></i>
            <h3 class="h4 fw-bold">Comunidad</h3>
            <p class="text-muted">Creamos conexiones significativas entre viajeros y locales.</p>
          </div>
        </div>
      </div>
    </div>


    <!------------------Vídeo--------------------->
    <div class="container py-5 rounded">
      <h2 class="display-6 fw-bold text-center">Apúntate y vive una experiencia única</h2>
      <div class="col-8 d-flex flex-column mx-auto mt-4">
        <video ref="medio" width="100%" preload="auto">
          <source ref="medio" src="../assets/videos/videoTour.mp4" type="video/mp4" />
          <source ref="medio" src="../assets/videos/videoTour.ogv" type="video/ogv" />
          Vídeo no soportado por el navegador.
        </video>
        <div id="controlesVideo" class="d-flex flex-row justify-content-center mt-2 rounded">
          <button @click="accionReiniciar" class="btn control-btn" aria-label="Reiniciar vídeo">
            <i class="fas fa-redo"></i>
          </button>
          <button @click="accionRetrasar" class="btn control-btn" aria-label="Retrasar vídeo">
            <i class="fas fa-backward"></i>
          </button>
          <button @click="accionPlay" class="btn control-btn" aria-label="Comenzar/parar vídeo">
            <i :class="playIcon"></i>
          </button>
          <button @click="accionAdelantar" class="btn control-btn" aria-label="Adelantar vídeo">
            <i class="fas fa-forward"></i>
          </button>
          <button @click="accionSilenciar" class="btn control-btn" aria-label="Silenciar vídeo">
            <i class="fas fa-volume-mute"></i>
          </button>
          <span class="volume-label">Volumen: {{ volumenActual }}</span>
          <button @click="accionMenosVolumen" class="btn control-btn" aria-label="Bajar volumen">
            <i class="fas fa-volume-down"></i>
          </button>
          <button @click="accionMasVolumen" class="btn control-btn" aria-label="Subir volumen">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.info {
  --radius: 0.7em;
  background: var(--amarilloClaro);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  transition: transform 0.3s ease;
}

h2 {
  color: rgb(155, 45, 5);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
}

.work {
  color: rgb(155, 45, 5);
}

/*Contenedor con los controles del vídeo */
#controlesVideo {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(5px, 2vw, 15px);
  margin-top: 15px;
  background: #f8eed7;
  padding: 1em;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.control-btn {
  background: var(--amarilloClaro);
  border: none;
  padding: 10px;
  font-size: 1.2rem;
  color: var(--marronClaro);
  transition: background 0.3s ease, transform 0.3s ease;
}

.control-btn:hover {
  background: var(--marronClaro);
  color: var(--blanco);
  transform: scale(1.1);
}

.volume-label {
  font-size: 1rem;
  color: var(--marronClaro);
  margin: 0 10px;
}
</style>