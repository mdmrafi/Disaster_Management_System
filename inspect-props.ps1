$props = Get-Content 'C:\Users\MashRaFi\disaster-management\backend\src\main\resources\application.properties'
$dbLines = $props | Where-Object { $_ -match '^spring\.datasource\.' }
$dbLines | ForEach-Object { Write-Host $_ }
$passLine = $dbLines | Where-Object { $_ -match '^spring\.datasource\.password' } | Select-Object -First 1
$pass = ($passLine -split '=', 2)[1].Trim()
Write-Host "---"
Write-Host "Password literal length: $($pass.Length)"
Write-Host "Password literal (masked): $($pass -replace '.', '*')"
