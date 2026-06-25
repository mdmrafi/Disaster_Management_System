$log = 'C:\Users\MashRaFi\disaster-management\backend\run.log'
for ($i = 0; $i -lt 30; $i++) {
    $line = Select-String -Path $log -Pattern 'Started DisasterManagementApplication|APPLICATION FAILED|ERROR' -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($line) {
        Write-Host $line.Line
        if ($line.Line -match 'Started|FAILED|ERROR') { break }
    } else {
        Write-Host ("waiting... " + $i)
    }
    Start-Sleep -Seconds 2
}
