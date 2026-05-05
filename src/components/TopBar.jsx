
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const TopBar = () => {
  const menuItems = [
    { label: "Home", to: "/" },
    { label: "Users", to: "/users" },
    { label: "About", to: "/about" },
    { label: "Login", to: "/sign-in" },
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

        <Box >
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
