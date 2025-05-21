import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from '@mui/material/Typography';

export default function CreateWorkPlan() {
  return (
    <Box
      sx={{
        display: "grid",
        flexWrap: "wrap",
        "& > :not(style)": {
          m: 1,
          width: 1200,
          height: 60,
        },
      }}
      
    >  <Paper elevation={0} sx={{ display: "flex", flexDirection: "column", backgroundColor: "white", width: "100%"}}>
     <Typography variant="caption" sx={{textAlign: "center", fontSize: "17px" }}>
        Year of Assessment: 2023
    </Typography>
    <Typography variant="caption" sx={{textAlign: "center", fontSize: "17px" }}>
    Current Quarter
    </Typography>
    </Paper>
    
    
     <Paper elevation={3} sx={{ display: "flex", backgroundColor: "green", width: "100%"}}>
      <Typography variant="body2" sx={{ mt: 2, color: "white", fontWeight: "bold"}}>
          Name
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:35, color: "white", fontWeight: "bold" }}>
          EC Number
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:35, color: "white", fontWeight: "bold" }}>
         Title
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:35, color: "white", fontWeight: "bold" }}>
         Status
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ display: "flex", width: "100%"}}>
      <Typography variant="body2" sx={{ mt: 2}}>
          Confidence Mutimbanyoka
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:22 }}>
          5136
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:30 }}>
        ICT Graduate Trainee
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:30, color: "blue" }}>
        Pending Approval
        </Typography>
      </Paper>


      <Paper elevation={3} sx={{ display: "flex", width: "100%"}}>
      <Typography variant="body2" sx={{ mt: 5}}>
          Reachel Makwara
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:30 }}>
          5137
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:30 }}>
        ICT Graduate Trainee
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, ml:30, color: "blue" }}>
        Pending Approval
        </Typography>
      </Paper>
    </Box>
  );
}
