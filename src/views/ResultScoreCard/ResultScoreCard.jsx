import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import "./resultScoreCard.scss";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import InfoIcon from "@mui/icons-material/Info";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import DeleteIcon from "@mui/icons-material/Delete";

import WorkPlanData from "../../components/WorkPlanData/workplandata";
import SummaryScores from "../../components/SummaryScores/SummaryScores";
import Signatures from "../../components/Signatures/Signatures";
import axiosClient from "../../authentication/axios-client";
import { useTheme, useMediaQuery } from "@material-ui/core";
import Tooltip from "@mui/material/Tooltip";

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
import { useNavigate, useParams } from "react-router-dom";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Checkbox from "@mui/material/Checkbox";
import { KeyboardArrowUp, KeyboardArrowDown } from "@material-ui/icons";
import ArticleIcon from "@mui/icons-material/Article";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ClearIcon from "@mui/icons-material/Clear";
import CommentIcon from "@mui/icons-material/Comment";

import {
  useGmailTabsStyles,
  useGmailTabItemStyles,
} from "@mui-treasury/styles/tabs";
import swal from "sweetalert";
import { useStateContext } from "../../context/ContextProvider";
import { FaRegFilePdf } from "react-icons/fa";

import * as XLSX from "xlsx";
import ExcelJS from "exceljs";

import { saveAs } from "file-saver";

const getCurrentYear = () => new Date().getFullYear();

function Row({
  program,
  programs,
  area,
  planStatus,
  totalWeightedScore,
  overallPerformanceAreasScore,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [evidenceId, setEvidenceId] = useState("");
  const [evidencesFileIds, setEvidencesFileIds] = useState(
    selectedIndicator?.evidenceFileIds || []
  );
  const [scorecardStatus, setScorecardStatus] = useState(planStatus);

  const [isHovered, setIsHovered] = useState(false);
  const [message, setMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    const totalAgreedScorePerformances =
      totalWeightedScore - indicator.agreedWeightedScore;
    const overallAgreedScorePerformances =
      overallPerformanceAreasScore - area.performance_area_score;
    
    // Encode the indicator name for use as a URL parameter
    const indicatorName = encodeURIComponent(indicator.description);
    
    navigate(`/add_actual_performance?indicatorName=${indicatorName}`, {
      state: {
        indicator,
        program,
        area,
        totalAgreedScorePerformances,
        overallAgreedScorePerformances,
      },
    });
  };

  const [viewingEvidence, setViewingEvidence] = useState(null);
  const [evidenceBlobUrl, setEvidenceBlobUrl] = useState(null);
  
  const handleDownloadEvidence = async (attachedId, filename) => {
    console.log("handleDownloadEvidence called with:", attachedId, filename);
    
    // Debug: Check if we have valid IDs
    if (!attachedId) {
      console.error("No attachedId provided!");
      alert("Error: No file ID found. Please refresh and try again.");
      return;
    }
    
    // Check for token
    const token = localStorage.getItem('ACCESS_TOKEN');
    console.log("Token found:", token ? "yes" : "no");
    
    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    try {
      console.log("Making API request to /file/download/", attachedId);
      
      // Use axiosClient with arraybuffer response type for direct access to binary data
      const response = await axiosClient.get(`/file/download/${attachedId}`, {
        responseType: "arraybuffer"
      });

      console.log("File download response status:", response.status);
      
      // Determine file type from filename
      const fileExtension = filename ? filename.split('.').pop().toLowerCase() : '';
      console.log("File extension:", fileExtension);
      
      // Create blob from arraybuffer for viewing - no need for Uint8Array anymore
      const blob = new Blob([response.data]);
      const blobUrl = URL.createObjectURL(blob);
      
      console.log("Blob URL created:", blobUrl);
      
      // Store the blob/file URL and set viewing state to show in modal
      setEvidenceBlobUrl(blobUrl);
      setViewingEvidence({ 
        filename: filename || 'document', 
        attachedId,
        fileType: fileExtension
      });
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
  useEffect(() => {
    console.log(scorecardStatus);
  });

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
                      Target for {currentYear}(%)
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
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Appraisee Score for {evaluationPeriod}
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Agreed Weighted Score
                    </TableCell>
                    <TableCell align="right" style={{ width: "10%" }}>
                      Actual Performance from Appraiser
                    </TableCell>

                    <TableCell align="right" style={{ width: "10%" }}>
                      Edit
                    </TableCell>
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

                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.perfomanceComment &&
                          indicator.perfomanceComment.length > 20
                            ? `${indicator.perfomanceComment.substring(
                                0,
                                36
                              )}...`
                            : indicator.perfomanceComment}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.appraisee_actual_perfomance !== null &&
                          indicator.appraisee_actual_perfomance !== undefined &&
                          indicator.appraisee_actual_perfomance !== "" &&
                          !isNaN(parseFloat(indicator.appraisee_actual_perfomance))
                            ? indicator.appraisee_actual_perfomance
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.appraiseeScore !== null &&
                          indicator.appraiseeScore !== undefined &&
                          indicator.appraiseeScore !== "" &&
                          !isNaN(parseFloat(indicator.appraiseeScore))
                            ? indicator.appraiseeScore
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          {indicator.agreedWeightedScore !== null &&
                          indicator.agreedWeightedScore !== undefined &&
                          indicator.agreedWeightedScore !== "" &&
                          !isNaN(parseFloat(indicator.agreedWeightedScore))
                            ? indicator.agreedWeightedScore
                            : "___"}
                        </TableCell>
                        <TableCell align="center" style={{ width: "10%" }}>
                          ___
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
                          {/* <IconButton
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleUpdateRedirect(indicator)}
                          >
                            <ModeEditIcon
                              sx={{ fontSize: "10px", color: "green" }}
                            />
                          </IconButton> */}
                          <IconButton
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => handleIndicatorDialog(indicator)}
                          >
                            <VisibilityIcon
                              sx={{ fontSize: "10px", color: "green" }}
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
                        {viewingEvidence && evidenceBlobUrl ? (
                          <Box sx={{ width: '100%', height: '70vh' }}>
                            {/* For PDF files - use iframe */}
                            {viewingEvidence.fileType === 'pdf' ? (
                              <iframe
                                src={evidenceBlobUrl}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                title="PDF Viewer"
                              />
                            ) : viewingEvidence.fileType === 'docx' || viewingEvidence.fileType === 'doc' || viewingEvidence.fileType === 'xlsx' || viewingEvidence.fileType === 'xls' ? (
                              /* For Office documents - show download options */
                              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1" gutterBottom>
                                  {viewingEvidence.fileType === 'docx' || viewingEvidence.fileType === 'doc' 
                                    ? "Word documents cannot be previewed directly." 
                                    : "Excel spreadsheets cannot be previewed directly."}
                                </Typography>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = evidenceBlobUrl;
                                    link.download = viewingEvidence.filename;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  sx={{ mt: 2 }}
                                >
                                  Download Document
                                </Button>
                              </Box>
                            ) : (
                              /* For images - display directly */
                              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <img
                                  src={evidenceBlobUrl}
                                  alt={viewingEvidence.filename}
                                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Typography>Unable to load file preview.</Typography>
                        )}
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

export default function ResultScoreCard() {
  const navigate = useNavigate();
  const { username } = useParams(); // Get username from URL if provided (for HC/admin viewing other users)
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [performanceAreas, setPerformanceAreas] = React.useState([]);
  const [clicked, setClicked] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [selectedOutcomes, setSelectedOutcomes] = useState([]);
  const [selectedPerfomance, setSelectedPerfomance] = useState(null);
  const [totalWeightedScore, setTotalWeightedScore] = useState(0);
  const [totalProgramsWeight, setTotalProgramsWeight] = useState(0);
  const [selectedPerfomanceArea, setSelectedPerfomanceArea] = useState("");
  const [selectedPerfomanceIndex, setSelectedPerfomanceIndex] = useState("");
  const [selectedProgramIndex, setSelectedProgramIndex] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [workplanStatus, setWorkplanStatus] = useState("");
  const [clickedComment, setClickedComment] = useState(false);
  const [scorecardComment, setScorecardComment] = useState("");

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
  
  // Use username from URL if provided (for HC/admin viewing), otherwise use logged-in user
  const targetUserName = username || userName;
  
  const [profileData, setProfileData] = useState(" ");
  const [error, setError] = useState(null);
  const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];
  const [
    overallPerformanceAreasScore,
    setOverallPerformanceAreasScore,
  ] = useState(null);

  const [planStatus, setPlanStatus] = useState("");

  // Calculate period to use for display
  const periodToUse = currentOpenQuarter || evaluationPeriod;

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data for the target user (not the logged-in user)
        const response = await axiosClient.get(`/User/${targetUserName}`);
        setProfileData(response.data);
        console.log("Target User profile for scorecard:");
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        console.error(error);
      }
    };

    fetchData();
  }, [targetUserName]);

  useEffect(() => {
    const fetchData = async () => {
      const appraiseeWorkplanArray = [];
      if (profileData) {
        try {
          // Use backend quarter if available, otherwise fall back to calendar-based period
          const periodToUse = currentOpenQuarter || evaluationPeriod;
          
          console.log("Fetching scorecards for period:", periodToUse);
          console.log("Target username:", targetUserName);
          
          // First try with period filter
          let response = await axiosClient.get("/scorecard/searchScorecard", {
            params: {
              username: targetUserName,
              period: periodToUse,
              page: 0,
              size: 10,
            },
          });
          
          console.log("Scorecard API Response with period:");
          console.log(response.data);

          // If no results with period, try without period filter
          if (!response.data?.content?.length && !Array.isArray(response.data) || 
              (response.data?.content?.length === 0) || 
              (Array.isArray(response.data) && response.data.length === 0)) {
            console.log("No scorecard with period, trying without period filter...");
            response = await axiosClient.get("/scorecard/searchScorecard", {
              params: {
                username: targetUserName,
                page: 0,
                size: 10,
              },
            });
            console.log("Scorecard API Response without period:");
            console.log(response.data);
          }

          // Use response directly - backend already filtered by period
          const filteredScorecards = response.data;
          appraiseeWorkplanArray.push(filteredScorecards);
          setResponseBody(filteredScorecards);
          console.log(appraiseeWorkplanArray);

          // Get the scorecard content
          const scorecardContent = filteredScorecards?.content || (Array.isArray(filteredScorecards) ? filteredScorecards : []);
          
          if (scorecardContent.length > 0 && scorecardContent[0].areasOfPerformance) {
            const areasOfPerformance = scorecardContent[0].areasOfPerformance;
            console.log("performance Scorecard", areasOfPerformance);

            setPlanStatus(scorecardContent[0].scorecardStatus);
            setScorecardComment(scorecardContent[0].scorecardStatusComment);

            if (areasOfPerformance && areasOfPerformance.length > 0) {
              const firstPerformanceArea = areasOfPerformance[0];
              console.log("first Performance Area", firstPerformanceArea);
              setSelectedPerfomance(firstPerformanceArea);
              setPerformanceAreas(areasOfPerformance);

              let totalPerformanceAreasScore = 0;

              performanceAreas.forEach((performanceArea) => {
                totalPerformanceAreasScore +=
                  performanceArea.performance_area_score;
              });

              setOverallPerformanceAreasScore(totalPerformanceAreasScore);

              console.log(totalPerformanceAreasScore);
            }
            handlePerformanceClick(selectedPerfomance, 0);
          } else {
            // No scorecard for current quarter - show empty state
            console.log("No scorecard found for current quarter:", currentQuarter);
            setPerformanceAreas([]);
            setPlanStatus("");
            setScorecardComment("");
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
  }, [
    profileData,
    selectedPerfomance,
    totalWeightedScore,
    totalProgramsWeight,
    currentOpenQuarter,
    evaluationPeriod,
    targetUserName
  ]);

  const handlePerformanceClick = async (area, index) => {
    console.log("Performance clicked", area);
    if (area && area.performanceArea) {
      setSelectedPerfomance(area);
      setSelectedPerfomanceArea(area.performanceArea);
      setSelectedPerfomanceIndex(index);
      console.log("Performance", index);
      const sumOfAgreedWeightedScores = await new Promise((resolve) => {
        const sum = area?.programs?.reduce((sum, program) => {
          const programAgreedWeightedScores = program.indicators.reduce(
            (programSum, indicator) =>
              programSum + indicator.agreedWeightedScore,
            0
          );
          return sum + programAgreedWeightedScores;
        }, 0);
        resolve(sum);
      });

      console.log(sumOfAgreedWeightedScores);

      setTotalWeightedScore(sumOfAgreedWeightedScores);
      const sumOfWeights = area?.programs?.reduce(
        (sum, program) => sum + program.weight,
        0
      );
      console.log(sumOfWeights);
      setTotalProgramsWeight(sumOfWeights);
    }
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

  //888888888888888888888888 WORKING REPORT GENERATION FUNCTION8888888888888888888888888888888888
  // const handleDownloadExcel = (performanceA) => {
  //   const workbook = new ExcelJS.Workbook();

  //   performanceA.forEach((performanceArea) => {
  //     const worksheet = workbook.addWorksheet(performanceArea.performanceArea);

  //     // Define the columns for the worksheet
  //     worksheet.columns = [
  //       { key: "Program", width: 30 },
  //       { key: "Indicator", width: 30 },
  //       { key: "MeasurementUnit", width: 20 },
  //       { key: "Weight", width: 10 },
  //       {
  //         key: "PreviousYearPerformance",
  //         width: 20,
  //       },
  //       { key: "AnnualTarget", width: 15 },
  //       { key: "QuarterlyTarget", width: 15 },
  //       { key: "AllowableVariance", width: 20 },
  //       {
  //         key: "ActualQ42022Performance",
  //         width: 20,
  //       },
  //       {
  //         key: "ApraiseeScoreQ42022",
  //         width: 20,
  //       },
  //       {
  //         key: "AgreedWeightedScore",
  //         width: 20,
  //       },
  //       {
  //         key: "ResponsibleDivision",
  //         width: 20,
  //       },
  //       {
  //         key: "CommentOnPerformance",
  //         width: 30,
  //       },
  //       {
  //         key: "EvidenceOfPerformance",
  //         width: 30,
  //       },
  //       { key: "AppraisersScore", width: 20 },
  //       { key: "AgreedScore", width: 20 },
  //     ];

  //     // Apply styles to the first row
  //     const headerRow1 = worksheet.getRow(1);
  //     headerRow1.getCell(4).value =
  //       "ZIMRA INTEGRATED RESULTS BASED PERFORMANCE MANAGEMENT (IRBM) CONTRACT MATRIX";
  //     headerRow1.getCell(4).alignment = { horizontal: "center" };
  //     headerRow1.height = 30;
  //     headerRow1.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FF00B050" },
  //     };
  //     headerRow1.font = {
  //       bold: true,
  //       color: { argb: "FFFFFFFF" },
  //     };

  //     worksheet.mergeCells("D1:P1");
  //     worksheet.getCell("D1").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };

  //     // Apply styles to the Third(3) row
  //     const headerRow3 = worksheet.getRow(3);
  //     headerRow3.getCell(
  //       3
  //     ).value = `Section ${performanceArea.section} : Delivery of Mandates / Operations in the Agency Integrated Performance Agreement - ${performanceArea.performanceArea} (${performanceArea.weight}%)`;
  //     headerRow3.getCell(3).alignment = { horizontal: "center" };
  //     headerRow3.height = 20;
  //     headerRow3.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FF00B050" },
  //     };
  //     headerRow3.font = {
  //       bold: true,
  //       color: { argb: "FFFFFFFF" },
  //     };

  //     worksheet.mergeCells("C3:P3");
  //     worksheet.getCell("C3").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };

  //     // Appraisee Information Row
  //     const headerRow5 = worksheet.getRow(5);
  //     headerRow5.getCell(
  //       1
  //     ).value = `Name of Incument: R. Chinamasa`;
  //     headerRow5.getCell(
  //       4
  //     ).value = `Name of Appraisor : Mr A. Mandiwanza`;
  //     worksheet.getCell("C3").alignment = {
  //       width: 30,

  //     };
  //     headerRow5.getCell(
  //       9
  //     ).value = "Current Evaluation Period:01 October - 31 December 2022";
  //     // headerRow5.getCell(1).alignment = { horizontal: "center" };
  //     headerRow5.height = 20;
  //     headerRow5.font = {
  //       bold: true,

  //     };

  //     const headerRow6 = worksheet.getRow(6);
  //     headerRow6.getCell(
  //       1
  //     ).value = "Designation	Commissioner General";
  //     headerRow6.getCell(
  //       4
  //     ).value = `Designation : ZIMRA Board Chairperson`;

  //     // headerRow6.getCell(1).alignment = { horizontal: "center" };
  //     headerRow6.height = 20;
  //     headerRow6.font = {
  //       bold: true,

  //     };

  //     worksheet.mergeCells("A6:B6");
  //     worksheet.getCell("A6").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };

  //     worksheet.mergeCells("D5:H5");
  //     worksheet.getCell("D3").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };
  //     worksheet.mergeCells("D6:H6");
  //     worksheet.getCell("D6").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };
  //     worksheet.mergeCells("I5:K5");
  //     worksheet.getCell("I5").alignment = {
  //       vertical: "middle",
  //       horizontal: "left",
  //       wrapText: true,
  //     };

  //     worksheet.getRow(7).values = [
  //       "Program Name",
  //       "Indicator",
  //       "Measurement Unit",
  //       "Weight (%)",
  //       "Previous year Performance",
  //       "Annual Target",
  //       "Quarterly Target",
  //       "Allowable Variance",
  //       "Actual Q4 2022 Performance",
  //       "Apraisee Score for Q4 2022",
  //       "Agreed Weighted Score",
  //       "Responsible Division",
  //       "Comment on Performance",
  //       "Evidence of Performance",
  //       "Appraiser's Score",
  //     ];

  //     // Skip the first 3 rows for the data

  //     // Apply styles to header row 4
  //     const headerRow = worksheet.getRow(7);
  //     headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  //     headerRow.fill = {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FF0000FF" },
  //     };

  //     // Perfomance Data starting at Row 5

  //     let currentRow = 8;
  //     let startRow = currentRow;
  //     let previousProgramName = "";
  //     performanceArea.programs.forEach((program) => {
  //       const programName = program.name;

  //       if (programName !== previousProgramName) {
  //         startRow = currentRow;
  //       }

  //       program.indicators.forEach((indicator) => {
  //         const programNameForIndicator =
  //           programName !== previousProgramName ? programName : "";
  //         worksheet.addRow({
  //           Program: programNameForIndicator,
  //           Indicator: indicator.description,
  //           MeasurementUnit: indicator.measurement_unit,
  //           Weight: indicator.weight,
  //           PreviousYearPerformance: indicator.Previous_year_Perfomenace,
  //           AnnualTarget: indicator.annual_target,
  //           QuarterlyTarget: indicator.quarterly_target,
  //           AllowableVariance: indicator.allowable_variance,
  //           ActualQ42022Performance: indicator.appraisee_actual_perfomance,
  //           ApraiseeScoreQ42022: indicator.appraiseeScore,
  //           AgreedWeightedScore: indicator.agreedWeightedScore,
  //           ResponsibleDivision: indicator.responsibleDivision,
  //           CommentOnPerformance: "", // Placeholder for comments
  //           EvidenceOfPerformance: "", // Placeholder for evidence
  //           AppraisersScore: indicator.appraisor_actual_perfomance,
  //           AgreedScore: indicator.agreedWeightedScore,
  //         });
  //         currentRow++;
  //       });

  //       // Merge cells for the program name
  //       if (programName !== previousProgramName) {
  //         try {
  //           worksheet.mergeCells(`A${startRow}`, `A${currentRow - 1}`);
  //           const mergedCell = worksheet.getCell(`A${startRow}`);
  //           // Log before setting alignment
  //           console.log(
  //             `Before setting alignment: ${JSON.stringify(
  //               mergedCell.alignment
  //             )}`
  //           );

  //           mergedCell.alignment = {
  //             vertical: "middle",
  //             horizontal: "right",
  //             wrapText: true,
  //           };
  //           mergedCell.font = {
  //             bold: true,
  //           };

  //           // Log after setting alignment
  //           console.log(
  //             `After setting alignment: ${JSON.stringify(mergedCell.alignment)}`
  //           );
  //         } catch (error) {
  //           console.error("Error occurred while merging cells:", error);
  //         }
  //       }

  //       previousProgramName = programName;
  //     });

  //     // Apply wrap text to the entire sheet
  //     worksheet.eachRow((row) => {
  //       row.eachCell((cell) => {
  //         cell.alignment = { wrapText: true };
  //       });
  //     });
  //   });

  //   // Generate the Excel file and save it
  //   workbook.xlsx.writeBuffer().then((buffer) => {
  //     const blob = new Blob([buffer], { type: "application/octet-stream" });
  //     saveAs(blob, "performance_data.xlsx");
  //   });
  // };

  //////////////////////888888888888888888888888888888888888888888//////////////////////////////////
  const handleDownloadExcel = (performanceA) => {
    const workbook = new ExcelJS.Workbook();

    // Create the "SUMMARY SCORES" worksheet and set it as the first tab
    const summaryWorksheet = workbook.addWorksheet("SUMMARY SCORES");

    summaryWorksheet.getRow(7).values = [
      "Section",
      "Performance Area",
      "Weight(%)",
      "Weighted Score",
    ];

    summaryWorksheet.columns = [
      { key: "section", width: 15 },
      { key: "performanceArea", width: 45 },
      { key: "weight", width: 15 },
      { key: "weightedScore", width: 15 },
    ];
    // Start adding data to the summary table from row 5
    let summaryRow = 7;
    performanceA.forEach((performanceArea) => {
      summaryWorksheet.addRow({
        section: performanceArea.section,
        performanceArea: performanceArea.performanceArea,
        weight: performanceArea.weight,
        weightedScore: performanceArea.performance_area_score || "",
      });
      summaryRow++;
    });
    // Add Total Weighted Score row after the summary table, the headings are acting as keys
    const totalWeightedScoreRow = summaryWorksheet.addRow({
      section: "Total Weighted Score (after adjustment for Not Rated)",
      performanceArea: "",
      weight: "",
      weightedScore: `${overallPerformanceAreasScore}`,
    });

    // Merge cells for the Total Weighted Score row
    summaryWorksheet.mergeCells(
      `A${totalWeightedScoreRow.number}:C${totalWeightedScoreRow.number}`
    );

    // Apply styles to the Total Weighted Score row
    totalWeightedScoreRow.eachCell((cell) => {
      cell.alignment = { horizontal: "left" };
      cell.font = { bold: true };
    });

    // Apply styles to header row 4
    const headerRow = summaryWorksheet.getRow(7);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0000FF" },
    };

    const headerSummaryRow1 = summaryWorksheet.getRow(1);
    headerSummaryRow1.getCell(3).value =
      "COMMISSIONER GERERAL'S IRBM PEFORMANCE CONTRACT EVALUATION";
    headerSummaryRow1.getCell(3).alignment = { horizontal: "left" };
    headerSummaryRow1.height = 30;
    headerSummaryRow1.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF0000CD" },
    };
    headerSummaryRow1.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    const headerSummaryRow3 = summaryWorksheet.getRow(3);
    headerSummaryRow3.getCell(2).value = "SUMMARY SCORES";
    headerSummaryRow3.getCell(2).alignment = { horizontal: "left" };
    headerSummaryRow3.height = 30;

    headerSummaryRow3.font = {
      bold: true,
    };

    const headerSummaryRow5 = summaryWorksheet.getRow(5);
    headerSummaryRow5.getCell(1).value =
      "Appraisal Period	: 01 October - 31 December 2024";
    headerSummaryRow5.getCell(1).alignment = { horizontal: "center" };
    headerSummaryRow5.height = 30;
    headerSummaryRow5.font = {
      bold: true,
    };

    summaryWorksheet.mergeCells("C1:P1");
    summaryWorksheet.getCell("C1").alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };
    summaryWorksheet.mergeCells("B3:K3");
    summaryWorksheet.getCell("B3").alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    summaryWorksheet.mergeCells("A5:K5");
    summaryWorksheet.getCell("A5").alignment = {
      vertical: "middle",
      horizontal: "left",
      wrapText: true,
    };

    // Iterate through performanceA to create other worksheets
    performanceA.forEach((performanceArea) => {
      const worksheet = workbook.addWorksheet(performanceArea.performanceArea);

      // Define the columns for the worksheet
      worksheet.columns = [
        { key: "Program", width: 30 },
        { key: "Indicator", width: 30 },
        { key: "MeasurementUnit", width: 20 },
        { key: "Weight", width: 10 },
        { key: "PreviousYearPerformance", width: 20 },
        { key: "AnnualTarget", width: 15 },
        { key: "QuarterlyTarget", width: 15 },
        { key: "AllowableVariance", width: 20 },
        { key: "ActualQ42022Performance", width: 20 },
        { key: "ApraiseeScoreQ42022", width: 20 },
        { key: "AgreedWeightedScore", width: 20 },
        { key: "ResponsibleDivision", width: 20 },
        { key: "CommentOnPerformance", width: 30 },
        { key: "EvidenceOfPerformance", width: 30 },
        { key: "AppraisersScore", width: 20 },
        { key: "AgreedScore", width: 20 },
      ];

      // Apply styles to the first row
      const headerRow1 = worksheet.getRow(1);
      headerRow1.getCell(4).value =
        "ZIMRA INTEGRATED RESULTS BASED PERFORMANCE MANAGEMENT (IRBM) CONTRACT MATRIX";
      headerRow1.getCell(4).alignment = { horizontal: "center" };
      headerRow1.height = 30;
      headerRow1.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF00B050" },
      };
      headerRow1.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      worksheet.mergeCells("D1:P1");
      worksheet.getCell("D1").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      // Apply styles to the Third(3) row
      const headerRow3 = worksheet.getRow(3);
      headerRow3.getCell(
        3
      ).value = `Section ${performanceArea.section} : Delivery of Mandates / Operations in the Agency Integrated Performance Agreement - ${performanceArea.performanceArea} (${performanceArea.weight}%)`;
      headerRow3.getCell(3).alignment = { horizontal: "center" };
      headerRow3.height = 20;
      headerRow3.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF00B050" },
      };
      headerRow3.font = {
        bold: true,
        color: { argb: "FFFFFFFF" },
      };

      worksheet.mergeCells("C3:P3");
      worksheet.getCell("C3").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      // Appraisee Information Row
      const headerRow5 = worksheet.getRow(5);
      headerRow5.getCell(1).value = `Name of Incument: R. Chinamasa`;
      headerRow5.getCell(4).value = `Name of Appraisor : Mr A. Mandiwanza`;
      worksheet.getCell("C3").alignment = {
        width: 30,
      };
      headerRow5.getCell(9).value =
        "Current Evaluation Period:01 October - 31 December 2022";
      // headerRow5.getCell(1).alignment = { horizontal: "center" };
      headerRow5.height = 20;
      headerRow5.font = {
        bold: true,
      };

      const headerRow6 = worksheet.getRow(6);
      headerRow6.getCell(1).value = "Designation	Commissioner General";
      headerRow6.getCell(4).value = `Designation : ZIMRA Board Chairperson`;

      // headerRow6.getCell(1).alignment = { horizontal: "center" };
      headerRow6.height = 20;
      headerRow6.font = {
        bold: true,
      };

      worksheet.mergeCells("A6:B6");
      worksheet.getCell("A6").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      worksheet.mergeCells("D5:H5");
      worksheet.getCell("D3").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
      worksheet.mergeCells("D6:H6");
      worksheet.getCell("D6").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
      worksheet.mergeCells("I5:K5");
      worksheet.getCell("I5").alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      worksheet.getRow(7).values = [
        "Program Name",
        "Indicator",
        "Measurement Unit",
        "Weight (%)",
        "Previous year Performance",
        "Annual Target",
        "Quarterly Target",
        "Allowable Variance",
        "Actual Q4 2022 Performance",
        "Apraisee Score for Q4 2022",
        "Agreed Weighted Score",
        "Responsible Division",
        "Comment on Performance",
        "Evidence of Performance",
        "Appraiser's Score",
      ];

      // Skip the first 3 rows for the data

      // Apply styles to header row 4
      const headerRow = worksheet.getRow(7);
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF0000FF" },
      };

      // Perfomance Data starting at Row 5

      let currentRow = 8;
      let startRow = currentRow;
      let previousProgramName = "";
      performanceArea.programs.forEach((program) => {
        const programName = program.name;

        if (programName !== previousProgramName) {
          startRow = currentRow;
        }

        program.indicators.forEach((indicator) => {
          const programNameForIndicator =
            programName !== previousProgramName ? programName : "";
          worksheet.addRow({
            Program: programNameForIndicator,
            Indicator: indicator.description,
            MeasurementUnit: indicator.measurement_unit,
            Weight: indicator.weight,
            PreviousYearPerformance: indicator.Previous_year_Perfomenace,
            AnnualTarget: indicator.annual_target,
            QuarterlyTarget: indicator.quarterly_target,
            AllowableVariance: indicator.allowable_variance,
            ActualQ42022Performance: indicator.appraisee_actual_perfomance,
            ApraiseeScoreQ42022: indicator.appraiseeScore,
            AgreedWeightedScore: indicator.agreedWeightedScore,
            ResponsibleDivision: indicator.responsibleDivision,
            CommentOnPerformance: "", // Placeholder for comments
            EvidenceOfPerformance: "", // Placeholder for evidence
            AppraisersScore: indicator.appraisor_actual_perfomance,
            AgreedScore: indicator.agreedWeightedScore,
          });
          currentRow++;
        });

        // Merge cells for the program name
        if (programName !== previousProgramName) {
          try {
            worksheet.mergeCells(`A${startRow}`, `A${currentRow - 1}`);
            const mergedCell = worksheet.getCell(`A${startRow}`);
            // Log before setting alignment
            console.log(
              `Before setting alignment: ${JSON.stringify(
                mergedCell.alignment
              )}`
            );

            mergedCell.alignment = {
              vertical: "middle",
              horizontal: "right",
              wrapText: true,
            };
            mergedCell.font = {
              bold: true,
            };

            // Log after setting alignment
            console.log(
              `After setting alignment: ${JSON.stringify(mergedCell.alignment)}`
            );
          } catch (error) {
            console.error("Error occurred while merging cells:", error);
          }
        }

        previousProgramName = programName;
      });

      // Apply wrap text to the entire sheet
      worksheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.alignment = { wrapText: true };
        });
      });
    });

    // Generate the Excel file and save it
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "performance_data.xlsx");
    });
  };

  const handleSubmitResultScorecard = (e) => {
    e.preventDefault();
    if (planStatus === "ResultsScorecard") {
      swal({
        text: "Your Workplan is waiting for approval",
        icon: "warning",
        button: "OK!",
      });
    } else {
      // Check for indicators without appraiseeScore value (skip empty/invalid performance areas)
      const hasMissingValues = responseBody.content[0].areasOfPerformance.some(
        (area) => {
          // Skip validation for empty/invalid performance areas
          if (!area.performanceArea || area.performanceArea.trim() === "") {
            return false;
          }
          return area.programs.some((program) => {
            // Skip validation for empty/invalid programs
            if (!program.name || program.name.trim() === "") {
              return false;
            }
            return program.indicators.some((indicator) => {
              const value = indicator.appraiseeScore;
              console.log(value);
              // Prevent submission if appraiseeScore is 0, null, undefined, or empty
              return (
                value === null ||
                value === undefined ||
                value === "" ||
                value === 0 ||
                (typeof value === "string" && value.trim() === "") ||
                (typeof value === "number" && isNaN(value)) ||
                (typeof value === "string" && isNaN(parseFloat(value)))
              );
            });
          });
        }
      );
      console.log(hasMissingValues);
      if (hasMissingValues) {
        swal({
          text: "Please provide appraisee scores for ALL indicators before submitting. No indicator can be left blank.",
          icon: "warning",
          button: "OK!",
        });
        return; // Exit early to prevent submission
      } else {
        axiosClient
          .get("/scorecard/searchScorecard", {
            params: {
              period: evaluationPeriod,
              username: targetUserName,
            },
          })
          .then((res) => {
            const scoreCard = res.data;
            if (scoreCard.content && scoreCard.content.length > 0) {
              // There is an existing scoreCard, so update it
              console.log(
                "There is an existing scoreCard, so update it",
                res.data
              );
              console.log("My ID: " + res.data.content[0].id);
              const myScorecardId = res.data.content[0].id;

              console.log(res.data.content[0].areasOfPerformance);

              const updatedScorecard = {
                ...scoreCard.content[0],
                scorecardStatus: "ResultsScorecard",
              };

              console.log("updated Scorecard", updatedScorecard);

              try {
                axiosClient
                  .put(
                    `/scorecard/updateScorecard/${myScorecardId}`,
                    updatedScorecard
                  )
                  .then((res) => {
                    console.log("Backend Response:", res);
                    if (res.status === 200) {
                      swal({
                        text: "Scorecard Submitted Successfully",
                        icon: "success",
                        button: "OK!",
                      });
                      setPlanStatus("ResultsScorecard");
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
                text: "You have no score card to submit!",
                icon: "warning",
                button: "OK!",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };
  ////////////////////////////////////////////////////////
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
            MY RESULT SCORECARD
          </strong>
        </Typography>
      </Paper>
      <div style={{ marginLeft: 300, marginTop: 10, display: "flex" }}>
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
      {clickedComment && (
        <div
          className="comment-container"
          style={{
            marginLeft: 150,
            marginTop: 10,
            textAlign: "center",
            width: "1000px",
          }}
        >
          <Typography variant="caption">
            The Zimbabwe Revenue Authority, or ZIMRA, is the body responsible
            for collecting taxes and other revenue streams for the government in
            Zimbabwe. It derives its mandate from the Revenue Authority Act,
            passed by the parliament of Zimbabwe in 2002 and other related
            legislation.
            {scorecardComment}
          </Typography>
        </div>
      )}

      <div style={{ position: "absolute", top: 60, right: 40 }}>
        {(planStatus === "Rejected" || (planStatus === "ResultsScorecard" && username)) ? (
          <div style={{ marginLeft: 20, cursor: "pointer" }}>
            <Typography
              className=""
              onClick={() => setClickedComment(!clickedComment)}
            >
              {planStatus === "Rejected" ? "Rejection Comment" : "Appraisee Comment"} <CommentIcon />{" "}
              <span style={{ color: "#309366" }}></span>
            </Typography>
          </div>
        ) : null}
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
              No Result Scorecard Found
            </Typography>
            <Typography variant="body1">
              There is no result scorecard for the period: <strong>{periodToUse || evaluationPeriod}</strong>.
              {currentOpenQuarter ? 
                ` The current open quarter is ${currentOpenQuarter}.` : 
                " No quarter is currently open in the system."}
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
<>
        {performanceAreas.map((area, index) => (
          <TabPanel key={index} value={value} index={index}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                {area.section} - IRBM {area.performanceArea} (
                <span style={{ color: "green" }}>{area.weight}%</span>)
              </h6>
              <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                Scorecard Status:{" "}
                <span
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  {planStatus === "WorkingScorecard"
                    ? "Working Scorecard"
                    : planStatus === "ResultsScorecard"
                    ? "Pending Approval"
                    : planStatus}
                </span>
              </Typography>
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
                        <TableCell align="right" style={{ width: "10%" }}>
                          <Button
                            onClick={() =>
                              handleDownloadExcel(performanceAreas)
                            }
                          >
                            Download Excel
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {area.programs &&
                        area.programs.map((program, index) => (
                          <Row
                            key={index}
                            program={program}
                            programs={area.programs}
                            area={area}
                            planStatus={planStatus}
                            totalWeightedScore={totalWeightedScore}
                            overallPerformanceAreasScore={
                              overallPerformanceAreasScore
                            }
                          />
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Typography
                  style={{ marginLeft: "150px", marginRight: "50px" }}
                >
                  Total Programs Weight:
                </Typography>
                <Typography
                  style={{
                    color: "#5c5c11",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    marginRight: "350px",
                  }}
                >
                  {totalProgramsWeight || totalProgramsWeight === 0
                    ? totalProgramsWeight
                    : "____"}
                  %
                </Typography>
                <Typography>
                  Total Weighted Score:{" "}
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {totalWeightedScore}
                  </span>
                </Typography>
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
              <Typography>Name of Appraiser : _____________</Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Typography>Designation : _____________ </Typography>
                <div
                  className="btn-saveWorkPlan"
                  style={{ marginLeft: "710px", marginTop: "" }}
                >
                  {/* Hide submit buttons when viewing another user's scorecard (HC/admin view) */}
                  {!username && (
                    planStatus !== "ResultsScorecard" &&
                    planStatus !== "Rejected" &&
                    planStatus !== "Approved" ? (
                      <button
                        onClick={handleSubmitResultScorecard}
                        className="workplan-btn"
                        style={{
                          borderRadius: "25px",
                          marginLeft: "180px",
                          width: "160px",
                          marginTop: "-70px",
                        }}
                      >
                        Submit For Approval
                      </button>
                    ) : planStatus === "Approved" ? (
                      <div
                        className="btn-saveWorkPlan"
                        style={{
                          display: "flex",
                          marginLeft: "110px",
                          marginTop: "-70px",
                          width: "400px",
                        }}
                      >
                        <p
                          style={{
                            borderRadius: "9px",
                            height: "25px",
                            width: "165%",
                            backgroundColor: "#69b33e",
                            paddingLeft: "19px",
                            fontWeight: "bold",
                          }}
                        >
                          Result Scorecard Approved!
                        </p>
                      </div>
                    ) : planStatus === "Rejected" ? (
                      <button
                        onClick={handleSubmitResultScorecard}
                        className="workplan-btn"
                        style={{
                          borderRadius: "25px",
                          marginLeft: "180px",
                          width: "200px",
                          marginTop: "-70px",
                        }}
                      >
                        Re-Submit For Approval
                      </button>
                    ) : planStatus === "ResultsScorecard" ? (
                      <p
                        style={{
                          borderRadius: "9px",
                          height: "25px",
                          width: "190px",
                          backgroundColor: "#69b33e",
                          paddingLeft: "16px",
                          fontWeight: "bold",
                          marginTop: "-70px",
                        }}
                      >
                        Waiting For Approval!
                      </p>
                    ) : null
                  )}
                </div>

                {/* <div
                  className="btn-saveWorkPlan "
                  style={{
                    marginLeft: "550px",
                  }}
                >
                  <button
                    onClick={handleSubmitResultScorecard}
                    className="workplan-btn"
                    style={{
                      borderRadius: "25px",
                      marginLeft: "180px",
                      width: "160px",
                      marginTop: "-70px",
                    }}
                    // disabled={planStatus === "pendingApproval"}
                  >
                    Submit For Approval
                  </button>
                </div> */}
              </div>
            </div>
          </TabPanel>
        ))}
        </>
          </>
        )}
      </div>
    </>
  );
}
