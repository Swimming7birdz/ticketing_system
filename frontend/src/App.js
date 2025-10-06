import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBarLayout from "./components/NavBarLayout/NavBarLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import TicketView from "./components/TicketView/TicketView";
import AdminDash from "./pages/AdminDash/AdminDash";
import AllAssignees from "./pages/AllAssignees/AllAssignees";
import AllTickets from "./pages/AllTickets/AllTickets";
import InstructorDash from "./pages/InstructorDash/InstructorDash";
import TicketSubmit from "./pages/IssueSubmissionForm/IssueSubmissionForm";
import Login from "./pages/Login/Login";
import MyTickets from "./pages/MyTickets/MyTickets";
import AdminSettings from "./pages/Settings/AdminSettings";
import StudentSettings from "./pages/Settings/StudentSettings";
import TASettings from "./pages/Settings/TASettings";
import StudentDash from "./pages/StudentDash/StudentDash";
import TAinfo from "./pages/TAInfo/TAinfo";
import TicketInfo from "./pages/TicketInfo/TicketInfo";
import TicketQueue from "./pages/TicketQueue/TicketQueue";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import Registration from "./pages/Registration/Registration";
import Profile from "./pages/Profile/Profile";
import StudentTickets from "./pages/StudentTickets/StudentTickets";
import InstructorTickets from "./pages/InstructorTickets/InstructorTickets";
import InstructorProfile from "./pages/InstructorProfile/InstructorProfile"; 
import EscalatedTickets from "./pages/EscalatedTickets/EscalatedTickets";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import RequestReset from "./pages/RequestReset/RequestReset";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/requestreset" element={<RequestReset />} />

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
        <Route path="/alltickets" element={<AllTickets />} />
        <Route path="/allassignees" element={<AllAssignees />} />
        <Route path="/adminsettings" element={<AdminSettings />} />
        <Route path="/tasettings" element={<TASettings />} />
        <Route path="/studentsettings" element={<StudentSettings />} />
        <Route path="/ticketview" element={<TicketView />} />
	      <Route path="/instructorprofile" element={<InstructorProfile />} /> 
        <Route 
          path="/escalatedtickets" 
          element={<ProtectedRoute
            element={<EscalatedTickets />}
            authorizedRoles={["admin"]}
           />
          } 
        />
        {/* Testing Pages */}

        {/* Change user_id to the user's id */}
        <Route path="/mytickets" element={<StudentTickets />} />
        <Route path="/instructortickets" element={<InstructorTickets />} />
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

        <Route path="/profile" element={<Profile />} />
      </Route>

      {/*Default to login page for unrecognized routes*/}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
