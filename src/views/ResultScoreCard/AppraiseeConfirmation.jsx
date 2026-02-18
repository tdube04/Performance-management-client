import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import * as AiIcons from "react-icons/ai";
import * as FaIcons from "react-icons/fa";
import Swal from "sweetalert2";
import "./appraiseeConfirmation.scss";

const AppraiseeConfirmation = () => {
  const { userName, userType, token } = useStateContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scorecardData, setScorecardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    confirmedAt: null,
    confirmationStatus: null,
    appraiseeComments: "",
  });

  const steps = [
    "Review Scorecard",
    "Acknowledge Appraiser Input",
    "Confirm Acceptance",
    "Forward to Human Capital",
  ];

  useEffect(() => {
    fetchScorecardData();
  }, []);

  const fetchScorecardData = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/scorecard/searchScorecard", {
        params: {
          period: getCurrentEvaluationPeriod(),
          username: userName,
        },
      });

      if (response.data.content && response.data.content.length > 0) {
        const data = response.data.content[0];
        setScorecardData(data);
        
        // Check if already confirmed
        if (data.appraiseeConfirmed && data.appraiseeConfirmedAt) {
          setHasConfirmed(true);
          setConfirmationData({
            confirmedAt: data.appraiseeConfirmedAt,
            confirmationStatus: data.confirmationStatus,
            appraiseeComments: data.appraiseeComments || "",
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching scorecard:", error);
      setLoading(false);
    }
  };

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

  const handleConfirmClick = () => {
    setConfirmationOpen(true);
    setActiveStep(0);
  };

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmitConfirmation = async () => {
    if (!agreedToTerms) {
      Swal.fire({
        icon: "warning",
        title: "Warning",
        text: "Please agree to the terms before confirming",
      });
      return;
    }

    setIsConfirming(true);

    try {
      const payload = {
        appraiseeConfirmed: true,
        appraiseeConfirmedAt: new Date().toISOString(),
        confirmationStatus: "CONFIRMED",
        appraiseeComments: confirmationData.appraiseeComments,
        status: "CONFIRMED_BY_APPRAISEE",
        forwardedToHC: true,
        forwardedToHCAt: new Date().toISOString(),
      };

      await axiosClient.put(`/scorecard/${scorecardData.id}/confirm`, payload);

      Swal.fire({
        icon: "success",
        title: "Confirmation Received",
        html: `
          <div style="text-align: center;">
            <p style="font-size: 48px; color: #4caf50; margin: 10px 0;">✓</p>
            <p style="font-size: 18px; font-weight: bold;">Scorecard Confirmed!</p>
            <p style="font-size: 14px; color: #666;">Your result scorecard has been forwarded to Human Capital for processing.</p>
          </div>
        `,
        confirmButtonText: "View Dashboard",
      }).then(() => {
        // Reload the page after confirmation
        window.location.reload();
      });

      setHasConfirmed(true);
      setConfirmationOpen(false);
      setIsConfirming(false);
      
      // Update local state
      setConfirmationData({
        confirmedAt: new Date().toISOString(),
        confirmationStatus: "CONFIRMED",
        appraiseeComments: confirmationData.appraiseeComments,
      });

    } catch (error) {
      console.error("Error confirming scorecard:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to confirm scorecard. Please try again.",
      });
      setIsConfirming(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              <AiIcons.AiOutlineFileSearch /> Review Your Scorecard
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please review the actual performance inputs provided by your appraiser before confirming.
            </Alert>
            <Card variant="outlined" className="summary-card">
              <CardContent>
                <Typography variant="subtitle2">Scorecard Summary</Typography>
                <Box className="summary-details">
                  <div className="summary-item">
                    <Typography variant="body2">Status:</Typography>
                    <Chip 
                      label={scorecardData?.scorecardStatus || "N/A"} 
                      color="success"
                      size="small"
                    />
                  </div>
                  <div className="summary-item">
                    <Typography variant="body2">Evaluation Period:</Typography>
                    <Typography>{getCurrentEvaluationPeriod()}</Typography>
                  </div>
                  <div className="summary-item">
                    <Typography variant="body2">Appraiser:</Typography>
                    <Typography>{scorecardData?.appraiserName || "N/A"}</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
            <Button
              variant="outlined"
              startIcon={<AiIcons.AiOutlineEye />}
              onClick={() => navigate("/resultscorecard")}
              sx={{ mt: 2 }}
            >
              View Full Scorecard
            </Button>
          </Box>
        );
      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              <AiIcons.AiOutlineCheckCircle /> Acknowledge Appraiser Input
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Your appraiser has submitted actual performance ratings for your review.
            </Alert>
            <Card variant="outlined" className="acknowledgment-card">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Key Points:
                </Typography>
                <ul className="ack-list">
                  <li>The actual performance ratings reflect your achievement against set targets</li>
                  <li>Review each performance area and indicator carefully</li>
                  <li>Contact your appraiser if you have any questions or concerns</li>
                  <li>Once confirmed, the scorecard will be forwarded to Human Capital</li>
                </ul>
              </CardContent>
            </Card>
          </Box>
        );
      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              <AiIcons.AiOutlineForm /> Confirm Acceptance
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              By confirming, you acknowledge that you have reviewed and accept the appraiser's input.
            </Alert>
            <Card variant="outlined" className="terms-card">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Terms of Confirmation
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  I hereby confirm that:
                </Typography>
                <ol className="terms-list">
                  <li>I have reviewed the actual performance ratings provided by my appraiser</li>
                  <li>I understand that this confirmation is final for this evaluation period</li>
                  <li>I agree that my scorecard will be processed by Human Capital</li>
                  <li>I understand that I cannot make further changes after confirmation</li>
                </ol>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I have read and agree to the terms above"
                  sx={{ mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Comments (Optional)"
                  multiline
                  rows={3}
                  value={confirmationData.appraiseeComments}
                  onChange={(e) =>
                    setConfirmationData({
                      ...confirmationData,
                      appraiseeComments: e.target.value,
                    })
                  }
                  sx={{ mt: 2 }}
                  placeholder="Add any comments or concerns..."
                />
              </CardContent>
            </Card>
          </Box>
        );
      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h6" className="step-title">
              <AiIcons.AiOutlineSend /> Forward to Human Capital
            </Typography>
            <Card variant="outlined" className="forward-card">
              <CardContent>
                <Box className="forward-icon">
                  <AiIcons.AiOutlineCloudSync style={{ fontSize: "48px", color: "#4caf50" }} />
                </Box>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Ready to Submit
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Your confirmed scorecard will be securely forwarded to Human Capital for final processing.
                </Typography>
                <Box className="forward-summary">
                  <div className="forward-item">
                    <AiIcons.AiOutlineCheckCircle style={{ color: "#4caf50" }} />
                    <span>Scorecard reviewed</span>
                  </div>
                  <div className="forward-item">
                    <AiIcons.AiOutlineCheckCircle style={{ color: "#4caf50" }} />
                    <span>Appraiser input acknowledged</span>
                  </div>
                  <div className="forward-item">
                    <AiIcons.AiOutlineCheckCircle style={{ color: "#4caf50" }} />
                    <span>Terms accepted</span>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box className="confirmation-loading">
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading scorecard...</Typography>
      </Box>
    );
  }

  if (!scorecardData) {
    return (
      <Box className="confirmation-empty">
        <Typography variant="h6">No Scorecard Found</Typography>
        <Typography>You don't have a result scorecard to confirm.</Typography>
      </Box>
    );
  }

  // Check if scorecard is approved and ready for confirmation
  const canConfirm = scorecardData.scorecardStatus === "Approved" || 
                     scorecardData.scorecardStatus === "EvaluatorApproved";

  if (hasConfirmed) {
    return (
      <Box className="confirmation-container">
        <Card className="confirmation-success-card">
          <CardContent>
            <Box className="success-header">
              <AiIcons.AiOutlineCheckCircle className="success-icon" />
              <Typography variant="h5">Scorecard Confirmed</Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Your result scorecard has been confirmed and forwarded to Human Capital for processing.
            </Typography>
            <Box className="confirmation-details">
              <div className="detail-item">
                <Typography variant="body2">Confirmed On:</Typography>
                <Typography>
                  {confirmationData.confirmedAt
                    ? new Date(confirmationData.confirmedAt).toLocaleString()
                    : "-"}
                </Typography>
              </div>
              <div className="detail-item">
                <Typography variant="body2">Status:</Typography>
                <Chip 
                  label={confirmationData.confirmationStatus || "CONFIRMED"} 
                  color="success"
                  size="small"
                />
              </div>
            </Box>
            <Button
              variant="outlined"
              startIcon={<AiIcons.AiOutlineDashboard />}
              onClick={() => navigate("/dashboard")}
              sx={{ mt: 3 }}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="confirmation-container">
      <Card className="confirmation-card">
        <CardContent>
          <Typography variant="h5" className="card-title">
            <FaIcons.FaRegCheckCircle /> Result Scorecard Confirmation
          </Typography>
          
          {canConfirm ? (
            <>
              <Alert severity="success" sx={{ mt: 2, mb: 2 }}>
                Your scorecard has been approved by your appraiser. Please review and confirm acceptance.
              </Alert>
              
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3, mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box className="stepper-content">
                {renderStepContent(activeStep)}
              </Box>

              <Box className="stepper-actions">
                <Button
                  disabled={activeStep === 0}
                  onClick={handlePreviousStep}
                  startIcon={<AiIcons.AiOutlineLeft />}
                >
                  Previous
                </Button>
                
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitConfirmation}
                    disabled={isConfirming || !agreedToTerms}
                    startIcon={isConfirming ? <AiIcons.AiOutlineLoading3Quarters className="spinning" /> : <AiIcons.AiOutlineSend />}
                  >
                    {isConfirming ? "Submitting..." : "Confirm & Forward to HC"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNextStep}
                    startIcon={<AiIcons.AiOutlineRight />}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </>
          ) : (
            <Box className="not-ready">
              <Alert severity="info">
                Your scorecard is currently in "{scorecardData.scorecardStatus}" status. 
                Confirmation will be available once your appraiser approves the scorecard.
              </Alert>
              <Button
                variant="outlined"
                startIcon={<AiIcons.AiOutlineArrowLeft />}
                onClick={() => navigate("/dashboard")}
                sx={{ mt: 2 }}
              >
                Return to Dashboard
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={() => !isConfirming && setConfirmationOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <AiIcons.AiOutlineExclamationCircle /> Confirm Your Action
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to confirm your scorecard? This action is final and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitConfirmation}
            disabled={isConfirming || !agreedToTerms}
          >
            {isConfirming ? "Confirming..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppraiseeConfirmation;
