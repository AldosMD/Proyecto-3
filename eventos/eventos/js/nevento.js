document.addEventListener("DOMContentLoaded", function() {
    const inputFecha = document.getElementById('fecha');
    const hoy = new Date();
    const hoyFormateado = hoy.getFullYear() + '-' + 
                          String(hoy.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(hoy.getDate()).padStart(2, '0');
    
    inputFecha.setAttribute('min', hoyFormateado);

    const urlParams = new URLSearchParams(window.location.search);
    const idEdicion = urlParams.get('id');

    if (idEdicion) {
        const listaEventos = JSON.parse(localStorage.getItem('listaEventos')) || [];        
        const eventoGuardado = listaEventos.find(evento => evento.id == idEdicion);

        if (eventoGuardado) {
            document.getElementById('name').value = eventoGuardado.planeador;
            document.getElementById('nameE').value = eventoGuardado.evento;
            document.getElementById('fecha').value = eventoGuardado.fecha;
            document.getElementById('ubicacion').value = eventoGuardado.ubicacion;
            document.getElementById('tipo').value = eventoGuardado.tipo;
            document.getElementById('phone').value = eventoGuardado.telefono;
            document.getElementById('email').value = eventoGuardado.email;

            document.getElementById('RE').innerText = "Actualizar evento";
            document.getElementById('formulario').dataset.editId = idEdicion;
        }
    }
});

const formulario = document.getElementById('formulario');
const mensaje = document.getElementById('message');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    // 3. Validación extra: Verificar la fecha antes de procesar el envío
    const fechaSeleccionada = document.getElementById('fecha').value;
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    const fechaEventoObj = new Date(fechaSeleccionada + "T00:00:00");

    if (fechaEventoObj < fechaHoy) {
        mensaje.innerText = "Error: La fecha no puede ser anterior al día actual.";
        mensaje.style.color = "red";
        return; // Detiene el registro
    }

    const datosEvento = {
        planeador: document.getElementById('name').value,
        evento: document.getElementById('nameE').value,
        fecha: fechaSeleccionada,
        ubicacion: document.getElementById('ubicacion').value,
        tipo: document.getElementById('tipo').value,
        telefono: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    let listaEventos = JSON.parse(localStorage.getItem('listaEventos')) || [];
    const editId = formulario.dataset.editId;

    if (editId) {
        datosEvento.id = Number(editId); 
        const index = listaEventos.findIndex(ev => ev.id == editId);
        if (index !== -1) {
            listaEventos[index] = datosEvento; 
        }
        mensaje.innerText = "¡Evento actualizado con éxito! Redirigiendo...";
    } else {
        datosEvento.id = Date.now(); 
        listaEventos.push(datosEvento);
        mensaje.innerText = "¡Evento registrado con éxito! Redirigiendo...";
    }

    localStorage.setItem('listaEventos', JSON.stringify(listaEventos));

    mensaje.style.color = "green";
    document.getElementById('RE').disabled = true;

    setTimeout(function() {
        window.location.href = '../tablero.html'; 
    }, 2000);
});