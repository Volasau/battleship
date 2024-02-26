import { httpServer } from './src/http_server/index';
import { startServerWebSocket } from './src/ws/index';

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
startServerWebSocket();
console.log(`Websocket server was started at 3000 port!\n`);

process.on('SIGINT', () => {
  console.log('\nClosing  servers...');
  httpServer.close(() => {
    process.exit();
  });
});
