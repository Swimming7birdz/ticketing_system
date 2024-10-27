import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import TicketSubmit from './pages/IssueSubmissionForm/IssueSubmissionForm';
import TicketInfo from './pages/TicketInfo/TicketInfo';
import AdminDash from './pages/AdminDash';
import NavBarLayout from './components/NavBarLayout/NavBarLayout'
import TicketQueue from './pages/TicketQueue';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<NavBarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ticketinfo" element={<TicketInfo />} />
        <Route path="/ticketsubmit" element={<TicketSubmit />} />
        <Route path="/admindash" element={<AdminDash />} />
        <Route path="/ticketqueue" element={<TicketQueue />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
