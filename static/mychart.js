let ctx = null;
let chart = null;
let config = {
    type: 'line',  // 라인 그래프
    data: {
        labels: [],
        datasets: [{
            label: '조도그래프',
            backgroundColor: 'yellow',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            data: [],
            fill: false,
        }]
    },
    options: {
        responsive: false,
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: { display: true, labelString: '시간(초)' },
            }],
            yAxes: [{
                display: true,
                scaleLabel: { display: true, labelString: '조도 값' }
            }]
        }
    }
};

let LABEL_SIZE = 20;  // 차트에 그려지는 데이터의 개수
let tick = 0;         // 도착한 데이터의 개수 (0~99)

function drawChart() {
    ctx = document.getElementById('canvas').getContext('2d');
    chart = new Chart(ctx, config);
    init();
}

function init() {
    for (let i = 0; i < LABEL_SIZE; i++) {
        chart.data.labels[i] = i;
    }
    chart.update();
}

function addChartData(value) {
    tick++;
    tick %= 100;

    let n = chart.data.datasets[0].data.length;
    if (n < LABEL_SIZE) {
        chart.data.datasets[0].data.push(value);
    } else {
        chart.data.datasets[0].data.push(value);
        chart.data.datasets[0].data.shift();
        chart.data.labels.push(tick);
        chart.data.labels.shift();
    }
    chart.update();
}

function hideshow() {
    let canvas = document.getElementById('canvas');
    if (canvas.style.display == "none")
        canvas.style.display = "inline-block";
    else
        canvas.style.display = "none";
}

window.addEventListener("load", drawChart);
