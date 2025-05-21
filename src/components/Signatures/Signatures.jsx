import * as React from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { FormControl, FormLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export default function Signatures() {
  return (

    <div style={{ display: 'flex', flexDirection: 'column' }}>

    <Typography variant="h5" align="center" color="green" fontWeight="bold">Work Plan Agreed / Final Appraisal Signatures</Typography>

    <FormControl>
    <div style={{ display: 'flex', justifyContent: 'center', marginTop:'20px', marginBottom:'20px'}}>
    <FormLabel style={{ display: 'inline-flex', fontWeight: "bold", color:'black'}}>Overall Score:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    </FormControl>



    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
       <Box sx={{ width: "30%" }}>
    <FormControl>
    <div style={{ display: 'flex', marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold"}}>Incumbent:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex', marginBottom:'20px'}}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold" }}>Supervisor:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex', marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px' , fontWeight: "bold"}}>Reviewer: </FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    </FormControl>
    </Box>

    <Box sx={{ width: "30%" }}>
    <FormControl>
    <div style={{ display: 'flex', marginBottom:'20px'}}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold"}}>Signature:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2' }}></TextField>
    </div>
    <div style={{ display: 'flex',marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold" }}>Signature:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex', marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px' , fontWeight: "bold"}}>Signature:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    </FormControl>
    </Box>

    <Box sx={{ width: "40%" }}>
    <FormControl>
    <div style={{ display: 'flex', marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold"}}>Date:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex', marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px', fontWeight: "bold" }}>Date:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex',marginBottom:'20px' }}>
    <FormLabel style={{ display: 'inline-flex', marginRight: '70px', marginLeft: '70px' , fontWeight: "bold"}}>Date:</FormLabel>
    <TextField style={{ display: 'inline-flex', backgroundColor: '#f2f2f2'}}></TextField>
    </div>
    <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
    <Button style={{fontWeight: "bold",backgroundColor: "green", color:'white', width: "225px"}}>Submit</Button>
    </div>
    </FormControl>
    </Box>
    </Box>

    </div>
  );

}
