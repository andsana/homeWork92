import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import {ActiveConnections, IncomingMessage} from './types';
import WebSocket from 'ws';
import User from './models/User';
import Chat from './models/Chat';
import userRouter from './routers/users';
import chatRouter from './routers/chat';

const app = express();
expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/chat', chatRouter);

const activeConnections: ActiveConnections = {};
const wsRouter = express.Router();

wsRouter.ws('/ws', (ws, req) => {
  ws.on('message', async (msg) => {
    const message: IncomingMessage = JSON.parse(msg.toString());

    switch (message.type) {
      case 'LOGIN':
        try {
          const user = await User.findOne({token: message.payload});
          if (!user) {
            ws.send(JSON.stringify({type: 'ERROR', payload: 'Authentication failed'}));
            return ws.close();
          }
          const id = user.username;
          activeConnections[id] = ws;
          ws.send(JSON.stringify({type: 'LOGGED_IN', payload: id}));
          break;
        } catch (error) {
          ws.send(JSON.stringify({type: 'ERROR', payload: 'Internal server error'}));
        }
        break;
      case 'SEND_MESSAGE':
        const newMessage = new Chat({username: message.username, message: message.payload});
        await newMessage.save();

        Object.values(activeConnections).forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'NEW_MESSAGE',
              payload: {username: message.username, text: message.payload}
            }));
          }
        });
        break;
    }
  });

  ws.on('close', () => {
    Object.keys(activeConnections).forEach(key => {
      if (activeConnections[key] === ws) {
        delete activeConnections[key];
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server started on ${port} port!`);
});


