import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Proxy for AI Requests to bypass CORS and Private Network issues
  app.post("/api/proxy-ai", async (req, res) => {
    const { url, headers, body } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: "Missing URL for proxy" });
    }

    try {
      console.log(`Proxying request to: ${url}`);
      const response = await fetch(url, {
        method: "POST",
        headers: headers || {},
        body: JSON.stringify(body)
      });

      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (e) {
        // If not JSON, return as message object
        data = { message: text };
      }

      res.status(response.status).json(data);
    } catch (error: any) {
      console.error("Proxy Network/Critical Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch from external provider" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Expose endpoint returning real tracked client IP address
  app.get("/api/ip", (req, res) => {
    let clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;
    if (Array.isArray(clientIp)) {
      clientIp = clientIp[0];
    } else if (typeof clientIp === "string") {
      clientIp = clientIp.split(",")[0].trim();
    }
    if (typeof clientIp === "string" && clientIp.startsWith("::ffff:")) {
      clientIp = clientIp.substring(7);
    }
    res.json({ ip: clientIp || "127.0.0.1" });
  });

  // Serve sample data explicitly if needed (Vite handles this in dev via public, but just in case)
  app.use("/sample-data", express.static(path.join(process.cwd(), "public/sample-data")));

  // API to get raw file content
  app.get("/api/raw-file", async (req, res) => {
    const filePath = req.query.path as string;
    if (!filePath) {
      return res.status(400).json({ error: "Path is required" });
    }

    try {
      // Security: ensure the path is within the project root
      const fullPath = path.resolve(process.cwd(), filePath.startsWith("/") ? filePath.substring(1) : filePath);
      if (!fullPath.startsWith(process.cwd())) {
        return res.status(403).json({ error: "Access denied" });
      }

      if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
        const content = fs.readFileSync(fullPath, "utf-8");
        res.setHeader("Content-Type", "text/plain");
        res.send(content);
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to read file" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
