$ws = New-Object -ComObject WScript.Shell
$curDir = Get-Location
$shortcut = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), ([char]0x0627+[char]0x0644+[char]0x0645+[char]0x0633+[char]0x062a+[char]0x0634+[char]0x0627+[char]0x0631+[char]0x0020+[char]0x0627+[char]0x0644+[char]0x0630+[char]0x0647+[char]0x0628+[char]0x064a + '.lnk'))

$sc = $ws.CreateShortcut($shortcut)
$sc.TargetPath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
# Opening index.html DIRECTLY ( bypassing setup.html )
$sc.Arguments = "--app=file:///$curDir\index.html --window-size=1400,900"
$sc.WorkingDirectory = $curDir.ToString()
$sc.IconLocation = "$curDir\icon-192.png"
$sc.Save()

Write-Host "🚀 Fixed to open the heart of the app (index.html)!"
Invoke-Item $shortcut
