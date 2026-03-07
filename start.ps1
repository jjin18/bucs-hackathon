# Start portfolio dev server and open browser
# Double-click this file or run: .\start.ps1

# CRITICAL: Run from this script's folder so npm finds the right package.json
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

$port = 3006
$url = "http://127.0.0.1:$port"

Write-Host "Portfolio folder: $scriptDir" -ForegroundColor Gray
Write-Host "Starting dev server at $url" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

# Open browser after server has time to bind
Start-Job -ScriptBlock {
  Start-Sleep -Seconds 5
  Start-Process $using:url
} | Out-Null

npm run dev
