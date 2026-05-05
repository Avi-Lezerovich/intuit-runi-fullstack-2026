import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Navigate, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import Feed from "./components/Feed";
import UsersPage from "./pages/Users.tsx";

import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";

function HomePage() {
  return <Feed />;
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

const App = () => {
  return (
    <div>
      <TopBar />
      <Toolbar /> {/* Spacer — pushes content below the fixed AppBar */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<SignIn disableCustomTheme />} />
        <Route path="/signup" element={<SignUp disableCustomTheme />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
