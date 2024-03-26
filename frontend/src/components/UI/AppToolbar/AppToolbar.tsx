import {NavLink} from 'react-router-dom';
import {AppBar, Grid, styled, Toolbar, Typography} from '@mui/material';
import {useAppSelector} from '../../../app/hooks.ts';
import UserMenu from './UserMenu.tsx';
import AnonymousMenu from './AnonymousMenu.tsx';
import { selectUser } from '../../../features/users/usersSlice.ts';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const user = useAppSelector(selectUser);

  return (
    <AppBar position="sticky" sx={{ mb: 2 }}>
      <Toolbar>
        <Grid container justifyContent="space-betweem" alignItems="center">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">Chat</Link>
          </Typography>
          {user ? <UserMenu user={user} /> : <AnonymousMenu />}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
