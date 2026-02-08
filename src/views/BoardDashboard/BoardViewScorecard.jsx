import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useGmailTabItemStyles } from "@mui-treasury/styles/tabs";
import Button from "@material-ui/core/Button";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import InfoIcon from "@mui/icons-material/Info";
import Sheet from "@mui/joy/Sheet";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItemButton from "@mui/joy/ListItemButton";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Swal from "sweetalert2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { DialogTitle, TextField } from "@mui/material";

// Reusing the exact Row component structure from ResultScoreCard
function Row({
    program,
    area,
    totalWeightedScore,
    overallPerformanceAreasScore,
}) {
    const [open, setOpen] = React.useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [evidencesFileIds, setEvidencesFileIds] = useState([]);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const classes = useStyles();

    const handleIndicatorDialog = async (indicator) => {
        setSelectedIndicator(indicator);
        setModalOpen(true);
        setEvidencesFileIds(indicator.evidenceFileIds || []);
    };

    const handleDownloadEvidence = async (attachedId, filename) => {
        try {
            const response = await axiosClient.get(`/file/download/${attachedId}`, {
                responseType: "blob",
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${filename}.pdf`;
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error(error);
        }
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
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    style={{ color: "#16160E", fontWeight: 550 }}
                >
                    {program.name}
                </TableCell>
                <TableCell align="center">{program.weight}</TableCell>
                <TableCell align="center">{currentYear}</TableCell> {/* Simplified period */}
                <TableCell align="center">{program.indicators.length}</TableCell>
            </TableRow>
            <TableRow style={{ maxWidth: "80%" }}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="caption" gutterBottom component="div">
                                Program Indicators
                            </Typography>
                            <Table size="medium" aria-label="purchases" style={{ maxWidth: "50%" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ width: "10%" }}>Indicator</TableCell>
                                        <TableCell sx={{ width: 10 }}>Measurement Unit</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Weight(%)</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Incremental/Decremental</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Annual Target for {currentYear}(%)</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Allowable Variance</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Quarterly Target(%)</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Responsible Division</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Comment</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Actual Performance</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Appraisee Score</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Agreed Weighted Score</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>Appraiser's Actual</TableCell>
                                        <TableCell align="right" style={{ width: "10%" }}>View</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {program.indicators &&
                                        program.indicators.map((indicator, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="center" component="th" scope="row" style={{ width: "10%" }}>
                                                    {indicator.description}
                                                </TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.measurement_unit}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.weight}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.incremental_or_decremental}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.annual_target}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.allowable_variance}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.quarterly_target}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.responsibleDivision}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>
                                                    {indicator.perfomanceComment && indicator.perfomanceComment.length > 20
                                                        ? `${indicator.perfomanceComment.substring(0, 36)}...`
                                                        : indicator.perfomanceComment}
                                                </TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.appraisee_actual_perfomance || "___"}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.appraiseeScore || "___"}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.agreedWeightedScore || "___"}</TableCell>
                                                <TableCell align="center" style={{ width: "10%" }}>{indicator.appraisor_actual_perfomance || "___"}</TableCell>
                                                <TableCell align="right" style={{ width: "10%" }}>
                                                    <IconButton onClick={() => handleIndicatorDialog(indicator)}>
                                                        <VisibilityIcon sx={{ fontSize: "20px", color: "green" }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            {/* Indicator Details Dialog - Copied from ResultScoreCard */}
            <Dialog
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <DialogContent>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="subtitle1" sx={{ mt: 6, fontWeight: "bold" }}>
                            <InfoIcon sx={{ fontSize: "15px", color: "green" }} /> Indicator Details
                        </Typography>
                    </div>

                    {/* Detailed View Logic reused */}
                    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                        {/* Display key indicator details here in specific layout */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", width: "100%" }}>
                            <div><strong>Name:</strong> {selectedIndicator?.description}</div>
                            <div><strong>Weight:</strong> {selectedIndicator?.weight}</div>
                            <div><strong>Unit:</strong> {selectedIndicator?.measurement_unit}</div>
                            <div><strong>Target:</strong> {selectedIndicator?.annual_target}</div>
                            <div><strong>Comment:</strong> {selectedIndicator?.perfomanceComment}</div>
                        </div>
                    </div>

                    {/* Evidence Sheet */}
                    <Sheet variant="outlined" sx={{ p: 2, borderRadius: "sm", mt: 2 }}>
                        <List>
                            <ListSubheader>Attached Evidences</ListSubheader>
                            {evidencesFileIds.map((evidence) => (
                                <ListItem key={evidence?.id}>
                                    <ListItemButton onClick={() => handleDownloadEvidence(evidence?.id, evidence?.filename)}>
                                        <PictureAsPdfIcon /> {evidence?.filename}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Sheet>

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalOpen(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
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

export default function BoardViewScorecard() {
    const location = useLocation();
    const navigate = useNavigate();
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const [scorecardData, setScorecardData] = useState(null);
    const { userName } = useStateContext();
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");

    const indicatorColors = ["#d93025", "#1a73e8", "#188038", "#e37400"];
    const tabItem3Styles = useGmailTabItemStyles({ color: indicatorColors[2] });

    useEffect(() => {
        if (location.state && location.state.scorecard) {
            setScorecardData(location.state.scorecard);
        } else {
            navigate("/board-dashboard/scorecard-approvals");
        }
    }, [location, navigate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleApprove = async () => {
        const result = await Swal.fire({
            title: "Approve Scorecard?",
            text: `Approve scorecard for ${scorecardData.user_email}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Approve",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosClient.get(`/scorecard/approveBoardScorecard/${scorecardData.id}`, {
                    params: {
                        boardMemberEmail: userName,
                    },
                });

                await Swal.fire({
                    icon: "success",
                    title: "Approved!",
                    text: response.data,
                    timer: 3000,
                });

                navigate("/board-dashboard/scorecard-approvals");
            } catch (error) {
                console.error("Error approving scorecard:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data || "Failed to approve scorecard",
                });
            }
        }
    };

    const handleRejectClick = () => {
        setRejectionReason("");
        setRejectDialogOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Rejection Reason Required",
                text: "Please provide a reason for rejection",
            });
            return;
        }

        try {
            const response = await axiosClient.get(`/scorecard/rejectBoardScorecard/${scorecardData.id}`, {
                params: {
                    boardMemberEmail: userName,
                    rejectionReason: rejectionReason,
                },
            });

            await Swal.fire({
                icon: "success",
                title: "Rejected",
                text: response.data,
                timer: 3000,
            });

            setRejectDialogOpen(false);
            navigate("/board-dashboard/scorecard-approvals");
        } catch (error) {
            console.error("Error rejecting scorecard:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data || "Failed to reject scorecard",
            });
        }
    };

    if (!scorecardData) return <div>Loading...</div>;

    return (
        <div style={{ padding: "20px" }}>
            {/* Header Paper */}
            <Paper elevation={1} sx={{ ml: 50, display: "flex", backgroundColor: "white", width: "400px", border: "1px solid #B4B2A9", borderRadius: "6px" }}>
                <Typography variant="body2" sx={{ textAlign: "center", ml: 5, p: 2 }}>
                    <strong style={{ marginLeft: "60px", textAlign: "center" }}>
                        COMMISSIONER GENERAL SCORECARD
                    </strong>
                </Typography>
            </Paper>

            {/* Info Header */}
            <div style={{ marginLeft: 300, marginTop: 10, display: "flex" }}>
                <div style={{ marginRight: 20 }}>
                    <Typography sx={{ fontSize: 12 }}>
                        <strong>Current Year Of Assessment: <span style={{ color: "#309366" }}>{scorecardData.evaluationPeriod}</span></strong>
                    </Typography>
                </div>
            </div>

            {/* Tabs */}
            <div className={classes.root} style={{ marginTop: "20px" }}>
                <Box sx={{ mt: 1, ml: 4, width: "95%", typography: "body1", fontWeight: "bold", borderRadius: 20, backgroundColor: "#e7e7e7" }}>
                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        {scorecardData.areasOfPerformance.map((area, index) => (
                            <Tab classes={tabItem3Styles} key={index} label={area.performanceArea} sx={{ fontSize: 8, color: "black", fontWeight: "bold" }} />
                        ))}
                    </Tabs>
                </Box>

                {/* Content */}
                {scorecardData.areasOfPerformance.map((area, index) => (
                    <TabPanel key={index} value={value} index={index}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <h6 style={{ marginLeft: "11px", marginTop: "-9px" }}>
                                {area.section} - IRBM {area.performanceArea} (<span style={{ color: "green" }}>{area.weight}%</span>)
                            </h6>
                            <Typography style={{ marginTop: "-10px", marginLeft: "600px" }}>
                                Scorecard Status: <span style={{ color: "green", fontWeight: "bold" }}>{scorecardData.scorecardStatus}</span>
                            </Typography>
                        </div>

                        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", "& > :not(style)": { m: 1, width: 1450, height: 520 } }}>
                            <TableContainer component={Paper}>
                                <Table aria-label="collapsible table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>Program</TableCell>
                                            <TableCell align="center">Weight (%)</TableCell>
                                            <TableCell align="center">Total Number of Indicators</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {area.programs && area.programs.map((program, idx) => (
                                            <Row key={idx} program={program} area={area} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </TabPanel>
                ))}
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "20px", marginBottom: "40px" }}>
                <Button variant="contained" color="default" onClick={() => navigate("/board-dashboard/scorecard-approvals")}>
                    Close View
                </Button>
                {/* Buttons disabled if already processed */}
                {(() => {
                    const isActionDisabled = scorecardData.scorecardStatus !== "ResultsScorecard";
                    return (
                        <>
                            <Button
                                variant="contained"
                                disabled={isActionDisabled}
                                style={isActionDisabled ? {} : { backgroundColor: "#28a745", color: "white" }}
                                startIcon={<CheckCircleIcon />}
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="contained"
                                disabled={isActionDisabled}
                                style={isActionDisabled ? {} : { backgroundColor: "#d32f2f", color: "white" }}
                                startIcon={<CancelIcon />}
                                onClick={handleRejectClick}
                            >
                                Reject
                            </Button>
                        </>
                    );
                })()}
            </div>

            {/* Rejection Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle style={{ backgroundColor: "#d32f2f", color: "#fff" }}>Reject Scorecard</DialogTitle>
                <DialogContent style={{ marginTop: "20px" }}>
                    <Typography variant="body2" style={{ marginBottom: "16px" }}>
                        Rejecting scorecard for: <strong>{scorecardData.user_email}</strong>
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a detailed reason for rejection..."
                    />
                </DialogContent>
                <DialogActions style={{ padding: "16px" }}>
                    <Button onClick={() => setRejectDialogOpen(false)} color="default">
                        Cancel
                    </Button>
                    <Button onClick={handleRejectConfirm} variant="contained" style={{ backgroundColor: "#d32f2f", color: "white" }}>
                        Confirm Rejection
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
