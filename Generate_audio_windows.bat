@echo off
setlocal
cd /d "%~dp0"
echo This will send ONLY the prepared study scripts to Microsoft Edge TTS to generate Ukrainian MP3 files.
echo Internet connection required. No original lecture recordings are uploaded.
choice /c YN /n /m "Continue? [Y/N] "
if errorlevel 2 exit /b 0
set "ENV=%LOCALAPPDATA%\YaProgramistAudioenv"
if not exist "%ENV%\Scripts\python.exe" (
  py -3.12 -m venv "%ENV%"
  if errorlevel 1 goto error
)
"%ENV%\Scripts\python.exe" -m pip install --upgrade edge-tts
if errorlevel 1 goto error
"%ENV%\Scripts\python.exe" "%~dp0tools\generate_audio.py"
if errorlevel 1 goto error
echo.
echo SUCCESS. MP3 files are in audio. Open GitHub Desktop, Commit, then Push origin.
pause
exit /b 0
:error
echo.
echo ERROR. Check internet connection or Python 3.12. Run this file again to resume.
pause
exit /b 1
