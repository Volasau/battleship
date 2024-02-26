import { USERS } from '../data/data';
import { IUser } from '../interface/interface';
import WebSocket, { RawData } from 'ws';

export function registerUser(message: RawData, ws: WebSocket, userId: string) {
  const messageString = message.toString('utf-8');
  const jsonObject = JSON.parse(messageString);
  const { data } = jsonObject;
  const userName = JSON.parse(data).name;
  const password = JSON.parse(data).password;

  const existingUser = USERS.find((user) => user.name === userName);

  if (existingUser) {
    if (existingUser.password !== password) {
      const outUserData = {
        name: userName,
        index: userId,
        error: true,
        errorText: 'Invalid password',
      };

      const outUserJson = JSON.stringify(outUserData);
      const outMassageData = { ...jsonObject, data: outUserJson };
      const outMassageDataJSON = JSON.stringify(outMassageData);
      ws.send(outMassageDataJSON);
      return;
    }

    if (existingUser.index === null) {
      existingUser.index = userId;
      console.log(`New index ${userId} for user ${userName}.`);
    } else {
      const outUserData = {
        name: userName,
        index: userId,
        error: true,
        errorText: 'User active now',
      };

      const outUserJson = JSON.stringify(outUserData);
      const outMassageData = { ...jsonObject, data: outUserJson };
      const outMassageDataJSON = JSON.stringify(outMassageData);
      ws.send(outMassageDataJSON);
      return;
    }
  } else {
    const newUser: IUser = {
      name: userName,
      index: userId,
      wins: 0,
      password: password,
    };

    USERS.push(newUser);
  }

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
