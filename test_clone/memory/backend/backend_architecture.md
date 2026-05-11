# Backend Architecture - Bharat Book AI Import

## 1. Overview
The Bharat Book AI Import application follows a hybrid client-heavy architecture. The vast majority of business logic, state management, and AI parsing (via Google Generative AI SDK) executes directly in the browser to reduce latency and infrastructure costs.

The backend is a high-performance, lightweight **Node.js + Express** server (implemented in `server.ts`) designed specifically to facilitate the frontend build process, bypass browser security constraints, and serve static assets seamlessly.

## 2. Server Technical Stack
- **Entry point:** `server.ts`
- **Runtime:** Node.js
- **Framework:** Express.js (`express`, `path`, `fs`, `url`)
- **Port:** `3000` (Strictly enforced by infrastructure and deployment environments; binding to `0.0.0.0`)
- **Development Tooling:** Vite (embedded as dynamic middleware)

## 3. Core API Endpoints

### 3.1. AI / External Service Proxy
**Endpoint:** `POST /api/proxy-ai`
- **Purpose:** Acting as a transparent proxy. Browsers heavily restrict Cross-Origin Resource Sharing (CORS) against external AI APIs, and directly calling APIs from the frontend often runs into restrictive preflight blocks. This endpoint accepts external URLs and forwards the request server-side.
- **Payload/Request Definition:**
  ```json
  {
    "url": "https://external-api.url/path",
    "headers": { "Authorization": "Bearer ...", "Content-Type": "application/json" },
    "body": { ... }
  }
  ```
- **Error & Response Handling:** 
  - Validates if `url` exists, returning standard HTTP 400 if missing.
  - Returns `response.status` dynamically reflecting the proxy provider's status.
  - Automatically parses `text()` output to JSON. If the target returns malformed JSON, gracefully wraps it as `{ "message": text }` to prevent frontend crash errors.

### 3.2. Local File Introspection
**Endpoint:** `GET /api/raw-file?path=...`
- **Purpose:** Development/Introspection utility allowing the frontend or AI tools to query the exact string contents of files. Useful for fetching dynamic structural configurations or code analysis logic.
- **Security implementation:**
  ```typescript
  const fullPath = path.resolve(process.cwd(), filePath);
  if (!fullPath.startsWith(process.cwd())) {
    res.status(403).json({ error: "Access denied" });
  }
  ```
  This strict path resolution ensures no path transversal vulnerabilities (`../` escaping the project directory) are possible.

### 3.3. Health & Static Data
- **Health Check:** `GET /api/health` - Basic liveness probe returning `{ "status": "ok" }`.
- **Sample DB Exposer:** `app.use("/sample-data", express.static(path.join(process.cwd(), "sample-data")))` - Exposes the JSON database mock files for the "Sample Data Toggle" feature inside the application.

## 4. Production vs. Development Environment Mapping

The Express backend uses a unified `server.ts` file that seamlessly handles both environments through deep integration with the `NODE_ENV` environment variable:

- **Development (`NODE_ENV !== "production"`):**
  Dynamically spins up a Vite server in `middlewareMode`. Critically, `hmr: false` is configured because the system controls reloading externally. The Express server intercepts API calls while automatically routing all other traffic (like specific views or asset fetching) to Vite's compiler, providing real-time UI updates without needing two separate network ports.

- **Production (`NODE_ENV === "production"`):**
  Operates as a pure static file server structure.
  - Points `express.static()` to the pre-compiled `dist` directory.
  - Implements SPA (Single Page Application) fallback routing: `app.get('*', ... res.sendFile(path.join(distPath, 'index.html')))` ensuring that direct routes like `/ledger-master` do not throw 404s upon hard refresh.

## 5. Security & Stability Considerations
- **Payload Limits:** Global express middleware `express.json({ limit: '10mb' })` protects the server against memory exhaustion from oversized JSON payloads, which is extremely critical when proxying Base64 image strings heavily used in AI OCR Invoice scanning.
- **No Direct DB Access:** The server is entirely stateless. It does not possess any ORM, manage DB connections, or handle sessions, drastically reducing the security attack surface.
