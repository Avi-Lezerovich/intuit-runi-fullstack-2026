import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import Feed from "./components/Feed";

import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";

function HomePage() {
  return <Feed />;
}

function UsersPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Typography color="text.secondary">Users page is ready for your data.</Typography>
    </Box>
  );
}

function AboutPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About
      </Typography>
      <Typography color="text.secondary">AgentHub helps you browse and manage content.</Typography>
    </Box>
  );
}

function App() {
  return (
    <div>
      <TopBar />
      <Toolbar /> {/* Spacer — pushes content below the fixed AppBar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/sign-in" element={<SignIn disableCustomTheme />} />
        <Route path="/sign-up" element={<SignUp disableCustomTheme />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
