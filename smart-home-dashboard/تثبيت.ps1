$shortcutName = "المستشار الذهبي.lnk"
$targetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$arguments = "--app=file:///d:/ذهب وفضه/smart-home-dashboard/index.html --window-size=1400,900"
$workingDir = "d:\ذهب وفضه\smart-home-dashboard"

# Locations
$paths = @(
    [System.IO.Path]::Combine([Environment]::GetFolderPath('Desktop'), $shortcutName),
    "d:\ذهب وفضه\$shortcutName",
    "d:\ذهب وفضه\smart-home-dashboard\$shortcutName"
)

$ws = New-Object -ComObject WScript.Shell

foreach ($p in $paths) {
    try {
        $s = $ws.CreateShortcut($p)
        $s.TargetPath = $targetPath
        $s.Arguments = $arguments
        $s.WorkingDirectory = $workingDir
        $s.Save()
        Write-Host "✅ تم بنجاح إنشاء: $p"
    } catch {
        Write-Warning "⚠️ فشل في إنشاء: $p"
    }
}
