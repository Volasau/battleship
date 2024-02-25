import { CLIENTS } from '../data/data';
import { updateRooms } from './updateRooms';

export function updateViewRooms() {
  CLIENTS.forEach((clientObj) => {
    clientObj.client.forEach((client) => {
      client.send(updateRooms());
    });
  });
}
