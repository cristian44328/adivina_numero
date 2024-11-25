const socket = io();

// DOM ELEMENTOS
let message = document.getElementById('message');
let username = document.getElementById('usuario');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');
let hint = document.getElementById('hint'); 
let winner = document.getElementById('winner');

// Enviar mensaje o intento
btn.addEventListener('click', function () {
    const userMessage = message.value;

    // Si es un número, se considera intento de adivinar
    if (!isNaN(userMessage) && userMessage.trim() !== '') {
        socket.emit('game:guess', {
            username: username.value,
            guess: parseInt(userMessage) // Convertimos el mensaje a un número
        });
    } else {
        // Si no es un número, se envía como mensaje normal
        socket.emit('chat:message', {
            username: username.value,
            message: userMessage
        });
    }

    message.value = ''; // Limpiar el campo de entrada
});

// Mostrar quién está escribiendo
message.addEventListener('keypress', function () {
    socket.emit('chat:typing', username.value);
});

// Recibir mensajes del chat
socket.on('chat:message', function (data) {
    actions.innerHTML = '';
    output.innerHTML += `<p>
      <strong>${data.username}</strong>: ${data.message}
    </p>`;
});

// Mostrar "alguien está escribiendo"
socket.on('chat:typing', function (data) {
    actions.innerHTML = `<p><em>${data} está escribiendo un mensaje...</em></p>`;
});

// Mostrar pistas del juego
socket.on('game:hint', function (data) {
    hint.innerHTML = `<strong>Pista:</strong> ${data.hint}`;
});

// Mostrar ganador
socket.on('game:winner', function (data) {
    winner.innerHTML = `<strong>${data.username}</strong> ha ganado el juego al adivinar el número correctamente!`;
    hint.innerHTML = ''; // Limpiar pistas
});
