$log = "C:\Users\MashRaFi\disaster-management\backend\run.log"
if (Test-Path $log) {
    $lines = Get-Content $log
    Write-Host "Total lines: $($lines.Count)"
    $errs = $lines | Select-String -Pattern "ERROR|BUILD FAILURE|Compilation failure|cannot find symbol|Caused by"
    Write-Host "Error lines:"
    $errs | Select-Object -First 40 | ForEach-Object { Write-Host $_.Line }
} else {
    Write-Host "Log file does not exist yet"
}