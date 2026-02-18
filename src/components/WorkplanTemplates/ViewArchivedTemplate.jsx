import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axiosClient from "../../authentication/axios-client";

export default function ViewArchivedTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await axiosClient.get(`/workplan-template/${id}`);
      setTemplate(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching template:", error);
      setLoading(false);
    }
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

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading template details...</Typography>
      </Box>
    );
  }

  if (!template) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Template not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" sx={{ color: "#309366", flexGrow: 1 }}>
          {template.templateName}
        </Typography>
      </Box>

      {/* Template Info Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Evaluation Period</Typography>
            <Typography variant="h6">{template.evaluationPeriod}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Chip 
              label={template.templateStatus} 
              color={getStatusColor(template.templateStatus)} 
              size="small" 
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Year</Typography>
            <Typography variant="h6">{template.year}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Quarter</Typography>
            <Typography variant="h6">{template.quarter}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Performance Areas</Typography>
            <Typography variant="h6">{template.totalPerformanceAreas}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Total Weights</Typography>
            <Typography variant="h6">{template.totalWeights}%</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Archived Date</Typography>
            <Typography variant="body1">
              {template.archivedAt ? new Date(template.archivedAt).toLocaleDateString() : "N/A"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Archived By</Typography>
            <Typography variant="body1">{template.archivedBy || "System"}</Typography>
          </Box>
        </Box>
        
        {template.archiveReason && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Archive Reason</Typography>
            <Typography variant="body1" sx={{ p: 1, backgroundColor: "#fff3e0", borderRadius: 1 }}>
              {template.archiveReason}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Performance Areas Section - 3 columns per row */}
      <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
        Performance Areas ({template.performanceAreas?.length || 0})
      </Typography>

      {template.performanceAreas && template.performanceAreas.length > 0 ? (
        <Box 
          sx={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(3, 1fr)", 
            gap: 2,
            mb: 3
          }}
        >
          {template.performanceAreas.map((area, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 2, 
                borderLeft: "4px solid #1976d2",
                height: "100%"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    {area.performanceArea}
                  </Typography>
                  {area.section && (
                    <Typography variant="body2" color="text.secondary">
                      Section: {area.section}
                    </Typography>
                  )}
                </Box>
                <Chip 
                  label={`${area.weight}%`} 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: "bold", ml: 1 }}
                />
              </Box>

              {area.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {area.description}
                </Typography>
              )}

              {area.programs && area.programs.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#388e3c", mb: 1 }}>
                    Programs ({area.programs.length})
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                    {area.programs.map((program, progIndex) => (
                      <Box 
                        key={progIndex} 
                        sx={{ 
                          display: "flex", 
                          justifyContent: "space-between", 
                          alignItems: "center",
                          p: 0.5,
                          backgroundColor: "#f5f5f5",
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="caption" sx={{ flex: 1, pr: 1 }}>
                          {program.programName}
                        </Typography>
                        <Chip 
                          label={`${program.weight}%`} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          ))}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            No performance areas available for this template.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
