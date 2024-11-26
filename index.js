const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: path.join(__dirname),
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.static(path.join(__dirname, 'build')));

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });


    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id] );
        delete users[socket.id];    
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
