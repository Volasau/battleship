import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { registerUser } from '../app/registerUser';
import { ROOMS, USERS } from '../data/data';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (ws) => {
  const userId = randomUUID();
  console.log('New connected', userId);

  ws.on('message', (message) => {
    const request = JSON.parse(String(message));
    console.log(request);

    switch (request.type) {
      case 'reg':
        registerUser(message, ws, userId);
        ws.send(
          JSON.stringify({
            type: 'update_winners',
            data: JSON.stringify([]),
            id: 0,
          })
        );
        ws.send(
          JSON.stringify({
            type: 'update_room',
            data: JSON.stringify(ROOMS),
            id: 0,
          })
        );

        break;

      case 'create_room':
        console.log('room');
        ROOMS.push({
          roomId: randomUUID(),
          roomUsers: [
            {
              name: USERS[0].name,
              index: USERS[0].index,
            },
          ],
        });

        const updateRoom = JSON.stringify({
          type: 'update_room',
          data: JSON.stringify(ROOMS),
          id: 0,
        });

        ws.send(updateRoom);
        break;

      case 'add_user_to_room':
        const roomInfo = JSON.parse(String(request.data));
        console.log(roomInfo);
        const roomId = roomInfo.indexRoom;
        console.log(roomId);
        const room = ROOMS.find((item) => item.roomId === roomId);
        room?.roomUsers.push({ name: USERS[1].name, index: USERS[1].index });

        const updateUserInRoom = JSON.stringify({
          type: 'update_room',
          data: JSON.stringify([
            {
              roomId: roomId,
              roomUsers: room?.roomUsers,
            },
          ]),
          id: 0,
        });
        ws.send(updateUserInRoom);

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
      default:
        console.log('Test');
    }

    // console.log(jsonObject);
  });
});
