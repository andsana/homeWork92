import {WebSocket} from 'ws';
import {Model} from 'mongoose';

interface ActiveUser {
  ws: WebSocket;
  username: string;
}

export interface ActiveConnections {
    [id: string]: ActiveUser;
}

export interface IncomingMessage {
    type: string;
    payload: string;
}

interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export interface UserFields {
  username: string;
  password: string;
  token: string;
  role: string;
}

type UserModel = Model<UserFields, unknown, UserMethods>;

interface ChatMutation {
    username: string;
    message: string;
}


