import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
// Clear any SEO critical HTML injected at build time before React mounts
rootEl.innerHTML = '';
createRoot(rootEl).render(<App />);
