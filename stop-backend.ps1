Get-Process -Name java -ErrorAction SilentlyContinue | ForEach-Object { try { $_ | Stop-Process -Force -ErrorAction SilentlyContinue } catch {} }
Get-Process -Name mvn -ErrorAction SilentlyContinue | ForEach-Object { try { $_ | Stop-Process -Force -ErrorAction SilentlyContinue } catch {} }
Start-Sleep -Seconds 2
Get-Process -Name java -ErrorAction SilentlyContinue | Select-Object Id, ProcessName
Write-Output "done"
