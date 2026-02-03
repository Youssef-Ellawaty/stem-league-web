import express from "express";
import { registerRoutes } from "./routes.js";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// Helper for ESM directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from client folder (vanilla JS)
// Go up one level from server/ to root, then into client/
app.use(express.static(path.join(__dirname, "../client")));

const server = createServer(app);

// Register API routes
await registerRoutes(server, app);

// Serve index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

const port = 5000;
server.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
