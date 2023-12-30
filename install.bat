@echo off
setlocal enabledelayedexpansion

echo Iniciando Instalacion 

rem Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js no está instalado. Instalando Node.js...
    bitsadmin /transfer "NodeJSInstaller" https://nodejs.org/dist/v20.10.0/node-v20.10.0-x64.msi "%TEMP%\node-v20.10.0-x64.msi"
    start /wait msiexec /i "%TEMP%\node-v20.10.0-x64.msi" /qn
    if %errorlevel% neq 0 (
        echo Error al instalar Node.js. Por favor, instálelo manualmente desde https://nodejs.org/
        goto :fin
    )
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm no está instalado. Instalando npm...
    npm install -g npm
    if %errorlevel% neq 0 (
        echo Error al instalar npm. Por favor, instálelo manualmente.
        goto :fin
    )
)

rem Si Node.js y npm están instalados, continuar con la instalación
mkdir public
mkdir uploads
npm i

echo Instalación completada.

:fin
endlocal
