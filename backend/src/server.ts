import http from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { garantirTabelas } from './services/storage';

const PORT = Number(process.env.PORT || 3000);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('activity:start', (data) => {
    io.emit('timer:update', { activityId: data.activityId, elapsedSeconds: data.elapsedSeconds || 0 });
  });
});

garantirTabelas().then(() => {
  server.listen(PORT, () => console.log(`FreelanceFlow backend rodando em http://localhost:${PORT}`));
});
