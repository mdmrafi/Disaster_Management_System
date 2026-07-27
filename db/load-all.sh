#!/usr/bin/env bash
# =====================================================================
# Load the full schema into a MySQL database, in the order the app needs.
#
# The migrations under db/migrations are NOT optional: 002_redesign.sql
# creates the `app_user` table that DataInitializer reads on startup.
# Skipping it makes the backend crash on boot with
#   "Table 'disaster_db.app_user' doesn't exist"
# which, on Render, shows up as a failed deploy right after a green build.
#
# Usage:
#   ./db/load-all.sh -h HOST -P PORT -u USER -p PASSWORD [-D DATABASE]
#
# Example (external MySQL used by the Render deploy):
#   ./db/load-all.sh -h mysql-abc.aivencloud.com -P 24029 \
#                    -u avnadmin -p "$MYSQL_PASSWORD" -D disaster_db
# =====================================================================
set -euo pipefail

HOST=localhost
PORT=3306
USER=root
PASSWORD=
DATABASE=disaster_db

while getopts "h:P:u:p:D:" opt; do
  case "$opt" in
    h) HOST=$OPTARG ;;
    P) PORT=$OPTARG ;;
    u) USER=$OPTARG ;;
    p) PASSWORD=$OPTARG ;;
    D) DATABASE=$OPTARG ;;
    *) echo "usage: $0 -h HOST -P PORT -u USER -p PASSWORD [-D DATABASE]" >&2; exit 2 ;;
  esac
done

DB_DIR=$(cd "$(dirname "$0")" && pwd)

run_sql() {
  MYSQL_PWD=$PASSWORD mysql --host="$HOST" --port="$PORT" --user="$USER" \
    --protocol=TCP "$DATABASE"
}

for f in schema.sql triggers.sql sample_data.sql; do
  echo "==> $f"
  run_sql < "$DB_DIR/$f"
done

# Migrations, lexically ordered. Each is written to be re-runnable enough
# for a first load; re-applying on an existing database may error on the
# ALTER TABLE statements, which is expected.
for f in "$DB_DIR"/migrations/*.sql; do
  [ -e "$f" ] || continue
  echo "==> migrations/$(basename "$f")"
  run_sql < "$f"
done

echo "Done. Tables:"
echo "SHOW TABLES;" | run_sql
