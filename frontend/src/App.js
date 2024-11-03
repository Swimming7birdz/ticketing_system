import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBarLayout from "./components/NavBarLayout/NavBarLayout";
import AdminDash from "./pages/AdminDash";
import InstructorDash from "./pages/InstructorDash/InstructorDash";
import TicketSubmit from "./pages/IssueSubmissionForm/IssueSubmissionForm";
import Login from "./pages/Login/Login";
import StudentDash from "./pages/StudentDash/StudentDash";
import TicketInfo from "./pages/TicketInfo/TicketInfo";
import TicketQueue from "./pages/TicketQueue";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<NavBarLayout />}>
        <Route path="/ticketinfo" element={<TicketInfo />} />
        <Route path="/ticketsubmit" element={<TicketSubmit />} />
        <Route path="/admindash" element={<AdminDash />} />
        <Route path="/ticketqueue" element={<TicketQueue />} />
        <Route path="/studentdash" element={<StudentDash />} />
        <Route path="/instructordash" element={<InstructorDash />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
