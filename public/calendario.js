document.addEventListener('DOMContentLoaded', async function () {
    const calendarEl = document.getElementById('calendar');
  
    // Obtener eventos desde API
    const res = await fetch('/api/clases');
    const data = await res.json();
  
    // Convertir a formato que acepta FullCalendar
    const eventos = data.map(d => ({
      title: 'Disponible',
      daysOfWeek: [d.dia_semana],
      startTime: d.hora_inicio,
      endTime: d.hora_fin,
      display: 'background',
      color: '#90ee90'
    }));
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: eventos
    });
  
    calendar.render();
  });
  