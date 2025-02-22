<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

//const session = ref(JSON.parse(localStorage.getItem('session')));

const usuariosBD = ref(); //Para almacenar los usuarios de la petición
const error = ref('');
const exitoActualizacion = ref('');
//DEfinición del modal 
let modalConfirmacion = null;
onMounted(() => {
    modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
});


function obtenerUsuariosBD() {
    try {
        //fetch('http://localhost/api/api.php/usuarios', {
        fetch('api/api.php/usuarios', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                usuariosBD.value = data;
                //console.log("Data: " + JSON.stringify(data));
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

function actualizarRol(id, nuevoRol) {
    console.log(id + "---" + nuevoRol);

    try {
        //fetch('http://localhost/api/api.php/usuarios?id=' + id, {
        fetch('api/api.php/usuarios?id=' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rol: nuevoRol })
        })
            .then(response => response.json())
            .then(data => {
                console.log("UPDATE:");
                console.log(data);
                exitoActualizacion.value = data.message;
                modalConfirmacion.show();
                error.value = '';

            })
            .catch(errMsg => {
                error.value = `Error al actualizar rol usuario: (${errMsg})`;
            }
            );
    } catch (err) {
        error.value = 'Error al obtener datos';
    }
}

function borrarUsuario(id) {
    try {
        //fetch('http://localhost/api/api.php/usuarios?id=' + id, {
        fetch('api/api.php/usuarios?id=' + id, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log("DELETE:");
                console.log(data);
                exitoActualizacion.value = data.message;
                error.value = '';

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
    }
}

//Llamada principal para obtener los datos de la tabla la primera vez que entramos
obtenerUsuariosBD();
</script>

<template>
    <h2 class="text-center mb-5">Usuarios Registrados</h2>
    <!--Meter aquí un modal de confirmación del guardado/borrado y hacer 
        que el mensaje de confirmación desaparezca al poco tiempo??-->
    <div v-if="exitoActualizacion != ''" class="text-success bg-color-success text-black">
        <!--MODAL-->
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="infoModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Confirmación</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p>{{ exitoActualizacion }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div v-if="error">{{ error }}</div>
    <div v-else id="divTabla" class="m-3 d-flex justify-content-center">
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
                <tr v-for="usuario in usuariosBD" :key="usuario.id">
                    <td>{{ usuario.id }}</td>
                    <td>{{ usuario.nombre }}</td>
                    <td>{{ usuario.email }}</td>
                    <td>{{ usuario.contraseña }}</td>
                    <td>
                        <select v-model="usuario.rol" @change="actualizarRol(usuario.id, usuario.rol)">
                            <option value="admin">Admin</option>
                            <option value="guia">Guía</option>
                            <option value="cliente">Cliente</option>
                        </select>
                    </td>
                    <td>
                        <!--<button title="Guardar cambios" type="button" class="btn btn-primary"
                            @click.prevent="actualizarRol">
                            <i class="fa-solid fa-check"></i>
                        </button>-->
                        <button aria-label="Botón para borrar al usuario" title="Borrar usuario" type="button"
                            class="btn btn-danger btnBorrado" @click="borrarUsuario(usuario.id)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
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
    border: 2px solid rgb(236, 166, 177);
}

/*tr{
    border:white;
}*/

.btnBorrado {
    color: white;
    background-color: #DC4C64;
    border: 1px solid #DC4C64;
}

.btnBorrado:hover {
    background-color: white;
    color: #DC4C64;
    border: 1px solid #DC4C64;
}
</style>