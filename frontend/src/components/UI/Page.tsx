import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import ChatItem from './ChatItem/ChatItem';
import UsersList from './UsersList/UsersList';
import { ChatMessage, IncomingMessage } from '../../types';
import { useAppSelector } from '../../app/hooks.ts';

function Page() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  const ws = useRef<WebSocket | null>(null);
  const userToken = useAppSelector((state) => state.users.user?.token);

  useEffect(() => {
    function connectWebSocket() {
      if (!userToken) return;

      ws.current = new WebSocket('ws://localhost:8000/messages');
      ws.current.onopen = () => {
        ws.current?.send(JSON.stringify({
          type: 'LOGIN',
          payload: userToken,
        }));
      };

      ws.current.onclose = () => {
        setTimeout(connectWebSocket, 3000);
      };

      ws.current.onmessage = event => {
        const decodedMessage = JSON.parse(event.data) as IncomingMessage;

        switch (decodedMessage.type) {
          case 'LAST_MESSAGES':
            setMessages(decodedMessage.payload);
            break;
          case 'NEW_MESSAGE':
            setMessages(prevMessages => [...prevMessages, decodedMessage.payload]);
            break;
          case 'ACTIVE_USERS':
            setActiveUsers(decodedMessage.payload);
            break;
          default:
            console.log('Неизвестный тип сообщения:', decodedMessage.type);
        }
      };
    }

    connectWebSocket();

    return () => {
      ws.current?.close();
    };
  }, [userToken]);

  const changeMessage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ws.current && messageText.trim()) {
      ws.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: messageText,
      }));
      setMessageText('');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Chat</Typography>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <UsersList users={activeUsers} />
        </Grid>
        <Grid item xs={9}>
          <Box sx={{ my: 2, height: '400px', overflowY: 'scroll' }}>
            {messages.map((msg, index) => (
              <ChatItem key={index} message={msg} />
            ))}
          </Box>
          <Box component="form" onSubmit={sendMessage}>
            <TextField
              label="Enter message"
              fullWidth
              variant="outlined"
              value={messageText}
              onChange={changeMessage}
              sx={{ mr: 1 }}
            />
            <Button type="submit" variant="contained">
              Send
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Page;
