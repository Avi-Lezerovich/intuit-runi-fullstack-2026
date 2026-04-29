
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const TopBar = () => {
  const menuItems = ["Home", "Users", "About", "Login"];

  return (
    <AppBar >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ marginRight: 'auto', fontWeight: "bold" }}>
          AgentHub
        </Typography>

        <Box >
          {menuItems.map((item) => 
            <Button key={item} color="inherit">
              {item}
            </Button>)}

        </Box>
       
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
