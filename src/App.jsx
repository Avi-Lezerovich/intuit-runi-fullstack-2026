import Toolbar from "@mui/material/Toolbar";
import TopBar from "./components/TopBar";
import Feed from "./components/Feed";

function App() {
  return (
    <div>
      <TopBar />
      <Toolbar /> {/* Spacer — pushes content below the fixed AppBar */}
      <Feed />
    </div>
  );
}

export default App;
