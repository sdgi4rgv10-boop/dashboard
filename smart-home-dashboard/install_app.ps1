$ws = New-Object -ComObject WScript.Shell
$curDir = Get-Location

# 1. Desktop
$scDesktop = $ws.CreateShortcut([System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Golden-Advisor.lnk'))
$scDesktop.TargetPath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$scDesktop.Arguments = "--app=file:///$curDir\index.html --window-size=1400,900"
$scDesktop.WorkingDirectory = $curDir.ToString()
$scDesktop.IconLocation = "$curDir\icon-192.png"
$scDesktop.Save()

# 2. Start Menu
$startMenuPath = [System.IO.Path]::Combine([Environment]::GetFolderPath('StartMenu'), 'Programs', 'Golden-Advisor.lnk')
$scStart = $ws.CreateShortcut($startMenuPath)
$scStart.TargetPath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$scStart.Arguments = "--app=file:///$curDir\index.html --window-size=1400,900"
$scStart.WorkingDirectory = $curDir.ToString()
$scStart.IconLocation = "$curDir\icon-192.png"
$scStart.Save()

Write-Host "✅ FULL INSTALLATION DONE!"
