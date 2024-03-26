import express from 'express';
import cors from 'cors';
import userRouter from './routers/users';
import mongoose from 'mongoose';
import config from './config';
import expressWs from 'express-ws';
import User from './models/User';
import {ActiveConnections, IncomingMessage, OnlineUser} from './types';
import Message from './models/Message';
import crypto from 'crypto';

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/users', userRouter);

expressWs(app);

const router = express.Router();

const activeConnections: ActiveConnections = {};

const onlineUsers: OnlineUser[] = [];

router.ws('/chat', (ws, _req, _next) => {
  const id = crypto.randomUUID();
  activeConnections[id] = ws;

  let user: OnlineUser | null = null;

  ws.on('message', async (msg) => {
    const decodedMessage = JSON.parse(msg.toString()) as IncomingMessage;

    if (decodedMessage.type === 'LOGIN') {
      const userData = await User.findOne({token: decodedMessage.payload}, '_id displayName');

      if (!userData) return;

      user = userData;
      onlineUsers.push(user);

      const messages = await Message.find().sort({date: -1}).limit(30).populate('user', 'displayName');

      ws.send(JSON.stringify({
        type: 'LOGIN-SUCCESS',
        payload: {onlineUsers, messages}
      }));

      Object.keys(activeConnections).forEach(key => {
        if (key !== id) {
          const connection = activeConnections[key];
          connection.send(JSON.stringify({
            type: 'NEW-USER',
            payload: {user},
          }));
        }
      });
    }

    if (decodedMessage.type === 'LOGOUT') {
      delete activeConnections[id];
      const ind = onlineUsers.findIndex(item => item._id === user?._id);
      onlineUsers.splice(ind, 1);
      Object.keys(activeConnections).forEach(key => {
        const connection = activeConnections[key];
        connection.send(JSON.stringify({
          type: 'USER-LOGOUT',
          payload: {onlineUsers},
        }));
      });
    }

    if (decodedMessage.type === 'SEND-MESSAGE') {
      if (user) {
        const msg = new Message({
          user: user._id,
          text: decodedMessage.payload,
          date: new Date(),
        });

        await msg.save();

        Object.keys(activeConnections).forEach(key => {
          const connection = activeConnections[key];
          connection.send(JSON.stringify({
            type: 'NEW-MESSAGE',
            payload: {
              message: {
                _id: msg._id,
                user: user,
                text: msg.text,
                date: msg.date,
              }
            },
          }));
        });
      }
    }
  });

  ws.on('close', async () => {
    delete activeConnections[id];
    const ind = onlineUsers.findIndex(item => item._id === user?._id);
    onlineUsers.splice(ind, 1);
    Object.keys(activeConnections).forEach(key => {
      const connection = activeConnections[key];
      connection.send(JSON.stringify({
        type: 'USER-LOGOUT',
        payload: {onlineUsers},
      }));
    });
  })
});

app.use(router);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`On ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();


