import express from 'express';
import {WebSocket} from 'ws';
import {IncomingMessage} from '../types';
import authenticateUser from '../utils/authenticateUser';
import sendLastMessages from '../utils/ sendLastMessages';
import Chat from '../models/Chat';
import {activeConnections} from '../utils/activeConnections';
import getActiveUsers from '../utils/getActiveUsers';
import expressWs from 'express-ws';

const chatRouter = express.Router();
const app = express();

expressWs(app);

chatRouter.ws('/messages', (ws: WebSocket) => {
  const id = require('crypto').randomUUID();
  console.log('Client connected! ID=', id);

  ws.on('message', async (msg) => {
    const decodedMessage: IncomingMessage = JSON.parse(msg.toString());

    switch (decodedMessage.type) {
      case 'LOGIN':
        const user = await authenticateUser(decodedMessage.payload);
        if (user) {
          activeConnections[id] = {ws, username: user.username};
          await sendLastMessages(ws);
          getActiveUsers();
          console.log(`User authenticated: ${user.username}`);
        } else {
          ws.close();
        }
        break;
      case 'SEND_MESSAGE':
        if (!activeConnections[id]) {
          ws.close();
          return;
        }
        const message = new Chat({
          username: activeConnections[id].username,
          message: decodedMessage.payload,
        });
        await message.save();
        await sendLastMessages(ws);
        break;
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected! ID=', id);
    delete activeConnections[id];
    getActiveUsers();
  });
});

export default chatRouter;
