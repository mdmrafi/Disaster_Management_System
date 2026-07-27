# Deploying

The backend deploys to [Render](https://render.com) as a Docker web service.
The frontend can go either to Render (as a static site, included in the same
Blueprint) or to [Vercel](https://vercel.com) via `vercel.json`. Pick one.

## 0. About the database

**Render does not offer a managed MySQL database** — its managed databases are
PostgreSQL only. This app is MySQL-specific (`mysql-connector-j`,
`MySQLDialect`, and `db/*.sql` use `AUTO_INCREMENT`, `ENUM`, `ENGINE=InnoDB`
and `DELIMITER` triggers), so the database has to be hosted elsewhere.

Any MySQL 8 host works. Free/low-cost options: Aiven, Railway, Clever Cloud,
PlanetScale. Create a database named `disaster_db` and keep the host, port,
user and password — you'll paste them into Render in step 3.

## 1. Prerequisites

- A GitHub account with this repo pushed (default branch `main`).
- A Render account (free tier is enough for a smoke test).
- A MySQL 8 database (see step 0).
- `mysql` client and `openssl` locally.

## 2. Load the schema

Run **all four** SQL files, in order. The migrations are not optional:
`db/migrations/002_redesign.sql` creates the `app_user` table that
`DataInitializer` reads at startup. Skip it and the backend crashes on boot
with `Table 'disaster_db.app_user' doesn't exist` — which on Render looks
like a failed deploy immediately after a successful build.

```bash
# from the repo root
./db/load-all.sh -h <MYSQL_HOST> -P <MYSQL_PORT> -u <USER> -p '<PASSWORD>' -D disaster_db
```

That script runs `schema.sql`, `triggers.sql`, `sample_data.sql`, then
everything under `db/migrations/` in lexical order, and prints `SHOW TABLES;`
at the end. Confirm `app_user` is in the list before moving on.

On Windows, `db/run-migrations.ps1` does the migrations half of the same job.

## 3. Create the Blueprint

1. Generate a JWT signing secret (base64, ≥64 bytes) and keep it handy:
   ```bash
   openssl rand -base64 64
   ```
2. In Render, click **New → Blueprint** and pick this repo.
3. Render reads `render.yaml` and proposes two resources:
   - `disaster-api` (Docker web service, rootDir `backend`)
   - `disaster-frontend` (static site, rootDir `frontend`)
4. Render prompts for every `sync: false` variable during creation. Fill in:

   | Key                          | Value                                                                                      |
   |------------------------------|--------------------------------------------------------------------------------------------|
   | `SPRING_DATASOURCE_URL`      | `jdbc:mysql://HOST:PORT/disaster_db?useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true` |
   | `SPRING_DATASOURCE_USERNAME` | your MySQL user                                                                              |
   | `SPRING_DATASOURCE_PASSWORD` | your MySQL password                                                                          |
   | `SECURITY_JWT_SECRET`        | the base64 string from step 1                                                                |
   | `APP_CORS_ALLOWED_ORIGINS`   | the exact origin the SPA is served from, e.g. `https://disaster-frontend.onrender.com`      |

5. Click **Apply**.

`APP_CORS_ALLOWED_ORIGINS` must match the browser origin exactly — scheme and
host, no trailing slash. If you host the frontend on Vercel, use the Vercel
URL here instead. Multiple origins are comma-separated.

## 4. Deploying the frontend to Vercel instead

`vercel.json` at the repo root builds `frontend/` and serves `frontend/dist`
with an SPA fallback rewrite. Import the repo in Vercel, set `VITE_API_URL`
to `https://disaster-api.onrender.com/api` as a build-time environment
variable, and deploy. Then set `APP_CORS_ALLOWED_ORIGINS` on `disaster-api`
to the Vercel URL and redeploy the backend.

If you go this route, you can delete the `disaster-frontend` service from
`render.yaml` so you aren't building the SPA twice.

## 5. Verify

```bash
# 200 {"status":"UP"} — this is what Render's health check polls
curl https://disaster-api.onrender.com/api/health

# 200 with a token
curl -X POST https://disaster-api.onrender.com/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@resilience.local","password":"admin123"}'
```

Then open the SPA and log in. Seed credentials are
`admin@resilience.local` / `admin123` — **change the password immediately on
any deployment that is reachable from the internet.**

If the health check returns 401 rather than 200, the deployed image predates
`HealthController`; redeploy from the current `main`.

## 6. Local development

Unchanged:

- Backend reads `backend/src/main/resources/application.properties` for
  defaults; env vars override them if set.
- Frontend uses Vite's proxy for `/api/*`. Leave `VITE_API_URL` unset.

## 7. Known gaps

- `spring.jpa.hibernate.ddl-auto=none`, so the schema is never created by the
  app. Step 2 is mandatory on every fresh database.
- `application.properties` is committed and carries a working local MySQL
  password and a fallback JWT secret. They are overridden in production by
  the env vars above, but the fallback secret is public — treat any token
  signed with it as forgeable, and never deploy without setting
  `SECURITY_JWT_SECRET`. Rotate the committed values.
