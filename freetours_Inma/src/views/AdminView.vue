<script setup>
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import router from '@/router';

let usuarioLogueado = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //Obtener guía del localStorage
//Primero comprobamos que no se pueda entrar a esta vista si no es ADMIN
if (!usuarioLogueado.value || usuarioLogueado.value.rol != 'admin') {
    router.push('/');
}

//------------------VARIABLES
let usuariosBD = ref(); //Para almacenar los usuarios de la petición
let error = ref('');
let exitoActualizacion = ref('');
let usuarioSeleccionado = ref(-1);
let paginaActual = ref(1);
let usuariosPorPagina = ref(5);
let guiasAsignados = ref([]);

//DEfinición del modal de cambio de rol 
let modalConfirmacion = null;
let modalBorrarUsuario = null;//Modal para borrar el usuario

onMounted(() => {
    modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
    modalBorrarUsuario = new bootstrap.Modal(document.getElementById('modalBorrarUsuario'));
});

function cerrarModalConfirmacion() {
    modalConfirmacion.hide();
}

function cerrarModalBorrado() {
    modalBorrarUsuario.hide();
}

//Función para establecer el usuario que se va a borrar
function seleccionarUsuario(id) {
    usuarioSeleccionado.value = id;
    console.log("Id seleccionado:" + usuarioSeleccionado.value);

    modalBorrarUsuario.show();
}

//--------------------PAGINACIÓN
const usuariosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * usuariosPorPagina.value;
    const final = inicio + usuariosPorPagina.value;
    return usuariosBD.value ? usuariosBD.value.slice(inicio, final) : [];
});

const totalPaginas = computed(() => {
    return usuariosBD.value ? Math.ceil(usuariosBD.value.length / usuariosPorPagina.value) : 0;
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

//--------------------FUNCIONES GENERALES

/**
 * Función que, por cada usuario, comprueba si este es un guia y si tiene asignada alguna ruta
 * (No se puede cambiar el rol de un guia que tenga asignaciones)
 * @param usuarios 
 */
function comprobarAsignaciones(usuarios) {
    usuarios.forEach(usuario => {
        if (usuario.rol == 'guia') {
            fetch(`/api/api.php/asignaciones?guia_id=${usuario.id}`, {
                method: 'GET',
            })
                .then(response => response.json())
                .then(data => {
                    //console.log('Asignaciones del guía:', data);
                    if (data.length > 1) guiasAsignados.value[usuario.id] = true; //marcamos el guía como asignado
                })
                .catch(error => console.error('Error comprobación asignaciones guía:', error));
        }
    });
}

/**
 * Función que obtiene todos los usuarios de la base de datos
 */
function obtenerUsuariosBD() {
    try {
        //fetch('http://localhost/api/api.php/usuarios', {
        fetch('/api/api.php/usuarios', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                usuariosBD.value = data;
                if (usuariosBD.value) comprobarAsignaciones(usuariosBD.value);
                //console.log("usuariosBD: " + JSON.stringify(usuariosBD));
                error.value = '';
            })
            .catch(errMsg => {
                error.value = errMsg;
            }
            );
    } catch (err) {
        error.value = 'Error al cargar los datos';
    }
}

/**
 * Función que actualiza el rol del usuario seleccionado
 * @param id 
 * @param nuevoRol 
 */
function actualizarRol(id, nuevoRol) {
    // console.log(id + "---" + nuevoRol);
    try {
        //fetch('http://localhost/api/api.php/usuarios?id=' + id, {
        fetch('/api/api.php/usuarios?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rol: nuevoRol })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.status == 'success') {
                    exitoActualizacion.value = data.message;

                    //Mostramos el modal
                    if (!modalConfirmacion) {
                        modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
                    }
                    modalConfirmacion.show();
                    setTimeout(() => modalConfirmacion.hide(), 3000);

                } else {
                    error.value = '';
                }
            })
            .catch(errMsg => {
                error.value = `Error al actualizar rol usuario: (${errMsg})`;
            }
            );
    } catch (err) {
        error.value = 'Error al obtener datos';
    }
}

function borrarUsuario() {
    try {
        //fetch('http://localhost/api/api.php/usuarios?id=' + id, {
        fetch('/api/api.php/usuarios?id=' + usuarioSeleccionado.value, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log("DELETE:");
                console.log(data);
                exitoActualizacion.value = data.message;
                error.value = '';
                cerrarModalBorrado(); //Para que se cierre automáticamente el modal
                //Se vuelve a llamar a obtenerUsuarios para que la lista de
                //usuarios que usa la tabla se actualice
                obtenerUsuariosBD();
            })
            .catch(errMsg => {
                error.value = `Error al actualizar rol usuario: (${errMsg})`;
            }
            );
    } catch (err) {
        error.value = 'Error al obtener datos';
        console.log(error.value);

    }
}

//Llamada principal para obtener los datos de la tabla la primera vez que entramos
obtenerUsuariosBD();
</script>

<template>
    <h2 class="text-center mb-5">Usuarios Registrados</h2>

    <div v-if="error">{{ error }}</div>
    <div v-else id="divTabla" class="m-3 d-flex flex-column align-items-center">
        <table class="table table-light table-striped table-hover text-center">
            <caption>Tabla de Usuarios Registrados</caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Contraseña</th>
                    <th scope="col">Rol</th>
                    <th scope="col">Borrado</th>
                </tr>
            </thead>
            <tbody>
                <!--HACER QUE NO SE PUEDA MODIFICAR EL ADMIN-->
                <tr v-for="usuario in usuariosPaginados" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.email }}</td>
                    <td>{{ usuario.contraseña }}</td>
                    <td>
                        <p v-if="usuario.rol == 'admin'">Admin</p>
                        <p v-else-if="guiasAsignados[usuario.id]">Guía</p>
                        <select v-else v-model="usuario.rol" @change="actualizarRol(usuario.id, usuario.rol)">
                            <!-- <option value="admin">Admin</option> (Sólo puede haber 1 admin)-->
                            <option value="guia">Guía</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </td>
                    <td>
                        <button aria-label="Botón para borrar al usuario" title="Borrar usuario" type="button"
                            class="btn btn-danger btnBorrado" @click="seleccionarUsuario(usuario.id)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <nav aria-label="Navegación de páginas" class="mt-3">
            <ul class="pagination">
                <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                    <button class="page-link" aria-label="Pasar a la página anterior" @click="pagAnterior"
                        :disabled="paginaActual === 1">
                        <span>&laquo;</span>
                    </button>
                </li>

                <li v-for="pagina in totalPaginas" :key="pagina" class="page-item"
                    :class="{ active: pagina === paginaActual }">
                    <button class="page-link" @click="setPagina(pagina)">{{ pagina }}</button>
                </li>

                <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                    <button class="page-link" aria-label="Pasar a la página siguiente" @click="pagSiguiente"
                        :disabled="paginaActual === totalPaginas">
                        <span>&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>

        <div class="mt-2">
            <select v-model="usuariosPorPagina" class="form-select form-select-sm" style="width: auto;">
                <option :value="5">5 por página</option>
                <option :value="10">10 por página</option>
                <option :value="15">15 por página</option>
            </select>
        </div>
    </div>

    <!--MODAL DE CONFIRMACIÓN-->
    <div class="text-success bg-color-success text-black">
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="infoModalLabel">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Confirmación</h5>
                        <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ exitoActualizacion }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--MODAL DE BORRADO DE UN USUARIO-->

    <div class="modal fade" id="modalBorrarUsuario" tabindex="-1" aria-labelledby="exampleModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Borrar usuario</h5>
                    <button type="button" @click.prevent="cerrarModalBorrado" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Vas a borrar el usuario ¿Estás seguro?
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="cerrarModalBorrado" class="btn"
                        data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" @click.prevent="borrarUsuario" class="btn btnBorrado">
                        Borrar usuario</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
h2,
th {
    color: rgb(22, 11, 11);
}

th {
    text-transform: uppercase;
}

table {
    max-width: 80%;
    overflow-y: scroll;
    overflow-x: scroll;
    border: 2px solid var(--amarillo);
}
</style>