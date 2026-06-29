# Deploying to Render

This project is configured to deploy end-to-end on [Render](https://render.com)
with a single Blueprint. The Blueprint provisions a managed MySQL database,
a Spring Boot API service, and a React/Vite static frontend, and wires them
together via environment variables.

## 1. Prerequisites

- A GitHub account with this repo pushed (default branch `main`).
- A Render account (free tier is enough for a smoke test).
- `openssl` locally to generate a JWT secret (any base64 tool works).

## 2. One-time setup

1. Generate a JWT signing secret (base64-encoded, ≥64 bytes):
   ```bash
   openssl rand -base64 64
   ```
   Keep this — you'll paste it into Render in step 4.

2. Apply the database schema to the Render database **after** the DB
   is created (Render exposes a *External Connection String* for MySQL):
   ```bash
   # from the repo root
   Get-Content db\schema.sql, db\triggers.sql, db\sample_data.sql |
     mysql -h <RENDER_DB_HOST> -P 3306 -u <USER> -p disaster_db
   ```
   Use the **External** host/credentials from the Render dashboard for the
   `disaster-db` instance — internal hostnames only resolve from within
   Render.

## 3. Create the Blueprint

1. In Render, click **New → Blueprint**.
2. Connect your GitHub account and pick this repo.
3. Render reads `render.yaml` at the repo root and proposes three resources:
   - `disaster-db` (MySQL)
   - `disaster-api` (Docker web service, rootDir `backend`)
   - `disaster-frontend` (static site, rootDir `frontend`)
4. Click **Apply**. Render starts creating all three.

## 4. Set the secrets

After the first deploy, set these two values in the Render dashboard:

| Service              | Key                  | Value                                                            |
|----------------------|----------------------|------------------------------------------------------------------|
| `disaster-api`       | `SECURITY_JWT_SECRET`| The base64 string you generated in step 1.                       |
| `disaster-api`       | `APP_CORS_ALLOWED_ORIGINS` | `https://disaster-frontend.onrender.com` (replace with your custom domain if you have one). |

Then redeploy `disaster-api` so it picks up the new env vars.

> The Blueprint leaves `VITE_API_URL` pointing at `https://disaster-api.onrender.com/api`.
> If you rename the backend service, update both `render.yaml` and the
> Render env var and redeploy the frontend.

## 5. Verify

- API health check: `curl https://disaster-api.onrender.com/api/health`
  (or whatever endpoint your `HealthController` exposes — the Blueprint
  uses `/api/health` for the health-check path).
- SPA: open `https://disaster-frontend.onrender.com` and log in.

## 6. Local development after these changes

Nothing changes for local dev:

- Backend still reads `backend/src/main/resources/application.properties`
  for defaults; env vars override them if set.
- Frontend still uses Vite's proxy for `/api/*`. Leave `VITE_API_URL`
  unset locally.

## 7. What was added in this change

- `render.yaml` — single Blueprint with DB + API + frontend.
- `backend/Dockerfile` + `backend/.dockerignore` — multi-stage Maven build.
- `backend/src/main/resources/application.properties(.example)` —
  every value now reads from an env var with a sensible default.
- `backend/.../config/WebConfig.java` — allowed origins driven by
  `app.cors.allowed-origins` (env: `APP_CORS_ALLOWED_ORIGINS`).
- `frontend/src/api/client.js` — uses `VITE_API_URL` if set, else `/api`.
- `frontend/public/_redirects` — SPA fallback so client routes survive
  a hard refresh.
- `frontend/.env.example` — documentation of the env var.