# Creates the disaster_db database using the credentials from application.properties.
# Avoids hardcoding the password in the command line.
$mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
$props = Get-Content 'C:\Users\MashRaFi\disaster-management\backend\src\main\resources\application.properties'
$passLine = $props | Where-Object { $_ -match '^spring\.datasource\.password\s*=' } | Select-Object -First 1
$pass = ($passLine -split '=', 2)[1].Trim()

& $mysql -u root -h localhost -P 3306 --password=$pass -e "CREATE DATABASE IF NOT EXISTS disaster_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; SHOW DATABASES LIKE 'disaster_db';"