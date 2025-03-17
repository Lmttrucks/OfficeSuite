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
  Description,
  Business
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 60;

function AdminMenu() {
  const navigate = useNavigate();
  const [loadsMenuOpen, setLoadsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [invoicingMenuOpen, setInvoicingMenuOpen] = useState(false);
  const [companiesMenuOpen, setCompaniesMenuOpen] = useState(false);
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(false);
  const [employeesMenuOpen, setEmployeesMenuOpen] = useState(false); // Add this line

  const loadsSubmenuItems = [
    { text: 'Load Search', path: '/admin/loads/search' },
    { text: 'Add Load', path: '/admin/loads/addloadpage' },
    { text: 'Edit Load', path: '/admin/loads/editloadpage' },
    { text: 'Link Load', path: '/admin/loads/link-load' }
  ];

  const invoicingSubmenuItems = [
    { text: 'Create Invoice', path: '/admin/invoicing/create' },
    { text: 'Search Invoice', path: '/admin/invoicing/search' },
    { text: 'Other Invoice', path: '/admin/invoicing/other' },
    { text: 'Linked Invoice', path: '/admin/invoicing/link-invoice' } // New submenu item for Linked Invoice
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

  const employeesSubmenuItems = [
    { text: 'Add Employee', path: '/admin/employees/add' }, // Add this line
    { text: 'Edit Employee', path: '/admin/employees/edit/:id' } // Add this line
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

  const handleEmployeesClick = () => {
    setEmployeesMenuOpen(!employeesMenuOpen); // Add this line
  };

  const resetMenuState = () => {
    setLoadsMenuOpen(false);
    setInvoicingMenuOpen(false);
    setCompaniesMenuOpen(false);
    setJobsMenuOpen(false);
    setUsersMenuOpen(false);
    setEmployeesMenuOpen(false); // Add this line
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isExpanded ? drawerWidthExpanded : drawerWidthCollapsed,
          transition: 'width 0.3s',
          overflowX: 'hidden',
          top: '1px'
        }
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false);
        resetMenuState();
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLoadsClick}>
            <ListItemIcon>
              <LocalShipping />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Loads" />}
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

        <ListItem disablePadding>
          <ListItemButton onClick={handleEmployeesClick}> {/* Add this block */}
            <ListItemIcon>
              <People />
            </ListItemIcon>
            {isExpanded && <ListItemText primary="Employees" />}
            {isExpanded && (employeesMenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        <Collapse in={employeesMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {employeesSubmenuItems.map((submenuItem) => (
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
