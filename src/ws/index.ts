import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { registerUser } from '../app/registerUser';
import { ROOMS, USERS, SHIPS, CLIENTS } from '../data/data';
import { IClients, IExtendedWebSocket, IShip } from '../interface/interface';
import { updateRooms } from '../app/updateRooms';
import { updateViewRooms } from '../app/updateViewRooms';
import { createNewRoom } from '../app/createRoom';
import { updateWinners } from '../app/updateWinners';

const wsServer = new WebSocketServer({ port: 3000 });

function startServerWebSocket() {
  wsServer.on('connection', (ws) => {
    const userId = randomUUID();
    console.log('New connected', userId);

    const socket: IExtendedWebSocket = ws as IExtendedWebSocket;
    socket.id = userId;
    const clientObj: IClients = { client: [socket] };
    CLIENTS.push(clientObj);

    ws.on('message', (message) => {
      const request = JSON.parse(String(message));

      switch (request.type) {
        case 'reg':
          registerUser(message, ws, userId);

          CLIENTS.forEach((clientObj) => {
            clientObj.client.forEach((client) => {
              client.send(updateWinners());
            });
          });

          CLIENTS.forEach((clientObj) => {
            clientObj.client.forEach((client) => {
              client.send(updateRooms());
            });
          });
          break;

        case 'create_room':
          createNewRoom(socket);
          updateViewRooms();
          break;

        case 'add_user_to_room':
          const roomInfo = JSON.parse(String(request.data));
          console.log(roomInfo);
          const roomId = roomInfo.indexRoom;
          console.log(roomId);
          const room = ROOMS.find((item) => item.roomId === roomId);
          room?.roomUsers.push({
            name: USERS[0].name,
            index: USERS[0].index,
          });

          CLIENTS.forEach((clientObj) => {
            clientObj.client.forEach((client) => {
              client.send(updateRooms());
            });
          });
          const addUserToRoom = JSON.stringify({
            type: 'create_game',
            data: JSON.stringify({
              idGame: roomId,
              idPlayer: userId,
            }),
            id: 0,
          });
          ws.send(addUserToRoom);
          break;

        case 'add_ships':
          const shipsInfo = JSON.parse(String(request.data));
          shipsInfo.ships.forEach((item: IShip) => {
            SHIPS.push(item);
          });

          const startGame = JSON.stringify({
            type: 'start_game',
            data: JSON.stringify({
              ships: SHIPS,
              currentPlayerIndex: shipsInfo.indexPlayer,
            }),
            id: 0,
          });

          ws.send(startGame);

          const turnUser = JSON.stringify({
            type: 'turn',
            data: JSON.stringify({
              currentPlayer: USERS[0].index,
            }),
            id: 0,
          });

          ws.send(turnUser);
          break;

        case 'attack':
          console.log('Fire');
          break;
        default:
          console.log('Sorry');
      }
    });

    ws.on('close', () => {
      const index = CLIENTS.findIndex((clientObj) =>
        clientObj.client.includes(socket)
      );
      if (index !== -1) {
        CLIENTS.splice(index, 1);
      }
      console.log(`User ${socket.id} exited`);

      const userIndex = USERS.findIndex((user) => user.index === userId);
      if (userIndex !== -1) {
        USERS[userIndex].index = null;
      }

      const roomIndexesToDelete: number[] = [];
      ROOMS.forEach((room, index) => {
        if (room.roomUsers.some((user) => user.index === userId)) {
          roomIndexesToDelete.push(index);
        }
      });

      roomIndexesToDelete.reverse().forEach((index) => {
        ROOMS.splice(index, 1);
      });

      CLIENTS.forEach((clientObj) => {
        clientObj.client.forEach((client) => {
          client.send(updateRooms());
        });
      });
    });
  });
}

export { startServerWebSocket };
