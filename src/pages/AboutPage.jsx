import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const AboutPage = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>
      About
    </Typography>
    <Typography color="text.secondary">
      AgentHub helps you browse and manage content.
    </Typography>
  </Box>
);

export default AboutPage;
