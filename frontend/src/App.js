import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBarLayout from "./components/NavBarLayout/NavBarLayout";
import AdminDash from "./pages/AdminDash";
import AllTickets from "./pages/AllTickets";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TicketSubmit from "./pages/IssueSubmissionForm/IssueSubmissionForm";
import Login from "./pages/Login/Login";
import TicketInfo from "./pages/TicketInfo/TicketInfo";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<NavBarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alltickets" element={<AllTickets />} />
        <Route path="/ticketinfo" element={<TicketInfo />} />
        <Route path="/ticketsubmit" element={<TicketSubmit />} />
        <Route path="/admindash" element={<AdminDash />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
