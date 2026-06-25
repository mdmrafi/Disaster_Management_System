$base = "http://localhost:8080/api"
$hdr  = @{ "Content-Type" = "application/json" }

Write-Host "==== LOGIN ===="
try {
    $loginBody = @{ email = "admin@resilience.local"; password = "admin123" } | ConvertTo-Json
    $loginResp = Invoke-WebRequest -Uri "$base/auth/login" -Method POST -Headers $hdr -Body $loginBody -UseBasicParsing -TimeoutSec 15
    $token = ($loginResp.Content | ConvertFrom-Json).token
    if ($token) {
        $hdr["Authorization"] = "Bearer $token"
        Write-Host ("login OK, token len={0}" -f $token.Length)
    } else {
        Write-Host "login response missing token, continuing unauthenticated"
    }
} catch {
    Write-Host ("login FAILED: {0}" -f $_.Exception.Message)
}

function Test-Endpoint {
    param($Name, $Method, $Path, $Body = $null)
    $uri = "$base$Path"
    try {
        if ($Body) {
            $json = $Body | ConvertTo-Json -Depth 5
            $r = Invoke-WebRequest -Uri $uri -Method $Method -Headers $hdr -Body $json -UseBasicParsing -TimeoutSec 15
        } else {
            $r = Invoke-WebRequest -Uri $uri -Method $Method -Headers $hdr -UseBasicParsing -TimeoutSec 15
        }
        Write-Host ("[{0}] {1} {2} -> {3}" -f $Name, $Method, $Path, $r.StatusCode)
        if ($r.Content) { Write-Host ("    body: " + ($r.Content.Substring(0, [Math]::Min(180, $r.Content.Length)))) }
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        $body = ""
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $body = $reader.ReadToEnd()
        }
        Write-Host ("[{0}] {1} {2} -> {3} {4}" -f $Name, $Method, $Path, $code, $body)
    }
}

Write-Host "==== READ endpoints ===="
Test-Endpoint "GET dashboard"   GET  "/dashboard/summary"
Test-Endpoint "GET disasters"   GET  "/disasters"
Test-Endpoint "GET areas"       GET  "/areas"
Test-Endpoint "GET camps"       GET  "/camps"
Test-Endpoint "GET resources"   GET  "/resources"
Test-Endpoint "GET donations"   GET  "/donations"
Test-Endpoint "GET allocations" GET  "/allocations"
Test-Endpoint "GET volunteers"  GET  "/volunteers"
Test-Endpoint "GET victims"     GET  "/victims"

Write-Host ""
Write-Host "==== CREATE disaster ===="
Test-Endpoint "POST disasters" POST "/disasters" @{
    disasterName  = "Smoke-test flood"
    disasterType  = "FLOOD"
    severityLevel = "HIGH"
    startDate     = "2026-06-01"
    description   = "Smoke test"
}

Write-Host ""
Write-Host "==== CREATE affected area ===="
Test-Endpoint "POST areas" POST "/areas" @{
    areaName   = "Smoke area"
    district   = "Smoke district"
    population = 1000
    disasterId = 1
}

Write-Host ""
Write-Host "==== CREATE camp ===="
Test-Endpoint "POST camps" POST "/camps" @{
    campName = "Smoke camp"
    location = "Smoke location"
    capacity = 100
    areaId   = 1
}

Write-Host ""
Write-Host "==== CREATE resource ===="
Test-Endpoint "POST resources" POST "/resources" @{
    resourceName    = "Smoke water"
    category        = "FOOD"
    initialQuantity = 50
}

Write-Host ""
Write-Host "==== CREATE donation ===="
Test-Endpoint "POST donations" POST "/donations" @{
    donorName    = "Smoke donor"
    donationDate = "2026-06-25"
    disasterId   = 1
    resourceId   = 1
    quantity     = 10
}

Write-Host ""
Write-Host "==== CREATE allocation ===="
Test-Endpoint "POST allocations" POST "/allocations" @{
    campId         = 1
    resourceId     = 1
    quantity       = 5
    allocationDate = "2026-06-25"
}

Write-Host ""
Write-Host "==== CREATE volunteer ===="
Test-Endpoint "POST volunteers" POST "/volunteers" @{
    name           = "Smoke Vol"
    phone          = "+1-555-0000"
    specialization = "RESCUE"
}

Write-Host ""
Write-Host "==== CREATE victim ===="
Test-Endpoint "POST victims" POST "/victims" @{
    name          = "Smoke Victim"
    age           = 35
    gender        = "FEMALE"
    familyMembers = 2
    priorityLevel = "HIGH"
    campId        = 1
}

Write-Host ""
Write-Host "==== UPDATE disaster 1 ===="
Test-Endpoint "PUT disasters/1" PUT "/disasters/1" @{
    disasterName  = "Updated flood"
    disasterType  = "FLOOD"
    severityLevel = "CRITICAL"
    startDate     = "2026-06-01"
    description   = "Updated"
}

Write-Host ""
Write-Host "==== UPDATE camp 1 ===="
Test-Endpoint "PUT camps/1" PUT "/camps/1" @{
    campName = "Updated camp"
    location = "Updated location"
    capacity = 200
    areaId   = 1
}

Write-Host ""
Write-Host "==== UPDATE resource 1 ===="
Test-Endpoint "PUT resources/1" PUT "/resources/1" @{
    resourceName = "Updated resource"
    category     = "MEDICAL"
}

Write-Host ""
Write-Host "==== UPDATE volunteer 1 ===="
Test-Endpoint "PUT volunteers/1" PUT "/volunteers/1" @{
    name           = "Updated Vol"
    phone          = "+1-555-0001"
    specialization = "MEDICAL"
}

Write-Host ""
Write-Host "==== UPDATE victim 1 ===="
Test-Endpoint "PUT victims/1" PUT "/victims/1" @{
    name          = "Updated Victim"
    age           = 40
    gender        = "MALE"
    priorityLevel = "MEDIUM"
    campId        = 1
}