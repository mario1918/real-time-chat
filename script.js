let username = document.getElementById("username");
let messageArea = document.getElementById("message-area");
let message = document.getElementById("message");
let sendButton = document.getElementById("button-send");
let numberOfUsers = document.getElementById("usersCount");

// Function to generate a random hex color
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const randomColor = getRandomColor();

sendButton.addEventListener('click', sendMessage);
message.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

function autoScroll() {
    messageArea.scrollTop = messageArea.scrollHeight;
}

/* ----------------------- Message sending logic ----------------------- */

const socket = io();

function sendMessage(e) {

    if (message.value && username.value) {
        socket.emit('username', username.value);
        socket.emit('chat message', message.value);
        socket.emit('name color', randomColor);
        message.value = '';
    } else {
        alert(`Please enter a name and a message!`);
    }
}

socket.on('username', (user) => {
    const recMessage = document.createElement("p");
    recMessage.classList.add("user-text");
    recMessage.style.color = randomColor;
    recMessage.textContent = `${user} [${new Date().toLocaleTimeString()}]`;
    messageArea.appendChild(recMessage);
});


socket.on('chat message', (msg) => {
    const recMessage = document.createElement("p");
    recMessage.classList.add("messgae-text");
    recMessage.textContent = msg;
    messageArea.appendChild(recMessage);

    //Auto scroll to the bottom
    autoScroll();
});

// Listen for user count updates
socket.on('usersCount', (count) => {
    numberOfUsers.textContent = `Connected Users: ${count}`;
});



