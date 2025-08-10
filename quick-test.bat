@echo off
echo ====================================
echo   SkillBridge Quick Test Setup
echo ====================================
echo.

echo 1. Starting development server...
start cmd /c "npm run dev"

echo.
echo 2. Waiting for server to start...
timeout /t 5 /nobreak > nul

echo.
echo 3. Opening test suite in browser...
start "" "src/tests/index.html"

echo.
echo 4. Opening application in browser...
start "" "http://localhost:8080"

echo.
echo ====================================
echo   Setup Complete!
echo ====================================
echo.
echo You now have:
echo - Development server running on localhost:8080
echo - Interactive test suite open
echo - Ready to test all features
echo.
echo Next steps:
echo 1. Configure your Supabase credentials in .env
echo 2. Run the database schema in Supabase
echo 3. Start testing with the interactive test suite
echo.
pause
