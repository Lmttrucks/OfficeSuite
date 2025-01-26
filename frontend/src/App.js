import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import DriverDashboard from './pages/DriverDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import NotFound from './pages/NotFound';
import './styles/index.css';
import AddLoadPage from './pages/admin/loads/AddLoadPage';
import Loading from './pages/Loading'; // Import the Loading component
import InvoicePreviewPage from './pages/admin/invoicing/InvoicePreviewPage';
import InvoiceGenFrm from './components/InvoiceGenFrm'; // Import InvoiceGenFrm component
import InvoicePreviewForm from './components/InvoicePreviewForm'; // Import InvoicePreviewForm component
import InvoicePreviewTable from './components/InvoicePreviewTable'; // Import InvoicePreviewTable component
import AddCompanyPage from './pages/companies/addCompanyPage';
import EditCompanyPage from './pages/companies/editCompanyPage';
import AddJobPage from './pages/jobs/AddJobPage';
import EditJobPage from './pages/jobs/EditJobPage';
import DeleteJobPage from './pages/jobs/DeleteJobPage';
import AddUserPage from './pages/admin/appusers/addUserPage';
import EditUserPage from './pages/admin/appusers/editUserPage';
import DeleteUserPage from './pages/admin/appusers/deleteUserPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Loading Route */}
        <Route
          path="/loading"
          element={
            <PrivateRoute allowedRoles={['driver', 'manager', 'admin']}>
              <Loading />
            </PrivateRoute>
          }
        />

        {/* Protected Routes Wrapped in Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                {/* Admin Dashboard Route */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/admin/loads/addloadpage"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AddLoadPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/create"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <InvoiceGenFrm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/search"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <InvoicePreviewPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/preview"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <InvoicePreviewPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users/add"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AddUserPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users/edit"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <EditUserPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users/delete"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <DeleteUserPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/companies/add"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AddCompanyPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/companies/edit"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <EditCompanyPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/jobs/add"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <AddJobPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/jobs/edit"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <EditJobPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/jobs/delete"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <DeleteJobPage />
                    </PrivateRoute>
                  }
                />

                {/* Other Routes */}
                <Route
                  path="/driver/dashboard"
                  element={
                    <PrivateRoute allowedRoles={['driver']}>
                      <DriverDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/manager/dashboard"
                  element={
                    <PrivateRoute allowedRoles={['manager']}>
                      <ManagerDashboard />
                    </PrivateRoute>
                  }
                />
                {/* 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
