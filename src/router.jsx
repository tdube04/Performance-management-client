import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Admin/Login/Login";
import NotFound from "./views/NotFound/NotFound";
import Signup from "./views/SignupPage/Signup";
import AppraiseeDashboard from "./components/AppraiseeDashboard/AppraiseeDashboard.jsx";
import CreateWorkPlan from "./views/CreateWorkPlan/CreateWorkPlan";
import PerformanceArea from "./Widgets/PerformanceArea";
import PendingApproval from "./views/PendingApproval/PendingApproval";
import Rejected from "./views/Rejected/Rejected";
import Approved from "./views/Approved/Approved";
import UnderReview from "./views/UnderReview/UnderReview";
import UnderEvaluation from "./views/UnderEvaluation/UnderEvaluation";
import Completed from "./views/Completed/Completed";
import PreviousScorecards from "./views/PreviousScorecards/PreviousScorecards";
import PreviousWorkplans from "./views/PreviousWorkplans/PreviousWorkplans";
import CurrentScoreCard from "./views/WorkingScoreCard/WorkingScoreCard";
import WorkingScoreCard from "./views/WorkingScoreCard/WorkingScoreCard";
import { MyDashboard } from "./MyDashboard/MyDashboard";
import ResultScoreCard from "./views/ResultScoreCard/ResultScoreCard";
import AllIrbms from "./views/AllIrbms/AllIrbms";
import GuestLayout from "./components/GuestLayout";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import HCLayout from "./components/AdminLayout/HCLayout";
import AdminHomePage from "./views/AdminDashboard/AdminHomePage";
import HCDashboard from "./views/HC/HCDashboard";
import NotificationManagement from "./views/HC/NotificationManagement";
import AddPillars from "./components/Pillars/AddPillars/AddPillars";
import ViewPillars from "./components/Pillars/ViewPillars/ViewPillars";
import SelectCurrentYear from "./components/Pillars/SelectCurrentYear/SelectCurrentYear";
import AddDivision from "./components/Divisions/AddDivision/AddDivision";
import ViewDivisions from "./components/Divisions/ViewDivisions/ViewDivisions";
import AddOutcomes from "./components/Outcomes/AddOutcomes/AddOutcomes";
import AddForCurrentYear from "./components/Outcomes/AddForCurrentYear/AddForCurrentYear";
import ViewWorkPlan from "./components/ViewWorkPlan/ViewWorkPlan";
import ViewWorkingScoreCard from "./views/WorkingScoreCard/ViewWorkingScoreCard";
import AddAppraisee from "./views/AddAppraisee/AddAppraisee";
import IncompleteWorkPlan from "./components/AppraiseesView/IncompleteWorkplan";
import AddSection from "./components/Divisions/AddDivision/AddSection";
import AddPerformanceArea from "./components/AddPerformanceArea/AddPerformanceArea";
import SummaryScores from "./components/SummaryScores/SummaryScores";
import UpdateWorkPlan from "./views/CreateWorkPlan/UpdateWorkPlan";
import ActualPerformance from "./views/ResultScoreCard/ActualPerformance";
import PendingResultsScorecard from "./views/PendingResultsScorecard/PendingResultsScorecard";
import AddNewIndicator from "./views/CreateWorkPlan/AddNewIndicator";
import ToApproveResultsScorecard from "./components/AppraiseesView/ToApproveResultsScorecard";
import AppraiserActualPerfromance from "./views/ResultScoreCard/AppraiserActualPerformance";
import ApprovedResultsScorecard from "./views/Approved/ApprovedResultsScorecard";
import RejectedResultsScorecard from "./views/Rejected/RejectedResultsScorecard";
import ViewApprovedResultsScorecard from "./views/ViewApprovedResultsScorecard/ViewApprovedResultsScorecard";
import ViewRejectedResultsScorecard from "./views/ViewRejectedResultsScorecard/ViewRejectedResultsScorecard";
import AddRatios from "./views/AccountingRatios/AddRatios";
import ViewAccountingRatios from "./views/AccountingRatios/ViewAccountingRatios";
import UpdateProfile from "./components/UserProfile/UpdateProfile";
import AddQuarter from "./components/Quarters/AddQuarters";
import CloseQuarter from "./components/Quarters/CloseQuarter";
import OpenQuarter from "./components/Quarters/OpenQuarter";
import ArchiveTemplates from "./components/WorkplanTemplates/ArchiveTemplates";
import ViewArchivedTemplate from "./components/WorkplanTemplates/ViewArchivedTemplate";
import ViewRepositoryWorkPlans from "./views/ViewRepositoryWorkplans/ViewRepositoryWorkplans";
import ElevateUserRole from "./components/ElevateUserRole/ElevateUserRole";
import UpdateWorkplan2 from "./views/CreateWorkPlan/UpdateWorkplan2";
import AdminLogin from "./views/Admin/Login/AdminLogin";
import BoardLayout from "./components/AdminLayout/BoardLayout";
import BoardPortalHomePage from "./views/AdminDashboard/BoardPortalHomePage";
import BoardWorkplanList from "./views/BoardDashboard/BoardWorkplanList";
import BoardScorecardList from "./views/BoardDashboard/BoardScorecardList";
import BoardViewScorecard from "./views/BoardDashboard/BoardViewScorecard";
import BoardViewWorkplan from "./views/BoardDashboard/BoardViewWorkplan";
import EvaluatorApproveResultsScorecard from "./views/Approved/EvaluatorApproveResultsScorecard";
import EvaluatorViewApprovedResultsScorecard from "./views/EvaluatorViewResultsScorecard/EvaluatorViewResultsScorecard";
import AppraiseeConfirmation from "./views/ResultScoreCard/AppraiseeConfirmation";
import MyNotifications from "./views/MyNotifications/MyNotifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppraiseeDashboard />,
    children: [
      {
        path: "/",
        element: <SummaryScores />,
      },

      {
        path: "/dashboard",
        element: <SummaryScores />,
      },
      {
        path: "/completed",
        element: <Completed />,
      },

      {
        path: "/createWorkPlan",
        element: <CreateWorkPlan />,
      },

      {
        path: "/updateWorkPlan",
        element: <UpdateWorkPlan />,
      },

      {
        path: "/update-Workplan",
        element: <UpdateWorkplan2 />,
      },

      {
        path: "/viewWorkPlan",
        element: <ViewWorkPlan />,
      },
      {
        path: "/approved-appraisee-results-scorecard",
        element: <ApprovedResultsScorecard />,
      },
      {
        path: "/approved-appraisee-results-scorecard-evalaluator-comment",
        element: <EvaluatorApproveResultsScorecard />,
      },
      {
        path: "/rejected-appraisee-results-scorecard",
        element: <RejectedResultsScorecard />,
      },

      {
        path: "/pendingApproval",
        element: <PendingApproval />,
      },
      {
        path: "/allirbms",
        element: <AllIrbms />,
      },

      {
        path: "/rejected",
        element: <Rejected />,
      },

      {
        path: "/approved",
        element: <Approved />,
      },

      {
        path: "/underreview",
        element: <UnderReview />,
      },

      {
        path: "/underevaluation",
        element: <UnderEvaluation />,
      },

      {
        path: "/completed",
        element: <Completed />,
      },
      {
        path: "/previousscorecards",
        element: <PreviousScorecards />,
      },
      {
        path: "/previousworkplans",
        element: <PreviousWorkplans />,
      },
      {
        path: "/workingscorecard",
        element: <WorkingScoreCard />,
      },

      {
        path: "/add_actual_performance",
        element: <ActualPerformance />,
      },
      {
        path: "/appraiser_add_actual_performance",
        element: <AppraiserActualPerfromance />,
      },
      {
        path: "/view_Workingscorecard",
        element: <ViewWorkingScoreCard />,
      },
      {
        path: "/resultscorecard",
        element: <ResultScoreCard />,
      },
      {
        path: "/selected-incomplete-workplan",
        element: <IncompleteWorkPlan />,
      },
      {
        path: "/selected-repository-workplan",
        element: <ViewRepositoryWorkPlans />,
      },
      {
        path: "/add-appraisee",
        element: <AddAppraisee />,
      },

      {
        path: "/appraisee-result-scorecard-pending-approval",
        element: <PendingResultsScorecard />,
      },

      {
        path: "/selected-pending-approval-results-scorecard",
        element: <ToApproveResultsScorecard />,
      },
      {
        path: "/selected-approved-results-scorecard",
        element: <ViewApprovedResultsScorecard />,
      },
      {
        path: "/selected-repository-scorecard",
        element: <ViewApprovedResultsScorecard />,
      },
      {
        path: "/evaluatorcomment-selected-approved-results-scorecard",
        element: <EvaluatorViewApprovedResultsScorecard />,
      },
      {
        path: "/selected-rejected-appraisee-results-scorecard",
        element: <ViewRejectedResultsScorecard />,
      },

      {
        path: "/confirm-scorecard",
        element: <AppraiseeConfirmation />,
      },
      {
        path: "/my-notifications",
        element: <MyNotifications />,
      },

      {
        path: "/add-indicator",
        element: <AddNewIndicator />,
      },
      {
        path: "/update-profile",
        element: <UpdateProfile />,
      },
      {
        path: "/update-profile",
        element: <UpdateProfile />,
      },
      /////////////////////////////////BOARD DASHBOARD ENDPOINTS///////////////////////////////////////

      {
        path: "/board-dashboard/completed",
        element: <Completed />,
      },

      {
        path: "/board-dashboard/createWorkPlan",
        element: <CreateWorkPlan />,
      },

      {
        path: "/board-dashboard/updateWorkPlan",
        element: <UpdateWorkPlan />,
      },

      {
        path: "/board-dashboard/update-Workplan",
        element: <UpdateWorkplan2 />,
      },

      {
        path: "/board-dashboard/viewWorkPlan",
        element: <ViewWorkPlan />,
      },
      {
        path: "/board-dashboard/approved-appraisee-results-scorecard",
        element: <ApprovedResultsScorecard />,
      },
      {
        path: "/board-dashboard/rejected-appraisee-results-scorecard",
        element: <RejectedResultsScorecard />,
      },

      {
        path: "/board-dashboard/pendingApproval",
        element: <PendingApproval />,
      },
      {
        path: "/board-dashboard/allirbms",
        element: <AllIrbms />,
      },

      {
        path: "/board-dashboard/rejected",
        element: <Rejected />,
      },

      {
        path: "/board-dashboard/approved",
        element: <Approved />,
      },

      {
        path: "/board-dashboard/underreview",
        element: <UnderReview />,
      },

      {
        path: "/board-dashboard/underevaluation",
        element: <UnderEvaluation />,
      },

      {
        path: "/board-dashboard/completed",
        element: <Completed />,
      },
      {
        path: "/board-dashboard/previousscorecards",
        element: <PreviousScorecards />,
      },
      {
        path: "/board-dashboard/previousworkplans",
        element: <PreviousWorkplans />,
      },
      {
        path: "/board-dashboard/workingscorecard",
        element: <WorkingScoreCard />,
      },

      {
        path: "/board-dashboard/add_actual_performance",
        element: <ActualPerformance />,
      },
      {
        path: "/board-dashboard/appraiser_add_actual_performance",
        element: <AppraiserActualPerfromance />,
      },
      {
        path: "/board-dashboard/view_Workingscorecard",
        element: <ViewWorkingScoreCard />,
      },
      {
        path: "/board-dashboard/resultscorecard",
        element: <ResultScoreCard />,
      },
      {
        path: "/board-dashboard/selected-incomplete-workplan",
        element: <IncompleteWorkPlan />,
      },
      {
        path: "/board-dashboard/selected-repository-workplan",
        element: <ViewRepositoryWorkPlans />,
      },
      {
        path: "/board-dashboard/add-appraisee",
        element: <AddAppraisee />,
      },

      {
        path: "/board-dashboard/appraisee-result-scorecard-pending-approval",
        element: <PendingResultsScorecard />,
      },

      {
        path: "/board-dashboard/selected-pending-approval-results-scorecard",
        element: <ToApproveResultsScorecard />,
      },
      {
        path: "/board-dashboard/selected-approved-results-scorecard",
        element: <ViewApprovedResultsScorecard />,
      },
      {
        path: "/board-dashboard/selected-repository-scorecard",
        element: <ViewApprovedResultsScorecard />,
      },
      {
        path: "/board-dashboard/selected-rejected-appraisee-results-scorecard",
        element: <ViewRejectedResultsScorecard />,
      },
    ],
  },
  // {
  // HC Dashboard Routes
  {
    path: "/hc",
    element: <HCLayout />,
    children: [
      {
        path: "/hc/dashboard",
        element: <HCDashboard />,
      },
      {
        path: "/hc/users",
        element: <HCDashboard />,
      },
      {
        path: "/hc/users/grade",
        element: <HCDashboard />,
      },
      {
        path: "/hc/users/division",
        element: <HCDashboard />,
      },
      {
        path: "/hc/users/section",
        element: <HCDashboard />,
      },
      {
        path: "/hc/submissions",
        element: <HCDashboard />,
      },
      {
        path: "/hc/pending",
        element: <HCDashboard />,
      },
      {
        path: "/hc/post-quarter",
        element: <HCDashboard />,
      },
      {
        path: "/hc/notifications",
        element: <NotificationManagement />,
      },
      {
        path: "/hc/reports/summary",
        element: <HCDashboard />,
      },
      {
        path: "/hc/reports/export",
        element: <HCDashboard />,
      },
      {
        path: "/hc/scorecard/:id/review",
        element: <HCDashboard />,
      },
    ],
  },
  // Standalone route for HC to view user scorecards (outside HCLayout to avoid nested route issues)
  {
    path: "/hc/user/:username/scorecard",
    element: <ResultScoreCard />,
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/adminlogin",
        element: <AdminLogin />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [

      {
        path: "/admin/dashboard",
        element: <AdminHomePage />,
      },
      {
        path: "/admin/performanceAreas",
        element: <PerformanceArea />,
      },
      {
        path: "/admin/addPillars",
        element: <AddPillars />,
      },
      {
        path: "/admin/viewPillars",
        element: <ViewPillars />,
      },
      {
        path: "/admin/currentYearPillars",
        element: <SelectCurrentYear />,
      },
      {
        path: "/admin/addDivision",
        element: <AddDivision />,
      },
      {
        path: "/admin/addSection",
        element: <AddSection />,
      },
      {
        path: "/admin/viewDivisions",
        element: <ViewDivisions />,
      },
      {
        path: "/admin/addOutcomes",
        element: <AddOutcomes />,
      },
      {
        path: "/admin/add-performance-area",
        element: <AddPerformanceArea />,
      },
      {
        path: "/admin/addOutcomes-information",
        element: <AddForCurrentYear />,
      },
      {
        path: "/admin/add-accounting-ratios",
        element: <AddRatios />,
      },
      {
        path: "/admin/view-all-accounting-ratios",
        element: <ViewAccountingRatios />,
      },
      {
        path: "/admin/save-quarter",
        element: <AddQuarter />,
      },
      {
        path: "/admin/close-quarter-evaluation-period",
        element: <CloseQuarter />,
      },
      {
        path: "/admin/open-quarter-evaluation-period",
        element: <OpenQuarter />,
      },
      {
        path: "/admin/workplan-template-archive",
        element: <ArchiveTemplates />,
      },
      {
        path: "/admin/workplan-template-view/:id",
        element: <ViewArchivedTemplate />,
      },
      {
        path: "/admin/update-user-role",
        element: <ElevateUserRole />,
      },
    ],
  },
  // {
  // Board Dashboard Routes
  {
    path: "/board-dashboard",
    element: <BoardLayout />,
    children: [
      {
        path: "/board-dashboard/dashboard",
        element: <BoardPortalHomePage />,
      },
      {
        path: "/board-dashboard/workplan-approvals",
        element: <BoardWorkplanList />,
      },
      {
        path: "/board-dashboard/scorecard-approvals",
        element: <BoardScorecardList />,
      },
      {
        path: "/board-dashboard/view-scorecard", // New route for detailed view
        element: <BoardViewScorecard />,
      },
      {
        path: "/board-dashboard/view-workplan", // New route for workplan detailed view
        element: <BoardViewWorkplan />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
