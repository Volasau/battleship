import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { registerUser } from '../app/registerUser';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (ws) => {
  const userId = randomUUID();
  console.log('New connected', userId);

  ws.on('message', (message) => {
    const request = JSON.parse(String(message));
    console.log(request);

    switch (request.type) {
      case 'reg':
        registerUser(message, ws);

        break;

      case 'create_room':
        console.log('room');

        const updateRoom = JSON.stringify({
          type: 'update_room',
          data: JSON.stringify([
            {
              roomId: randomUUID(),
              roomUsers: [
                {
                  name: 'ryhor',
                  index: 1,
                },
              ],
            },
          ]),
          id: 0,
        });

        ws.send(updateRoom);
        break;

      case 'add_user_to_room':
        const addUserToRoom = JSON.stringify({
          type: 'create_game',
          data: JSON.stringify({
            idGame: randomUUID(),
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
