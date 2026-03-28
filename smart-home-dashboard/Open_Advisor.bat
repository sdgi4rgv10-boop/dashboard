@echo off
chcp 65001 > nul
start chrome.exe --app="file:///%~dp0index.html" --window-size=1400,900
exit
