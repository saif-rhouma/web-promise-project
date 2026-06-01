const el = document.getElementById('dashboard-data');

const registrationsByMonthData = JSON.parse(
    el.getAttribute('data-registrations-by-months')
);

const jobsByMonthData = JSON.parse(
    el.getAttribute('data-jobs-by-months')
);

const registrationsByMonthChart = document
    .getElementById('registrationsByMonthChart')
    .getContext('2d');

const jobsByMonthChart = document
    .getElementById('jobsByMonthChart')
    .getContext('2d');

// BAR CHART
new Chart(registrationsByMonthChart, {
    type: 'bar',
    data: {
        labels: registrationsByMonthData.map(j => j.month),
        datasets: [{
            label: 'Users',
            data: registrationsByMonthData.map(j => j.count),
            borderWidth: 1,
            pointHoverBorderColor: '#1967d2',
            pointBorderWidth: 10,
            pointHoverBorderWidth: 3,
            pointHitRadius: 20,
            borderWidth: 3,
            borderColor: '#1967d2',
            pointBackgroundColor: 'rgba(255, 255, 255, 0)',
            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderColor: 'rgba(66, 133, 244, 0)',
            cubicInterpolationMode: 'monotone',
            fill: true,
            backgroundColor: 'rgba(212, 230, 255, 0.2)',
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// BAR CHART
new Chart(jobsByMonthChart, {
    type: 'bar',
    data: {
        labels: jobsByMonthData.map(j => j.month),
        datasets: [{
            label: 'Jobs Post',
            data: jobsByMonthData.map(j => j.count),
            borderWidth: 1,
            pointHoverBorderColor: '#1967d2',
            pointBorderWidth: 10,
            pointHoverBorderWidth: 3,
            pointHitRadius: 20,
            borderWidth: 3,
            borderColor: '#1967d2',
            pointBackgroundColor: 'rgba(255, 255, 255, 0)',
            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
            pointBorderColor: 'rgba(66, 133, 244, 0)',
            cubicInterpolationMode: 'monotone',
            fill: true,
            backgroundColor: 'rgba(212, 230, 255, 0.2)',
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});