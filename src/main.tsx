import { createRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import App from "./App.tsx";
import "./index.css";

// Initialize Microsoft Clarity (only when project ID is configured)
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
if (clarityProjectId && import.meta.env.PROD) {
    Clarity.init(clarityProjectId);
}

const rootEl = document.getElementById("root")!;
// Clear any SEO critical HTML injected at build time before React mounts
rootEl.innerHTML = '';
createRoot(rootEl).render(<App />);
