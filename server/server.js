const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomcolor = require('randomcolor');

const app = express();
const staticPath = `${__dirname}/../client`;


app.use(express.static(staticPath));

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (sock) => {
	const color = randomcolor();
	sock.emit('message', 'You are connected');
	sock.on('message', text => io.emit('message', text));
	sock.on('turn', ({ x, y }) => io.emit('turn', { x, y, color }));
});

server.on('error', (err) => {
	console.error(err);
});

server.listen(8080, () => {
	console.log('Server is ready');
});


