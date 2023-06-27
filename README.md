# localTransferServer
this repository provide a basic server for localhost to transfer different static files

# Pasos para usar la App

1. Crear dentro del repositorio la carpeta "public" donde van a ir todos los archivos para ser descargados desde otro dispositivo
2. Abrir una nueva terminal y ejecutar el comando "npm i"
3. Una ves que termine de instalar todas las dependencias ejecutar el comando "npm start"
4. Luego de levantado el servidor en localhost abrimos una nueva terminal y ejecutamos (para windows) "ip config" para poder ver la ip local del dispositivo donde se esta levantando el servidor
5. Teniendo la ip del dispositivo server, en el dispositivo al que vamos a enviar los archivos abrimos el navegador y tipamos la siguiente url con la ip que sacamos de el paso anterior "http://$IP:3000"
6. Todo listo para poder descargar los archivos
