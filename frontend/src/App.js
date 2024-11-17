import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBarLayout from "./components/NavBarLayout/NavBarLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminDash from "./pages/AdminDash/AdminDash";
import InstructorDash from "./pages/InstructorDash/InstructorDash";
import TicketSubmit from "./pages/IssueSubmissionForm/IssueSubmissionForm";
import Login from "./pages/Login/Login";
import StudentDash from "./pages/StudentDash/StudentDash";
import TicketInfo from "./pages/TicketInfo/TicketInfo";
import TicketQueue from "./pages/TicketQueue/TicketQueue";
// import MyTickets from "./pages/MyTickets/MyTickets";
import TAinfo from "./pages/TAInfo/TAinfo";
import Unauthorized from "./pages/Unauthorized/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/*Verify that user is logged in before rendering any of these routes*/}
      <Route
        element={
          <ProtectedRoute
            element={<NavBarLayout />}
            authorizedRoles={["admin", "student", "TA"]}
          />
        }
      >
        <Route path="/ticketinfo" element={<TicketInfo />} />
        <Route path="/ticketsubmit" element={<TicketSubmit />} />
        <Route path="/ticketqueue" element={<TicketQueue />} />

        {/* Testing Pages */}
        {/* <Route path="/mytickets" element={<MyTickets />} /> */}
        <Route path="/ta-info" element={<TAinfo />} />

        {/*Verify the correct user type for dashboards*/}
        <Route
          path="/admindash"
          element={
            <ProtectedRoute
              element={<AdminDash />}
              authorizedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/studentdash"
          element={
            <ProtectedRoute
              element={<StudentDash />}
              authorizedRoles={["student"]}
            />
          }
        />
        <Route
          path="/instructordash"
          element={
            <ProtectedRoute
              element={<InstructorDash />}
              authorizedRoles={["TA"]}
            />
          }
        />
      </Route>

      {/*Default to login page for unrecognized routes*/}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
