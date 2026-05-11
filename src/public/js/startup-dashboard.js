const el = document.getElementById('dashboard-data');

const applicationsPerJob = JSON.parse(
    el.getAttribute('data-applications-per-job')
);

const applicationsOverTime = JSON.parse(
    el.getAttribute('data-applications-over-time')
);

const barCtx = document
    .getElementById('applicationsPerJobChart')
    .getContext('2d');


// BAR CHART
new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: applicationsPerJob.map(j => j.title),
        datasets: [{
            label: 'Applications',
            data: applicationsPerJob.map(j => j.total),
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

// LINE CHART
new Chart(document.getElementById('applicationsOverTimeChart'), {
    type: 'line',
    data: {
        labels: applicationsOverTime.map(i => i.date),
        datasets: [{
            label: 'Applications',
            data: applicationsOverTime.map(i => i.total),
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
    }
});