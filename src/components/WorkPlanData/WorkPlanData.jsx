import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { borderRadius } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import AddIcon from "@mui/icons-material/Add";
import axiosClient from "../../authentication/axios-client";
import "./workplandata.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(10),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: "bottom",
    height: 20,
    width: 20,
  },
  details: {
    alignItems: "center",
  },
  column: {
    flexBasis: "33.33%",
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
  fontSize: 10,
}));

export default function WorkPlanData(props) {
  const classes = useStyles();

  const [data, setData] = useState([]);

  const [programs, setPrograms] = useState([]);
  const [message, setMessage] = useState(null);

  const [selectedPerfomance, setSelectedPerfomance] = useState(props.performanceArea);

  const [selectedProgramIndex, setSelectedProgramIndex] = useState(0);

  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState(0);

  const [selectedOutcomes, setSelectedOutcomes] = useState([]);

  const [expanded, setExpanded] = React.useState(false);
  const performanceRef = useRef(null);
  const descriptionRef = useRef(null);
  const measurement_unitRef = useRef(null);
  const weightRef = useRef(null);
  const quarterly_targetRef = useRef(null);
  const annual_targetRef = useRef(null);
  const allowable_varianceRef = useRef(null);
  const previous_year_PerfomenaceRef = useRef(null);
  const current_targetRef = useRef(null);
  const responsible_DivisionRef = useRef(null);
  const actual_perfomanceRef = useRef(null);
  const appraisee_scoreRef = useRef(null);
  const indicatorRef = useRef(null);
  const measurementRef = useRef(null);

  
  const handleSubmitIndicator = (e) => {
    e.preventDefault();

    const updatedPerformanceArea = { ...selectedPerfomance };

    // const newProgramData = {
    //   description: selectedOutcomes.name,
    //   measurement_unit: measurement_unitRef.current.value,
    //   weight: weightRef.current.value,
    //   quarterly_target: quarterly_targetRef.current.value,
    //   annual_target: annual_targetRef.current.value,
    //   allowable_variance: allowable_varianceRef.current.value,
    //   previous_year_Perfomenace: previous_year_PerfomenaceRef.current.value,
    // };

    const newProgramData = {
      description:"Indicator",
      measurement_unit: "$",
      weight: "54",
      quarterly_target: "34",
      annual_target:"34",
      allowable_variance: "34",
      previous_year_Perfomenace:"34",
    };
    if (
      updatedPerformanceArea.programs &&
      Array.isArray(updatedPerformanceArea.programs)
    ) {
      const selectedProgram =
        updatedPerformanceArea.programs[props.selectedProgramIndex];
      if (!selectedProgram.indicators) {
        selectedProgram.indicators = [];
      }
      selectedProgram.indicators.push(newProgramData);
    } else {
      throw new Error("The programs array is null or not an array");
    }

    axiosClient
      .post(
        `Performance_Area/update/${props.index}`,
        updatedPerformanceArea
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputClick = () => {
    setMessage("");
  };

  return (
    <Box display="block" style={{ height: "700px" }}>
      <div className="full-description">
        <Box
          sx={{
            marginLeft: 20,
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 428,
              height: 700,
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "20px solid #309366",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                className={classes.heading}
                style={{
                  display: "flex",
                  alignItems: "right",
                  justifyContent: "center",
                  marginBottom: "10px",
                  color: "black",
                }}
              >
                {props.section} - {props.outcome}
              </Typography>
            </div>
            <br />
            <form
            onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex",
              }}
            >
              <div style={{ display: "flex" }}>
                <label >Outcome Indicator: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={indicatorRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex" }}>
                <label>Measurement Unit: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={measurementRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex" }}>
                <label>Weight: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={weightRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Perfomance of 2022: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={previous_year_PerfomenaceRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Annual target for 2023: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={annual_targetRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Target for Q4 2022: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={current_targetRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Responsible Division: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={responsible_DivisionRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Actual Perfomance: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={actual_perfomanceRef}
                  onClick={handleInputClick}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Allowable variance: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={actual_perfomanceRef}
                  onClick={handleInputClick}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Apraisee Score: </label>

                <input
                  type="text"
                  className="input-pillar"
                  ref={appraisee_scoreRef}
                  onClick={handleInputClick}
                />
              </div>

              <div className="btn-outcome-program">
                <button
                  className="btn-outcome"
                  style={{ borderRadius: "25px" }}
                >
                  Add
                </button>
              </div>
            </form>
          </Paper>
        </Box>
      </div>
    </Box>
  );
}

