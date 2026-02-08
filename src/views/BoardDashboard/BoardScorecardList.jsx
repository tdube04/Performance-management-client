import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Chip, Tabs, Tab, Paper } from "@mui/material";
import { darken } from "@mui/material";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Swal from "sweetalert2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const getCurrentEvaluationPeriod = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    let quarter;
    if (currentMonth >= 1 && currentMonth <= 3) quarter = "Q1";
    else if (currentMonth >= 4 && currentMonth <= 6) quarter = "Q2";
    else if (currentMonth >= 7 && currentMonth <= 9) quarter = "Q3";
    else quarter = "Q4";

    return `${currentYear}-${quarter}`;
};

export default function BoardScorecardList() {
    const [scorecards, setScorecards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [selectedScorecard, setSelectedScorecard] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const { userName } = useStateContext();
    const evaluationPeriod = getCurrentEvaluationPeriod();
    const navigate = useNavigate();

    const [currentTab, setCurrentTab] = useState(0);

    const handleView = (scorecard) => {
        navigate("/board-dashboard/view-scorecard", {
            state: { scorecard }
        });
    };

    useEffect(() => {
        fetchBoardScorecards();
    }, [currentTab]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const getStatusFromTab = (tabIndex) => {
        switch (tabIndex) {
            case 0: return "ResultsScorecard";
            case 1: return "Approved";
            case 2: return "Rejected";
            case 3: return "ALL";
            default: return "ResultsScorecard";
        }
    };

    const fetchBoardScorecards = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get("/scorecard/searchScorecardForBoard", {
                params: {
                    period: evaluationPeriod,
                    scorecardStatus: getStatusFromTab(currentTab),
                },
            });
            setScorecards(response.data || []);
        } catch (error) {
            console.error("Error fetching Board scorecards:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load scorecards. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (scorecard) => {
        const result = await Swal.fire({
            title: "Approve Scorecard?",
            text: `Approve scorecard for ${scorecard.user_email}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Approve",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosClient.get(`/scorecard/approveBoardScorecard/${scorecard.id}`, {
                    params: {
                        boardMemberEmail: userName,
                    },
                });

                Swal.fire({
                    icon: "success",
                    title: "Approved!",
                    text: response.data,
                    timer: 3000,
                });

                fetchBoardScorecards(); // Refresh the list
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

    const handleRejectClick = (scorecard) => {
        setSelectedScorecard(scorecard);
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
            const response = await axiosClient.get(`/scorecard/rejectBoardScorecard/${selectedScorecard.id}`, {
                params: {
                    boardMemberEmail: userName,
                    rejectionReason: rejectionReason,
                },
            });

            Swal.fire({
                icon: "success",
                title: "Rejected",
                text: response.data,
                timer: 3000,
            });

            setRejectDialogOpen(false);
            setSelectedScorecard(null);
            setRejectionReason("");
            fetchBoardScorecards(); // Refresh the list
        } catch (error) {
            console.error("Error rejecting scorecard:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data || "Failed to reject scorecard",
            });
        }
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "user_email",
                header: "Commissioner General",
                size: 180,
                Cell: ({ cell }) => (
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {cell.getValue()}
                    </Typography>
                ),
            },
            {
                accessorKey: "evaluationPeriod",
                header: "Period",
                size: 100,
            },
            {
                accessorKey: "scorecardStatus",
                header: "Status",
                size: 150,
                Cell: ({ cell }) => {
                    const status = cell.getValue();
                    return (
                        <Chip
                            label={status === "ResultsScorecard" ? "Pending Board Approval" : status}
                            color={status === "ResultsScorecard" ? "warning" : "default"}
                            size="small"
                        />
                    );
                },
            },
            {
                accessorKey: "total_overal_weighted_score",
                header: "Overall Score",
                size: 120,
                Cell: ({ cell }) => {
                    const score = cell.getValue() || 0;
                    return (
                        <Typography variant="body2" sx={{ fontWeight: 600, color: score >= 70 ? "#28a745" : "#ffc107" }}>
                            {score.toFixed(2)}%
                        </Typography>
                    );
                },
            },
            {
                accessorKey: "AreasOfPerformance",
                header: "Performance Areas",
                size: 120,
                Cell: ({ cell }) => {
                    const areas = cell.getValue() || [];
                    return <Typography variant="body2">{areas.length} areas</Typography>;
                },
            },
            {
                accessorKey: "actions",
                header: "Actions",
                size: 200,
                Cell: ({ row }) => {
                    const isActionDisabled = row.original.scorecardStatus !== "ResultsScorecard";
                    return (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                size="small"
                                color="info"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleView(row.original)}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "12px",
                                    padding: "4px 12px",
                                }}
                            >
                                View Details
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={isActionDisabled}
                                color="success"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => handleApprove(row.original)}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "12px",
                                    padding: "4px 12px",
                                    backgroundColor: isActionDisabled ? undefined : "#2e7d32" // Force green if active
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                variant="contained"
                                size="small"
                                disabled={isActionDisabled}
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleRejectClick(row.original)}
                                sx={{
                                    textTransform: "none",
                                    fontSize: "12px",
                                    padding: "4px 12px",
                                    backgroundColor: isActionDisabled ? undefined : "#d32f2f" // Force red if active
                                }}
                            >
                                Reject
                            </Button>
                        </Box >
                    );
                },
            },
        ],
        []
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#1a237e" }}>
                Board Scorecard Approvals
            </Typography>

            <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
                Review and approve result scorecards submitted by the Commissioner General (Grade 1)
            </Typography>

            <Paper sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                >
                    <Tab label="Pending Approval" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="Approved" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="Rejected" sx={{ textTransform: "none", fontWeight: 600 }} />
                    <Tab label="All History" sx={{ textTransform: "none", fontWeight: 600 }} />
                </Tabs>
            </Paper>

            <MaterialReactTable
                columns={columns}
                data={scorecards}
                state={{ isLoading: loading }}
                enableRowSelection={false}
                enableColumnOrdering
                enableGlobalFilter
                initialState={{
                    showColumnFilters: false,
                    density: "comfortable",
                }}
                muiTablePaperProps={{
                    elevation: 2,
                    sx: {
                        borderRadius: "8px",
                    },
                }}
                muiTableBodyProps={{
                    sx: (theme) => ({
                        "& tr:nth-of-type(odd)": {
                            backgroundColor: darken(theme.palette.background.default, 0.05),
                        },
                    }),
                }}
                muiTableHeadCellProps={{
                    sx: {
                        backgroundColor: "#1a237e",
                        color: "#fff",
                        fontWeight: 700,
                    },
                }}
            />

            {/* Rejection Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ backgroundColor: "#d32f2f", color: "#fff" }}>Reject Scorecard</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Rejecting scorecard for: <strong>{selectedScorecard?.user_email}</strong>
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
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setRejectDialogOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleRejectConfirm} variant="contained" color="error">
                        Confirm Rejection
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
