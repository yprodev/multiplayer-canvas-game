const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const randomcolor = require('randomcolor');
const createBoard = require('./create-board');
const createCooldown = require('./create-cooldown');

const app = express();
const staticPath = `${__dirname}/../client`;


app.use(express.static(staticPath));

const server = http.createServer(app);
const io = socketio(server);
const { clear, getBoard, makeTurn } = createBoard(20);

io.on('connection', (sock) => {
	const color = randomcolor();
	const cooldown = createCooldown(2000);
	sock.emit('board', getBoard());

	sock.on('message', text => io.emit('message', text));
	sock.on('turn', ({ x, y }) => {
		if (cooldown()) {
			const playerWon = makeTurn(x, y, color);
			io.emit('turn', { x, y, color });

			if (playerWon) {
				sock.emit('message', 'You Won');
				io.emit('message', 'New Round');
				clear();
				io.emit('board');
			}
		}

	});
});

server.on('error', (err) => {
	console.error(err);
});

server.listen(8080, () => {
	console.log('Server is ready');
});


