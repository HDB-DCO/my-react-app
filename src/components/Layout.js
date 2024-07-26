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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../assets/HDB_logo.png";

const drawerWidth = 240;

const Layout = () => {
  // Add more pages here
  const menuItems = [
    { text: "Home", href: "/" },
    { text: "Absence Request", href: "/absence_request" },
    { text: "Absence Request Copy", href: "/absence_request_copy" },
    { text: "Add User", href: "/add_employee" },
  ];

  const [open, setOpen] = useState(false);
  const location = useLocation();

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
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon/>
          </IconButton>
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
          <IconButton color="black">
            <AccountCircle />
          </IconButton>
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
