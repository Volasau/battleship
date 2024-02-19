import { WebSocketServer } from 'ws';
import { randomUUID } from 'crypto';
import { USERS } from '../data/user';
import { IUser } from '../interface/user.interface';

const wsServer = new WebSocketServer({ port: 3000 });

wsServer.on('connection', (ws) => {
  ws.on('message', (message) => {
    const userId = randomUUID();
    console.log('New connected', userId);
    const messageString = message.toString('utf-8');
    const jsonObject = JSON.parse(messageString);
    const type = jsonObject.type;
    const { data } = jsonObject;
    const userName = JSON.parse(data).name;
    const password = JSON.parse(data).password;

    const newUser: IUser = {
      id: userId,
      name: userName,
      password: password,
    };

    USERS.push(newUser);
    console.log(USERS);

    switch (type) {
      case 'reg':
        const outUserData = {
          name: userName,
          index: 1,
          error: false,
          errorText: 'errorText',
        };

        const outUserJson = JSON.stringify(outUserData);
        const outMassageData = { ...jsonObject, data: outUserJson };
        const outMassageDataJSON = JSON.stringify(outMassageData);
        ws.send(outMassageDataJSON);
        break;

      default:
        console.log('Test');
    }

    console.log(jsonObject);
  });
});
