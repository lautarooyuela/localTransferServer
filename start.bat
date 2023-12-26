@echo off
setlocal enabledelayedexpansion

rem Obtener la dirección IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set "ip=%%a"
)
rem Eliminar espacios en blanco al principio
set "ip=!ip:~1!"

echo Dirigete a la siguiente direccion en el navegador del dispositivo que quieres hacer el intercambio: 
echo !ip!:3000

rem Ejecuta el server
node index.js

endlocal
