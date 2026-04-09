import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;
rootEl.innerHTML = '';  // Clear SEO critical HTML injected at build time
createRoot(rootEl).render(<App />);

