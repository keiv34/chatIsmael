// Conexión al servidor de Socket.IO
var socket = io.connect('http://localhost:4000');

// Elementos del DOM
var persona = document.getElementById('persona'),
    ingresar = document.getElementById('ingresar'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    appChat = document.getElementById('app-chat'),
    mensaje = document.getElementById('mensaje'),
    formMensaje = document.getElementById('form-mensaje'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output'),
    sonidoNotificacion = document.getElementById('sonido-notificacion'); 

// Evento para el botón de "Ingresar al chat"
ingresar.addEventListener('click', function() {
    if (persona.value.trim() !== "") {
        panelBienvenida.style.display = "none";
        appChat.style.display = "flex"; // Usar flex para que coincida con el CSS

        Swal.fire({
            title: `¡Hola, ${persona.value}!`,
            text: 'Has ingresado al chat. ¡Comienza a conversar!',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, ingresa un nombre para continuar.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
});

// Evento para el envío del formulario de mensaje
formMensaje.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir que la página se recargue
    if (mensaje.value.trim() !== "") {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: persona.value
        });
        mensaje.value = "";
    }
});

// Evento para detectar que el usuario está escribiendo
mensaje.addEventListener('keypress', function() {
    socket.emit('typing', {
        nombre: persona.value,
        texto: mensaje.value
    });
});

// Recibir mensajes del servidor
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = "";
    const ventanaMensajes = document.getElementById('ventana-mensajes');

    const nuevoMensaje = document.createElement('div');
    nuevoMensaje.classList.add('message');
    
    // Distinguir entre mensaje enviado y recibido
    if (data.usuario === persona.value) {
        nuevoMensaje.classList.add('sent');
    } else {
        nuevoMensaje.classList.add('received');
        sonidoNotificacion.play().catch(error => {
            console.log("La reproducción automática fue bloqueada por el navegador.", error);
        });
    }
    
    // Añadir el contenido del mensaje (con nombre en ambos casos)
    nuevoMensaje.innerHTML = `<p><strong>${data.usuario}</strong>${data.mensaje}</p>`;
    output.appendChild(nuevoMensaje);

    // Hacer scroll automático hacia el último mensaje
    ventanaMensajes.scrollTop = ventanaMensajes.scrollHeight;
});

// Recibir notificación de que alguien está escribiendo
socket.on('typing', function(data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = `
            <em>${data.nombre} está escribiendo 
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </em>`;
    } else {
        escribiendoMensaje.innerHTML = "";
    }
});