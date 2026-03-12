import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import { MaterialReactTable } from "material-react-table";
import { useStateContext } from "../../context/ContextProvider";
import axiosClient from "../../authentication/axios-client";

// Material Icons
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import GradeIcon from "@mui/icons-material/Grade";
import WorkIcon from "@mui/icons-material/Work";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const getCurrentEvaluationPeriod = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  let quarter;
  let daysRemaining;
  let quarterStart;
  let quarterEnd;

  if (currentMonth >= 1 && currentMonth <= 3) {
    quarter = "Q1";
    quarterStart = "01 January";
    quarterEnd = "31 March";
    const endOfQuarter = new Date(currentYear, 2, 31);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else if (currentMonth >= 4 && currentMonth <= 6) {
    quarter = "Q2";
    quarterStart = "01 April";
    quarterEnd = "30 June";
    const endOfQuarter = new Date(currentYear, 5, 30);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else if (currentMonth >= 7 && currentMonth <= 9) {
    quarter = "Q3";
    quarterStart = "01 July";
    quarterEnd = "30 September";
    const endOfQuarter = new Date(currentYear, 8, 30);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  } else {
    quarter = "Q4";
    quarterStart = "01 October";
    quarterEnd = "31 December";
    const endOfQuarter = new Date(currentYear, 11, 31);
    daysRemaining = Math.ceil((endOfQuarter.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
  }

  return {
    evaluationPeriod: `${currentYear}-${quarter}`,
    daysRemaining,
    quarterStart,
    quarterEnd,
  };
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, onClick }) => (
  <Card 
    sx={{ 
      height: '100%', 
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 6 } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 0.5 }}>
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend && (
              trend > 0 ? <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Avatar sx={{ bgcolor: `${color}15`, width: 56, height: 56 }}>
          <Icon sx={{ color: `${color} !important`, fontSize: 28 }} />
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const QuickActionCard = ({ title, description, icon: Icon, color, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      cursor: 'pointer',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: color,
        bgcolor: `${color}08`,
      },
    }}
  >
    <Avatar sx={{ bgcolor: `${color}15`, width: 48, height: 48 }}>
      <Icon sx={{ color }} />
    </Avatar>
    <Box sx={{ flex: 1 }}>
      <Typography variant="subtitle2" fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {description}
      </Typography>
    </Box>
    <ArrowForwardIcon sx={{ color: 'text.disabled' }} />
  </Paper>
);

export default function AdminHomePage() {
  const navigate = useNavigate();
  const [appraiseeProfileData, setAppraiseeProfileData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalDivisions: 0,
    totalGrades: 0,
    activeStaff: 0,
    pendingAssignments: 0,
  });
  
  const { evaluationPeriod, daysRemaining, quarterStart, quarterEnd } = getCurrentEvaluationPeriod();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersResponse = await axiosClient.get("/getAllUsers");
      const users = usersResponse.data;
      console.log("Users data:", users); // Debug log
      setAppraiseeProfileData(users);
      
      // Calculate stats
      const divisions = [...new Set(users.map(u => u.divisionName).filter(Boolean))];
      const grades = [...new Set(users.map(u => u.grade).filter(Boolean))];
      
      setStats({
        totalStaff: users.length,
        totalDivisions: divisions.length,
        totalGrades: grades.length,
        activeStaff: users.filter(u => u.enabled !== false).length,
        pendingAssignments: users.filter(u => u.appraiser_status === 'UnAssigned').length,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      size: 120,
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
            {row.original.name?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="body2" fontWeight={500}>
            {row.original.name} {row.original.surname}
          </Typography>
        </Box>
      ),
    },
    {
      accessorKey: "positionName",
      header: "Position",
      size: 150,
    },
    {
      accessorKey: "grade",
      header: "Grade",
      size: 80,
      Cell: ({ row }) => {
        const gradeValue = row.original.grade || row.original.Grade || "N/A";
        return (
          <Chip 
            label={`Grade ${gradeValue}`} 
            size="small" 
            sx={{ fontWeight: 600 }} 
            color={parseInt(gradeValue) <= 5 ? "success" : parseInt(gradeValue) <= 10 ? "warning" : "error"}
          />
        );
      },
    },
    {
      accessorKey: "divisionName",
      header: "Division",
      size: 120,
      Cell: ({ row }) => row.original.divisionName || row.original.division || "N/A",
    },
    {
      accessorKey: "sectionName",
      header: "Section",
      size: 120,
      Cell: ({ row }) => row.original.sectionName || row.original.section || "N/A",
    },
    {
      accessorKey: "ec_number",
      header: "EC Number",
      size: 100,
    },
    {
      accessorKey: "appraiser_status",
      header: "Status",
      size: 120,
      Cell: ({ value }) => {
        const statusConfig = {
          'Assigned': { color: 'success', icon: CheckCircleIcon, label: 'Assigned' },
          'UnAssigned': { color: 'warning', icon: PendingActionsIcon, label: 'Unassigned' },
        };
        const config = statusConfig[value] || statusConfig['UnAssigned'];
        return (
          <Chip 
            icon={<config.icon sx={{ fontSize: 16 }} />}
            label={config.label}
            size="small"
            color={config.color}
            sx={{ fontWeight: 500 }}
          />
        );
      },
    },
    {
      accessorKey: "userRole",
      header: "Role",
      size: 100,
      Cell: ({ row }) => {
        const roles = row.original.userRole || [];
        if (!roles || roles.length === 0) {
          return <Chip label="USER" size="small" variant="outlined" />;
        }
        // If user has ADMIN role, show it (as it's more prominent)
        if (roles.includes("ADMIN") || roles.includes("HC")) {
          return (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {roles.map((role, idx) => (
                <Chip 
                  key={idx}
                  label={role} 
                  size="small" 
                  color={role === "ADMIN" ? "error" : role === "HC" ? "warning" : "default"}
                  variant="outlined"
                />
              ))}
            </Box>
          );
        }
        return <Chip label={roles[0]} size="small" variant="outlined" />;
      },
    },
  ], []);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
          color: 'white',
        }}
      >
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              Manage your organization's performance management system
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                icon={<CalendarTodayIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                label={`${quarterStart} - ${quarterEnd}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<AssessmentIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                label={`Evaluation: ${evaluationPeriod}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <Chip 
                icon={<TrendingUpIcon sx={{ fontSize: 16, color: 'white !important' }} />}
                label={`${daysRemaining} days remaining`}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md="auto">
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
              <IconButton 
                onClick={fetchData}
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }, color: 'white' }}
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Staff"
            value={stats.totalStaff}
            subtitle="Registered users"
            icon={PeopleIcon}
            color="#1a237e"
            trend={5}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Staff"
            value={stats.activeStaff}
            subtitle="Enabled accounts"
            icon={VerifiedUserIcon}
            color="#2e7d32"
            trend={3}
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Divisions"
            value={stats.totalDivisions}
            subtitle="Active divisions"
            icon={BusinessIcon}
            color="#c62828"
            onClick={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            subtitle="Unassigned appraisees"
            icon={PendingActionsIcon}
            color="#f57c00"
            onClick={() => navigate('/add-appraisee')}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      {/* <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Add User"
              description="Register new staff member"
              icon={PersonAddIcon}
              color="#1a237e"
              onClick={() => navigate('/register')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Manage Roles"
              description="Assign user permissions"
              icon={AdminPanelSettingsIcon}
              color="#c62828"
              onClick={() => navigate('/elevate-user-role')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="View Reports"
              description="Performance analytics"
              icon={AssessmentIcon}
              color="#2e7d32"
              onClick={() => {}}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Staff Directory"
              description="Browse all staff"
              icon={GroupsIcon}
              color="#f57c00"
              onClick={() => {}}
            />
          </Grid>
        </Grid>
      </Paper> */}

      {/* Staff Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        <Box sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Staff Directory
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appraiseeProfileData.length} staff members in the system
            </Typography>
          </Box>
          <Chip 
            label={`${stats.totalGrades} Grade Levels`}
            color="primary"
            variant="outlined"
          />
        </Box>
        
        {appraiseeProfileData && (
          <MaterialReactTable
            columns={columns}
            enableRowSelection
            getRowSurname={(row) => row.surname}
            onRowSelectionChange={setRowSelection}
            state={{ rowSelection }}
            data={appraiseeProfileData}
            initialState={{ 
              showColumnFilters: false,
              pagination: { pageSize: 10 },
            }}
            muiTablePaperProps={{
              elevation: 0,
              sx: {
                borderRadius: 0,
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                fontWeight: 600,
                bgcolor: '#f8f9fa',
              },
            }}
            muiTableBodyRowProps={({ row, index }) => ({
              sx: {
                cursor: 'pointer',
                '&:hover': { bgcolor: '#f5f7fa' },
              },
              onClick: () => {
                // Handle row click - could navigate to user details
              },
            })}
            muiTablePaginationProps={{
              showFirstButton: true,
              showLastButton: true,
            }}
          />
        )}
      </Paper>

      {/* Footer Info */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Last updated: {new Date().toLocaleDateString()} | Performance Management System v2.0
        </Typography>
      </Box>
    </Box>
  );
}
