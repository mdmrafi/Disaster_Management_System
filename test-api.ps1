try {
    $r = Invoke-WebRequest -Uri "http://localhost:8080/api/dashboard/summary" -Method GET -UseBasicParsing -TimeoutSec 10
    Write-Output ("Status: " + $r.StatusCode)
    Write-Output ("Body: " + $r.Content)
} catch {
    Write-Output ("Error: " + $_.Exception.Message)
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        Write-Output ("Body: " + $reader.ReadToEnd())
    }
}