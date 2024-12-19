let currentDate = new Date();
let workLog = [];
let totalHours = 0;
const calendarContainer = document.getElementById('calendar');
const monthYearHeader = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const workForm = document.getElementById('work-form');
const workDateInput = document.getElementById('work-date');
const activityNameInput = document.getElementById('activity-name');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');
const overtimeInput = document.getElementById('overtime');
const statusSelect = document.getElementById('status');
const descriptionInput = document.getElementById('description');
const totalHoursElement = document.getElementById('total-hours');

// Funzione per ottenere il mese e anno corrente
function formatDate(month, year) {
    const months = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return `${months[month]} ${year}`;
}

// Funzione per generare il calendario del mese
function generateCalendar(month, year) {
    const date = new Date(year, month);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysInMonth = lastDate;

    monthYearHeader.innerText = formatDate(month, year);

    let calendarHtml = '';

    // Aggiungi celle vuote prima del primo giorno del mese
    for (let i = 0; i < firstDay; i++) {
        calendarHtml += `<div class="day"></div>`;
    }

    // Aggiungi i giorni del mese
    for (let i = 1; i <= daysInMonth; i++) {
        calendarHtml += `
            <div class="day" data-date="${i}">
                <span>${i}</span>
                <div class="activity-marker" id="activity-marker-${i}" style="display: none;"></div>
                <span class="hours-worked" id="hours-worked-${i}" style="display: none;"></span>
            </div>
        `;
    }

    calendarContainer.innerHTML = calendarHtml;
}

// Funzione per calcolare le ore lavorate
function calculateHours(start, end) {
    const startTime = start.split(":");
    const endTime = end.split(":");
    const startDate = new Date(2000, 0, 1, startTime[0], startTime[1]);
    const endDate = new Date(2000, 0, 1, endTime[0], endTime[1]);
    const diff = (endDate - startDate) / 3600000; // Differenza in ore
    return diff;
}

// Funzione per aggiungere attività al calendario
function addActivity() {
    const date = new Date(workDateInput.value);
    const day = date.getDate();
    const activity = activityNameInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const overtime = parseFloat(overtimeInput.value) || 0;
    const status = statusSelect.value;
    const description = descriptionInput.value;

    const hoursWorked = calculateHours(startTime, endTime) + overtime;

    // Salva l'attività
    workLog.push({
        day,
        activity,
        startTime,
        endTime,
        overtime,
        status,
        description,
        hoursWorked
    });

    // Aggiorna il totale delle ore
    totalHours += hoursWorked;
    totalHoursElement.innerText = `Ore Totali: ${totalHours.toFixed(2)} ore`;

    // Aggiorna il calendario con il marker
    const dayElement = document.querySelector(`.day[data-date="${day}"]`);
    const markerElement = dayElement.querySelector(".activity-marker");
    const hoursElement = dayElement.querySelector(".hours-worked");

    markerElement.style.display = "block";
    hoursElement.innerText = `${hoursWorked.toFixed(2)}h`;
    hoursElement.style.display = "block";

    // Mostra il marker in base allo stato
    dayElement.classList.add(status);

    // Pulisci il form
    workForm.reset();
}

// Eventi
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

workForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addActivity();
});

// Inizializza il calendario per il mese corrente
generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
