$here = "C:\Users\MashRaFi\disaster-management\backend"
$log = "C:\Users\MashRaFi\disaster-management\backend\run.log"
$emptyLog = New-Item -ItemType File -Path $log -Force
Start-Process -FilePath "$here\mvnw.cmd" -ArgumentList "spring-boot:run" -WorkingDirectory $here -RedirectStandardOutput $log -RedirectStandardError "$log.err" -WindowStyle Hidden
Write-Output "started"