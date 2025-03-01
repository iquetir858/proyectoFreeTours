<template>
    <footer class="footer py-4">
        <div class="container">
            <div class="row gy-4">
                <!-- Brand Section -->
                <div class="col-12 col-md-4 text-center text-md-start">
                    <h5 class="brand-name display-6 mb-2">PurrfectTours</h5>
                    <p class="mb-1">&copy; {{ new Date().getFullYear() }} - Todos los derechos reservados.</p>
                    <p>Desarrolladora - Inmaculada Quesada Tirado</p>
                </div>
                
                <!-- Social Media Section -->
                <div class="col-12 col-md-4">
                    <h4 class="text-center mb-3">Siguenos</h4>
                    <div class="d-flex justify-content-center gap-4">
                        <a href="#" class="social-icon">
                            <i class="fa-brands fa-twitter fs-2"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fa-brands fa-facebook fs-2"></i>
                        </a>
                        <a href="#" class="social-icon">
                            <i class="fa-brands fa-instagram fs-2"></i>
                        </a>
                    </div>
                </div>
                
                <!-- Links Section -->
                <div class="col-12 col-md-4">
                    <h4 class="text-center mb-3">Enlaces</h4>
                    <ul class="nav flex-column align-items-center">
                        <li class="nav-item mb-2">
                            <a href="#" class="text-decoration-none text-white hover-link">Inicio</a>
                        </li>
                        <li class="nav-item mb-2">
                            <a href="#" class="text-decoration-none text-white hover-link">Tours</a>
                        </li>
                        <li class="nav-item">
                            <a href="/about" class="text-decoration-none text-white hover-link">Contacto</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    position: relative;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    background: linear-gradient(45deg, #1a0808, #2d1010);
}

.brand-name {
    background: linear-gradient(to right, #ffffff, #d3d3d3);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

p, h4 {
    color: #d3d3d3;
}

.social-icon {
    text-decoration: none;
    transition: all 0.3s ease;
}

.social-icon i {
    color: rgba(255, 255, 255, 0.9);
}

.social-icon:hover {
    transform: translateY(-3px);
}

social-icon:hover i {
    color: #eca6b1;
}

.hover-link {
    transition: color 0.3s ease;
}

.hover-link:hover {
    color: #eca6b1 !important;
}

@media (max-width: 768px) {
    .brand-name {
        font-size: 2rem;
    }
}
</style>