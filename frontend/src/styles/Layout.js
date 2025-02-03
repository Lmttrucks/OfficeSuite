import React from 'react';
import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';
import AdminMenu from '../components/menus/AdminMenu'; // Corrected path
import Header from '../components/menus/Header'; // Corrected path
import './layout.css'; // Import the new CSS file

const Layout = ({ children }) => {
  const location = useLocation();

  // Check if the current page is the login page
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Header />} {/* Add Header component */}
      {!isLoginPage && <AdminMenu />}{' '}
      {/* Render AdminMenu directly below Header */}
      <main style={{ marginLeft: '60px' }}>{children}</main>{' '}
      {/* Add left margin */}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
