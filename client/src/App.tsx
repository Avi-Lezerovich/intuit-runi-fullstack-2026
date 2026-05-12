/**
 * Top-level app shell + route table.
 * Renders the TopBar on every page and a single Footer at the bottom.
 *
 * ScrollToTop is mounted as a *sibling* of Routes (not a wrapper) on purpose:
 * it only needs the useLocation effect — it renders nothing — so wrapping the
 * routes would only add a no-op layer.
 *
 * ProtectedRoute guards /new-post; unauthenticated visitors hitting it are
 * redirected to /login. The wildcard route at the bottom redirects unknown
 * URLs to "/" so the address bar matches what the user is actually seeing.
 */
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import TopBar from "./components/layout/top-bar/TopBar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import ScrollToTop from "./components/routing/ScrollToTop";

import Home from "./pages/Home";
import Users from "./pages/Users";
import ProfilePage from "./pages/ProfilePage";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NewPost from "./pages/NewPost";

const App = () => {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ScrollToTop />
      <TopBar />
      <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user-posts/:userId" element={<ProfilePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/new-post"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />
          {/* 404 fallback — redirect so the URL bar matches what they're seeing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
};
export default App;
