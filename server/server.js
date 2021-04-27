const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomcolor = require('randomcolor');
const createBoard = require('./create-board');

const app = express();
const staticPath = `${__dirname}/../client`;


app.use(express.static(staticPath));

const server = http.createServer(app);
const io = socketio(server);
const { clear, getBoard, makeTurn } = createBoard(20);

io.on('connection', (sock) => {
	const color = randomcolor();
	sock.emit('board', getBoard());

	sock.on('message', text => io.emit('message', text));
	sock.on('turn', ({ x, y }) => {
		makeTurn(x, y, color);
		io.emit('turn', { x, y, color });
	});
});

server.on('error', (err) => {
	console.error(err);
});

server.listen(8080, () => {
	console.log('Server is ready');
});


