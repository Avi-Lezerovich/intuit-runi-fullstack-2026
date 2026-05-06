
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink, NavLink } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";

const MENU_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Users", to: "/users" },
  { label: "About", to: "/about" },
  { label: "Login", to: "/login" },
];

const TopBar = () => {

  return (
    <AppBar >
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ marginRight: 'auto', fontWeight: "bold", color: "text.primary", textDecoration: "none" }}
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

          {MENU_ITEMS.map((item) => (
            <Button 
              key={item.label} 
              color="inherit" 
              component={NavLink} 
              to={item.to}
              end
              sx={{ "&.active": { fontWeight: 700, textDecoration: "underline" } }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
       
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
