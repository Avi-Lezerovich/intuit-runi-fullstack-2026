/**
 * Application entry point. Builds the provider stack and mounts <App />.
 *
 * Provider ordering matters:
 *   CacheProvider (RTL Emotion cache)
 *     └ ThemeProvider (MUI theme)
 *         └ CssBaseline (must be inside ThemeProvider to read tokens)
 *             └ BrowserRouter (must wrap NotificationsProvider — Notifications doesn't
 *                              use routing, but App and TopBar inside it do)
 *                 └ NotificationsProvider (toast/snackbar context for the whole tree)
 *                     └ App
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import App from "./App";
import { theme } from "./theme";
import { NotificationsProvider } from "./components/feedback/Notifications";

// Emotion cache configured for RTL — required by MUI to flip styles (margins,
// borders, etc.) correctly for Hebrew. Without this, "marginInlineStart" and
// friends would resolve to the wrong physical side.
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HashRouter>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </HashRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
);
