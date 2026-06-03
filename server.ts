import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

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

  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        return res.json({ 
          reply: "I am operating in limited mode. Please configure GEMINI_API_KEY to enable full diagnostic analysis.",
          diagnosticResults: [
             { testName: "API Connection", passed: false, recommendation: "Add your Gemini API key." }
          ]
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are the Technical Analyst Chatbot for Bharat Book AI, an ERP and Voucher Management System. 
Your primary goal is to provide problem-specific answers related to this software, its functionality, tools, vouchers, accounting, ledgers, or technical analysis.
If the user asks a question completely unrelated to this system or software, politely decline and state you can only assist with Bharat Book AI.
Exception: If the user asks about your identity, developer, manufacturer, creation date, or what AI model you are, you must answer this exception strictly by stating:
- Developer: Developer Manufacturer: Kansya Digital Service
- Creation Date: 2026
- AI Model: Real Model which are currently using (Gemini 2.5 Flash)
Do not provide additional fictional details about this.

Please structure your response strictly into four clearly labeled sections, using clean markdown format (bold headers, bullet points, italics), avoiding excessive unstructured text:

**1. Human-Readable Summary**
[Explain the core problem or solution in a simple, non-technical, and easily understandable format.]

**2. Feature Analysis**
[Break down the specific modules, tools, vouchers, or features of Bharat Book AI that relate to the user's query.]

**3. Technical Specifications**
[Provide the technical details, step-by-step logic, system configurations, or data flow analysis related to the problem.]

**4. Recommended Actions**
[Provide a concise list of actionable steps or best practices for the user to resolve the issue or optimize their use of the system.]

User asks: `;
      
      let targetModel = req.body.model || 'gemini-2.5-flash';

      let response;
      try {
        response = await ai.models.generateContent({
          model: targetModel,
          contents: systemInstruction + message,
        });
      } catch (err: any) {
        if (err.message?.includes('not found') || err.message?.includes('not supported')) {
           // Fallback to a guaranteed supported model if the selected one fails
           response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: systemInstruction + message,
           });
        } else {
           throw err;
        }
      }

      const replyText = response.text || "No response generated.";
      
      return res.json({ reply: replyText });
    } catch (e: any) {
      console.error(e);
      let errorMessage = e.message || "Internal server error.";
      if (errorMessage.includes("503") || errorMessage.includes("high demand")) {
        errorMessage = "The AI service is currently experiencing high demand. Please wait a moment and try again.";
      }
      return res.json({ reply: `API Error: ${errorMessage}` });
    }
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


  // API to handle GST Upload Ingestion & Auto-refilling logic
  app.post("/api/gst/upload", (req, res) => {
    try {
      const { fileName, content, voucherType } = req.body;
      if (!content || !voucherType) {
        return res.status(400).json({ error: "Missing content or voucherType" });
      }

      // Safe clean name for Tax_Sample_Data
      const safeVoucherType = String(voucherType || "GSTR1");
      const normalizedType = safeVoucherType.toUpperCase().replace(/[^A-Z0-9]/g, "");
      let typeFolder = "GSTR1";
      if (normalizedType.includes("GSTR2A")) typeFolder = "GSTR2A";
      else if (normalizedType.includes("GSTR2B")) typeFolder = "GSTR2B";
      else if (normalizedType.includes("GSTR3B")) typeFolder = "GSTR3B";
      else if (normalizedType.includes("GSTR4")) typeFolder = "GSTR4";
      else if (normalizedType.includes("GSTR9")) typeFolder = "GSTR9";
      else if (normalizedType.includes("CMP08")) typeFolder = "CMP08";
      else if (normalizedType.includes("GSTR1")) typeFolder = "GSTR1";

      const basePaths = [
        path.join(process.cwd(), "public", "Tax_Sample_Data", typeFolder)
      ];

      // Ensure paths exist
      basePaths.forEach(p => {
        if (!fs.existsSync(p)) {
          fs.mkdirSync(p, { recursive: true });
        }
      });

      const lines = content.split("\n").map((l: string) => l.trim()).filter(Boolean);
      const hasDataRows = lines.length > 1;

      const safeName = String(voucherType || "GSTR-1").replace(/\s+/g, "_");

      if (!hasDataRows) {
        // Save blank template
        basePaths.forEach(p => {
          fs.writeFileSync(path.join(p, "blank.csv"), content, "utf-8");
          fs.writeFileSync(path.join(p, `${typeFolder}_blank.csv`), content, "utf-8");
        });
        
        // Compute simulated refilled content
        let filledContent = content;
        if (typeFolder === "GSTR1") {
          filledContent += "\n27AAAAA1111A1Z1,Acme General Traders Pvt Ltd,INV-2026-10492,2026-05-01,118000.00,27-Maharashtra,18%,100000.00,0.00,9000.00,9000.00";
          filledContent += "\n27BBBBB2222B2Z2,Hind Co-ops Agencies,INV-2026-11840,2026-05-03,52500.00,27-Maharashtra,5%,50000.00,0.00,1250.00,1250.00";
        } else if (typeFolder.includes("GSTR2")) {
          filledContent += "\n27AAAAA1111A1Z1,Acme General Traders Pvt Ltd,Regular,INV-2026-10492,2026-05-01,118000.00,27-Maharashtra,18%,100000.00,0.00,9000.00,9000.00,Available";
          filledContent += "\n27BBBBB2222B2Z2,Hind Co-ops Agencies,Regular,INV-2026-11840,2026-05-03,52500.00,27-Maharashtra,5%,50000.00,0.00,1250.00,1250.00,Available";
        } else if (typeFolder === "GSTR4" || typeFolder === "GSTR9") {
          filledContent += "\n27BBBBB2222B2Z2,Krishna Grocers & Retailers,2025-26,750000.00,1%,750000.00,0.00,3750.00,3750.00,0.00";
          filledContent += "\n33DDDDD4444D4Z4,Vasan Grocery Store,2025-26,450000.00,1%,450000.00,0.00,2250.00,2250.00,0.00";
        } else if (typeFolder === "CMP08") {
          filledContent += "\n27BBBBB2222B2Z2,Q1-2026,180000.00,1.0%,0.00,900.00,900.00,0.00";
          filledContent += "\n33DDDDD4444D4Z4,Q1-2026,120000.00,1.0%,0.00,600.00,600.00,0.00";
        } else {
          filledContent += "\n27AAAAA1111A1Z1,Acme India Ltd,INV-101,2026-05-20,500000.00,27-Maharashtra,18%,423728.81,38135.59,38135.59,0.00";
        }

        basePaths.forEach(p => {
          fs.writeFileSync(path.join(p, "filled.csv"), filledContent, "utf-8");
          fs.writeFileSync(path.join(p, `${typeFolder}_filled.csv`), filledContent, "utf-8");
        });

        return res.json({
          status: "success",
          type: "empty_refilled",
          message: `Blank template uploaded. Re-routed & stored filled details inside Tax Sample Data subfolder structure: /Tax_Sample_Data/${typeFolder}/`,
          blankPath: `/Tax_Sample_Data/${typeFolder}/${typeFolder}_blank.csv`,
          filledPath: `/Tax_Sample_Data/${typeFolder}/${typeFolder}_filled.csv`,
          refilledData: filledContent
        });
      } else {
        // Content has rows (filled CSV uploaded)
        basePaths.forEach(p => {
          fs.writeFileSync(path.join(p, "filled.csv"), content, "utf-8");
          fs.writeFileSync(path.join(p, `${typeFolder}_filled.csv`), content, "utf-8");
        });

        return res.json({
          status: "success",
          type: "actual_data",
          message: `Active compliance rows saved inside: /Tax_Sample_Data/${typeFolder}/${typeFolder}_filled.csv`,
          blankPath: `/Tax_Sample_Data/${typeFolder}/${typeFolder}_blank.csv`,
          filledPath: `/Tax_Sample_Data/${typeFolder}/${typeFolder}_filled.csv`
        });
      }
    } catch (e: any) {
      console.error("Error in GST Upload Ingestion Helper:", e);
      res.status(500).json({ error: e.message || "Failed to process GST sample storage" });
    }
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
