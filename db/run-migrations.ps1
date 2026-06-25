# Run every .sql file under db\migrations in lexical order, using the
# non-interactive credentials stored in %USERPROFILE%\my.cnf.
# Usage: .\db\run-migrations.ps1            # apply all migrations
#        .\db\run-migrations.ps1 -Database disaster_db

param(
    [string]$Database = 'disaster_db',
    [string]$MysqlExe = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe',
    [string]$CnfPath  = "$env:USERPROFILE\my.cnf"
)

if (-not (Test-Path $CnfPath)) {
    throw "Missing $CnfPath. Create it with [client] user=root password=..."
}
if (-not (Test-Path $MysqlExe)) {
    throw "MySQL client not found at $MysqlExe. Update -MysqlExe."
}

# Ensure a schema_migrations tracking table exists in the target database.
$bootstrap = @"
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename    VARCHAR(255) NOT NULL PRIMARY KEY,
  applied_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
"@
$bootstrap | & $MysqlExe "--defaults-extra-file=$CnfPath" $Database
if ($LASTEXITCODE -ne 0) { throw "Failed to bootstrap schema_migrations ($LASTEXITCODE)" }

Get-ChildItem -Path (Join-Path $PSScriptRoot 'migrations') -Filter '*.sql' |
    Sort-Object Name |
    ForEach-Object {
        $name = $_.Name
        # Skip if already recorded as applied.
        $already = (& $MysqlExe "--defaults-extra-file=$CnfPath" -N -B $Database `
            -e "SELECT COUNT(*) FROM schema_migrations WHERE filename='$name';").Trim()
        if ([int]$already -gt 0) {
            Write-Host "==> Skipping $name (already applied)" -ForegroundColor DarkGray
            return
        }

        Write-Host "==> Applying $name" -ForegroundColor Cyan
        Get-Content $_.FullName | & $MysqlExe "--defaults-extra-file=$CnfPath" $Database
        if ($LASTEXITCODE -ne 0) { throw "Migration $name failed ($LASTEXITCODE)" }

        # Record success.
        $escName = $name.Replace("'", "''")
        "INSERT INTO schema_migrations (filename) VALUES ('$escName');" |
            & $MysqlExe "--defaults-extra-file=$CnfPath" $Database
        if ($LASTEXITCODE -ne 0) { throw "Failed to record $name ($LASTEXITCODE)" }
    }

Write-Host "All migrations applied." -ForegroundColor Green
