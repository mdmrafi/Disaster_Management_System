# Loads schema.sql, triggers.sql, and sample_data.sql into disaster_db.
$mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
$props = Get-Content 'C:\Users\MashRaFi\disaster-management\backend\src\main\resources\application.properties'
$passLine = $props | Where-Object { $_ -match '^spring\.datasource\.password\s*=' } | Select-Object -First 1
$pass = ($passLine -split '=', 2)[1].Trim()

$root = 'C:\Users\MashRaFi\disaster-management'
$files = @(
    (Join-Path $root 'db\schema.sql'),
    (Join-Path $root 'db\triggers.sql'),
    (Join-Path $root 'db\sample_data.sql')
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { Write-Host "MISSING: $f"; continue }
    Write-Host "Loading $f ..."
    Get-Content $f -Raw | & $mysql -u root -h localhost -P 3306 --password=$pass disaster_db
    if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: $f"; break }
}

Write-Host "Done."
& $mysql -u root -h localhost -P 3306 --password=$pass disaster_db -e "SHOW TABLES;"