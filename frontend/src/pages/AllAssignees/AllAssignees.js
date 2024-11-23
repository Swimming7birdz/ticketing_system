import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import InstructorCard from "../../components/InstructorCard";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const AllAssignees = () => {
  const [tas, setTAs] = useState([]);
  const [filteredTAs, setFilteredTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTAs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tas, search]);

  const fetchTAs = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(`${baseURL}/api/users/role/TA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch TAs");
      }

      const tasData = await response.json();
      setTAs(tasData);
      setFilteredTAs(tasData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TAs:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = tas.filter((ta) =>
      ta.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTAs(filtered);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>
          Loading, please wait...
        </Typography>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#DBDADA",
        padding: 50,
        gap: 50,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}
      >
        All Teaching Assistants (TAs)
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TextField
          label="Search TAs"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Button
          variant="outlined"
          onClick={() => setSearch("")}
          sx={{ color: "#8C1D40", borderColor: "#8C1D40" }}
        >
          Clear Search
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
          maxHeight: "70vh",
          overflowY: "auto",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      >
        {filteredTAs.map((ta) => (
          <InstructorCard
            key={ta.user_id}
            name={ta.name}
            counts={{}} // You can pass counts or other data if needed
          />
        ))}
      </div>
    </div>
  );
};

export default AllAssignees;
