import logo from './logo.svg';
import Login from './pages/Login/Login'
import TicketInfo from './pages/TicketInfo/TicketInfo';
import './App.css';
import SideBar from './components/SideBar/SideBar';
import TopBar from './components/TopBar/TopBar';

function App() {
  return (
    <div className='App'>
      <SideBar className="sideBar"/>
      <div className="appContents">
        <TopBar className="topBar"/>
        <TicketInfo/>
      </div>
    </div>

    // <Login/>

  );
}

export default App;
