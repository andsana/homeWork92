import Chat from '../models/Chat';
import WebSocket from 'ws';

async function sendLastMessages(ws: WebSocket) {
  try {
    const lastMessages = await Chat.find().sort({ createdAt: -1 }).limit(30);
    ws.send(JSON.stringify({
      type: 'LAST_MESSAGES',
      payload: lastMessages.reverse()
    }));
  } catch (error) {
    console.error('Error sending latest messages:', error);
  }
}

export default sendLastMessages;