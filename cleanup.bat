@echo off
REM REN  "%APPDATA%\nims_aap\acf_mis_local.sqlite3" acf_mis_local_beforeV50.sqlite3
REN  "%APPDATA%\nims_aap\acf_mis_local.sqlite3" acf_mis_local_beforev51.sqlite3
REM del /f  "%APPDATA%\nims_aap\acf_mis_local.sqlite3"
del /f  "%APPDATA%\nims_aap\config.json"
echo  "%APPDATA%\nims_aap\acf_mis_local.sqlite3" file deleted
pause