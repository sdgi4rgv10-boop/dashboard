$baseDir = $PSScriptRoot

$fso = New-Object -ComObject Scripting.FileSystemObject
$shortDir = $fso.GetFolder($baseDir).ShortPath

$ws = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'GoldenAdvisorApp.lnk')
$s = $ws.CreateShortcut($desktopPath)

$s.TargetPath = "$shortDir\GoldenAdvisor.exe"
$s.WorkingDirectory = $shortDir
$s.IconLocation = "$shortDir\icon.ico"
$s.Save()

Write-Host "Shortcut created successfully using ShortPath: $shortDir"
