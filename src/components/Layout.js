import AccountCircle from "@mui/icons-material/AccountCircle";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/HDB_logo.png";
import "../css/Layout.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUserRoles, selectIsAuthenticated } from "../redux/selectors";
import { logout } from '../redux/authSlice';

const drawerWidth = 240;

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  // Add more pages here
  let menuItems = [];
  const handleLogout = () => {
    //console.log("Button clicked!");
    dispatch(logout());
    navigate('/');
    // Add your logout logic here
  };

  const [open, setOpen] = useState(false);
  const location = useLocation();
  const userRoles = useSelector(selectUserRoles);
  //console.log("userRoles :: ",userRoles);
  if(userRoles.includes("ADMIN")){
      menuItems = [
        { text: "Home", href: "/" },
        { text: "Add User", href: "/add_user" },
        { text: "CP Leave Record", href: "/application_status" },
        { text: (
          <Button className="logout-button" onClick={handleLogout}>
            Logout
          </Button>
        ),
      },
       ];
  }else if(userRoles.includes("CP")){
      menuItems = [
      { text: "Home", href: "/cp_home" },
      { text: "Profile", href: "/" },
      { text: "Absence Request", href: "/absence_request" },
      { text: "Additional Work Request", href: "/" },
      { text: "Application Statuss", href: "/application_status" },
      { text: "View Timesheet", href: "/" },
      { text: (
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      ),
    },
     ];
    
  }else if(userRoles.includes("PL")){
      menuItems = [
      { text: "Home", href: "/" },
      { text: "Approval Page", href: "/approval_request" },
      { text: (
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      ),
    },
     ];
    
  }else if(userRoles.includes("VENDOR")){
      menuItems = [
      { text: "Home", href: "/" },
      { text: "Approval Page", href: "/approval_request" },
      { text: (
        <Button className="logout-button" onClick={handleLogout}>
          Logout
        </Button>
      ),
    },
     ];
    
  }else{
      menuItems = [
    ];
  }

  const shouldShowBreadcrumbs = menuItems.length !== 0;

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const drawer = (
    <Box
      sx={{ width: drawerWidth }} // Adjust the padding top to align with AppBar. was: paddingTop: '64px'
      role="presentation"
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      <List>
        <ListItem>
          <ListItemIcon>
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </ListItemIcon>
        </ListItem>
        {menuItems.map((item) => (
          <ListItem button component="a" href={item.href} key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.href === location.pathname);
    return currentItem ? currentItem.text : 'HR Management System';
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer - 1,
          backgroundColor: "white",
          boxShadow: "none",
        }}
      >
        <Toolbar>
        {shouldShowBreadcrumbs && (
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>)}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            href="/"
            edge="start"
            sx={{ mr: 2 }}
          >
            <img src={logo} alt="Logo" style={{ height: "40px" }} />
          </IconButton>
          <Typography variant="h6" noWrap color="black" fontWeight="medium">
            {getPageTitle()}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <IconButton color="black">
            <AccountCircle />
          </IconButton> */}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            position: "fixed",
            zIndex: (theme) => theme.zIndex.appBar + 1, // Ensure drawer overlays the AppBar
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
