import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import "./workingScoreCard.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import ClearIcon from "@mui/icons-material/Clear";

import FileSaver from "file-saver";

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
import Tooltip from "@mui/material/Tooltip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNavigate } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import ArticleIcon from "@mui/icons-material/Article";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
import swal from "sweetalert";
import { useStateContext } from "../../context/ContextProvider";
import { FaRegFilePdf } from "react-icons/fa";
import AdjustIcon from "@mui/icons-material/Adjust";

function Row({ program, area, planStatus }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [
    currentPerformanceAreaSelected,
    setCurrentPerformanceAreaSelected,
  ] = useState(area);

  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [evidenceId, setEvidenceId] = useState("");
  const [evidencesFileIds, setEvidencesFileIds] = useState(
    selectedIndicator?.evidenceFileIds || []
  );
  const [resources, setResources] = useState(
    selectedIndicator?.responsibleResources || []
  );
  const [updatedEvidenceData, setUpdatedEvidenceData] = useState(null);

  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState(null);
  const [evidenceBlobUrl, setEvidenceBlobUrl] = useState(null);
  const classes = useStyles();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  // console.log(program.name);
  // console.log("Total indicators: ", program.indicators.length);

  const { evaluationPeriod, daysRemaining } = getCurrentEvaluationPeriod();

  // console.log(area);

  const RedPdfIcon = styled(PictureAsPdfIcon)({
    color: "red",
  });

  const handleUpdateRedirect = (indicator) => {
    navigate("/workingscorecard", { state: { indicator, program, area } });
  };

  const handleDownloadEvidence = async (attachedId, filename) => {
    console.log("handleDownloadEvidence called with:", attachedId, filename);
    
    // Debug: Check if we have valid IDs
    if (!attachedId) {
      console.error("No attachedId provided!");
      alert("Error: No file ID found. Please refresh and try again.");
      return;
    }
    
    // Check for token - axiosClient handles auth automatically
    const token = localStorage.getItem('ACCESS_TOKEN');
    console.log("Token found:", token ? "yes" : "no");
    
    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    try {
      console.log("Making API request to /file/download/", attachedId);
      
      // Use axiosClient - it already adds the Authorization header automatically
      const response = await axiosClient.get(`/file/download/${attachedId}`, {
        responseType: "blob"
      });

      console.log("File download response status:", response.status);
      
      // Determine file type from filename
      const fileExtension = filename ? filename.split('.').pop().toLowerCase() : '';
      console.log("File extension:", fileExtension);
      
      // For Word documents and other non-PDF files, download instead of viewing
      if (fileExtension !== 'pdf') {
        console.log("Non-PDF file - will download");
        // Create a blob and trigger download
        const blob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename || 'evidence file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        console.log("Download triggered for:", filename);
        return;
      }
      
      // For PDF files, create blob and view in modal
      const blob = new Blob([response.data], { type: "application/pdf" });
      
      console.log("Blob created, size:", blob.size);

      if (blob.size === 0) {
        alert("The file appears to be empty.");
        return;
      }

      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      console.log("Blob URL created:", blobUrl);
      
      // Store the blob URL and set viewing state to show in modal
      setEvidenceBlobUrl(blobUrl);
      setViewingEvidence({ filename: filename || 'document.pdf', attachedId });
      console.log("State updated - should show modal now");
    } catch (error) {
      console.error("Error downloading evidence:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 403) {
        alert("You don't have permission to view this file. Please contact administrator.");
      } else if (error.response?.status === 404) {
        alert("File not found.");
      } else {
        alert("Failed to load evidence file. Please try again.");
      }
    }
  };

  const handleCloseEvidenceViewer = () => {
    // Clean up the blob URL to free memory
    if (evidenceBlobUrl) {
      URL.revokeObjectURL(evidenceBlobUrl);
    }
    setViewingEvidence(null);
    setEvidenceBlobUrl(null);
  };

  const handleDeleteEvidence = (id) => {
    // Make a copy of the evidenceFileIds array
    const updatedEvidenceFileIds = evidencesFileIds.filter(
      (evidence) => evidence.id !== id
    );

    setEvidencesFileIds(updatedEvidenceFileIds);

    setEvidencesFileIds((prevData) =>
      prevData.filter((evidence) => evidence.id !== id)
    );

    const updatedSelectedIndicator = {
      ...selectedIndicator,
      evidenceFileIds: updatedEvidenceFileIds,
    };
    setUpdatedEvidenceData(updatedSelectedIndicator);
    console.log(updatedSelectedIndicator);

    handleSubmitUpdatedEvidencesData();
  };
  const handleDeleteResource = (resource) => {
    // Make a copy of the evidenceFileIds array
    const updatedResourcesFileIds = resources.filter(
      (resourceName) => resourceName.username !== resource
    );

    setResources(updatedResourcesFileIds);

    const updatedSelectedIndicator = {
      ...selectedIndicator,
      responsibleResources: updatedResourcesFileIds,
    };
    setUpdatedEvidenceData(updatedSelectedIndicator);
    console.log(updatedSelectedIndicator);
    handleSubmitUpdatedEvidencesData();
  };

  const handleSubmitUpdatedEvidencesData = async () => {
    const evaluationPeriod = "2026-Q1";

    axiosClient
      .get("/scorecard/searchScorecard", {
        params: {
          period: evaluationPeriod,
          username: userName,
        },
      })
      .then((res) => {
        const scorecard = res.data;
        if (scorecard.content && scorecard.content.length > 0) {
          // There is an existing scorecard, so update it
          console.log("There is an existing scorecard, so update it", res.data);
          console.log("My ID: " + res.data.content[0].id);
          const scorecardId = res.data.content[0].id;
          const existingAreasOfPerformance =
            res.data.content[0].areasOfPerformance || [];
          console.log("My Areas: ");
          console.log(existingAreasOfPerformance);

          // Find the existing performance area
          const existingPerformanceArea = existingAreasOfPerformance.find(
            (area) =>
              area.performanceArea ===
              currentPerformanceAreaSelected.performanceArea
          );

          if (existingPerformanceArea) {
            // Performance area already exists, find the existing program
            const existingProgram = existingPerformanceArea.programs.find(
              (programName) => programName.name === program.name
            );
            const programIndex = existingPerformanceArea.programs.findIndex(
              (programName) => programName.name === program.name
            );

            if (existingProgram) {
              // Program already exists, update its indicators array
              const existingIndicators = existingProgram.indicators;

              // Find the index of the indicator, if it already exists
              const indicatorIndex = existingIndicators.findIndex(
                (indicatorName) =>
                  indicatorName.description === selectedIndicator.description
              );

              const existingIndicatorData = existingIndicators.find(
                (indicatorName) =>
                  indicatorName.description === selectedIndicator.description
              );
              console.log(existingIndicatorData);

              if (existingIndicatorData) {
                // Push the new evidenceInfo into the evidenceFileIds array

                if (existingIndicatorData) {
                  const newExistingIndicatorData = {
                    ...existingIndicatorData,
                    evidenceFileIds: evidencesFileIds,
                  };

                  // Replace the existing indicator with the updated indicator
                  existingIndicators[indicatorIndex] = newExistingIndicatorData;
                  existingProgram.indicators = existingIndicators;

                  // Update the existing performance area with the updated program
                  existingPerformanceArea.programs[
                    programIndex
                  ] = existingProgram;

                  // Update the existing areas of performance with the updated performance area
                  existingAreasOfPerformance[
                    existingAreasOfPerformance.indexOf(existingPerformanceArea)
                  ] = existingPerformanceArea;

                  // Update the scorecard with the updated areas of performance
                  const updatedScorecard = {
                    ...scorecard.content[0],
                    areasOfPerformance: existingAreasOfPerformance,
                  };

                  // Send the updated scorecard to the server
                  try {
                    axiosClient
                      .put(
                        `/scorecard/updateScorecard/${scorecardId}`,
                        updatedScorecard
                      )
                      .then((res) => {
                        console.log("Status code:", res.status);
                        if (res.status === 200) {
                          swal({
                            text: "Indicator info Saved Successfully",
                            icon: "success",
                            button: "OK!",
                          });
                          //  navigate("/view_Workingscorecard");
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                  } catch (error) {
                    console.log("An error occurred:", error);
                  }
                }
              } else {
                // Indicator doesn't exist, add it to the indicators array
                console.log("Indicator doesn't exist");
                newIndicatorData.evidenceFileIds = [evidenceInfo];
                existingIndicators.push(newIndicatorData);
              }
            } else {
              console.log("Program doesn't exist");
            }
          } else {
            setMessage("Selected Performance not found");
          }
        } else {
          console.log("You Have No Scorecard");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIndicatorDialog = async (indicator) => {
    setSelectedIndicator(indicator);

    setModalOpen(true);

    setEvidencesFileIds(indicator.evidenceFileIds);
    console.log(evidencesFileIds);
  };
  const handleInputClick = () => {
    setMessage("");
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>{" "}
        <TableCell
          component="th"
          scope="row"
          style={{ color: "#16160E", fontWeight: 550 }}
        >
          {program.name}
        </TableCell>
        <TableCell align="center">{program.weight}</TableCell>
        <TableCell align="center">{evaluationPeriod}</TableCell>
        <TableCell align="center">{program.indicators.length}</TableCell>
      </TableRow>
      <TableRow style={{ maxWidth: "80%" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="caption" gutterBottom component="div">
                Program Indicators
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
                      Weight(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Incremental/Decremental
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Annual Target for {currentYear}(%)
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Allowable Variance
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Current Quarter Target(%)
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Responsible Division
                    </TableCell>
                    {/* <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance
                    </TableCell> */}
                    <TableCell align="right" style={{ width: "10%" }}>
                      Comment
                    </TableCell>

                    <TableCell
                      align="right"
                      style={{ width: "10%" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.indicators &&
                    program.indicators.map((indicator, index) => (
                      <TableRow>
                        <TableCell
                          align="center"
                          component="th"
                          scope="row"
                          style={{ width: "10%" }}
                        >
                          {indicator.description}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.measurement_unit}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.weight}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.incremental_or_decremental}
                        </TableCell>
                        {/* <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.previous_year_Perfomenace}
                        </TableCell> */}

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.annual_target}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.allowable_variance}
                        </TableCell>

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.quarterly_target}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.responsibleDivision}
                        </TableCell>
                        {/* <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.actual_perfomance !== null &&
                          indicator.actual_perfomance !== 0
                            ? indicator.actual_perfomance
                            : "___"}
                        </TableCell> */}
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.perfomanceComment !== null &&
                          indicator.perfomanceComment !== 0
                            ? indicator.perfomanceComment.length > 20
                              ? `${indicator.perfomanceComment.substring(
                                  0,
                                  36
                                )}...`
                              : indicator.perfomanceComment
                            : "___"}
                        </TableCell>
                        <TableCell align="right" style={{ width: "10%" }}>
                          <Tooltip
                            title={
                              planStatus === "ResultsScorecard"
                                ? "Update disabled: Scorecard under pending approval"
                                : planStatus === "Approved"
                                ? "Now you can't edit since the Result Scorecard is now Approved"
                                : ""
                            }
                          >
                            <span>
                              <IconButton
                                disabled={
                                  planStatus === "ResultsScorecard" ||
                                  planStatus === "Approved"
                                }
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                onClick={() => handleUpdateRedirect(indicator)}
                              >
                                <ModeEditIcon
                                  sx={{
                                    fontSize: "15px",
                                    color:
                                      planStatus === "ResultsScorecard" ||
                                      planStatus === "Approved"
                                        ? "gray"
                                        : "green",
                                  }}
                                />
                              </IconButton>
                            </span>
                          </Tooltip>

                          <IconButton
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleIndicatorDialog(indicator)}
                          >
                            <VisibilityIcon
                              sx={{ fontSize: "15px", color: "green" }}
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}

                  <Dialog
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                  >
                    <DialogContent>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ mt: 6, fontWeight: "bold" }}
                        >
                          <InfoIcon
                            sx={{
                              fontSize: "15px",
                              color: "green",
                            }}
                          />{" "}
                          Indicator Details
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "570px",
                          marginRight: "0px",
                          marginLeft: "-14px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr",
                            width: "570px",
                          }}
                        >
                          <div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Indicator Name:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Indicator Weight:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Incremental/Decremental:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Annual Target:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Allowable Variance:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Quarterly Target:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Responsible Division:
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                Comment:
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ mt: 6 }}
                                style={{
                                  backgroundColor: "#ffffff",
                                  padding: "5px",
                                  border: "1px solid #ccc",
                                  width: "345%",
                                  height: "80px",
                                }}
                              >
                                {selectedIndicator &&
                                  selectedIndicator.perfomanceComment}
                              </Typography>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.description}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator && selectedIndicator.weight}
                                {selectedIndicator &&
                                  selectedIndicator.measurement_unit}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.incremental_or_decremental}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.annual_target}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.allowable_variance}
                                {selectedIndicator &&
                                  selectedIndicator.measurement_unit}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#ffffff",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.quarterly_target}
                                {selectedIndicator &&
                                  selectedIndicator.measurement_unit}
                              </Typography>
                            </div>
                            <div
                              style={{
                                backgroundColor: "#f5f5f5",
                                padding: "5px",
                              }}
                            >
                              <Typography variant="body2" sx={{ mt: 6 }}>
                                {selectedIndicator &&
                                  selectedIndicator.responsibleDivision}
                              </Typography>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Sheet
                        variant="outlined"
                        sx={{
                          width: 565,
                          height: 150,
                          maxHeight: 390,
                          overflow: "auto",
                          borderRadius: "sm",
                          mt: 1,
                          ml: -1,
                          p: 2,
                          backgroundColor: "#FFFFFF",
                          // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                          // borderTop: "7px solid #309366",
                          position: "relative",
                          elevation: 3,
                        }}
                      >
                        <List>
                          <ListItem nested key={performance.id}>
                            <ListSubheader
                              sticky
                              sx={{ mt: -2, textAlign: "center" }}
                            >
                              Attached Evidences
                            </ListSubheader>
                            <List>
                              {evidencesFileIds &&
                                evidencesFileIds &&
                                evidencesFileIds.map((evidence, index) => (
                                  <ListItem
                                    key={evidence && evidence.id}
                                    onClick={() =>
                                      handleDownloadEvidence(
                                        evidence && evidence.id,
                                        evidence && evidence.filename
                                      )
                                    }
                                    endAction={
                                      <div>
                                        <IconButton
                                          sx={{
                                            fontSize: "15px",
                                            color: "green",
                                            marginRight: "8px",
                                          }}
                                          onMouseEnter={() =>
                                            setIsHovered(true)
                                          }
                                          onMouseLeave={() =>
                                            setIsHovered(false)
                                          }
                                          onClick={() =>
                                            handleDeleteEvidence(
                                              evidence && evidence.id
                                            )
                                          }
                                        >
                                          {planStatus !== "ResultsScorecard" &&
                                            planStatus !== "Approved" && (
                                              <ClearIcon />
                                            )}
                                        </IconButton>
                                      </div>
                                    }
                                  >
                                    <ListItemButton>
                                      <PictureAsPdfIcon />
                                      {evidence && evidence.filename}
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                            </List>
                          </ListItem>
                        </List>
                      </Sheet>
                      <Sheet
                        variant="outlined"
                        sx={{
                          width: 565,
                          height: 150,
                          maxHeight: 390,
                          overflow: "auto",
                          borderRadius: "sm",
                          mt: 1,
                          ml: -1,
                          p: 2,
                          backgroundColor: "#FFFFFF",
                          // boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
                          // borderTop: "7px solid #309366",
                          position: "relative",
                          elevation: 3,
                        }}
                      >
                        <List>
                          <ListItem nested key={performance.id}>
                            <ListSubheader
                              sticky
                              sx={{ mt: -2, textAlign: "center" }}
                            >
                              Resources Assigned
                            </ListSubheader>
                            <List>
                              {selectedIndicator &&
                                selectedIndicator.responsibleResources &&
                                selectedIndicator.responsibleResources.map(
                                  (resource, index) => (
                                    <ListItem
                                      key={resource && resource.username}
                                      endAction={
                                        <div>
                                          {/* <IconButton
                                            sx={{
                                              fontSize: "15px",
                                              color: "green",
                                              marginRight: "8px",
                                            }}
                                            onMouseEnter={() =>
                                              setIsHovered(true)
                                            }
                                            onMouseLeave={() =>
                                              setIsHovered(false)
                                            }
                                            onClick={() =>
                                              handleDeleteResource(
                                                resource && resource.username
                                              )
                                            }
                                          >
                                            <ClearIcon />
                                          </IconButton> */}
                                        </div>
                                      }
                                    >
                                      <ListItemButton>
                                        <PersonOutlineIcon />
                                        {resource && resource.username}
                                      </ListItemButton>
                                    </ListItem>
                                  )
                                )}
                            </List>
                          </ListItem>
                        </List>
                      </Sheet>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => setModalOpen(false)}
                        color="primary"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                  
                  {/* Evidence Viewer Modal */}
                  {viewingEvidence && evidenceBlobUrl && (
                    <Dialog
                      open={true}
                      onClose={handleCloseEvidenceViewer}
                      maxWidth="lg"
                      fullWidth
                    >
                      <DialogTitle>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{viewingEvidence.filename}</span>
                          <IconButton onClick={handleCloseEvidenceViewer}>
                            <ClearIcon />
                          </IconButton>
                        </div>
                      </DialogTitle>
                      <DialogContent>
                        <iframe
                          src={evidenceBlobUrl}
                          style={{ width: '100%', height: '70vh', border: 'none' }}
                          title="Evidence Viewer"
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
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
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

const label = { inputProps: { "aria-label": "Checkbox demo" } };
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // January is 0, so we add 1

  let quarter;
  let daysRemaining;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    const endOfQuarter = new Date(currentYear, 2, 31); // March 31st
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    const endOfQuarter = new Date(currentYear, 5, 30); // June 30th
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    const endOfQuarter = new Date(currentYear, 8, 30); // September 30th
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    const endOfQuarter = new Date(currentYear, 11, 31); // December 31st
    const differenceInTime = endOfQuarter.getTime() - currentDate.getTime();
    daysRemaining = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    daysRemaining: daysRemaining,
  };
};

const getCurrentYear = () => new Date().getFullYear();

export default function ViewWorkingScoreCard() {
  const navigate = useNavigate();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [performanceAreas, setPerformanceAreas] = React.useState([]);
  const [clicked, setClicked] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedPerfomance, setSelectedPerfomance] = useState([]);
  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState("");
  const [selectedProgramIndex, setSelectedProgramIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [workplanStatus, setWorkplanStatus] = useState("");

  // State for backend quarter status
  const [currentOpenQuarter, setCurrentOpenQuarter] = useState(null);
  const [quarterLoading, setQuarterLoading] = useState(true);

  // Get default calendar-based period as fallback
  const defaultPeriod = getCurrentEvaluationPeriod();
  const { evaluationPeriod, dateRange, daysRemaining } = defaultPeriod;

  // Get current year for display
  const currentYear = new Date().getFullYear();

  const [responseBody, setResponseBody] = useState([]);
  const { userName, setUserName, userType, setUserType } = useStateContext();
  const [profileData, setProfileData] = useState(" ");
  const [error, setError] = useState(null);
  const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];

  const [planStatus, setPlanStatus] = useState("");

  const tabItem3Styles = useGmailTabItemStyles({ color: indicatorColors[2] });

  // Fetch current open quarter from backend
  useEffect(() => {
    const fetchQuarterStatus = async () => {
      try {
        const response = await axiosClient.get("/evaluation_periods/current-status");
        const quarterData = response.data;
        
        if (quarterData.hasOpenQuarter && quarterData.currentQuarter) {
          setCurrentOpenQuarter(quarterData.currentQuarter);
          console.log("Current open quarter from backend:", quarterData.currentQuarter);
        } else {
          console.log("No open quarter found in backend");
        }
        setQuarterLoading(false);
      } catch (error) {
        console.error("Error fetching quarter status:", error);
        setQuarterLoading(false);
      }
    };

    fetchQuarterStatus();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // useEffect(() => {
  //   axiosClient.get("/Performance_Area/allAreas").then((response) => {
  //     setPerformanceAreas(response.data);
  //     console.log(response.data);

  //   });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/User/{id}?id=${userName}`);
        setProfileData(response.data);
        console.log("My Appraiser profile");
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchData();
  }, [userName]);

  useEffect(() => {
    const fetchData = async () => {
      const appraiseeWorkplanArray = [];
      if (profileData) {
        try {
          // Use backend quarter if available, otherwise fall back to calendar-based period
          const periodToUse = currentOpenQuarter || evaluationPeriod;
          
          // Fetch ALL scorecards without period filter, then filter locally
          const response = await axiosClient.get("/scorecard/searchScorecard", {
            params: {
              username: userName,
              page: 0,
              size: 100, // Get up to 100 scorecards
            },
          });
          console.log("All Appraisee Scorecards (unfiltered):");
          console.log(response.data);

          // Get current open quarter from backend if not already set
          let currentQuarter = currentOpenQuarter;
          if (!currentQuarter) {
            try {
              const quarterResponse = await axiosClient.get("/evaluation_periods/current-status");
              if (quarterResponse.data.hasOpenQuarter) {
                currentQuarter = quarterResponse.data.currentQuarter;
              }
            } catch (qError) {
              console.error("Error fetching quarter:", qError);
            }
          }

          console.log("Filtering for quarter:", currentQuarter);

          // Filter scorecards to only show those matching the current open quarter
          let filteredScorecards = response.data;
          if (response.data && response.data.content) {
            filteredScorecards = {
              ...response.data,
              content: response.data.content.filter(
                (scorecard) => scorecard.evaluationPeriod === currentQuarter
              )
            };
          } else if (response.data && Array.isArray(response.data)) {
            // Handle case where response is an array directly
            filteredScorecards = {
              content: response.data.filter(
                (scorecard) => scorecard.evaluationPeriod === currentQuarter
              )
            };
          }

          console.log("Filtered Scorecards (only matching quarter):", filteredScorecards);
          appraiseeWorkplanArray.push(filteredScorecards);
          setResponseBody(filteredScorecards);
          console.log(appraiseeWorkplanArray);

          // Check if filtered scorecards exist
          const scorecardContent = filteredScorecards?.content || (Array.isArray(filteredScorecards) ? filteredScorecards : []);
          
          if (scorecardContent.length > 0 && scorecardContent[0].areasOfPerformance) {
            const areasOfPerformance = scorecardContent[0].areasOfPerformance;
            console.log("performance Scorecard", areasOfPerformance);
            setPerformanceAreas(areasOfPerformance);
            setPlanStatus(scorecardContent[0].scorecardStatus);
          } else {
            // No scorecard for current quarter - show empty state
            console.log("No scorecard found for current quarter:", currentQuarter);
            setPerformanceAreas([]);
            setPlanStatus("");
          }
        } catch (error) {
          console.error(error);
          // Show empty state on error
          setPerformanceAreas([]);
          setPlanStatus("");
        }
      }
    };

    fetchData();
  }, [profileData, currentOpenQuarter, evaluationPeriod, userName]);

  const handlePerformanceClick = (area, index) => {
    console.log("Perfomance clicked", area);

    setSelectedPerfomance(area);
    setSelectedPerfomanceArea(area.performanceArea);
    setSelectedPerfomanceIndex(index);
    console.log("Perfomance", index);

    // const updatedPerformanceArea = performanceAreas.find(
    //   (area) => area.performanceArea === selectedPerfomanceArea
    // );
  };

  const handleWorkplanStatusChange = (event) => {
    setWorkplanStatus(event.target.value);
  };

  const handleOutcomeItemClick = (program, index) => {
    console.log("Program clicked", program);
    console.log("Outcome ", program);
    console.log("Program index selected", index);

    setSelectedOutcomes(program);

    setSelectedProgramIndex(index);
  };

  const handleInputClick = () => {
    setMessage("");
  };

  // const submitWorkPlan = (e) => {
  //   e.preventDefault();

  //   const workplan = {
  //     appraiser_email: "tdube1",
  //     AreasOfPerformance: performanceAreas,
  //     user_email: userName, //muchoko
  //     evaluator_email: "pmuleya",
  //     evaluationPeriod: evaluationPeriod,
  //     workplanStatus: "Approved",
  //   };

  //   const checkboxSelected = document.getElementById("appraiseeId").checked;
  //   if (!checkboxSelected) {
  //     swal({
  //       text: "Please sign before sending the Workplan",
  //       icon: "success",
  //       button: "OK!",
  //     });
  //     console.log("Checkbox not selected. Data cannot be posted.");
  //     return;
  //   }
  //   axiosClient.post("workplan/save", workplan).then((res) => {
  //     console.log(res);
  //     swal({
  //       text: "Workplan Saved Successfully",
  //       icon: "success",
  //       button: "OK!",
  //     });
  //   });
  // };

  const handleSubmitWorkplan = (e) => {
    e.preventDefault();
    if (planStatus === "PendingApproval") {
      alert("You Workplan is Waiting for approval");
    } else {
      axiosClient
        .get("/workplan/searchWorkplan", {
          params: {
            period: evaluationPeriod,
            username: userName,
          },
        })
        .then((res) => {
          const workplan = res.data;
          if (workplan.content && workplan.content.length > 0) {
            // There is an existing workplan, so update it
            console.log(
              "There is an existing workplan, so update it",
              res.data
            );
            console.log("My ID: " + res.data.content[0].id);
            const myWorkplanId = res.data.content[0].id;

            console.log(res.data.content[0].AreasOfPerformance);

            const updatedWorkplan = {
              ...workplan.content[0],
              workplanStatus: "PendingApproval",
            };

            console.log("updatedWorkplan", updatedWorkplan);

            try {
              axiosClient
                .put(
                  `/workplan/updateWorkplan/${myWorkplanId}`,
                  updatedWorkplan
                )
                .then((res) => {
                  console.log("Backend Response:", res);
                  if (res.status === 200) {
                    swal({
                      text: "Workplan Submitted Successfully",
                      icon: "success",
                      button: "OK!",
                    });
                    navigate("/viewWorkPlan");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } catch (error) {
              console.log("An error occurred:", error);
            }
          } else {
            swal({
              text: "You have no workplan to submit!",
              icon: "warning",
              button: "OK!",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          ml: 50,
          display: "flex",
          backgroundColor: "white",
          width: "400px",
          border: "1px solid #B4B2A9",
          borderRadius: "6px",
        }}
      >
        {" "}
        <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 2 }}>
          <strong style={{ marginLeft: "145px", textAlign: "center" }}>
            {" "}
            MY WORKING SCORECARD
          </strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 90, marginTop: 10, display: "flex" }}>
        <div style={{ marginRight: 20 }}>
          <Typography className="" sx={{ fontSize: 12 }}>
            <strong>
              Current Year Of Assessment:{" "}
              <span style={{ color: "#309366" }}>
                {!quarterLoading && currentOpenQuarter ? currentOpenQuarter : evaluationPeriod}
              </span>
            </strong>
          </Typography>
        </div>
        <div>
          <Typography className="">
            <strong>
              Current Quarter Ends In:{" "}
              <span style={{ color: "#f44336" }}>{daysRemaining} days</span>
            </strong>
          </Typography>
        </div>
      </div>
      {/* <div style={{ position: "absolute", top: 60, right: 40 }}>
        <select
          className="input2 animate__animated animate__bounceIn"
          value={workplanStatus}
          onChange={handleWorkplanStatusChange}
          placeholder="Worlpan status"
          style={{
            width: 190,
            height: 40,
            backgroundColor: "#f9f6f6",
          }}
        >
          <option>WORKPLAN STATUS...</option>
          <option value="%">Incomplete</option>
          <option value="$">Complete</option>
        </select>{" "}
      </div> */}
      <div className={classes.root}>
        {/* Show message when no scorecard found for current quarter */}
        {!quarterLoading && performanceAreas.length === 0 && (
          <Box sx={{ ml: 4, mt: 2, p: 3, bgcolor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="h6" color="error" gutterBottom>
              No Working Scorecard Found for Current Quarter
            </Typography>
            <Typography variant="body1">
              There is no working scorecard for the current evaluation period. 
              {currentOpenQuarter ? 
                `The current open quarter is ${currentOpenQuarter}.` : 
                "No quarter is currently open in the system."}
            </Typography>
            {!currentOpenQuarter && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Please contact the administrator to open a new quarter.
              </Typography>
            )}
          </Box>
        )}

        {performanceAreas.length > 0 && (
          <>
            <Box
          sx={{
            mt: 1,
            ml: 4,
            width: "95%",
            typography: "body1",
            fontWeight: "bold",
            borderRadius: 20,
            backgroundColor: "#e7e7e7",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            // textColor="secondary"
            // indicatorColor="secondary"
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {performanceAreas.map((area, index) => (
              <Tab
                classes={tabItem3Styles}
                key={index}
                label={area.performanceArea}
                onClick={() => handlePerformanceClick(area, index)}
                sx={{
                  fontSize: 8,
                  color: "black",
                  fontWeight: "bold",
                  fontStyle: "sans-serif",
                }}
              />
            ))}
            {/* <Tab label="Summary Scores" />
          <Tab label="Signatures" /> */}
          </Tabs>
        </Box>

        {performanceAreas.map((area, index) => (
          <TabPanel key={index} value={value} index={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                {area.section} - IRBM {area.performanceArea} (
                <span style={{ color: "green" }}>{area.weight}%</span>)
              </h6>
              {/* <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                Score Status:{" "}
                {planStatus === "scorecardStatus"
                  ? "Pending Approval"
                  : planStatus}
              </Typography> */}
            </div>

            <div className="">
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexWrap: "wrap",
                  "& > :not(style)": {
                    m: 1,
                    width: 1450,
                    height: 520,
                  },
                }}
              >
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    {/* <caption>A basic table example with a caption</caption> */}
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>Program</TableCell>
                        <TableCell align="center">Weight&nbsp;(%)</TableCell>
                        <TableCell align="center">
                          Current Evaluation Period
                        </TableCell>

                        <TableCell align="center">
                          Total Number of Indicators
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {area.programs &&
                        area.programs.map((program, index) => (
                          <Row
                            key={index}
                            program={program}
                            area={area}
                            planStatus={planStatus}
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {/* <Typography
                  style={{ marginLeft: "150px", marginRight: "50px" }}
                >
                  Total Weight:
                </Typography>
                <Typography
                  style={{
                    color: "#5c5c11",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginRight: "350px",
                  }}
                >
                  30.0%
                </Typography>
                <Typography>Total Weighted Score: ____</Typography> */}
              </div>
            </div>
            <br />
            <div>
              <Typography
                style={{
                  color: "green",
                }}
              >
                Section A1 : Delivery of Mandates / Operations in the Agency
                Integrated Performance Agreement - Evaluation of Outcomes
              </Typography>
              <Typography style={{}}>
                Current Evaluation Period : 01 July - 30 September {currentYear}
              </Typography>
              <Typography>Name of Appraiser : _____________ </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography>Designation : _____________ </Typography>

                {/* <div
                  className="btn-saveWorkPlan "
                  style={{
                    marginLeft: "550px",
                  }}
                >
                  <button
                    onClick={handleSubmitWorkplan}
                    className="workplan-btn"
                    style={{
                      borderRadius: "25px",
                      marginLeft: "180px",
                      width: "160px",
                      marginTop: "-70px",
                    }}
                    // disabled={planStatus === "PendingApproval"}
                  >
                    Submit For Approval
                  </button>
                </div> */}
              </div>
            </div>
          </TabPanel>
        ))}
          </>
        )}
      </div>
    </>
  );
}
