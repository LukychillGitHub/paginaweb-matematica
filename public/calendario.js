document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    slotMinTime: "00:00:00",
    slotMaxTime: "23:59:59",
    allDaySlot: false,
    events: '/api/clases/eventos',
    slotDuration: "00:60:00",

    eventClick: function (info) {
      const evento = info.event;
      const id = evento.id;

      if (!id) return alert('Este evento no se puede editar');

      const [fecha, hora_inicio] = evento.startStr.split('T');
      const hora_fin = evento.endStr.split('T')[1].slice(0, 5);

      document.getElementById('modal-id').value = id;
      document.getElementById('modal-fecha').value = fecha;
      document.getElementById('modal-inicio').value = hora_inicio.slice(0, 5);
      document.getElementById('modal-fin').value = hora_fin;

      document.getElementById('modal-editar').style.display = 'flex';
    }
  });

  calendar.render();

  // Cerrar modal
  document.getElementById('modal-cerrar').addEventListener('click', () => {
    document.getElementById('modal-editar').style.display = 'none';
  });

  // Guardar cambios (edición de franja)
  document.getElementById('form-editar').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('modal-id').value;
    const fecha = document.getElementById('modal-fecha').value;
    const inicio = document.getElementById('modal-inicio').value;
    const fin = document.getElementById('modal-fin').value;

    if (!fecha || !inicio || !fin) {
      alert('⚠️ Completá todos los campos.');
      return;
    }

    if (fin <= inicio) {
      alert('⚠️ La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    const res = await fetch(`/api/clases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fecha, hora_inicio: inicio, hora_fin: fin })
    });

    if (res.ok) {
      alert('✅ Disponibilidad actualizada');
      document.getElementById('modal-editar').style.display = 'none';
      calendar.refetchEvents(); // Vuelve a cargar el calendario
    } else {
      const data = await res.json();
      alert(`❌ ${data.error}`);
    }
  });
});
