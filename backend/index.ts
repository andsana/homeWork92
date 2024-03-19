import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import userRouter from "./routers/users";
import chatRouter from "./routers/chat";
import mongoose from "mongoose";
import config from "./config";

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use('/messages', chatRouter);
app.use('/users', userRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();







// const app = express();
// expressWs(app);
//
// const port = 8000;
// app.use(cors());
// const router = express.Router();
//
// const activeConnections: ActiveConnections = {};

// router.ws('/chat', (ws, req) => {
//   const id = crypto.randomUUID();
//   console.log('client connected! id=', id);
//   activeConnections[id] = ws;
//
//   let username = 'Anonymous'; // Переменная для хранения имени пользователя
//
//   ws.on('message', (msg) => {
//     const decodedMessage: IncomingMessage = JSON.parse(msg.toString());
//
//     switch (decodedMessage.type) {
//       case 'SET_USERNAME':
//         username = decodedMessage.payload;
//         break;
//       case 'SEND_MESSAGE':
//         // Рассылка сообщения всем пользователям
//         Object.keys(activeConnections).forEach(connId => {
//           const conn = activeConnections[connId];
//           conn.send(JSON.stringify({
//             type: 'NEW_MESSAGE',
//             payload: {
//               username,
//               text: decodedMessage.payload
//             }
//           }));
//         });
//         break;
//       default:
//         console.log('Unknown message type:', decodedMessage.type);
//     }
//   });
//
//   ws.on('close', () => {
//     console.log('client disconnected! id=', id);
//     delete activeConnections[id];
//   });
// });





