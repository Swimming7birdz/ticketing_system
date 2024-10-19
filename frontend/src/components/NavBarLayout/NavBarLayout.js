import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';
import TopBar from '../TopBar/TopBar';
import './NavBarLayout.css'

const Layout = () => {
  return (
    <div className="sideBarLayout">
      <SideBar className="sideBar" />
      <div className="topBarLayout">
        <TopBar className="topBar" />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;