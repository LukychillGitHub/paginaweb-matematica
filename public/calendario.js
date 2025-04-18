document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [
        {
          title: 'Disponible',
          daysOfWeek: [1, 3, 5],
          startTime: '15:00',
          endTime: '17:00',
          display: 'background',
          color: '#90ee90'
        }
      ]
    });
  
    calendar.render();
  });
  