import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
import UsersPage from "../pages/UsersPage";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import NewPost from "../pages/NewPost";

// All route declarations live here so App.jsx stays focused on layout.
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/users" element={<UsersPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/new-post" element={<NewPost />} />
    <Route path="/login" element={<SignInPage disableCustomTheme />} />
    <Route path="/signup" element={<SignUpPage disableCustomTheme />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
