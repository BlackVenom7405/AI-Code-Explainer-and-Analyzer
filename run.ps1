$PSScriptRoot = Split-Path -Parent -Path $MyInvocation.MyCommand.Definition
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "          CodeLens AI - Single File Launcher               " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Python is not installed or not in your system PATH." -ForegroundColor Red
    Write-Host "Please install Python 3.9+ from https://www.python.org/" -ForegroundColor Yellow
    exit 1
}

python "$PSScriptRoot\run.py"
