@echo off
echo ========================================
echo  Demarrage du Backend Django
echo ========================================
cd /d "C:\Users\oelam\OneDrive\Desktop\IOt\IOT-Project"
call venv\Scripts\activate
echo.
echo ✅ Environnement virtuel active
echo.
echo 🚀 Demarrage du serveur Django...
echo.
py manage.py runserver
pause

