import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

import Chip from "@material-ui/core/Chip";
import axiosClient from "../../../authentication/axios-client";
import SelectPillars from "../../MultiSelect/MultiSelectorPillars";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Macroeconomic Stability & Financial Re-engagement",
  "Inclusive growth",
  "Governance",
  "Infrastructure and Utilities",
  "Social Development",
  "Cross-cutting",
];

function getStyles(name, pillarName, theme) {
  return {
    fontWeight:
      pillarName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function SelectCurrentYear() {
  const classes = useStyles();
  const theme = useTheme();
  const [pillars, setPillars] = useState([]);
  const [pillarName, setPillarName] = React.useState([]);
  const [selectedPillars, setSelectedPillars] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPillarName(
      
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  useEffect(() => {
    axiosClient.get("/Pillars/allPillars").then((response) => {
      setPillars(response.data);
      console.log(response.data);
    });
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
          height: "400px",
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
              width: 900,
              height: 45,
            },
          }}
        >
          <FormControl className={classes.formControl}>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Select Appraisee
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={pillarName}
                onChange={handleChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={pillarName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
           

            <div className="btn-addPillar">
              <button className="pillar-btn" style={{ borderRadius: "25px" }}>
                Submit
              </button>
            </div>
          </FormControl>
        </Box>
        <div id="selected-names">
          <div className={classes.chips}>
            {selectedPillars.map((value) => (
              <Chip key={value} label={value} className={classes.chip} />
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
}
