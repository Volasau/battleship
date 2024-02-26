import { randomUUID } from 'crypto';
import { ROOMS, USERS } from '../data/data';
import { IExtendedWebSocket, IRoom } from '../interface/interface';

export function createNewRoom(socket: IExtendedWebSocket) {
  USERS.forEach((user) => {
    if (user.index === socket.id) {
      const newRoom: IRoom = {
        roomId: randomUUID(),
        roomUsers: [{ name: user.name, index: user.index }],
      };
      ROOMS.push(newRoom);
    }
  });
}
