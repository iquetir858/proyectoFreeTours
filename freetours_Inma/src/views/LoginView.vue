<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

//!!!!!!!!!!!!!!! IMPORTANTE
//MANTENER USUARIO LOGEADO EN EL LOCALSTORAGE???

const emit = defineEmits(["loggedIn"]);
const route = useRoute();

//---------Datos Login
const form = ref({ email: '', contraseña: '' });
const userLogged = ref(); //id, nombre, email, rol --Datos que recibe en el fetch
const errorLogin = ref('');

//---------Datos Registro
const formRegistro = ref({ nombre: '', email: '', contraseña: '', contraseña2: ''});
const errorRegistro = ref('');
const exitoRegistro = ref('');
const errores = ref({});
const validado = ref(false);

//Modal para el resgitro 
let modalRegistro = null;
onMounted(() => {
  modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));
});


//---------Función de login de usuario
function login() {
  try {
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form.value)
    }
    //fetch('http://localhost/api/api.php/usuarios?login', options)
    fetch('/api/api.php/usuarios?login', options)
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          userLogged.value = data.user;
          emit('loggedIn', userLogged.value);
          errorLogin.value = '';

          //Redirigimos al home (ya con ese usuario logeado)
          router.push('/');
        } else {
          errorLogin.value = data.message;
          form.value = { email: '', contraseña: '' }; //Para vaciar los inputs en caso de error
          //console.error(data.message);
        }
      })
      .catch(errMsg => {
        errorLogin.value = errMsg;
        console.error(errMsg);
      }
      );
  } catch (err) {
    errorLogin.value = 'Error al cargar los datos';
  }
}

/**
 * Función que valida los datos del registro
 */
function validacionRegistro() {
  let nombre = formRegistro.value.nombre;
  let correo = formRegistro.value.email;
  let contra = formRegistro.value.contraseña;
  let patron = /^(?=.*\d)[a-zA-Z\d]{8,}$/;
  let patronCorreo = /[a-zA-Z0-9]+@tours.com/;

  //Borramos anteriores mensajes y reiniciamos errores
  errores.value = {};
  exitoRegistro.value = '';
  errorRegistro.value = '';

  if (!nombre || nombre.length < 4 || !isNaN(nombre)) {
    errores.value.nombre = "El nombre debe contener al menos 4 caracteres y NO ser numérico";
  }
  if (!contra || contra.length < 8 || !patron.test(contra)) {
    errores.value.contraseña = "La contraseña debe tener 8 caracteres con al menos 1 número";
    //errores.value.contraseña2 = "La contraseña debe tener 8 caracteres con al menos 1 número";
  } else if (contra !== formRegistro.value.contraseña2) {
    errores.value.contraseña2 = "Las contraseñas no coinciden";
  }
  if (!correo || !patronCorreo.test(correo)) {
    errores.value.email = "Introduce un correo válido (Ej: usuario12@tours.com)";
  }

  validado.value = true;

  //Si hay errores, devuelve false
  return Object.keys(errores.value).length === 0;

}

//---------------------- Función para realizar el resgitro del usuario en la base de datos

/**
 * Función que comprueba si hay errores y, si no los hay, realiza el registro del usuario
 */
function userRegister() {
  if (validacionRegistro()) { //Aquí ya estarían todos los datos correctos en el registro por lo que se haría el fetch

    //fetch('http://localhost/api/api.php/usuarios', {
    fetch('/api/api.php/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formRegistro.value)
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          errorRegistro.value = '';
          exitoRegistro.value = data.message;
          //Mostramos el modal
          if (!modalRegistro) {
            modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));
          }
          modalRegistro.show();
          formRegistro.value={ nombre: '', email: '', contraseña: '', contraseña2: ''}; //Reseteamos los valores del form
          setTimeout(() => {
            modalRegistro.hide();
            exitoRegistro.value = '';
            router.push('/login')
          }, 2000);
        } else {
          exitoRegistro.value = '';
          errorRegistro.value = data.message;
        }
      })
      .catch(error => console.error('Error:', error));

  } else {
    exitoRegistro.value = '';
    errorRegistro.value = 'Formato de nombre/contraseña/correo incorrecto';
  }
}

</script>

<template>
  <div id="generalDiv" class="d-flex flex-column justify-content-center align-items-center">
    <div id="botonesCambio" class="d-flex justify-content-evenly w-100">
      <RouterLink class="text-white" to="/login">
        <button class="btn btn-primary text-decoration-none" aria-label="Cambiar al login">Login</button>
      </RouterLink>
      <RouterLink class="text-white text-decoration-none" to="/register">
        <button class="btn btn-primary" aria-label="Cambiar a registro">Registro</button>
      </RouterLink>
    </div>

    <div class="flip-container" :class="{ 'flipped': route.path === '/register' }">
      <div class="flipper">
        <!-- Parte del login -->
        <div class="front">
          <div id="loginDiv">
            <form action="POST">
              <h2 class="h3 mb-3 fw-normal text-center">LOGIN</h2>
              <div class="form-floating p-1">
                <input v-model="form.email" type="text" name="email" id="email" class="form-control">
                <label for="email">Correo electrónico</label>
              </div>
              <div class="form-floating p-1">
                <input v-model="form.contraseña" type="password" name='contraseña' id="contraseña" class="form-control">
                <label for='contraseña'>Contraseña</label>
              </div>
              <p v-if="errorLogin" class="text-danger mt-2">{{ errorLogin }}</p>
              <div class="buttons mt-2 d-flex justify-content-evenly">
                <button type="submit" @click.prevent="login" class="btn btn-success me-1">Iniciar Sesión</button>
                <RouterLink class="text-black text-decoration-none" to="/"> <button
                    class="btn btnCancelar">Cancelar</button></RouterLink>
              </div>
            </form>
          </div>
        </div>

        <!-- Parte del registro -->
        <div class="back">
          <div id="registerDiv">
            <form action="">
              <h2 class="h3 mb-3 fw-normal  text-center">REGISTRO</h2>
              <!--INPUT NOMBRE-->
              <div class="form-floating">
                <input v-model="formRegistro.nombre" type="text" name="nombre" id="nombre" class="form-control"
                  data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Debe contener al menos 4 caracteres y NO ser numérico"
                  :class="{ 'is-invalid': errores.nombre, 'is-valid': !errores.nombre && formRegistro.nombre }">
                <label for="nombre">Nombre</label>
                <div v-if="errores.nombre" class="invalid-feedback">{{ errores.nombre }}</div>
              </div>

              <!--INPUT CORREO-->
              <div class="form-floating">
                <input v-model="formRegistro.email" type="text" name="email" class="form-control"
                  data-bs-toggle="tooltip" data-bs-placement="top" title="(Ej: usuario12@tours.com)"
                  :class="{ 'is-invalid': errores.email, 'is-valid': !errores.email && formRegistro.email }">
                <label for="email">Correo</label>
                <div v-if="errores.email" class="invalid-feedback">{{ errores.email }}</div>

              </div>
              <!--INPUT CONTRASEÑA-->
              <div class="form-floating">
                <input v-model="formRegistro.contraseña" type="text" name="contraseña" class="form-control"
                  data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Debe tener al menos 8 caracteres, incluyendo al menos un número"
                  :class="{ 'is-invalid': errores.contraseña, 'is-valid': !errores.contraseña && validado }">
                <label for="contraseña">Contraseña</label>
                <div v-if="errores.contraseña" class="invalid-feedback">{{ errores.contraseña }}</div>
              </div>

              <!--INPUT CONTRASEÑA 2-->
              <div class="form-floating">
                <input v-model="formRegistro.contraseña2" type="text" name="contraseña2" class="form-control"
                  data-bs-toggle="tooltip" data-bs-placement="top" title="Deben coincidir ambas contraseñas"
                  :class="{ 'is-invalid': errores.contraseña || errores.contraseña2, 'is-valid': !errores.contraseña && !errores.contraseña2 && validado }">
                <label for="contraseña2">Repita su contraseña</label>
                <div v-if="errores.contraseña2" class="invalid-feedback">{{ errores.contraseña2 }}</div>
              </div>

              <!--<p v-if="errorRegistro" class="text-danger mt-2">{{ errorRegistro }}</p>-->
              <div class="buttons mt-2 d-flex justify-content-evenly">
                <button @click.prevent="userRegister" class="btn btn-success"
                  aria-label="registrarse">Registrarse</button>
                <RouterLink class="text-black text-decoration-none" to="/"> <button class="btn btn-danger"
                    aria-label="Cancelar registro, redirigir al home">Cancelar</button></RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--MODAL DE CONFIRMACIÓN DE REGISTRO-->
  <div class="text-success bg-color-success text-black">
    <div class="modal fade" id="modalRegistro" tabindex="-1" aria-labelledby="infoModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Registro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p>{{ exitoRegistro }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#generalDiv {
  padding: 2rem 1rem;
  background: var(--white);
  height: fit-content;
}

#botonesCambio {
  width: 90%;
  max-width: 400px;
  margin-bottom: 2rem;
}

#botonesCambio button {
  font-size: clamp(1rem, 2vw, 1.3rem);
  font-weight: 600;
  padding: 0.8rem 2rem;
  background-color: var(--marron);
  border: none;
  color: var(--amarillo);
  border-radius: 25px;
  transition: all 0.3s ease;
  width: 140px;
}

#botonesCambio button:hover {
  background-color: var(--amarilloClaro);
  color: var(--marron);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.223);
}

#loginDiv,
#registerDiv {
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.form-floating {
  margin-bottom: 1rem;
}

.form-control {
  border-radius: 12px;
  border: 2px solid #ddd7cb;
  padding: 0.8rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--amarilloClaro);
  box-shadow: 0 0 0 0.2rem rgba(255, 139, 167, 0.25);
}

.form-floating label {
  color: #666;
}

.buttons {
  margin-top: 1.5rem;
}

.buttons button {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: none;
  transition: all 0.3s ease;
  min-width: 120px;
}


/* Ajustes de estilo del modal*/
.modal-content {
  border-radius: 20px;
  border: none;
}

.modal-header {
  background-color: var(--amarilloClaro);
  border-radius: 20px 20px 0 0;
}

/* Responsive */
@media (max-width: 768px) {

  #loginDiv,
  #registerDiv {
    width: 95%;
    padding: 1.5rem;
  }

  .buttons button {
    padding: 0.6rem 1.2rem;
  }
}

@media (max-width: 480px) {
  #botonesCambio button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    width: 120px;
  }
}

/* Estilos para la transición 3D */
.flip-container {
  perspective: 500px;
  width: 90%;
  max-width: 50vh;
  height: 100%;
}

.flip-container.flipped .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transform-style: preserve-3d;
  width: 100%;
  height: 600px;
  transition: all 1.0s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.front,
.back {
  backface-visibility: hidden;
  /*Esto es para que no se vea el contenido cuando está "detras"*/
  position: absolute;
  width: 100%;
  height: fit-content;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}

/*
#loginDiv,
#registerDiv {
  max-height: 100%;
  overflow-y: auto;
}
  */
</style>