const path = require('path');
const express = require('express');
const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

// Websockets
const SocketIO = require('socket.io');
const io = SocketIO(server);

// Lógica del juego
let randomNumber = Math.floor(Math.random() * 100) + 1; // Número aleatorio entre 1 y 100
console.log('Número objetivo:', randomNumber); // Solo para depuración en el servidor

io.on('connection', (socket) => {
    console.log('New connection', socket.id);

    // Chat
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    });

    // Juego: Adivina el Número
    socket.on('game:guess', (data) => {
        const guess = data.guess;
        const username = data.username;

        if (guess === randomNumber) {
            // Notificar al ganador
            io.sockets.emit('game:winner', { username });
            console.log(`¡${username} ganó! El número era ${randomNumber}`);

            // Reiniciar el juego
            randomNumber = Math.floor(Math.random() * 100) + 1;
            console.log('Nuevo número objetivo:', randomNumber);

        } else if (guess < randomNumber) {
            // Enviar pista: número mayor
            socket.emit('game:hint', { hint: 'El número es mayor' });
        } else {
            // Enviar pista: número menor
            socket.emit('game:hint', { hint: 'El número es menor' });
        }
    });
});
