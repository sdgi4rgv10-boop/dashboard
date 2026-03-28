$ws = New-Object -ComObject WScript.Shell
$curDir = Get-Location
# Create English-named shortcut to avoid encoding failures entirely
$shortcut = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'GoldPOS.lnk')

$sc = $ws.CreateShortcut($shortcut)
$sc.TargetPath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$sc.Arguments = "--app=file:///$curDir\index.html --window-size=1400,900"
$sc.WorkingDirectory = $curDir.ToString()
$sc.IconLocation = "$curDir\icon-192.png"
$sc.Save()

Write-Host "✅ GoldPOS app icon created successfully on desktop!"
Invoke-Item $shortcut
