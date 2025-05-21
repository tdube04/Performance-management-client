import React, { useState, useEffect } from "react";
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
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import axiosClient from "../../../authentication/axios-client";
import AddIcon from "@mui/icons-material/Add";

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
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontSize: 12,
}));

export default function AddForCurrentYear() {
  const classes = useStyles();

  const [data, setData] = useState([]);

  useEffect(() => {
    axiosClient.get("/Performance_Area/allAreas").then((response) => {
      setData(response.data);
      console.log(response.data);
    });
  }, []);
  return (
    <Box display="flex" style={{ height: "700px" }}>
      <div className="" style={{ overflow: "scroll" }}>
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              m: 1,
              width: 500,
              height: 650,
            },
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              mt: 5,
              ml: 20,
              p: 2,
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              borderTop: "10px solid #FFFF80",
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
                  width: 450,
                  height: 45,
                },
              }}
            >
              <div className={classes.root}>
                <Typography
                  className={classes.heading}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "10px",
                    color: "black",
                  }}
                >
                  Performance Areas
                </Typography>

                {data.map((item) => (
                  <Accordion

                  // style={{ backgroundColor: "#d4d2d2" }}
                  >
                    <AccordionSummary
                      style={{ backgroundColor: "#e2e2e2" }}
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1c-content"
                      id="panel1c-header"
                    >
                      <div className={classes.column}>
                        <Typography className={classes.heading}></Typography>
                      </div>
                      <div>
                        <Typography
                          className={classes.secondaryHeading}
                          sx={{ fontSize: 12, color: "black" }}
                        >
                          {item.section} {item.performanceArea}
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <div>
                      Outcomes/Programs{" "}
                      <Button size="small" color="primary">
                        Add
                      </Button>
                    </div>
                    <AccordionDetails className={classes.details}>
                      <div className={classes.column} />
                      <Box sx={{ width: "100%" }}>
                        <Grid
                          container
                          rowSpacing={2}
                          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                          <Grid item xs={8}>
                            <Item>Maximise Revenue Collection</Item>
                          </Grid>
                          <Grid item xs={8}>
                            <Item>Enhance Trade Facilitation</Item>
                          </Grid>
                        </Grid>
                      </Box>
                      {/* <div className={classes.column}>
                        <Chip label="Barbados" onDelete={() => {}} />
                      </div> */}
                      {/* <div className={clsx(classes.column, classes.helper)}>
                        <Typography variant="caption">
                          Select your destination of choice
                          <br />
                          <a
                            href="#secondary-heading-and-columns"
                            className={classes.link}
                          >
                            Learn more
                          </a>
                        </Typography>
                      </div> */}
                    </AccordionDetails>
                    <Divider />
                    <AccordionActions>
                      {/* <Button size="small">Cancel</Button> */}
                    </AccordionActions>
                  </Accordion>
                ))}
              </div>
            </Box>
          </Paper>
        </Box>
      </div>

      <div className="outcome-form">
        <Box
          sx={{
            mt: 2,
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
              mt: 2,
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
              <Typography variant="body2" sx={{ mt: 6 }}>
                A1 - Maximise Revenue Collection
              </Typography>
            </div>
            <br />
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" ,}}>
                <label> Outcome Indicator</label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label> Measurement Unit</label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Weight</label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Performance 2022 </label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Quarterly Target </label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Annual Target </label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Allowable Variance </label>

                <input type="text" className="input-pillar" />
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <label>Responsible Division </label>

                <input type="text" className="input-pillar" />
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
