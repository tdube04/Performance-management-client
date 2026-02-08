import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Chip } from "@mui/material";
import { darken } from "@mui/material";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Swal from "sweetalert2";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

export default function BoardWorkplanList() {
  const [workplans, setWorkplans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { userName } = useStateContext();
  const evaluationPeriod = getCurrentEvaluationPeriod();

  useEffect(() => {
    fetchBoardWorkplans();
  }, []);

  const fetchBoardWorkplans = async () => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/workplan/searchWorkplanForBoard", {
        params: {
          period: evaluationPeriod,
          planStatus: "pendingApproval",
        },
      });
      setWorkplans(response.data || []);
    } catch (error) {
      console.error("Error fetching Board workplans:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load workplans. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workplan) => {
    const result = await Swal.fire({
      title: "Approve Workplan?",
      text: `Approve workplan for ${workplan.user_email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosClient.get(`/workplan/approveBoardWorkplan/${workplan.id}`, {
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

        fetchBoardWorkplans(); // Refresh the list
      } catch (error) {
        console.error("Error approving workplan:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "Failed to approve workplan",
        });
      }
    }
  };

  const handleRejectClick = (workplan) => {
    setSelectedWorkplan(workplan);
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
      const response = await axiosClient.get(`/workplan/rejectBoardWorkplan/${selectedWorkplan.id}`, {
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
      setSelectedWorkplan(null);
      setRejectionReason("");
      fetchBoardWorkplans(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting workplan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data || "Failed to reject workplan",
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
        accessorKey: "workplanStatus",
        header: "Status",
        size: 150,
        Cell: ({ cell }) => {
          const status = cell.getValue();
          return (
            <Chip
              label={status === "pendingApproval" ? "Pending Board Approval" : status}
              color={status === "pendingApproval" ? "warning" : "default"}
              size="small"
            />
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
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleApprove(row.original)}
              sx={{
                textTransform: "none",
                fontSize: "12px",
                padding: "4px 12px",
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleRejectClick(row.original)}
              sx={{
                textTransform: "none",
                fontSize: "12px",
                padding: "4px 12px",
              }}
            >
              Reject
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: "#1a237e" }}>
        Board Workplan Approvals
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, color: "#666" }}>
        Review and approve workplans submitted by the Commissioner General (Grade 1)
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={workplans}
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
        <DialogTitle sx={{ backgroundColor: "#d32f2f", color: "#fff" }}>Reject Workplan</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Rejecting workplan for: <strong>{selectedWorkplan?.user_email}</strong>
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
