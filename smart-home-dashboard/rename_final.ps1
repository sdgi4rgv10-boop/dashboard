$desktop = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Golden-Advisor.lnk')
$start = [System.IO.Path]::Combine([Environment]::GetFolderPath('StartMenu'), 'Programs', 'Golden-Advisor.lnk')
$newName = [char]0x0627+[char]0x0644+[char]0x0645+[char]0x0633+[char]0x062a+[char]0x0634+[char]0x0627+[char]0x0631+[char]0x0020+[char]0x0627+[char]0x0644+[char]0x0630+[char]0x0647+[char]0x0628+[char]0x064a + ".lnk"

if (Test-Path $desktop) { Rename-Item -Path $desktop -NewName $newName }
if (Test-Path $start) { Rename-Item -Path $start -NewName $newName }
Write-Host "✅ Done!"
