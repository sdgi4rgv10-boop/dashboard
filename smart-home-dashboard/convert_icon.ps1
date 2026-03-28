Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\ذهب وفضه\smart-home-dashboard\icon-192.png")
$stream = New-Object System.IO.FileStream("d:\ذهب وفضه\smart-home-dashboard\icon.ico", [System.IO.FileMode]::Create)
$bitmap = New-Object System.Drawing.Bitmap($img)
$iconHandle = $bitmap.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($iconHandle)
$icon.Save($stream)
$stream.Close()
$icon.Dispose()
$bitmap.Dispose()
$img.Dispose()
Write-Host "Created icon.ico"
