import { Button, CircularProgress, TextField, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import InstructorCard from "../../components/InstructorCard";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const AllAssignees = () => {
  const theme = useTheme();
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        padding: 6.25,
        gap: 6.25,
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
          sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
        >
          Clear Search
        </Button>
      </div>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2.5,
          maxHeight: "70vh",
          overflowY: "auto",
          padding: 0.625,
          border: 1,
          borderColor: theme.palette.divider,
          borderRadius: 1,
        }}
      >
        {filteredTAs.map((ta) => (
          <InstructorCard
            key={ta.user_id}
            name={ta.name}
            counts={{}} // You can pass counts or other data if needed
          />
        ))}
      </Box>
    </Box>
  );
};

export default AllAssignees;
