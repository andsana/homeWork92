export interface ChatMessage {
  username: string;
  text: string;
}

export interface User {
  username: string;
}

export interface IncomingMessage {
  type: string;
  payload: any;
}

export interface RegisterMutation {
  username: string;
  password: string;
  displayName: string;
}

export interface LoginMutation {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  displayName: string;
  token: string;
  role: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface GlobalError {
  error: string;
}

export interface OnlineUser {
  _id: string;
  displayName: string;
}

export interface Message {
  _id: string;
  user: OnlineUser;
  text: string;
  date: string;
}

export interface DecodedMessage {
  type: string;
  payload: {
    user: OnlineUser;
    message: Message;
    onlineUsers: OnlineUser[];
    messages: Message[];
  };
}
