////////////////////////////////////////Messages//////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    cargarMensajes();
  });
  
  function cargarMensajes() {
    fetch('http://' + window.location.hostname + ':3000/getMessages')
      .then(response => response.json())
      .then(mensajes => {
        const mensajesList = document.getElementById('mensajes-list');
        mensajesList.innerHTML = '';
  
        mensajes.forEach(mensaje => {
          const listItem = document.createElement('li');
          listItem.textContent = mensaje.contenido;
          mensajesList.appendChild(listItem);
        });
      })
      .catch(error => console.error('Error al cargar mensajes:', error));
  }

  function borrarMensajes() {
    fetch('http://' + window.location.hostname + ':3000/deleteMessages')
      .then(response => response.json())
      .then(() => {cargarMensajes();})
      .catch(error => console.error('Error al cargar mensajes:', error));
  }
  
  function enviarMensaje() {
    const nuevoMensaje = document.getElementById('nuevo-mensaje').value;
  
    if (nuevoMensaje.trim() === '') {
      alert('Por favor, escribe un mensaje antes de enviar.');
      return;
    }
  
    fetch('http://' + window.location.hostname + ':3000/postMessages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contenido: nuevoMensaje }),
    })
      .then(response => response.json())
      .then(() => {
        cargarMensajes();
        document.getElementById('nuevo-mensaje').value = '';
      })
      .catch(error => console.error('Error al enviar mensaje:', error));
  }

  function enviarConEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      // Evitar el salto de línea si no se mantiene presionada la tecla Shift
      event.preventDefault();
      enviarMensaje();
    }
  }

  function volverPrincipal() {
    window.location.href = "/";
  }
  

  /////////////////////////////////////HUB////////////////////////////////////////
  document.addEventListener('DOMContentLoaded', function () {
    var hub = document.getElementById('hub');
    var hostname = window.location.hostname;
  
    var enlaces = [
      { texto: 'Local Transfer', url: 'http://' + hostname + ':3000/transfer' },
      { texto: 'Local Messages', url: 'http://' + hostname + ':3000/messages.html' }
    ];
  
    enlaces.forEach(function (enlace) {
      var a = document.createElement('a');
      a.href = enlace.url;
      a.textContent = enlace.texto;
      a.classList.add('hub-link');
      hub.appendChild(a);
    });
  });
  