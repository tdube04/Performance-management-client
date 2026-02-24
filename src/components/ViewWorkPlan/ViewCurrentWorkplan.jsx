import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";

import WorkPlanData from "../../components/WorkPlanData/workplandata";
import SummaryScores from "../../components/SummaryScores/SummaryScores";
import Signatures from "../../components/Signatures/Signatures";
import axiosClient from "../../authentication/axios-client";
import { useTheme, useMediaQuery } from "@material-ui/core";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import { borderRadius } from "@mui/system";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { styled } from "@mui/material/styles";

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
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  table: {
    minWidth: 650,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  row: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  details: {
    backgroundColor: "#f5f5f5",
  },
}));

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return {
    currentYear: currentYear,
  };
};

const { currentYear } = getCurrentEvaluationPeriod();

const Row = ({ program }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <TableRow className={classes.row}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {program.name}
        </TableCell>
        <TableCell align="right">15</TableCell>
        <TableCell align="right">2023</TableCell>
        <TableCell align="right">Economic Development</TableCell>
        <TableCell align="right">23</TableCell>
      </TableRow>
      <TableRow style={{ maxWidth: "80%" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="caption" gutterBottom component="div">
                Outcome Indicators
              </Typography>
              <Table
                size="medium"
                aria-label="purchases"
                style={{ maxWidth: "50%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%" }}>Indicator</TableCell>
                    <TableCell sx={{ width: 10 }}>Measurement Unit</TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Weight
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Previous Performance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Annual Target for {currentYear}
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Target for {currentYear}
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Agreed Weighted Score
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.indicators &&
                    program.indicators.map((indicator, index) => (
                      <TableRow>
                        <TableCell
                          component="th"
                          scope="row"
                          style={{ width: "10%" }}
                        >
                         {indicator.description}
                        </TableCell>
                        <TableCell style={{ width: "10%" }}>%</TableCell>
                        <TableCell align="right" style={{ width: "10%" }}>
                        {indicator.measurement_unit}
                        </TableCell>

                        <TableCell align="right" style={{ width: "10%" }}>
                        {indicator.weight}
                        </TableCell>
                        <TableCell align="right" style={{ width: "10%" }}>
                        {indicator.quarterly_target}
                        </TableCell>
                        <TableCell align="right" style={{ width: "10%" }}>
                        {indicator.allowable_variance}
                        </TableCell>

                        <TableCell align="right" style={{ width: "10%" }}>
                        {indicator.previous_year_Perfomenace}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              ;
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

Row.propTypes = {
  program: PropTypes.object.isRequired,
};

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const ViewWorkPlan = () => {
  const [performanceAreas, setPerformanceAreas] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    // fetch performance areas data from API here
    // and set it to the state using setPerformanceAreas
    const performanceAreasData = [
      {
        id: 2,
        section: "A1",
        weight: 0,
        programs: [
          {
            contributedPillar: null,
            indicators: null,
            name: "Maximise Reve",
            weight: 0,
          },
          {
            contributedPillar: null,
            indicators: [
              {
                description: "Net Revenue Collection",
                measurement_unit: "%",
                weight: 20,
                quarterly_target: 89,
                annual_target: 65,
                allowable_variance: 5,
                previous_year_Perfomenace: 23,
              },
              {
                description: "Net Revenue Collection",
                measurement_unit: "%",
                weight: 20,
                quarterly_target: 89,
                annual_target: 65,
                allowable_variance: 5,
                previous_year_Perfomenace: 23,
              },
              {
                description: "Indicator 3",
                measurement_unit: "%",
                weight: 10,
                quarterly_target: 89,
                annual_target: 65,
                allowable_variance: 5,
                previous_year_Perfomenace: 23,
              },
            ],
            name: "Program 2",
            weight: 0,
          },
        ],
        performanceArea: "Outcome Evaluation",
      },
    ];
    setPerformanceAreas(performanceAreasData);
  }, []);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="Performance Areas Tabs"
      >
        {performanceAreas.map((area, index) => (
          <Tab key={area.id} label={area.performanceArea} />
        ))}
      </Tabs>
      {performanceAreas.map((area, index) => (
        <TabPanel key={area.id} value={selectedTab} index={index}>
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              aria-label="Outcome Indicators Table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Outcome</TableCell>
                  <TableCell align="right">Weight&nbsp;(%)</TableCell>
                  <TableCell align="right">Current Year</TableCell>
                  <TableCell align="right">Pillar</TableCell>

                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {area.programs.map(
                  (program, index) => (
                    // program.indicators &&
                    // program.indicators.map((indicator, index) => (
                    <Row key={index} program={program} />
                  )
                  // ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div>
            <Checkbox />
            <Typography>Mark as Reviewed</Typography>
          </div>
        </TabPanel>
      ))}
    </div>
  );
};

export default ViewWorkPlan;
