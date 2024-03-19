import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

interface Props {
  users: string[];
}

const UsersList: React.FC<Props> = ({ users }) => {
  return (
    <Box>
      <Typography variant='h6'>Online users</Typography>
      <List>
        <List>
          {users.map((user, index) => (
            <ListItem key={index}>
              <Typography variant='body1'>
                {user}
              </Typography>
            </ListItem>
          ))}
        </List>
      </List>
    </Box>
  );
};

export default UsersList;

