export interface IUser {
  name: string;
  password: string;
  wins: number;
  index: string;
}

export interface IRoomUser {
  name: string;
  index: number;
}

export interface IRoom {
  roomId: number;
  roomUsers: IRoomUser[];
}

export interface IWinner {
  name: string;
  wins: number;
}
