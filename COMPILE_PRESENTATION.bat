@echo off
REM ========================================
REM JobSphere LaTeX Presentation Compiler
REM ========================================
REM This script compiles your LaTeX presentation to PDF
REM Just double-click this file to compile!
REM ========================================

echo.
echo ==========================================
echo   JobSphere LaTeX Presentation Compiler
echo ==========================================
echo.

REM Check if pdflatex is installed
where pdflatex >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: pdflatex not found!
    echo.
    echo Please install MiKTeX:
    echo https://miktex.org/download
    echo.
    pause
    exit /b 1
)

REM Display compilation info
echo Compiling JobSphere_Presentation.tex...
echo.
echo This may take 30-60 seconds on first run.
echo.

REM First compilation pass
echo [1/2] First pass...
pdflatex -interaction=nonstopmode --enable-installer JobSphere_Presentation.tex

echo.
echo [2/2] Second pass (updating references)...
pdflatex -interaction=nonstopmode --enable-installer JobSphere_Presentation.tex

echo.
echo ==========================================
echo   COMPILATION COMPLETE!
echo ==========================================
echo.

REM Check if PDF was created
if exist JobSphere_Presentation.pdf (
    echo SUCCESS: PDF created successfully!
    echo.
    echo File: JobSphere_Presentation.pdf
    echo.
    echo Opening PDF in 2 seconds...
    timeout /t 2 /nobreak
    start JobSphere_Presentation.pdf
) else (
    echo ERROR: PDF creation failed!
    echo Please check the compilation log above.
    pause
    exit /b 1
)

echo.
echo Done! Your presentation is ready!
echo.
pause
