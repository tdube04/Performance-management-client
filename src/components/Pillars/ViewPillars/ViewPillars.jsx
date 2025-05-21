import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import axiosClient from "../../../authentication/axios-client";
 export default function ViewPillars() {
  const [pillars, setPillars] = useState([]);
   useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosClient.get("Pillars/allPillars");
        setPillars(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);
   return (
    <div>
      <Paper
        elevation={3}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "300px",
          border: "2px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        NATIONAL PILLARS AND PRIORITIES
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          mt: 5,
          ml: 20,
          p: 2,
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
          borderTop: "10px solid #0BC772",
          position: "relative",
          elevation: 3,
        }}
      >
        <Box
          sx={{
            display: "grid",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 700,
              height: 45,
            },
          }}
           style={{ overflow: "scroll", scrollbarWidth: "thin" }}
        >
          {
            pillars.map((pillar) => (
              <Paper
                key={pillar.id}
                elevation={3}
                sx={{
                  display: "flex",
                  backgroundColor: "white",
                  width: "70%",
                  border: "2px solid #B4B2A9",
                  borderRadius: "15px",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    m: "auto",
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  {pillar.pillar}
                </Typography>
              </Paper>
            ))
          }
        </Box>
      </Paper>
    </div>
  );
}