import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useTheme } from "@mui/material/styles";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Switch,
    IconButton,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const token = Cookies.get("token");
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/role/student`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch students.");
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleEnabled = async (student) => {
        const currentValue = student.is_enabled ?? true;
        const newValue = !currentValue;

        setStudents((currentStudents) =>
            currentStudents.map((s) =>
                s.user_id === student.user_id ? { ...s, is_enabled: newValue } : s
            )
        );

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/users/${student.user_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        is_enabled: newValue,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update student status.");
            }
        } catch (err) {
            console.error("Error updating student status:", err);
            alert(`Error: ${err.message}. Reverting change.`);

            setStudents((currentStudents) =>
                currentStudents.map((s) =>
                    s.user_id === student.user_id
                        ? { ...s, is_enabled: currentValue }
                        : s
                )
            );
        }
    };

    const handleBack = () => {
        navigate(-1); // Navigates to the previous page in history
    };

    return (
        <Box
            sx={{
                minHeight: "calc(100vh - 60px)",
                backgroundColor: theme.palette.background.default,
                padding: "20px 0",
            }}
        >
            <Box
                sx={{
                    padding: 5,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    maxWidth: "800px",
                    margin: "40px auto",
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
                    <IconButton
                        onClick={handleBack}
                        aria-label="back to admin settings"
                    >
                        <ArrowBackIosNewIcon sx={{ color: theme.palette.text.primary }} />
                    </IconButton>
                    <Typography
                        variant="h4"
                        sx={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: theme.palette.text.primary,
                            flexGrow: 1, // Allows the title to take the remaining space
                        }}
                    >
                        Manage Students
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                {/* ... table headers ... */}
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Name
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Email
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Team
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            backgroundColor: theme.palette.background.paper,
                                            color: theme.palette.text.primary,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Enabled
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student) => {
                                    const isEnabled = student.is_enabled ?? true;

                                    return (
                                        <TableRow key={student.user_id}>
                                            <TableCell sx={{ color: theme.palette.text.primary }}>
                                                {student.name}
                                            </TableCell>
                                            <TableCell sx={{ color: theme.palette.text.primary }}>
                                                {student.email}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                sx={{ color: theme.palette.text.primary }}
                                            >
                                                {student.team_name || "N/A"}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Switch
                                                    checked={isEnabled}
                                                    onChange={() => handleToggleEnabled(student)}
                                                    color={isEnabled ? "success" : "error"}
                                                    inputProps={{ "aria-label": `toggle ${student.name}` }}
                                                />
                                            </TableCell>
                                    </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default ManageStudents;