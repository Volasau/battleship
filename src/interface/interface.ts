import WebSocket from 'ws';

export interface IUser {
  name: string;
  password: string;
  wins: number;
  index: string;
}

export interface IRoomUser {
  name: string;
  index: string;
}

export interface IRoom {
  roomId: string;
  roomUsers: IRoomUser[];
}

export interface IWinner {
  name: string;
  wins: number;
}

export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: string;
}

export interface IExtendedWebSocket extends WebSocket {
  id: string;
}

export interface IClients {
  client: IExtendedWebSocket[];
}
