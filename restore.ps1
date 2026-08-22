<#
.SYNOPSIS
  PowerShell wrapper for Restore_Deleted_Google_Drive_Pro
  Installs deps and runs the restore script.

.PARAMETER DryRun
  List what would be restored without actually restoring.

.PARAMETER Filter
  Only restore files whose name contains this substring.

.EXAMPLE
  .\restore.ps1
  .\restore.ps1 -DryRun
  .\restore.ps1 -Filter csv
#>
param(
    [switch]$DryRun,
    [string]$Filter = ""
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# check python
try { python --version | Out-Null } catch {
    Write-Error "Python not found in PATH. Install from https://python.org"
    exit 1
}

# install deps if needed
if (-not (Test-Path "./.deps_installed")) {
    Write-Host "Installing pip dependencies..." -ForegroundColor Cyan
    pip install -r requirements.txt
    if ($LASTEXITCODE -eq 0) { "" | Out-File ".deps_installed" }
}

# check credentials.json
if (-not (Test-Path "./credentials.json")) {
    Write-Host @"
Missing credentials.json

Get one at: https://console.cloud.google.com/apis/credentials
  Create Credentials -> OAuth client ID -> Desktop app
  Download JSON -> save as credentials.json in this folder

"@ -ForegroundColor Yellow
    exit 1
}

$pyArgs = @("restore_drive_trash.py")
if ($DryRun) { $pyArgs += "--dry-run" }
if ($Filter) { $pyArgs += "--filter", $Filter }

python @pyArgs
