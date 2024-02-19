import { randomUUID } from 'crypto';
import { USERS } from '../data/user';
import { IUser } from '../interface/user.interface';
import { RawData } from 'ws';

export function registerUser(message: RawData, ws: import('ws')) {
  const messageString = message.toString('utf-8');
  const jsonObject = JSON.parse(messageString);
  const { data } = jsonObject;
  const userName = JSON.parse(data).name;
  const password = JSON.parse(data).password;
  const userId = randomUUID();

  const existingUser = USERS.find((user) => user.name === userName);

  if (existingUser) {
    if (existingUser.password !== password) {
      const outUserData = {
        name: userName,
        index: userId,
        error: true,
        errorText: 'Invalide password',
      };

      const outUserJson = JSON.stringify(outUserData);
      const outMassageData = { ...jsonObject, data: outUserJson };
      const outMassageDataJSON = JSON.stringify(outMassageData);
      ws.send(outMassageDataJSON);
      return;
    }
  }

  const newUser: IUser = {
    id: userId,
    name: userName,
    password: password,
  };

  USERS.push(newUser);
  console.log(USERS);

  const outUserData = {
    name: userName,
    index: userId,
    error: false,
    errorText: 'errorText',
  };

  const outUserJson = JSON.stringify(outUserData);
  const outMassageData = { ...jsonObject, data: outUserJson };
  const outMassageDataJSON = JSON.stringify(outMassageData);

  ws.send(outMassageDataJSON);
}
