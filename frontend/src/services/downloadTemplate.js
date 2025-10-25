import React from "react";
import {Button} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import { CSVLink } from "react-csv";
import { useTheme } from "@mui/material/styles";

function DownloadTemplate() {
    const theme = useTheme();

    const headers = [
    { label: "Name", key: "name" },
    { label: "Canvas_user_id", key: "canvas_user_id" },
    { label: "User_id", key: "user_id" },
    { label: "Login_id", key: "login_id" },
    { label: "Sections", key: "sections" },
    { label: "Group_name", key: "group_name" },
    { label: "Canvas_group_id", key: "canvas_group_id" },
    { label: "Sponsor", key: "sponsor" },

  ];
    const data = [
    { name: "Livingston, Remington", canvas_user_id: "561555", user_id: "1352688424", login_id: "WEOFCN", sections: "87968", group_name: "Project 10", canvas_group_id: "690105", sponsor: "sponsor1@gmail.com" },
    ];

  return (
     <Button
      component={CSVLink}
      data={data}
      headers={headers}
      filename="Student_Project_Sponsor-template.csv"
      variant="contained"
      startIcon={<DownloadIcon />}
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.getContrastText
          ? theme.palette.getContrastText(theme.palette.primary.main)
          : theme.palette.primary.contrastText,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark || theme.palette.primary.main,
        },
        textTransform: "none",
      }}
    >
      Download
    </Button>
  );
}

export default DownloadTemplate;