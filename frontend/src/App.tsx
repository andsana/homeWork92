import { Container, CssBaseline } from '@mui/material';
import AppToolbar from './components/UI/AppToolbar/AppToolbar';
import { Route, Routes } from 'react-router-dom';
import Register from '../features/users/Register.tsx';
import Login from '../features/users/Login.tsx';
import Page from './components/UI/Page.tsx';

function App() {

  return (
      <>
        <CssBaseline />
        <header>
          <AppToolbar />
        </header>
        <main>
          <Container maxWidth="xl">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/messages" element={<Page />} />
              <Route path="*" element={<h1>Not found</h1>} />
            </Routes>
          </Container>
        </main>
      </>
  );
}
export default App;