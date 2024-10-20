import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import AllTickets from './pages/AllTickets';
import TicketSubmit from './pages/IssueSubmissionForm/IssueSubmissionForm';
import TicketInfo from './pages/TicketInfo/TicketInfo';
import NavBarLayout from './components/NavBarLayout/NavBarLayout'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<NavBarLayout/>}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alltickets" element={<AllTickets />} />
        <Route path="/ticketinfo" element={<TicketInfo />} />
        <Route path="/ticketsubmit" element={<TicketSubmit />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
