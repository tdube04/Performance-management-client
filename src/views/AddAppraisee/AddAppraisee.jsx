import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import axiosClient from "../../authentication/axios-client";
import SelectAppraisee from "../../components/MultiSelect/MultiSelectAppraisee";

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

const pillars = [
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

export default function AddAppraisee() {
  const classes = useStyles();
  const theme = useTheme();
  const [pillars, setPillars] = useState([]);
  const [pillarName, setPillarName] = React.useState([]);
  const [selectedPillars, setSelectedPillars] = React.useState([]);

  useEffect(() => {
    // axiosClient.get("/Pillars/allPillars").then((response) => {
    // //   setPillars(response.data);
    //   console.log(response.data);
    // });
    const pillars = [
      {
        id: 1,
        section: "A1",
      },
      {
        id: 2,
        section: "A1",
      },
    ];
    setPillars(pillars);
  }, []);

  const handleChange = (event) => {
    setPillarName(event.target.value);

    const selected = [];
    for (let i = 0; i < event.target.selectedOptions.length; i++) {
      selected.push(event.target.selectedOptions[i].value);
    }
    setSelectedPillars(selected);
  };

  const handleChangeMultiple = (event) => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPillarName(value);
  };

  const options = [
    {
      value: 0,
      text: 'Angular',
      selected: true,
    },
    {
      value: 1,
      text: 'Bootstrap',
      selected: true,
      disabled: true,
    },
    {
      value: 2,
      text: 'React.js',
    },
    {
      value: 3,
      text: 'Vue.js',
    },
    {
      label: 'backend',
      options: [
        {
          value: 4,
          text: 'Django',
        },
        {
          value: 5,
          text: 'Laravel',
          selected: true,
        },
        {
          value: 6,
          text: 'Node.js',
        },
      ],
    },
  ]

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
        Select Your Current Year Appraisees
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
      
           <SelectAppraisee/>

            
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
