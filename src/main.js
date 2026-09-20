/**
 * Main Entry Point
 * ==================
 * Creates and mounts the Vue application.
 */

import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";

// Create Vue application
const app = createApp(App);

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error("Vue Error:", err);
  console.error("Component:", vm);
  console.error("Info:", info);
};

// Performance monitoring (development only)
if (import.meta.env.DEV) {
  app.config.performance = true;
}

// Mount the app
app.mount("#app");
