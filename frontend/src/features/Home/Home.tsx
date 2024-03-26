import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector} from '../../app/hooks.ts';
import {selectUser} from '../users/usersSlice.ts';
import {useNavigate} from 'react-router-dom';
import {DecodedMessage, Message, OnlineUser} from '../../types';
import {Box, Button, List, ListItem, ListItemText, Paper, TextField, Typography} from '@mui/material';
import dayjs from 'dayjs';

const Home = () => {
  const user = useAppSelector(selectUser);
  const navigate = useNavigate();
  const ws = useRef<WebSocket | null>(null);

  const [formData, setFormData] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) {
      ws.current?.send(JSON.stringify({
        type: 'LOGOUT',
      }));
      navigate('/login');
    }

    ws.current = new WebSocket('ws://localhost:8000/chat');

    if (!ws.current) return;

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({
        type: 'LOGIN',
        payload: user?.token,
      }));
    };

    ws.current.onmessage = (event) => {
      const decodedMessage = JSON.parse(event.data) as DecodedMessage;

      if (decodedMessage.type === 'LOGIN-SUCCESS') {
        setMessages(decodedMessage.payload.messages);
        setOnlineUsers(decodedMessage.payload.onlineUsers);
      }

      if (decodedMessage.type === 'NEW-USER') {
        setOnlineUsers(prevState => [...prevState, decodedMessage.payload.user]);
      }

      if (decodedMessage.type === 'USER-LOGOUT') {
        setOnlineUsers(decodedMessage.payload.onlineUsers);
      }

      if (decodedMessage.type === 'NEW-MESSAGE') {
        setMessages(prevState => [...prevState, decodedMessage.payload.message]);
      }
    };

  }, [user]);

  const sendMSG = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ws.current) return;

    ws.current?.send(JSON.stringify({
      type: 'SEND-MESSAGE',
      payload: formData,
    }));
  }

  return (
    <Box sx={{display: 'flex', height: '100vh', p: 2}}>
      <Box sx={{width: '30%', borderRight: '1px solid #e0e0e0'}}>
        <Typography variant="h5" sx={{mb: 2}}>
          Online users
        </Typography>
        <List>
          {onlineUsers.map((user) => (
            <ListItem key={user._id}>
              <ListItemText primary={user.displayName}/>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box sx={{width: '70%', px: 3}}>
        <Paper sx={{height: '80%', overflow: 'auto', mb: 2}}>
          {messages.map((msg) => (
            <Paper
              key={msg._id}
              elevation={3}
              sx={{my: 1, p: 2}}
            >
              <Typography variant="body2" color="text.secondary">
                Date: {dayjs(msg.date).format('MMMM D, YYYY')}
              </Typography>
              <Typography variant="h6">{msg.user.displayName}</Typography>
              <Typography>{msg.text}</Typography>
            </Paper>
          ))}
        </Paper>
        <Box
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          onSubmit={sendMSG}
        >
          <TextField
            fullWidth
            size="small"
            label="Enter message"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
            variant="outlined"
            sx={{mr: 1}}
          />
          <Button variant="contained" color="primary" type="submit">
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
