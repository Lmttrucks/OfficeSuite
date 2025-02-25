import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './styles/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import PrivateRoute from './services/PrivateRoute';
import NotFound from './pages/NotFound';
import './styles/index.css';
import AddLoadPage from './pages/admin/loads/AddLoadPage';
import Loading from './pages/Loading';
import InvoicePreviewPage from './pages/admin/invoicing/InvoicePreviewPage';
import InvoiceGenFrm from './components/outinvoice/InvoiceGenFrm';
import InvoicePreviewForm from './components/outinvoice/InvoicePreviewForm';
import InvoicePreviewTable from './components/outinvoice/InvoicePreviewTable';
import AddCompanyPage from './pages/admin/companies/addCompanyPage';
import EditCompanyPage from './pages/admin/companies/editCompanyPage';
import AddJobPage from './pages/admin/jobs/AddJobPage';
import EditJobPage from './pages/admin/jobs/EditJobPage';
import DeleteJobPage from './pages/admin/jobs/DeleteJobPage';
import AddUserPage from './pages/admin/appusers/addUserPage';
import EditUserPage from './pages/admin/appusers/editUserPage';
import DeleteUserPage from './pages/admin/appusers/deleteUserPage';
import EditLoadPage from './pages/admin/loads/EditLoadPage';
import LinkLoadPage from './pages/admin/loads/LinkLoadPage';
import LinkInvoicePage from './pages/admin/invoicing/LinkInvoicePage';
import OtherInvoicePage from './pages/admin/invoicing/OtherInvoicePage';
import OtherInvoiceGenFrm from './components/outinvoice/otherinvoices/OtherInvoiceGenFrm';
import OtherInvoicePreviewForm from './components/outinvoice/otherinvoices/OtherInvoicePreviewForm';
import OtherInvoicePreviewTable from './components/outinvoice/otherinvoices/OtherInvoicePreviewTable';
import LinkInvoiceGenForm from './components/outinvoice/linkinvoicing/LinkInvoiceGenForm';
import LinkInvoicePreviewForm from './components/outinvoice/linkinvoicing/LinkInvoicePreviewForm';
import LinkInvoicePreviewTable from './components/outinvoice/linkinvoicing/LinkInvoicePreviewTable';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/loading"
          element={
            <PrivateRoute allowedRoles={['driver', 'manager', 'admin']}>
              <Loading />
            </PrivateRoute>
          }
        />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
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
                <Route
                  path="/admin/loads/editloadpage"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <EditLoadPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/loads/link-load"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <LinkLoadPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/other"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <OtherInvoicePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/other/generate"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <OtherInvoiceGenFrm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/other/preview"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <OtherInvoicePreviewForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/other/preview-table"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <OtherInvoicePreviewTable />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/link-invoice"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <LinkInvoicePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/link-invoice/generate"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <LinkInvoiceGenForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/link-invoice/preview"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <LinkInvoicePreviewForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/invoicing/link-invoice/preview-table"
                  element={
                    <PrivateRoute allowedRoles={['admin']}>
                      <LinkInvoicePreviewTable />
                    </PrivateRoute>
                  }
                />
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
