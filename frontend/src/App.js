import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login/Login';
import AllTickets from './pages/AllTickets';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar';
import TicketInfo from './pages/TicketInfo/TicketInfo';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path = "*"
        element = {
          <div className='sideBarLayout'>
            <SideBar className='sideBar'/>
              <div className='topBarLayout'>
                <TopBar className='topBar'/>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/alltickets" element={<AllTickets />} />
                  <Route path="/ticketinfo" element={<TicketInfo />} />
                </Routes>
              </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
