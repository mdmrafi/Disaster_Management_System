Get-Process -Name java -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Output ("Killing PID " + $_.Id + " (" + $_.StartTime + ")")
    try { $_.Kill() } catch { Write-Output ("  failed: " + $_.Exception.Message) }
}
Start-Sleep -Seconds 2
Get-Process -Name java -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table -AutoSize
Write-Output "done"