import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Chat from './pages/Chats';
import Terminos from './pages/Terminos';
import Privacidad from './pages/Privacidad';
import Cookies from './pages/Cookies';
import Dashboard from './pages/Dashboard';
import Layout from './components/layout/Layout';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="terminos" element={<Terminos />} />
          <Route path="privacidad" element={<Privacidad />} />
          <Route path="cookies" element={<Cookies />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;