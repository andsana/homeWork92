import {WebSocket} from 'ws';
import {Model} from 'mongoose';

export interface ActiveConnections {
    [id: string]: WebSocket;
}

export interface IncomingMessage {
    type: string;
    payload: string;
    username?: string;
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


