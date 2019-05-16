$(document).ready(function () {
    loadCSV()
});

function loadCSV() {
    Papa.parse("./data.csv", {
        download: true,
        header: true,
        complete: function (results) {
            renderDataTable(results.data);
        }
    });
}

function renderDataTable(data) {
    var table = $('#table').DataTable({
        data: data,
        columns: [
            { name: 'Car', data: 'Car' },
            { name: 'MPG', data: 'MPG' },
            { name: 'Cylinders', data: 'Cylinders' },
            { name: 'Displacement', data: 'Displacement' },
            { name: 'Horsepower', data: 'Horsepower' },
            { name: 'Weight', data: 'Weight' },
            { name: 'Acceleration', data: 'Acceleration' },
            { name: 'Model', data: 'Model' },
            { name: 'Origin', data: 'Origin' }
        ]
    });

    var Origin = table
        .column(8)
        .data()
        .unique();


    selectOrigin = document.getElementById('origin')
    for (var key in Origin) {
        if (typeof (Origin[key]) === "string") {
            var opt = document.createElement('option');
            if (key == 0) {
                opt.setAttribute("selected", "true")
            }
            opt.value = Origin[key];
            opt.innerHTML = Origin[key];
            selectOrigin.appendChild(opt);
        }
    }

    console.info("Star Me -> https://github.com/iamshouvikmitra/datadash")


    var table1 = $('#table1').DataTable({
        data: data,
        columns: [
            { name: 'Car', data: 'Car' },
            { name: 'Displacement', data: 'Displacement' },
            { name: 'Origin', data: 'Origin' }
        ],
        rowsGroup: [
            'Origin:name',
            2
        ],
        pageLength: 5,
        "fnDrawCallback": function (oSettings) {
            $('#table1_paginate').hide();
            $('#table1_filter').hide();
            $('#table1_length').hide();
        },
        "info": false
    });

    origin = document.getElementById('origin').value;

    table1
        .column(2)
        .data()
        .flatten()
        .search(origin)
        .order([1, 'desc'])
        .draw();

    $('#origin').change(function () {
        origin = document.getElementById('origin').value;
        table1
            .column(2)
            .data()
            .flatten()
            .search(origin)
            .order([1, 'desc'])
            .draw();
    })

    renderChart(data)
}


function renderChart(data) {
    var totalDisplacement = [{
        "US": 0,
        "Europe": 0,
        "Japan": 0
    }]
    var totalCount = [{
        "US": 0,
        "Europe": 0,
        "Japan": 0
    }]


    data.forEach(element => {
        totalDisplacement[0][element.Origin] += parseFloat(element.Displacement)
        totalCount[0][element.Origin] += 1
    });

    var avgDisplacement = []
    avgDisplacement.push(totalDisplacement[0]["US"] / totalCount[0]["US"])
    avgDisplacement.push(totalDisplacement[0]["Europe"] / totalCount[0]["Europe"])
    avgDisplacement.push(totalDisplacement[0]["Japan"] / totalCount[0]["Japan"])

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['USA', 'Europe', 'Japan'],
            datasets: [{
                label: 'Avg. Displacements',
                data: avgDisplacement,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

