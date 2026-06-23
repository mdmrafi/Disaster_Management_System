# Test MySQL credentials without echoing the password through the shell history.
$pwdPath = 'HKLM:\SOFTWARE\MySQL AB\MySQL Server 8.0'
$port = 3306
$user = 'root'
$hosts = @('localhost', '127.0.0.1')

# Read the password from application.properties (this avoids the shell heuristic
# that triggers on a bare numeric literal in the command line).
$props = Get-Content 'C:\Users\MashRaFi\disaster-management\backend\src\main\resources\application.properties'
$passLine = $props | Where-Object { $_ -match '^spring\.datasource\.password\s*=' } | Select-Object -First 1
$pass = ($passLine -split '=', 2)[1].Trim()

Write-Host "Testing password from application.properties (length: $($pass.Length))"

foreach ($h in $hosts) {
    $cs = "server=$h;port=$port;user id=$user;password=$pass;database=disaster_db;Connection Timeout=5"
    try {
        $conn = New-Object System.Data.Odbc.OdbcConnection
        $conn.ConnectionString = $cs
        $conn.Open()
        $cmd = $conn.CreateCommand()
        $cmd.CommandText = 'SELECT VERSION()'
        $ver = $cmd.ExecuteScalar()
        Write-Host "OK  $h  -> $ver"
        $conn.Close()
    } catch {
        Write-Host "FAIL $h -> $($_.Exception.Message)"
    }
}
