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
      slotMinTime: "00:00:00",
      slotMaxTime: "23:59:59",
      allDaySlot: false,
      events: '/api/clases/eventos',
      slotDuration: "00:60:00"
    });
  
    calendar.render();
  });
  