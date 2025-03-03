import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode"; 
 

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Helper function for fetch with token
const apiFetch = async (url, method = "GET", body = null) => {
  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed.");
  }

  return response.json();
};

// Fetch all tickets
export const fetchAllTickets = async () => {
  const url = `${baseURL}/api/tickets`;
  return apiFetch(url);
};

// Fetch tickets by user ID
export const fetchTicketsByUserId = async () => {
  const token = Cookies.get("token");
  if (!token) throw new Error("No token found");

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id; // Extract user ID from JWT

  const url = `${baseURL}/api/tickets/user/${userId}`;
  return apiFetch(url);
};

// Fetch tickets by TA ID
export const fetchTicketsByTAId = async (taId) => {
  const url = `${baseURL}/api/tickets/ta/${taId}`;
  return apiFetch(url);
};

// Fetch ticket by ticket ID
export const fetchTicketById = async (ticketId) => {
  const url = `${baseURL}/api/tickets/${ticketId}`;
  return apiFetch(url);
};

// Fetch all ticket data (detailed view)
export const fetchAllTicketDataById = async (ticketId) => {
  const url = `${baseURL}/api/tickets/info/${ticketId}`;
  return apiFetch(url);
};
