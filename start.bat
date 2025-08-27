@echo off
echo Starting Frontend and Backend...

:: Start Frontend
start cmd /k "cd frontend && npm run dev"

:: Start Backend
start cmd /k "cd server && nodemon server.js"