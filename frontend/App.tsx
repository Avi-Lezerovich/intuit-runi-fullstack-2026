import Toolbar from "@mui/material/Toolbar";
import TopBar from "./components/layout/TopBar";
import AppRoutes from "./routes/AppRoutes";

// App is now just the layout shell: the fixed AppBar, a spacer to push content
// below it, and the route tree. Routes live in routes/AppRoutes.jsx.
const App = () => (
  <div>
    <TopBar />
    <Toolbar /> {/* Spacer — pushes content below the fixed AppBar */}
    <AppRoutes />
  </div>
);

export default App;
