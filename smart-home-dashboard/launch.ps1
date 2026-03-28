$shortcut = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), ([char]0x0627+[char]0x0644+[char]0x0645+[char]0x0633+[char]0x062a+[char]0x0634+[char]0x0627+[char]0x0631+[char]0x0020+[char]0x0627+[char]0x0644+[char]0x0630+[char]0x0647+[char]0x0628+[char]0x064a + '.lnk'))
if (Test-Path $shortcut) {
    Invoke-Item $shortcut
    Write-Host "🚀 Running the application from the shortcut!"
} else {
    $eng = [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), 'Golden-Advisor.lnk')
    if (Test-Path $eng) {
        Invoke-Item $eng
        Write-Host "🚀 Running from Golden-Advisor.lnk"
    } else {
        Write-Error "Shortcut not found"
    }
}
