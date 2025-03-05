<script setup>
import Cat from '@/components/Cat.vue';

</script>

<template>
  <div class="info container py-5">

    <!-- Sobre nosotros -->
    <div class="row align-items-center g-4 mb-5">
      <div class="col-12 col-lg-12">
        <div class="p-4 bg-white rounded-4 shadow-sm hover-up">
          <h2 class="display-6 fw-bold position-relative mb-4">Sobre nosotros</h2>
          <p class="lead">Sabemos que no es lo mismo ser turista que viajero. Es por ello que apostamos por el concepto
            de 'free tours'
            y pensamos en lo cómodo que sería disponer de una plataforma que ponga en contacto a viajeros inteligentes
            con
            lugañeros, guías residentes y proveedores de tours económicos alrededor del mundo, de forma que cualquiera
            pueda
            disfrutar de experiencias auténticas y enriquecedoras sin preocuparse de gastar demasiado. ¡Y así nació
            <span class="fw-semibold">PurrfectTours</span>!
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
            <img src="https://avatar.iran.liara.run/public/81" alt="María García" class="rounded-circle mb-4 shadow-sm"
              width="150" height="150">
            <h3 class="h5 fw-bold">María García</h3>
            <p class="text-primary mb-2">CEO & Fundadora</p>
            <p class="text-muted small">Apasionada por los viajes y la cultura local. Con más de 10 años de experiencia
              en el sector turístico.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/24" alt="Carlos Rodríguez"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">Carlos Rodríguez</h3>
            <p class="text-primary mb-2">Director de Operaciones</p>
            <p class="text-muted small">Experto en logística y gestión de experiencias turísticas inolvidables.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/63" alt="Laura Martínez"
              class="rounded-circle mb-4 shadow-sm" width="150" height="150">
            <h3 class="h5 fw-bold">Laura Martínez</h3>
            <p class="text-primary mb-2">Coordinadora de Guías</p>
            <p class="text-muted small">Responsable de formar y coordinar nuestra red de guías locales.</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <div class="card border-0 shadow-sm hover-up h-100">
          <div class="card-body text-center p-4">
            <img src="https://avatar.iran.liara.run/public/38" alt="David Torres" class="rounded-circle mb-4 shadow-sm"
              width="150" height="150">
            <h3 class="h5 fw-bold">David Torres</h3>
            <p class="text-primary mb-2">Desarrollo de Producto</p>
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
            <i class="fas fa-heart fs-1 mb-3"></i>
            <h3 class="h4 fw-bold">Pasión</h3>
            <p class="text-muted">Amamos lo que hacemos y transmitimos esa pasión en cada tour.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm hover-up">
          <div class="card-body text-center p-4">
            <i class="fas fa-handshake fs-1 mb-3"></i>
            <h3 class="h4 fw-bold">Autenticidad</h3>
            <p class="text-muted">Experiencias reales con guías locales que conocen cada rincón.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100 border-0 shadow-sm hover-up">
          <div class="card-body text-center p-4">
            <i class="fas fa-globe fs-1 mb-3"></i>
            <h3 class="h4 fw-bold">Comunidad</h3>
            <p class="text-muted">Creamos conexiones significativas entre viajeros y locales.</p>
          </div>
        </div>
      </div>
    </div>


    <!--Vídeo-->
    <div class="row g-4 mt-4 mb-3 justify-content-center">
      <div class="col-12 text-center mb-1">
        <h2 class="display-6 fw-bold">Apúntate y vive una experiencia única</h2>
      </div>
      <div class="col-8 d-flex justify-content-center">
        <video controls width="100%" height="500px" preload="auto">
          <source src="../assets/videos/video.mp4" type="video/mp4">
          <source src="../assets/videos/video.ogv" type="video/ogv">
          Tu navegador no soporta este video
        </video>
      </div>
    </div>

  </div>
</template>

<style scoped>
.about {
  gap: 2rem;
}

.info {
  --radius: 0.7em;
  --primary-color: #FF6B6B;
  --bg-color: #FFF5F5;
  background: var(--bg-color);
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  transition: transform 0.3s ease;
}

.hover-up:hover {
  transform: translateY(-5px);
}

h2 {
  color: var(--primary-color);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  margin-bottom: 1.5rem;
  font-weight: 700;
  position: relative;
}

h3 {
  color: var(--primary-color);
}

span {
  color: var(--primary-color);
}
</style>
