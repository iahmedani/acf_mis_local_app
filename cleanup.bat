@echo off
del /f  "%APPDATA%\nims_aap\acf_mis_local.sqlite3"
del /f  "%APPDATA%\nims_aap\config.json"
echo  "%APPDATA%\nims_aap\acf_mis_local.sqlite3" file deleted
pause