import { createRoot } from "react-dom/client";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    const update = () => { void updateSW(true); };
    (window as unknown as { __ftSwUpdate?: () => void }).__ftSwUpdate = update;
    window.dispatchEvent(new CustomEvent("ft-sw-update", { detail: { update } }));
  },
  onRegisteredSW(_url, reg) {
    if (!reg) return;
    const check = () => { try { void reg.update(); } catch (_e) { /* */ } };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") check();
    });
    window.addEventListener("focus", check);
    window.setInterval(check, 10 * 60 * 1000);
  },
});

createRoot(document.getElementById("root")!).render(<App />);
