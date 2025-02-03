import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Collapse
} from '@mui/material';
import {
  Work,
  LocalShipping,
  Assignment,
  DirectionsCar,
  People,
  Contacts,
  Person,
  Settings,
  Build,
  ExpandLess,
  ExpandMore,
  Description, // Import icon for Invoicing
  Business // Import icon for Companies
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidthExpanded = 240; // Expanded drawer width
const drawerWidthCollapsed = 60; // Collapsed drawer width

function AdminMenu() {
  const navigate = useNavigate();
  const [loadsMenuOpen, setLoadsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [invoicingMenuOpen, setInvoicingMenuOpen] = useState(false); // State for Invoicing submenu
  const [companiesMenuOpen, setCompaniesMenuOpen] = useState(false); // State for Companies submenu
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false); // State for Jobs submenu
  const [usersMenuOpen, setUsersMenuOpen] = useState(false); // State for Users submenu

  const loadsSubmenuItems = [
    { text: 'Load Search', path: '/admin/loads/search' },
    { text: 'Add Load', path: '/admin/loads/addloadpage' }, // Updated path to AddLoadPage.jsx
    { text: 'Edit Load', path: '/admin/loads/editloadpage' } // New submenu item
  ];

  const invoicingSubmenuItems = [
    { text: 'Create Invoice', path: '/admin/invoicing/create' },
    { text: 'Search Invoice', path: '/admin/invoicing/search' }
  ];

  const companiesSubmenuItems = [
    { text: 'Add Company', path: '/admin/companies/add' },
    { text: 'Edit Company', path: '/admin/companies/edit' }
  ];

  const jobsSubmenuItems = [
    { text: 'Add Job', path: '/admin/jobs/add' },
    { text: 'Edit Job', path: '/admin/jobs/edit' },
    { text: 'Delete Job', path: '/admin/jobs/delete' }
  ];

  const usersSubmenuItems = [
    { text: 'Add User', path: '/admin/users/add' },
    { text: 'Edit User', path: '/admin/users/edit' },
    { text: 'Delete User', path: '/admin/users/delete' }
  ];

  const handleLoadsClick = () => {
    setLoadsMenuOpen(!loadsMenuOpen);
  };

  const handleInvoicingClick = () => {
    setInvoicingMenuOpen(!invoicingMenuOpen);
  };

  const handleJobsClick = () => {
    setJobsMenuOpen(!jobsMenuOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
          transition: 'width 0.3s', // **Smooth transition**
          overflowX: 'hidden',
          top: '1px' // Snap to the bottom of the header
        }
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <Toolbar />
      <Divider />
      <List>
        {/* Loads Menu with Submenu */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLoadsClick}>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Loads" />}{' '}
            {/* **Conditionally show text** */}
            {isExpanded && (loadsMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={loadsMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {loadsSubmenuItems.map((submenuItem) => (
              <ListItem key={submenuItem.text} disablePadding>
                <ListItemButton onClick={() => navigate(submenuItem.path)}>
                  {isExpanded && (
                    <ListItemText primary={submenuItem.text} inset />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Invoicing Menu with Submenu */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleInvoicingClick}>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Invoicing" />}
            {isExpanded &&
              (invoicingMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={invoicingMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {invoicingSubmenuItems.map((submenuItem) => (
              <ListItem key={submenuItem.text} disablePadding>
                <ListItemButton onClick={() => navigate(submenuItem.path)}>
                  {isExpanded && (
                    <ListItemText primary={submenuItem.text} inset />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Companies Menu with Submenu */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setCompaniesMenuOpen(!companiesMenuOpen)}
          >
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Companies" />}
            {isExpanded &&
              (companiesMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={companiesMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {companiesSubmenuItems.map((submenuItem) => (
              <ListItem key={submenuItem.text} disablePadding>
                <ListItemButton onClick={() => navigate(submenuItem.path)}>
                  {isExpanded && (
                    <ListItemText primary={submenuItem.text} inset />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Jobs Menu with Submenu */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleJobsClick}>
            <ListItemIcon>
              <Work />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Jobs" />}
            {isExpanded && (jobsMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={jobsMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {jobsSubmenuItems.map((submenuItem) => (
              <ListItem key={submenuItem.text} disablePadding>
                <ListItemButton onClick={() => navigate(submenuItem.path)}>
                  {isExpanded && (
                    <ListItemText primary={submenuItem.text} inset />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>

        {/* Users Menu with Submenu */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setUsersMenuOpen(!usersMenuOpen)}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Users" />}
            {isExpanded && (usersMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={usersMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {usersSubmenuItems.map((submenuItem) => (
              <ListItem key={submenuItem.text} disablePadding>
                <ListItemButton onClick={() => navigate(submenuItem.path)}>
                  {isExpanded && (
                    <ListItemText primary={submenuItem.text} inset />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}

export default AdminMenu;
