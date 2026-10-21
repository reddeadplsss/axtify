@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22 or later, then run this launcher again.
  pause
  exit /b 1
)
set PORT=4173
echo Open http://localhost:4173 in your browser.
echo Keep this window open while using Axtify.
node server.mjs
if errorlevel 1 pause
