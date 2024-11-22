@rem update folder-name\*.* flags = copies all files with confirmation
@rem update folder-name\file-name flags = copies one file with confirmation
xcopy /s /d /b %1 ..\..\inc\docs\webcat\%1 %2