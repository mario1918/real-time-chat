const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 4000;

let noOfUsers = 0;

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//Listens for a connection from a client
io.on('connection', (socket) => {
    console.log("A user has been connected");
    noOfUsers++;
    socket.emit('usersCount', noOfUsers);

    //Listens for the username
    socket.on('username', (user) => {
        io.emit('username', user);
    });

    //Listens for a message and then broadcast it to all users
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('name color', (color) => {
        io.emit('name color', color);
    });

    //Handle disconnection
    socket.on('disconnect', () => {
        console.log("User disconnected");
        noOfUsers--;
        io.emit('usersCount', noOfUsers);
    });

});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
  });

