@echo off
echo ========================================
echo  Demarrage Complet du Projet
echo ========================================
echo.
echo Ce script va demarrer Django et React
echo dans deux fenetres separees.
echo.
pause

echo.
echo 🚀 Demarrage du Backend Django...
start "Django Backend" cmd /k "cd /d C:\Users\oelam\OneDrive\Desktop\IOt\IOT-Project && venv\Scripts\activate && py manage.py runserver"

timeout /t 3 /nobreak >nul

echo.
echo 🚀 Demarrage du Frontend React...
start "React Frontend" cmd /k "cd /d C:\Users\oelam\OneDrive\Desktop\IOt\my-react-app && npm run dev"

echo.
echo ✅ Les deux serveurs sont en cours de demarrage!
echo.
echo 📍 URLs d'acces:
echo    - Backend:  http://localhost:8000
echo    - Frontend: http://localhost:5173
echo.
echo Fermez cette fenetre pour continuer.
pause

