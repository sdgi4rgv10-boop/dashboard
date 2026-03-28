# Auto-detect current directory without hardcoding path (solves encoding issues)
$baseDir = $PSScriptRoot
Set-Location -Path $baseDir

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("$baseDir\icon-192.png")
$stream = New-Object System.IO.FileStream("$baseDir\icon.ico", [System.IO.FileMode]::Create)
$bitmap = New-Object System.Drawing.Bitmap($img)
$iconHandle = $bitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$bitmap.Dispose()
$img.Dispose()
Write-Host "Icon converted successfully"

$cscPath = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (!(Test-Path $cscPath)) { $cscPath = "C:\Windows\Microsoft.NET\Framework\v4.0.30319\csc.exe" }

$appCsPath = "$baseDir\app.cs"
$exePath = "$baseDir\GoldenAdvisor.exe"
$iconPath = "$baseDir\icon.ico"

# Build the literal compile command array
$compileArgs = @(
    "/nologo",
    "/target:winexe",
    "/out:$exePath",
    "/reference:System.Windows.Forms.dll",
    $appCsPath
)

& $cscPath $compileArgs
Write-Host "Executable compiled successfully"

$ws = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'GoldenAdvisor.lnk')
$s = $ws.CreateShortcut($desktopPath)
$s.TargetPath = $exePath
$s.WorkingDirectory = $baseDir
$s.IconLocation = "$baseDir\icon.ico"
$s.Save()

Write-Host "Native App Shortcut created on Desktop"
Invoke-Item $desktopPath
