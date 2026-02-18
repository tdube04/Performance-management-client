import { useState, useEffect } from "react";
import axiosClient from "../authentication/axios-client";

/**
 * Custom hook to check quarter and workplan status for sidebar navigation control
 * 
 * Returns:
 * - hasOpenQuarter: boolean - whether there's an open quarter
 * - currentQuarter: string - the current quarter period (e.g., "2026-Q1")
 * - workplanExists: boolean - whether workplan exists for current user in current quarter
 * - workplanStatus: string - the status of the workplan
 * - canCreateWorkplan: boolean - whether user can create workplan
 * - loading: boolean - whether data is loading
 * - error: string - error message if any
 */
export const useQuarterNavigationStatus = (userEmail) => {
  const [status, setStatus] = useState({
    hasOpenQuarter: false,
    currentQuarter: null,
    currentQuarterStatus: null,
    workplanExists: false,
    workplanStatus: null,
    canCreateWorkplan: false,
    scorecardExists: false,
    scorecardStatus: null,
    canCreateScorecard: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userEmail) {
        setStatus((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        // First get current quarter status
        const quarterResponse = await axiosClient.get("/evaluation_periods/current-status");
        const quarterData = quarterResponse.data;

        const newStatus = {
          hasOpenQuarter: quarterData.hasOpenQuarter || false,
          currentQuarter: quarterData.currentQuarter || null,
          currentQuarterStatus: quarterData.currentQuarterStatus || null,
          workplanExists: false,
          workplanStatus: null,
          canCreateWorkplan: false,
          scorecardExists: false,
          scorecardStatus: null,
          canCreateScorecard: false,
          loading: false,
          error: null,
        };

        // If there's an open quarter, check if workplan exists
        if (newStatus.hasOpenQuarter && newStatus.currentQuarter) {
          try {
            const workplanResponse = await axiosClient.get("/workplan/searchWorkplan", {
              params: {
                username: userEmail,
                period: newStatus.currentQuarter,
              },
            });

            if (workplanResponse.data && workplanResponse.data.content && workplanResponse.data.content.length > 0) {
              const workplan = workplanResponse.data.content[0];
              newStatus.workplanExists = true;
              newStatus.workplanStatus = workplan.workplanStatus;
              
              // Can create new workplan only if previous was rejected
              newStatus.canCreateWorkplan = workplan.workplanStatus === "Rejected";
            } else {
              newStatus.workplanExists = false;
              newStatus.canCreateWorkplan = true; // Can create if none exists
            }
          } catch (wpError) {
            console.log("Error fetching workplan:", wpError);
            newStatus.canCreateWorkplan = true;
          }

          // Check if scorecard exists
          try {
            const scorecardResponse = await axiosClient.get("/scorecard/searchScorecard", {
              params: {
                username: userEmail,
                period: newStatus.currentQuarter,
              },
            });

            if (scorecardResponse.data && scorecardResponse.data.content && scorecardResponse.data.content.length > 0) {
              const scorecard = scorecardResponse.data.content[0];
              newStatus.scorecardExists = true;
              newStatus.scorecardStatus = scorecard.scorecardStatus;
              
              // Can create/update scorecard based on workplan status
              newStatus.canCreateScorecard = 
                newStatus.workplanStatus === "Approved" || 
                newStatus.workplanStatus === "BoardApproved";
            }
          } catch (scError) {
            console.log("Error fetching scorecard:", scError);
          }
        } else {
          // No open quarter - cannot create anything
          newStatus.canCreateWorkplan = false;
          newStatus.canCreateScorecard = false;
        }

        setStatus(newStatus);
      } catch (error) {
        console.error("Error fetching quarter status:", error);
        setStatus((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load quarter status",
        }));
      }
    };

    fetchStatus();
  }, [userEmail]);

  return status;
};

export default useQuarterNavigationStatus;
