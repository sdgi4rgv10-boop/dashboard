Set WshShell = CreateObject("WScript.Shell")
shortcutName = "\المستشار الذهبي.lnk"

' 1. Create on Desktop
On Error Resume Next
Set desktopShortcut = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & shortcutName)
ConfigureShortcut desktopShortcut
desktopShortcut.Save()

' 2. Create in d:\ذهب وفضه
Set folderShortcut1 = WshShell.CreateShortcut("d:\ذهب وفضه" & shortcutName)
ConfigureShortcut folderShortcut1
folderShortcut1.Save()

' 3. Create in current folder
Set folderShortcut2 = WshShell.CreateShortcut("d:\ذهب وفضه\smart-home-dashboard" & shortcutName)
ConfigureShortcut folderShortcut2
folderShortcut2.Save()
On Error GoTo 0

Sub ConfigureShortcut(oShortcut)
    oShortcut.TargetPath = "C:\Program Files\Google\Chrome\Application\chrome.exe"
    oShortcut.Arguments = "--app=file:///d:/ذهب وفضه/smart-home-dashboard/index.html --window-size=1400,900"
    oShortcut.WorkingDirectory = "d:\ذهب وفضه\smart-home-dashboard"
    oShortcut.Description = "المستشار الذهبي - نقطة البيع الذكية"
End Sub

MsgBox "✅ تم إنشاء الاختصار بنجاح في:" & vbCrLf & _
       "- سطح المكتب" & vbCrLf & _
       "- مجلد d:\ذهب وفضه" & vbCrLf & _
       "- داخل مجلد smart-home-dashboard", 64, "تم بنجاح"
