@echo off
setlocal enabledelayedexpansion

rem Obtener la dirección IP local
set "ip=192.168.1.X"
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| find "IPv4"') do (
    set "ips=%%a"
    set "ips=!ips:~1!"

    if "!ips:~0,9!"=="192.168.1" (
        set "ip=!ips!"
    )
)

echo Dirigete a la siguiente direccion en el navegador del dispositivo que quieres hacer el intercambio: 
echo !ip!:3000

rem Ejecuta el server
node index.js

endlocal
