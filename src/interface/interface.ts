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
