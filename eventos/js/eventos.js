document.addEventListener("DOMContentLoaded", function() {
    const contenedorEventos = document.getElementById('listaEventos');
    const inputBusqueda = document.querySelector('.buscador input');
    // Seleccionamos nuestros nuevos botones de radio
    const radiosFiltro = document.querySelectorAll('input[name="filtroFecha"]');

    // Obtenemos la lista original
    let listaEventos = JSON.parse(localStorage.getItem('listaEventos')) || [];

    // Función que dibuja las tarjetas (sin cambios, es la misma que ya teníamos)
    function renderizarEventos(eventosAMostrar) {
        contenedorEventos.innerHTML = "";

        if (eventosAMostrar.length > 0) {
            eventosAMostrar.forEach(function(evento) {
                const tarjetaEvento = document.createElement('div');
                tarjetaEvento.className = 'evento'; 

                tarjetaEvento.innerHTML = `
                    <div>
                        <h3 style="margin-top:0; color: #18a274;">${evento.evento}</h3>
                        <p><strong>Planeador:</strong> ${evento.planeador}</p>
                        <p><strong>Fecha:</strong> ${evento.fecha}</p>
                        <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
                        <p><strong>Tipo de evento:</strong> ${evento.tipo}</p>
                        <p><strong>Teléfono:</strong> ${evento.telefono}</p>
                        <p><strong>Correo electrónico:</strong> ${evento.email}</p>
                    </div>
                    <div class="acciones">
                        <button class="editar">Editar</button>
                        <button class="borrar">Borrar</button>
                    </div>
                `;

                contenedorEventos.appendChild(tarjetaEvento);

                //botones para borrar y editar
                const btnBorrar = tarjetaEvento.querySelector('.borrar');
                const btnEditar = tarjetaEvento.querySelector('.editar');

                btnBorrar.addEventListener('click', function() {
                    if(confirm(`¿Estás seguro de que deseas borrar el evento: "${evento.evento}"?`)) {
                        const nuevaLista = listaEventos.filter(ev => ev.id !== evento.id);
                        localStorage.setItem('listaEventos', JSON.stringify(nuevaLista)); 
                        window.location.reload(); 
                    }
                });

                btnEditar.addEventListener('click', function() {
                    window.location.href = 'eventos/nuevo.html?id=' + evento.id;
                });
            });
        } else {
            contenedorEventos.innerHTML = "<p style='text-align: center; color: gray; margin-top: 20px;'>No se encontraron eventos.</p>";
        }
    }

    function aplicarFiltros() {
        let eventosFiltrados = [...listaEventos];

        const filtroSeleccionado = document.querySelector('input[name="filtroFecha"]:checked').value;
        
        if (filtroSeleccionado === 'cercanos') {
            eventosFiltrados.sort(function(a, b) {
                const fechaA = new Date(a.fecha);
                const fechaB = new Date(b.fecha);
                
                //las fechas más cercanas quedan arriba y las fechas más lejanas quedan al final
                return fechaA - fechaB;
            });
        }
        renderizarEventos(eventosFiltrados);
    }

    radiosFiltro.forEach(function(radio) {
        radio.addEventListener('change', aplicarFiltros);
    });
    aplicarFiltros();
});