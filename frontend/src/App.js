import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AllTickets from './pages/AllTickets';
import AdminDash from './pages/AdminDash';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/alltickets" element={<AllTickets />} />
      <Route path="/admindash" element={<AdminDash />} />
    </Routes>
  );
}

export default App;
