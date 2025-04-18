document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
  
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridWeek,timeGridDay'
      },
      slotMinTime: "09:00:00",
      slotMaxTime: "20:00:00",
      allDaySlot: false,
      locale: 'es',
      events: [
        {
          title: 'Disponible',
          daysOfWeek: [1, 3, 5], // Lunes, Miércoles y Viernes
          startTime: '15:00',
          endTime: '17:00',
          display: 'background',
          color: '#90ee90'
        },
        {
          title: 'Disponible',
          daysOfWeek: [2, 4], // Martes y Jueves
          startTime: '10:00',
          endTime: '12:00',
          display: 'background',
          color: '#add8e6'
        }
      ]
    });
  
    calendar.render();
  });
  