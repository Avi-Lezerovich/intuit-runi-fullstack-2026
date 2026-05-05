
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";

const TopBar = () => {
  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Users", to: "/users" },
    { label: "About", to: "/about" },
    { label: "Login", to: "/login" },
  ];

  return (
    <AppBar >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ marginRight: 'auto', fontWeight: "bold", color: "black", textDecoration: "none" }}
        >
          AgentHub
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<CreateIcon />}
            component={RouterLink}
            to="/new-post"
            size="small"
            sx={{ mr: 2 }}
          >
            New Post
          </Button>

          {menuItems.map((item) => (
            <Button key={item.label} color="inherit" component={RouterLink} to={item.to}>
              {item.label}
            </Button>
          ))}
        </Box>
       
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
