import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import axiosClient from "../../authentication/axios-client";
import swal from "sweetalert";

export default function ArchiveTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push(y);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async (year = null) => {
    try {
      setLoading(true);
      let url = "/workplan-template/all";
      if (year) {
        url = `/workplan-template/year/${year}`;
      }
      const response = await axiosClient.get(url);
      setTemplates(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching templates:", error);
      setLoading(false);
    }
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    fetchTemplates(year);
  };

  const handleViewDetails = (templateId) => {
    navigate(`/admin/workplan-template-view/${templateId}`);
  };

  const handleDeleteTemplate = async (templateId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this archived template!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axiosClient.delete(`/workplan-template/${templateId}`);
          swal("Deleted!", "The archived template has been deleted.", "success").then(() => {
            fetchTemplates(selectedYear || null);
          });
        } catch (error) {
          console.error("Error deleting template:", error);
          swal("Error!", "Failed to delete the archived template.", "error");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "ARCHIVED":
        return "default";
      case "DRAFT":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#309366" }}>
          Workplan Template Archive
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "#666" }}>
          View archived workplan templates from previous quarters. Each archived template 
          contains all performance areas, programs, and their weights for historical reference 
          and auditing purposes.
        </Typography>

        {/* Year Filter */}
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body1">Filter by Year:</Typography>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minWidth: "150px",
            }}
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </Box>

        {loading ? (
          <Typography>Loading archived templates...</Typography>
        ) : templates.length === 0 ? (
          <Typography color="text.secondary">
            No archived templates found.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Template Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Evaluation Period</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Performance Areas</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Total Weights</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Archived Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Archived By</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id} hover>
                    <TableCell>{template.templateName}</TableCell>
                    <TableCell>{template.evaluationPeriod}</TableCell>
                    <TableCell>
                      <Chip
                        label={template.templateStatus}
                        color={getStatusColor(template.templateStatus)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{template.totalPerformanceAreas}</TableCell>
                    <TableCell>{template.totalWeights}%</TableCell>
                    <TableCell>
                      {template.archivedAt
                        ? new Date(template.archivedAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{template.archivedBy || "System"}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="View Details">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDetails(template.id)}
                            sx={{ textTransform: "none" }}
                          >
                            View
                          </Button>
                        </Tooltip>
                        {/* <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip> */}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </div>
  );
}
