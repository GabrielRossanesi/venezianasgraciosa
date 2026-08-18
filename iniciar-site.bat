@echo off
chcp 65001 >nul
title Venezianas Graciosa - Servidor Local
cd /d "%~dp0"

echo =======================================================
echo         VENEZIANAS GRACIOSA - INICIANDO SITE           
echo =======================================================
echo.
echo  [1/2] Iniciando servidor local na porta 8000...
echo  [2/2] Abrindo navegador em http://localhost:8000
echo.
echo  Pressione Ctrl+C para encerrar o servidor quando desejar.
echo =======================================================
echo.

:: Abre o navegador automaticamente apos 1 segundo em segundo plano
start "" powershell -Command "Start-Sleep -Seconds 1; Start-Process 'http://localhost:8000'"

:: Tenta iniciar servidor HTTP com Python
python -m http.server 8000
if %errorlevel% neq 0 (
    echo Python nao encontrado. Tentando abrir diretamente com o navegador padrao...
    start "" "%~dp0index.html"
)

pause
