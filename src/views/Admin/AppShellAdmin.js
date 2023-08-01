import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import StarIcon from "@material-ui/icons/Star";
import EditIcon from "@material-ui/icons/Edit";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@mui/material/Divider";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

export default function ButtonAppBar() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/home");
  };
  const goAnnouncement = () => {
    navigate("/Announcement-page");
  };
  const goTeacherManagement = () => {
    navigate("/TeacherManagement-page");
  };
  const goStudentManagement = () => {
    navigate("/StudentManagement");
  };
  const goClassManagement = () => {
    navigate("/ClassManagement-page");
  };
  const goSubjectManagement = () => {
    navigate("/SubjectManagement-page");
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Creative Learners' Academy
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        <MenuItem
          onClick={goHome}
          sx={{ textAlign: "center", padding: "20px 10px" }}
        >
          <HomeIcon />
          Home
        </MenuItem>
        <MenuItem
          onClick={goAnnouncement}
          sx={{ textAlign: "center", padding: "10px 10px" }}
        >
          <StarIcon />
          Announcement
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={goTeacherManagement}
          sx={{ textAlign: "center", padding: "10px 10px" }}
        >
          <EditIcon />
          Teacher Management
        </MenuItem>
        <MenuItem
          onClick={goStudentManagement}
          sx={{ textAlign: "center", padding: "10px 10px" }}
        >
          <EditIcon />
          Student Management
        </MenuItem>
        <MenuItem
          onClick={goClassManagement}
          sx={{ textAlign: "center", padding: "10px 10px" }}
        >
          <EditIcon />
          Class Management
        </MenuItem>
        <MenuItem
          onClick={goSubjectManagement}
          sx={{ textAlign: "center", padding: "10px 10px" }}
        >
          <EditIcon />
          Subject Management
        </MenuItem>
      </Drawer>
    </Box>
  );
}
