import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../authentication/axios-client";
import { useStateContext } from "../../context/ContextProvider";
import Swal from "sweetalert2";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  DoughnutController,
  BarController
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import "./hcDashboard.scss";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  DoughnutController,
  BarController
);

const HCDashboard = () => {
  const { userName, userType } = useStateContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Filters
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState("all");
  
  // Forwarded scorecards state
  const [forwardedScorecards, setForwardedScorecards] = useState([]);
  const [forwardedLoading, setForwardedLoading] = useState(false);

  // Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Statistics
  const [stats, setStats] = useState({
    totalUsers: 0,
    submitted: 0,
    pending: 0,
    postQuarterEnd: 0,
    complianceRate: 0,
    avgSubmissionTime: 0,
    topPerformers: [],
    bottomPerformers: [],
    divisionStats: {},
    gradeStats: {},
    recentSubmissions: [],
    scoreDistribution: {},
    forwardedToHC: 0
  });

  // Animation states
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    submitted: 0,
    pending: 0,
    postQuarterEnd: 0,
    complianceRate: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchForwardedScorecards();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, selectedGrade, selectedDivision, selectedSection, searchTerm, submissionStatus]);

  useEffect(() => {
    if (stats.totalUsers > 0) {
      animateStats();
    }
  }, [stats]);

  const animateStats = () => {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        totalUsers: Math.round(stats.totalUsers * easeOut),
        submitted: Math.round(stats.submitted * easeOut),
        pending: Math.round(stats.pending * easeOut),
        postQuarterEnd: Math.round(stats.postQuarterEnd * easeOut),
        complianceRate: Math.round(stats.complianceRate * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          totalUsers: stats.totalUsers,
          submitted: stats.submitted,
          pending: stats.pending,
          postQuarterEnd: stats.postQuarterEnd,
          complianceRate: stats.complianceRate
        });
      }
    }, interval);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch scorecard-based stats from the new endpoint
      try {
        const statsResponse = await axiosClient.get("/scorecard/hc/dashboardStats", {
          params: {}
        });
        const scorecardStats = statsResponse.data;
        
        // Use userScorecardList from the stats response if available
        let usersData = [];
        if (scorecardStats.userScorecardList && scorecardStats.userScorecardList.length > 0) {
          // Use the user-scorecard mapping from backend (most accurate)
          usersData = scorecardStats.userScorecardList;
        } else {
          // Fallback to /getAllUsers if no userScorecardList
          const usersResponse = await axiosClient.get("/getAllUsers");
          usersData = Array.isArray(usersResponse.data) ? usersResponse.data : usersResponse.data.content || [];
        }
        setUsers(usersData);
        
        // Update stats with scorecard-based data
        setStats({
          totalUsers: scorecardStats.totalUsers || usersData.length,
          submitted: scorecardStats.submitted || 0,
          pending: scorecardStats.pending || 0,
          postQuarterEnd: scorecardStats.postQuarterEnd || 0,
          complianceRate: scorecardStats.complianceRate || 0,
          avgSubmissionTime: 5,
          divisionStats: scorecardStats.divisionStats || {},
          gradeStats: scorecardStats.gradeStats || {},
          topPerformers: scorecardStats.topPerformers || [],
          bottomPerformers: scorecardStats.bottomPerformers || [],
          recentSubmissions: scorecardStats.recentSubmissions || [],
          scoreDistribution: scorecardStats.scoreDistribution || {},
          forwardedToHC: scorecardStats.forwardedToHC || 0
        });
      } catch (statsErr) {
        console.error("Error fetching scorecard stats:", statsErr);
        // Fallback to user-based data
        try {
          const response = await axiosClient.get("/getAllUsers");
          const usersData = Array.isArray(response.data) ? response.data : response.data.content || [];
          setUsers(usersData);
          calculateUserStats(usersData);
        } catch (err) {
          console.error("Error fetching users:", err);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Separate function to calculate user-based stats as fallback
  const calculateUserStats = (usersData) => {
    const submitted = usersData.filter(u => u.hasSubmittedScorecard).length;
    const pending = usersData.filter(u => !u.hasSubmittedScorecard).length;
    const postQuarterEnd = usersData.filter(u => u.submittedAfterQuarterEnd).length;
    const complianceRate = usersData.length > 0 ? Math.round((submitted / usersData.length) * 100) : 0;

    const divisionStats = {};
    usersData.forEach(user => {
      const division = user.divisionName || "Unknown";
      if (!divisionStats[division]) {
        divisionStats[division] = { total: 0, submitted: 0, pending: 0 };
      }
      divisionStats[division].total++;
      if (user.hasSubmittedScorecard) {
        divisionStats[division].submitted++;
      } else {
        divisionStats[division].pending++;
      }
    });

    const gradeStats = {};
    usersData.forEach(user => {
      const grade = user.grade || "Unknown";
      if (!gradeStats[grade]) {
        gradeStats[grade] = { total: 0, submitted: 0, pending: 0 };
      }
      gradeStats[grade].total++;
      if (user.hasSubmittedScorecard) {
        gradeStats[grade].submitted++;
      } else {
        gradeStats[grade].pending++;
      }
    });

    const topPerformers = usersData
      .filter(u => u.hasSubmittedScorecard && u.submissionDate)
      .sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate))
      .slice(0, 5);

    const recentSubmissions = usersData
      .filter(u => u.hasSubmittedScorecard && u.submissionDate)
      .sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate))
      .slice(0, 10);

    setStats({
      totalUsers: usersData.length,
      submitted,
      pending,
      postQuarterEnd,
      complianceRate,
      avgSubmissionTime: 5,
      divisionStats,
      gradeStats,
      topPerformers,
      recentSubmissions,
      scoreDistribution: {},
      forwardedToHC: 0
    });
  };

  const fetchForwardedScorecards = async () => {
    try {
      setForwardedLoading(true);
      // Fetch scorecards with forwardedToHC = true
      const response = await axiosClient.get("/scorecard/searchAllScorecards", {
        params: {}
      });
      
      // Filter scorecards that have been forwarded to HC
      const allScorecards = response.data || [];
      const forwarded = allScorecards.filter(s => s.forwardedToHC === true);
      
      setForwardedScorecards(forwarded);
      setForwardedLoading(false);
    } catch (err) {
      console.error("Error fetching forwarded scorecards:", err);
      setForwardedLoading(false);
    }
  };

  const handleMarkAsReceived = async (scorecard) => {
    const result = await Swal.fire({
      title: "Mark as Received?",
      text: `Mark scorecard for ${scorecard.user_email} as received?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, Mark as Received",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosClient.get(`/scorecard/hc/markReceived/${scorecard.id}`, {
          params: {
            hcEmail: userName,
          },
        });

        Swal.fire({
          icon: "success",
          title: "Received!",
          text: response.data,
          timer: 3000,
        });

        fetchForwardedScorecards(); // Refresh the list
      } catch (error) {
        console.error("Error marking scorecard as received:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data || "Failed to mark scorecard as received",
        });
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (selectedGrade) {
      filtered = filtered.filter(user => user.grade === selectedGrade);
    }

    if (selectedDivision) {
      filtered = filtered.filter(user => user.divisionName === selectedDivision);
    }

    if (selectedSection) {
      filtered = filtered.filter(user => user.sectionName === selectedSection);
    }

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (submissionStatus !== "all") {
      if (submissionStatus === "submitted") {
        filtered = filtered.filter(user => user.hasSubmittedScorecard);
      } else if (submissionStatus === "pending") {
        filtered = filtered.filter(user => !user.hasSubmittedScorecard);
      } else if (submissionStatus === "post-quarter") {
        filtered = filtered.filter(user => user.submittedAfterQuarterEnd);
      } else if (submissionStatus === "approved") {
        filtered = filtered.filter(user => user.scorecardStatus === 'Approved');
      } else if (submissionStatus === "results") {
        filtered = filtered.filter(user => user.scorecardStatus === 'ResultsScorecard');
      } else if (submissionStatus === "forwarded") {
        filtered = filtered.filter(user => user.forwardedToHC === true);
      }
    }

    setFilteredUsers(filtered);
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  // Chart data for submission status
  const submissionChartData = {
    labels: ['Submitted', 'Pending', 'Post-Q End'],
    datasets: [{
      data: [stats.submitted, stats.pending, stats.postQuarterEnd],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',
        'rgba(244, 67, 54, 0.8)',
        'rgba(255, 193, 7, 0.8)'
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(255, 193, 7, 1)'
      ],
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  // Chart data for division performance
  const divisionChartData = {
    labels: Object.keys(stats.divisionStats),
    datasets: [
      {
        label: 'Submitted',
        data: Object.values(stats.divisionStats).map(d => d.submitted),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderRadius: 8,
      },
      {
        label: 'Pending',
        data: Object.values(stats.divisionStats).map(d => d.pending),
        backgroundColor: 'rgba(244, 67, 54, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  // Chart data for score distribution
  const scoreDistributionChartData = {
    labels: ['6 - Exceeds (90%+)', '5 - Above Target (80-89%)', '4 - Met Target (70-79%)', '3 - Below Target (60-69%)', '2 - Below Variance (50-59%)', '1 - Not Met (<50%)'],
    datasets: [{
      data: [
        stats.scoreDistribution?.score6 || 0,
        stats.scoreDistribution?.score5 || 0,
        stats.scoreDistribution?.score4 || 0,
        stats.scoreDistribution?.score3 || 0,
        stats.scoreDistribution?.score2 || 0,
        stats.scoreDistribution?.score1 || 0
      ],
      backgroundColor: [
        'rgba(76, 175, 80, 0.8)',   // Green - Exceeds
        'rgba(139, 195, 74, 0.8)',  // Light Green - Above
        'rgba(255, 193, 7, 0.8)',   // Yellow - Met
        'rgba(255, 152, 0, 0.8)',   // Orange - Below
        'rgba(244, 67, 54, 0.8)',   // Red - Below Variance
        'rgba(183, 28, 28, 0.8)'    // Dark Red - Not Met
      ],
      borderColor: [
        'rgba(76, 175, 80, 1)',
        'rgba(139, 195, 74, 1)',
        'rgba(255, 193, 7, 1)',
        'rgba(255, 152, 0, 1)',
        'rgba(244, 67, 54, 1)',
        'rgba(183, 28, 28, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 }
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { stepSize: 1 }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart'
    }
  };

  // Get unique values for filters
  const grades = [...new Set(users.map(u => u.grade).filter(Boolean))].sort();
  const divisions = [...new Set(users.map(u => u.divisionName).filter(Boolean))].sort();
  const sections = [...new Set(users.map(u => u.sectionName).filter(Boolean))].sort();

  const handleExport = () => {
    const csvContent = filteredUsers.map(user => ({
      Name: `${user.name} ${user.surname}`,
      Username: user.username,
      Grade: user.grade,
      Division: user.divisionName,
      Section: user.sectionName,
      Position: user.positionName,
      Status: user.hasSubmittedScorecard ? "Submitted" : "Pending",
      SubmissionDate: user.submissionDate || "",
    }));

    const headers = Object.keys(csvContent[0] || {}).join(",");
    const rows = csvContent.map(row => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hc_dashboard_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleResetFilters = () => {
    setSelectedGrade("");
    setSelectedDivision("");
    setSelectedSection("");
    setSearchTerm("");
    setSubmissionStatus("all");
  };

  if (loading) {
    return (
      <div className="hc-dashboard-container">
        <LinearProgress color="primary" />
        <Fade in={loading}>
          <Box className="loading-container">
            <Box className="loading-content">
              <RiIcons.RiLoader4Line className="loading-spinner" />
              <Typography variant="h6">Loading Dashboard...</Typography>
              <Typography variant="body2" color="textSecondary">Fetching latest data</Typography>
            </Box>
          </Box>
        </Fade>
      </div>
    );
  }

  return (
    <div className="hc-dashboard-container">
      {/* Header */}
      <Paper elevation={0} className="dashboard-header">
        <Box className="header-content">
          <Box className="header-text">
            <Typography variant="h4" className="dashboard-title">
              <RiIcons.RiDashboardLine className="header-icon" />
              Human Capital Executive Dashboard
            </Typography>
            <Typography variant="subtitle1" className="dashboard-subtitle">
              <MdIcons.MdTrendingUp className="subtitle-icon" />
              Real-time IRBM Performance Monitoring & Analytics
            </Typography>
          </Box>
          <Box className="header-actions">
            <Tooltip title="Refresh Data">
              <IconButton onClick={fetchUsers} className="action-btn">
                <AiIcons.AiOutlineReload />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Report">
              <IconButton onClick={handleExport} className="action-btn">
                <FaIcons.FaFileExport />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton className="action-btn notification-btn">
                <Badge badgeContent={3} color="error">
                  <AiIcons.AiOutlineBell />
                </Badge>
              </IconButton>
            </Tooltip>
            <Avatar className="user-avatar" sx={{ bgcolor: 'primary.main' }}>
              {userName?.charAt(0)?.toUpperCase() || 'H'}
            </Avatar>
          </Box>
        </Box>
      </Paper>

      {/* KPI Cards */}
      <Grid container spacing={3} className="kpi-container">
        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={100}>
            <Card className="kpi-card gradient-blue">
              <CardContent>
                <Box className="kpi-icon">
                  <FaIcons.FaUsers />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value">
                    {animatedStats.totalUsers}
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Total Employees
                  </Typography>
                </Box>
                <Box className="kpi-trend positive">
                  <MdIcons.MdArrowUpward /> Active
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={200}>
            <Card className="kpi-card gradient-green">
              <CardContent>
                <Box className="kpi-icon success">
                  <FaIcons.FaCheckCircle />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value success">
                    {animatedStats.submitted}
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Submitted IRBMs
                  </Typography>
                </Box>
                <Box className="kpi-trend positive">
                  <MdIcons.MdArrowUpward /> On Track
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={300}>
            <Card className="kpi-card gradient-red">
              <CardContent>
                <Box className="kpi-icon warning">
                  <FaIcons.FaClock />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value warning">
                    {animatedStats.pending}
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Pending Submission
                  </Typography>
                </Box>
                <Box className="kpi-trend negative">
                  <MdIcons.MdArrowDownward /> Needs Attention
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={400}>
            <Card className="kpi-card gradient-purple">
              <CardContent>
                <Box className="kpi-icon purple">
                  <AiIcons.AiOutlinePercentage />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value purple">
                    {animatedStats.complianceRate}%
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Compliance Rate
                  </Typography>
                </Box>
                <Box className="kpi-progress">
                  <LinearProgress
                    variant="determinate"
                    value={animatedStats.complianceRate}
                    className="progress-bar"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={500}>
            <Card className="kpi-card gradient-orange">
              <CardContent>
                <Box className="kpi-icon orange">
                  <MdIcons.MdForward />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value orange">
                    {stats.forwardedToHC || 0}
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Forwarded to HC
                  </Typography>
                </Box>
                <Box className="kpi-trend positive">
                  <MdIcons.MdCheckCircle /> Ready for Review
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Grow in={true} timeout={550}>
            <Card className="kpi-card gradient-red">
              <CardContent>
                <Box className="kpi-icon warning">
                  <MdIcons.MdWarning />
                </Box>
                <Box className="kpi-content">
                  <Typography variant="h3" className="kpi-value warning">
                    {animatedStats.postQuarterEnd}
                  </Typography>
                  <Typography variant="body2" className="kpi-label">
                    Late Submissions
                  </Typography>
                </Box>
                <Box className="kpi-trend negative">
                  <MdIcons.MdWarning /> Post-Q End
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} className="charts-container">
        <Grid item xs={12} md={4}>
          <Slide direction="up" in={true} timeout={600}>
            <Card className="chart-card">
              <CardContent>
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">
                    <AiIcons.AiOutlinePieChart /> Submission Overview
                  </Typography>
                  <Chip label="Real-time" color="primary" size="small" />
                </Box>
                <Box className="chart-body doughnut-chart">
                  <Doughnut data={submissionChartData} options={doughnutOptions} />
                  <Box className="chart-center">
                    <Typography variant="h4" className="center-value">
                      {stats.complianceRate}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Compliance
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} md={4}>
          <Slide direction="up" in={true} timeout={650}>
            <Card className="chart-card">
              <CardContent>
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">
                    <MdIcons.MdBarChart /> Score Distribution
                  </Typography>
                  <Chip label="By Rating" color="secondary" size="small" />
                </Box>
                <Box className="chart-body doughnut-chart">
                  <Doughnut data={scoreDistributionChartData} options={doughnutOptions} />
                  <Box className="chart-center">
                    <Typography variant="h4" className="center-value">
                      {stats.submitted}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Scored
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        <Grid item xs={12} md={4}>
          <Slide direction="up" in={true} timeout={700}>
            <Card className="chart-card">
              <CardContent>
                <Box className="chart-header">
                  <Typography variant="h6" className="chart-title">
                    <AiIcons.AiOutlineBarChart /> Division Performance
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="">All Divisions</MenuItem>
                      {divisions.map(d => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box className="chart-body bar-chart">
                  <Bar data={divisionChartData} options={barOptions} />
                </Box>
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper elevation={1} className="tabs-section">
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          className="custom-tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<BiIcons.BiUser />} label="Users List" />
          <Tab icon={<MdIcons.MdStar />} label="Top Performers" />
          <Tab icon={<AiIcons.AiOutlineClockCircle />} label="Recent Activity" />
          <Tab icon={<FaIcons.FaFileAlt />} label="Pending HC Review" />
        </Tabs>

        <Box className="tab-content">
          {activeTab === 0 && (
            <Box className="users-tab">
              {/* Filters */}
              <Box className="filters-bar">
                <Box className="filters-row">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Grade</InputLabel>
                    <Select
                      value={selectedGrade}
                      label="Grade"
                      onChange={(e) => setSelectedGrade(e.target.value)}
                    >
                      <MenuItem value="">All Grades</MenuItem>
                      {grades.map(g => (
                        <MenuItem key={g} value={g}>{g}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Division</InputLabel>
                    <Select
                      value={selectedDivision}
                      label="Division"
                      onChange={(e) => setSelectedDivision(e.target.value)}
                    >
                      <MenuItem value="">All Divisions</MenuItem>
                      {divisions.map(d => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={submissionStatus}
                      label="Status"
                      onChange={(e) => setSubmissionStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="submitted">Submitted</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="approved">Approved</MenuItem>
                      <MenuItem value="results">Results Scorecard</MenuItem>
                      <MenuItem value="forwarded">Forwarded to HC</MenuItem>
                      <MenuItem value="post-quarter">Post-Q End</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <AiIcons.AiOutlineSearch style={{ marginRight: 8, color: 'gray' }} />
                    }}
                  />

                  <Button variant="outlined" onClick={handleResetFilters}>
                    Reset
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={<FaIcons.FaFileExport />}
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                </Box>
              </Box>

              {/* Users Table */}
              <MaterialReactTable
                columns={[
                  {
                    accessorKey: "name",
                    header: "Employee",
                    size: 200,
                    Cell: ({ row }) => (
                      <Box className="employee-cell">
                        <Avatar className="employee-avatar" sx={{ bgcolor: row.original.hasSubmittedScorecard ? 'success.light' : 'error.light' }}>
                          {row.original.name?.charAt(0)}{row.original.surname?.charAt(0)}
                        </Avatar>
                        <Box className="employee-info">
                          <Typography variant="body2" className="employee-name">
                            {row.original.name} {row.original.surname}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {row.original.username}
                          </Typography>
                        </Box>
                      </Box>
                    ),
                  },
                  {
                    accessorKey: "grade",
                    header: "Grade",
                    size: 80,
                    Cell: ({ row }) => (
                      <Chip
                        label={row.original.grade || "N/A"}
                        color={row.original.grade === "0" ? "error" : "default"}
                        size="small"
                        variant="outlined"
                      />
                    ),
                  },
                  {
                    accessorKey: "divisionName",
                    header: "Division",
                    size: 150,
                  },
                  {
                    accessorKey: "positionName",
                    header: "Position",
                    size: 180,
                  },
                  {
                    accessorKey: "status",
                    header: "Status",
                    size: 150,
                    Cell: ({ row }) => {
                      const { scorecardStatus, submittedAfterQuarterEnd, hasSubmittedScorecard, forwardedToHC } = row.original;
                      
                      // Show specific status based on scorecard status
                      if (scorecardStatus === 'Approved') {
                        return <Chip label="Approved" color="success" size="small" icon={<FaIcons.FaCheckCircle />} />;
                      } else if (scorecardStatus === 'ResultsScorecard') {
                        return <Chip label="Results Scorecard" color="info" size="small" icon={<FaIcons.FaFileAlt />} />;
                      } else if (scorecardStatus === 'WorkingScorecard') {
                        return <Chip label="Working Scorecard" color="warning" size="small" icon={<FaIcons.FaEdit />} />;
                      } else if (forwardedToHC) {
                        return <Chip label="Forwarded to HC" color="primary" size="small" icon={<MdIcons.MdForward />} />;
                      } else if (submittedAfterQuarterEnd) {
                        return <Chip label="Late" color="warning" size="small" icon={<FaIcons.FaExclamationTriangle />} />;
                      } else if (hasSubmittedScorecard) {
                        return <Chip label="Submitted" color="success" size="small" icon={<FaIcons.FaCheckCircle />} />;
                      } else {
                        return <Chip label="Pending" color="error" size="small" icon={<FaIcons.FaClock />} />;
                      }
                    },
                  },
                  {
                    accessorKey: "submissionDate",
                    header: "Submission Date",
                    size: 130,
                    Cell: ({ row }) => (
                      <Typography variant="body2">
                        {row.original.submissionDate
                          ? new Date(row.original.submissionDate).toLocaleDateString()
                          : "-"}
                      </Typography>
                    ),
                  },
                  {
                    accessorKey: "actions",
                    header: "Actions",
                    size: 100,
                    Cell: ({ row }) => (
                      <Box className="action-buttons">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => handleViewDetails(row.original)}>
                            <AiIcons.AiFillEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Scorecard">
                          <IconButton
                            size="small"
                            disabled={!row.original.hasSubmittedScorecard}
                            onClick={() => navigate(`/hc/user/${row.original.username}/scorecard`)}
                          >
                            <FaIcons.FaFileAlt />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    ),
                  },
                ]}
                data={filteredUsers}
                enablePagination
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50, 100]}
                initialState={{ showColumnFilters: false }}
                muiTableHeadCellProps={{
                  sx: {
                    backgroundColor: '#f8fafc',
                    fontWeight: 600,
                    fontSize: 13
                  }
                }}
                muiTableBodyRowProps={{
                  sx: {
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    cursor: 'pointer'
                  }
                }}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box className="top-performers-tab">
              <Grid container spacing={2}>
                {stats.topPerformers.map((user, index) => (
                  <Grid item xs={12} md={6} lg={4} key={user.username}>
                    <Card className="performer-card">
                      <CardContent>
                        <Box className="performer-rank">
                          <Typography variant="h4">#{index + 1}</Typography>
                        </Box>
                        <Box className="performer-info">
                          <Avatar className="performer-avatar" sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                            {user.name?.charAt(0)}{user.surname?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">
                              {user.name} {user.surname}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {user.positionName}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {user.divisionName}
                            </Typography>
                          </Box>
                        </Box>
                        <Box className="performer-date">
                          <MdIcons.MdCalendarToday />
                          Submitted: {user.submissionDate ? new Date(user.submissionDate).toLocaleDateString() : '-'}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box className="activity-tab">
              <ActivityList activityData={stats.recentSubmissions} />
            </Box>
          )}

          {/* Pending HC Review Tab */}
          {activeTab === 3 && (
            <Box className="hc-review-tab">
              <Box className="review-header">
                <Typography variant="h6" className="review-title">
                  <FaIcons.FaFileAlt /> Scorecards Pending HC Review
                </Typography>
                <Chip 
                  label={`${forwardedScorecards.length} Scorecards`} 
                  color="primary" 
                  size="small" 
                />
              </Box>
              
              {forwardedLoading ? (
                <LinearProgress />
              ) : forwardedScorecards.length === 0 ? (
                <Box className="empty-state">
                  <AiIcons.AiOutlineInbox style={{ fontSize: 48, color: '#9ca3af' }} />
                  <Typography variant="h6" color="textSecondary">
                    No Scorecards Pending Review
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Scorecards will appear here after appraisees confirm their results
                  </Typography>
                </Box>
              ) : (
                <Box className="review-list">
                  {forwardedScorecards.map((scorecard) => (
                    <Paper key={scorecard.id} elevation={1} className="review-item">
                      <Box className="review-item-content">
                        <Avatar 
                          className="review-avatar"
                          sx={{ bgcolor: scorecard.hcStatus === 'PENDING_HC' ? 'warning.light' : scorecard.hcStatus === 'UNDER_REVIEW_HC' ? 'info.light' : 'success.light' }}
                        >
                          <FaIcons.FaFileAlt />
                        </Avatar>
                        <Box className="review-item-info">
                          <Typography variant="subtitle1" className="review-item-title">
                            {scorecard.user_email || 'Unknown User'}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Evaluation Period: {scorecard.evaluationPeriod}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Submitted: {scorecard.forwardedToHCAt ? new Date(scorecard.forwardedToHCAt).toLocaleString() : 'N/A'}
                          </Typography>
                          {scorecard.hcReceivedAt && (
                            <Typography variant="body2" color="textSecondary">
                              Received: {new Date(scorecard.hcReceivedAt).toLocaleString()}
                            </Typography>
                          )}
                        </Box>
                        <Box className="review-item-status">
                          <Chip 
                            label={scorecard.hcStatus === 'PENDING_HC' ? 'Pending' : scorecard.hcStatus === 'UNDER_REVIEW_HC' ? 'Under Review' : scorecard.hcStatus || 'Pending'}
                            color={scorecard.hcStatus === 'PENDING_HC' ? 'warning' : 'success'}
                            size="small"
                          />
                          <Chip 
                            label={`Score: ${scorecard.total_overal_weighted_score?.toFixed(2) || 'N/A'}`}
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        <Box className="review-item-actions">
                          {scorecard.hcStatus === 'PENDING_HC' ? (
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              startIcon={<AiIcons.AiFillCheckCircle />}
                              onClick={() => handleMarkAsReceived(scorecard)}
                              sx={{ mr: 1 }}
                            >
                              Mark as Received
                            </Button>
                          ) : (
                            <Chip 
                              label="Received" 
                              color="success" 
                              size="small" 
                              sx={{ mr: 1 }}
                            />
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AiIcons.AiFillEye />}
                            onClick={() => navigate(`/hc/scorecard/${scorecard.id}/review`)}
                          >
                            Review
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>

      {/* User Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        TransitionComponent={Grow}
      >
        <DialogTitle className="modal-header">
          <Box className="modal-title">
            <Avatar className="modal-avatar" sx={{ bgcolor: selectedUser?.hasSubmittedScorecard ? 'success.main' : 'error.main' }}>
              {selectedUser?.name?.charAt(0)}{selectedUser?.surname?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6">
                {selectedUser?.name} {selectedUser?.surname}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedUser?.positionName}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setModalOpen(false)}>
            <AiIcons.AiOutlineClose />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="detail-section">
                  <Typography variant="subtitle2" className="section-title">
                    <BiIcons.BiUser /> Personal Information
                  </Typography>
                  <Divider />
                  <Box className="detail-grid">
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Username</Typography>
                      <Typography variant="body1">{selectedUser.username}</Typography>
                    </Box>
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{selectedUser.email}</Typography>
                    </Box>
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">EC Number</Typography>
                      <Typography variant="body1">{selectedUser.ec_number}</Typography>
                    </Box>
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Grade</Typography>
                      <Chip label={selectedUser.grade || "N/A"} size="small" />
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={0} className="detail-section">
                  <Typography variant="subtitle2" className="section-title">
                    <MdIcons.MdBusiness /> Organizational Information
                  </Typography>
                  <Divider />
                  <Box className="detail-grid">
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Division</Typography>
                      <Typography variant="body1">{selectedUser.divisionName}</Typography>
                    </Box>
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Section</Typography>
                      <Typography variant="body1">{selectedUser.sectionName}</Typography>
                    </Box>
                    <Box className="detail-item">
                      <Typography variant="caption" color="textSecondary">Position</Typography>
                      <Typography variant="body1">{selectedUser.positionName}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={0} className="detail-section">
                  <Typography variant="subtitle2" className="section-title">
                    <AiIcons.AiOutlineFileText /> IRBM Status
                  </Typography>
                  <Divider />
                  <Box className="status-display">
                    <Box className="status-item">
                      <Typography variant="caption" color="textSecondary">Current Status</Typography>
                      <Box className="status-badge">
                        {selectedUser.submittedAfterQuarterEnd ? (
                          <Chip label="Submitted After Quarter End" color="warning" />
                        ) : selectedUser.hasSubmittedScorecard ? (
                          <Chip label="Submitted" color="success" />
                        ) : (
                          <Chip label="Pending" color="error" />
                        )}
                      </Box>
                    </Box>
                    <Box className="status-item">
                      <Typography variant="caption" color="textSecondary">Submission Date</Typography>
                      <Typography variant="body1">
                        {selectedUser.submissionDate
                          ? new Date(selectedUser.submissionDate).toLocaleString()
                          : 'Not submitted'}
                      </Typography>
                    </Box>
                    <Box className="status-item">
                      <Typography variant="caption" color="textSecondary">Compliance Score</Typography>
                      <Rating value={selectedUser.hasSubmittedScorecard ? 5 : 0} readOnly />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions className="modal-actions">
          <Button onClick={() => setModalOpen(false)}>Close</Button>
          {selectedUser && selectedUser.hasSubmittedScorecard && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<FaIcons.FaFileAlt />}
              onClick={() => {
                setModalOpen(false);
                navigate(`/hc/user/${selectedUser.username}/scorecard`);
              }}
            >
              View Full Scorecard
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

// Activity List Component
const ActivityList = ({ activityData }) => {
  return (
    <Box className="activity-list">
      {activityData.map((item, index) => (
        <Paper key={index} elevation={0} className="activity-item">
          <Avatar className="activity-avatar" sx={{ bgcolor: 'primary.light' }}>
            {item.name?.charAt(0)}
          </Avatar>
          <Box className="activity-content">
            <Typography variant="body1">
              <strong>{item.name} {item.surname}</strong> submitted IRBM
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {item.divisionName} - {item.submissionDate ? new Date(item.submissionDate).toLocaleString() : '-'}
            </Typography>
          </Box>
          <Chip
            label={item.submittedAfterQuarterEnd ? "Late" : "On Time"}
            color={item.submittedAfterQuarterEnd ? "warning" : "success"}
            size="small"
          />
        </Paper>
      ))}
    </Box>
  );
};

export default HCDashboard;
