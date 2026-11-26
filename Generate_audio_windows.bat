@echo off
setlocal
cd /d "%~dp0"
if not exist "tools\generate_audio.py" (
  echo ERROR: Move this BAT file into the extracted website folder, next to index.html.
  pause
  exit /b 1
)
echo This sends ONLY prepared study scripts to Microsoft Edge TTS to generate 5 Ukrainian MP3 files.
echo Internet connection required. No original lecture recordings are uploaded.
choice /c YN /n /m "Continue? [Y/N] "
if errorlevel 2 exit /b 0
set "ENV=%LOCALAPPDATA%\YaProgramistAudio\venv"
if not exist "%ENV%\Scripts\python.exe" (
  py -3.12 -m venv "%ENV%"
  if errorlevel 1 goto error
)
"%ENV%\Scripts\python.exe" -c "import edge_tts" >nul 2>&1
if errorlevel 1 (
  "%ENV%\Scripts\python.exe" -m pip install edge-tts
  if errorlevel 1 goto error
)
"%ENV%\Scripts\python.exe" "%~dp0tools\generate_audio.py"
if errorlevel 1 goto error
echo.
echo SUCCESS. 5 full MP3 files are in audio. Open GitHub Desktop, Commit, then Push origin.
pause
exit /b 0
:error
echo.
echo ERROR. See the error above. Run this file again to resume.
pause
exit /b 1
