import React from 'react';
import { Paper, Typography } from '@mui/material';
import { ChatMessage } from '../../../types';

interface Props {
  message: ChatMessage;
}

const ChatItem: React.FC<Props> = ({message}) => {
  return (
    <Paper style={{ padding: '10px', margin: '10px 0' }}>
      <Typography variant="subtitle2">{message.username}</Typography>
      <Typography variant="body1">{message.text}</Typography>
    </Paper>
  );
};

export default ChatItem;
