import React, {useState } from "react";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import DownloadTemplate from "../../services/downloadTemplate";
import Stack from "@mui/material/Stack";
import {
    Button,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import { verifyFileService } from "../../services/verifyfile";
import { generateStudentUsers } from "../../services/generateStudentUsers";
import { useTheme } from "@mui/material/styles";
import { useTheme as useCustomTheme } from "../../contexts/ThemeContext";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const BulkUpload = () => {
    const [studentFile, setStudentFile] = useState(null);
    const [instructorFile, setInstructorFile] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();
    const { isDarkMode, themeMode, setTheme } = useCustomTheme();

    const handleBack = () => {
        navigate(-1); // Navigates to the previous page in history
    };

    const onDropStudent = React.useCallback((acceptedFiles) => {
        setStudentFile(acceptedFiles && acceptedFiles.length ? acceptedFiles[0] : null);
    }, []);

    const onDropInstructor = React.useCallback((acceptedFiles) => {
        setInstructorFile(acceptedFiles && acceptedFiles.length ? acceptedFiles[0] : null);
    }, []);

    const studentDrop = useDropzone({
        onDrop: onDropStudent,
        accept: {
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
    });

    const instructorDrop = useDropzone({
        onDrop: onDropInstructor,
        accept: {
        "text/csv": [".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
        },
        maxSize: 10 * 1024 * 1024,
        multiple: false,
    });

    const handleUploadFiles = async () => {
        // ensure at least one file is selected
        if (!studentFile && !instructorFile) return;
    
        try {
            if (studentFile) {
            const verifyResult = await verifyFileService(studentFile);
            if (!verifyResult.valid) {
                console.error("Student file verification failed:", verifyResult.errors);
                alert("Student file validation errors:\n" + verifyResult.errors.join("\n"));
                return;
            }
    
            const genResult = await generateStudentUsers(studentFile);
            if (!genResult.valid) {
                console.error("User creation failed:", genResult.errors);
                alert("Student user creation errors:\n" + genResult.errors.join("\n"));
                return;
            }
            }
    
            if (instructorFile) {
            const verifyResult = await verifyFileService(instructorFile);
            if (!verifyResult.valid) {
                console.error("Instructor file verification failed:", verifyResult.errors);
                alert("Instructor file validation errors:\n" + verifyResult.errors.join("\n"));
                return;
            }
    
            // TODO: process instructor file (create instructor users / import)
            console.log("Instructor file verified, add processing here.");
            }
    
        alert("Files processed successfully.");
            setStudentFile(null);
            setInstructorFile(null);
        } catch (err) {
            console.error("Upload failed:", err);
            alert("Upload failed: " + err.message);
        }
    };


    return ( <>
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
                        Data Bulk Upload
                    </Typography>
                </Box>


                {/* Student CSV dropzone */}
                <Box
                    sx={{
                    marginBottom: 5,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderRadius: "10px",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    padding: 2.5,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography 
                    variant="h5" 
                    sx={{ 
                        marginBottom: 2.5, 
                        fontWeight: "bold",
                        color: (theme) => theme.palette.text.primary
                    }}
                    >
                    Students file
                    </Typography>

   
                    <Box
                    {...studentDrop.getRootProps()}
                    sx={{
                        mt: 2,
                        border: (theme) => `2px dashed ${studentFile ? theme.palette.primary.main : theme.palette.divider}`,
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                    >
                    <input {...studentDrop.getInputProps()} />
                    <UploadFileIcon fontSize="large" sx={{ mb: 1 }} />
                    <Typography>Drop Student CSV here or click to select</Typography>
                    <Typography variant="caption">CSV, XLSX — max 10MB</Typography>
                    </Box>

                    {studentFile && (
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", p: 1, border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                        <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{studentFile.name}</Typography>
                        <Box>
                        <Button size="small" onClick={() => setStudentFile(null)}>Remove</Button>
                        </Box>
                    </Box>
                    )}

                    <Box sx={{ mt: 2, p: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                        <Typography 
                            variant="h7" 
                            sx={{ 
                            fontWeight: "bold",
                            color: theme.palette.text.primary
                            }}
                        >
                            Find template here:
                        </Typography>
                        <DownloadTemplate />
                        </Stack>
                    </Box> 

                </Box>

                <Box
                    sx={{
                    marginBottom: 5,
                    backgroundColor: (theme) => theme.palette.background.paper,
                    borderRadius: "10px",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    padding: 2.5,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    {/* Instructor CSV dropzone */}
                     <Typography 
                        variant="h5" 
                        sx={{ 
                            marginBottom: 2.5, 
                            fontWeight: "bold",
                            color: (theme) => theme.palette.text.primary
                        }}
                        >
                        Instructor-Sponsors file
                    </Typography>


                    <Box
                    {...instructorDrop.getRootProps()}
                    sx={{
                        mt: 2,
                        border: (theme) => `2px dashed ${instructorFile ? theme.palette.primary.main : theme.palette.divider}`,
                        borderRadius: 1,
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                    }}
                    >
                    <input {...instructorDrop.getInputProps()} />
                    <UploadFileIcon fontSize="large" sx={{ mb: 1 }} />
                    <Typography>Drop Instructor CSV here or click to select</Typography>
                    <Typography variant="caption">CSV, XLSX — max 10MB</Typography>
                    </Box>

                    {instructorFile && (
                    <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", p: 1, border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                        <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{instructorFile.name}</Typography>
                        <Box>
                        <Button size="small" onClick={() => setInstructorFile(null)}>Remove</Button>
                        </Box>
                    </Box>
                    )}

                    <Box sx={{ mt: 2, p: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                        <Typography 
                            variant="h7" 
                            sx={{ 
                            fontWeight: "bold",
                            color: theme.palette.text.primary
                            }}
                        >
                            Find template here:
                        </Typography>
                        <DownloadTemplate />
                        </Stack>
                    </Box> 
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button variant="contained" onClick={() => handleUploadFiles()} >Upload Files</Button>
                    <Button variant="outlined" onClick={() => { setStudentFile(null); setInstructorFile(null); }}>Clear</Button>
                </Box>

            </Box>
        </Box>
      </>
    );
};

export default BulkUpload;