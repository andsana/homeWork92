import {WebSocket} from 'ws';
import {Model} from 'mongoose';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
}

export interface UserFields {
  _id: string;
  username: string;
  password: string;
  displayName: string;
  token: string;
  role: string;
  active: boolean;
}

type UserModel = Model<UserFields, unknown, UserMethods>;

interface ChatMutation {
    username: string;
    message: string;
}


