var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(4000, function(){
    console.log('Servidor corriendo en http://localhost:4000');
});

app.use(express.static('public'));

// ⬇️ MODIFICACIÓN CRÍTICA: INCLUIR CORS PARA PERMITIR LA CONEXIÓN DESDE FIREBASE ⬇️
var io = socket(server, {
    cors: {
        // Tu dominio de Firebase
        origin: "https://chat-alexis-703.web.app", 
        methods: ["GET", "POST"]
    }
});
// ⬆️ FIN DE LA MODIFICACIÓN ⬆️

io.on('connection', function(socket){
    console.log('Hay una conexion', socket.id);

    socket.on('chat', function(data){
        console.log(data);
        io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});