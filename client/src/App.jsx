import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

import AuthLayout from './layouts/AuthLayout.jsx';
import AppLayout from './layouts/AppLayout.jsx';

// Core public / fallback pages (direct or lazy)
import Login from './pages/Login.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import Forbidden from './pages/Forbidden.jsx';
import NotFound from './pages/NotFound.jsx';

// Route-level code splitting with React.lazy
const HrDashboard = lazy(() => import('./pages/dashboards/HrDashboard.jsx'));
const ManagerDashboard = lazy(() => import('./pages/dashboards/ManagerDashboard.jsx'));
const EmployeeDashboard = lazy(() => import('./pages/dashboards/EmployeeDashboard.jsx'));

// Chapter 2 Pages
const Employees = lazy(() => import('./pages/hr/Employees.jsx'));
const EmployeeDetail = lazy(() => import('./pages/hr/EmployeeDetail.jsx'));
const Departments = lazy(() => import('./pages/hr/Departments.jsx'));
const MyTeam = lazy(() => import('./pages/manager/MyTeam.jsx'));
const Directory = lazy(() => import('./pages/Directory.jsx'));
const MyProfile = lazy(() => import('./pages/MyProfile.jsx'));

// Chapter 3 Pages
const MyLeaves = lazy(() => import('./pages/leaves/MyLeaves.jsx'));
const LeaveCalendar = lazy(() => import('./pages/leaves/LeaveCalendar.jsx'));
const LeaveApprovals = lazy(() => import('./pages/manager/LeaveApprovals.jsx'));
const LeaveRequests = lazy(() => import('./pages/hr/LeaveRequests.jsx'));
const LeaveSettings = lazy(() => import('./pages/hr/LeaveSettings.jsx'));

// Chapter 4 Pages
const MyAttendance = lazy(() => import('./pages/attendance/MyAttendance.jsx'));
const TeamAttendance = lazy(() => import('./pages/manager/TeamAttendance.jsx'));
const AttendanceManagement = lazy(() => import('./pages/hr/AttendanceManagement.jsx'));
const AnnouncementsFeed = lazy(() => import('./pages/announcements/AnnouncementsFeed.jsx'));
const ManageAnnouncements = lazy(() => import('./pages/hr/ManageAnnouncements.jsx'));

// Chapter 5 Pages
const ManagerTraining = lazy(() => import('./pages/training/ManagerTraining.jsx'));
const EmployeeTraining = lazy(() => import('./pages/training/EmployeeTraining.jsx'));
const HrTraining = lazy(() => import('./pages/training/HrTraining.jsx'));
const TrainingDetail = lazy(() => import('./pages/training/TrainingDetail.jsx'));

function LoadingFallback() {
  return (
    <div className="d-flex align-items-center justify-content-center min-vh-50 p-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading page...</span>
      </div>
    </div>
  );
}

function RootRedirect() {
  const { user } = useAuth();
  if (!user || user.role === 'hr') return <Navigate to="/hr" replace />;
  if (user.role === 'manager') return <Navigate to="/manager" replace />;
  return <Navigate to="/employee" replace />;
}

function TrainingsRoute() {
  const { user } = useAuth();
  if (user?.role === 'hr') return <HrTraining />;
  if (user?.role === 'manager') return <ManagerTraining />;
  return <EmployeeTraining />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Direct Access: Redirect login to main dashboard */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Navigate to="/hr" replace />} />
                </Route>

                {/* Force password change or account settings */}
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <AuthLayout>
                        <ChangePassword />
                      </AuthLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Protected Authenticated App Layout */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* Root Redirect based on role */}
                  <Route index element={<RootRedirect />} />

                  {/* Common/Shared Routes across all roles */}
                  <Route path="directory" element={<Directory />} />
                  <Route path="profile" element={<MyProfile />} />
                  <Route path="leaves/my" element={<MyLeaves />} />
                  <Route path="leaves/calendar" element={<LeaveCalendar />} />
                  <Route path="attendance/my" element={<MyAttendance />} />
                  <Route path="announcements" element={<AnnouncementsFeed />} />
                  <Route path="trainings/my" element={<EmployeeTraining />} />
                  <Route path="trainings" element={<TrainingsRoute />} />
                  <Route path="trainings/:id" element={<TrainingDetail />} />

                  {/* HR Restricted Routes */}
                  <Route
                    path="hr"
                    element={
                      <RoleRoute roles={['hr']}>
                        <HrDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="employees"
                    element={
                      <RoleRoute roles={['hr']}>
                        <Employees />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="employees/:id"
                    element={
                      <RoleRoute roles={['hr', 'manager', 'employee']}>
                        <EmployeeDetail />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="departments"
                    element={
                      <RoleRoute roles={['hr']}>
                        <Departments />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="leaves/requests"
                    element={
                      <RoleRoute roles={['hr']}>
                        <LeaveRequests />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="leaves/settings"
                    element={
                      <RoleRoute roles={['hr']}>
                        <LeaveSettings />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="leaves"
                    element={
                      <RoleRoute roles={['hr']}>
                        <LeaveRequests />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="attendance"
                    element={
                      <RoleRoute roles={['hr']}>
                        <AttendanceManagement />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="announcements/manage"
                    element={
                      <RoleRoute roles={['hr']}>
                        <ManageAnnouncements />
                      </RoleRoute>
                    }
                  />

                  {/* Manager Routes */}
                  <Route
                    path="manager"
                    element={
                      <RoleRoute roles={['manager', 'hr']}>
                        <ManagerDashboard />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="team"
                    element={
                      <RoleRoute roles={['manager', 'hr']}>
                        <MyTeam />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="leaves/approvals"
                    element={
                      <RoleRoute roles={['manager', 'hr']}>
                        <LeaveApprovals />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="leaves/team"
                    element={
                      <RoleRoute roles={['manager', 'hr']}>
                        <LeaveApprovals />
                      </RoleRoute>
                    }
                  />
                  <Route
                    path="attendance/team"
                    element={
                      <RoleRoute roles={['manager', 'hr']}>
                        <TeamAttendance />
                      </RoleRoute>
                    }
                  />

                  {/* Employee Routes */}
                  <Route
                    path="employee"
                    element={
                      <RoleRoute roles={['employee', 'manager', 'hr']}>
                        <EmployeeDashboard />
                      </RoleRoute>
                    }
                  />
                </Route>

                {/* Status and Fallback Routes */}
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
