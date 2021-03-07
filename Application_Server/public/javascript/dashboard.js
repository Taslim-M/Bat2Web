var allLabels=[
  "A.Tridens",
  "E. Bottae",
  "M. Emarginatus",
  "P. kuhli",
  "R. muscatellum",
  "R. nasutus",
  "R. aegyptius",
  "T. perforatus",
];
// ----------------bar chart--------------

var trace1={
  x: [1, 2, 3, 4],
  y: [1, 4, 9, 16],
  name: "A.Tridens",
  type: "bar",
  marker: { color: "#a8e6cf " },
};
var trace2={
  x: [1, 2, 3, 4],
  y: [6, 8, 4.5, 8],
  name: "E. Bottae",
  type: "bar",
  marker: { color: "#a3bded" },
};
var trace3={
  x: [1, 2, 3, 4],
  y: [15, 3, 4.5, 8],
  name: "P. kuhli",
  type: "bar",
  marker: { color: " #e4dcf1" },
};

var trace4={
  x: [1, 2, 3, 4],
  y: [1, 3, 3, 4],
  name: "R. muscatellum",
  type: "bar",
  marker: { color: "#ff8b94" },
};
var trace5={
  x: [1, 2, 3, 4],
  y: [1, 4, 9, 16],
  name: "R. aegyptius",
  type: "bar",
  marker: { color: "#ffaaa5" },
};
var trace6={
  x: [1, 2, 3, 4],
  y: [6, 8, 4.5, 8],
  name: "T. perforatus",
  type: "bar",
  marker: { color: "#ffd3b6" },
};
var trace7={
  x: [1, 2, 3, 4],
  y: [15, 3, 4.5, 8],
  name: "R. nasutus",
  type: "bar",
  marker: { color: "#dcedc1" },
};

var trace8={
  x: [1, 2, 3, 4],
  y: [1, 3, 3, 4],
  name: "M. Emarginatus",
  type: "bar",
  marker: { color: "#cbdadb" },
};

var data=[trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8];
var layout={
  xaxis: { title: "X axis" },
  yaxis: { title: "Y axis" },
  barmode: "relative",
  margin: { t: 0, r: 0 }, // no left and bottom margin so that scale is visible
  fontsize: 18,
  marker: { color: "#2f4b7c" },
};
var config={ responsive: true };

Plotly.newPlot("barChart", data, layout, config);
// --------------Pie chart-------------------

var allValues=[31, 24, 19, 18, 8, 31, 24, 19, 18, 8];

var ultimateColors=[
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

var data=[
  {
    values: parsed_pie_counts.map(x => x.count),
    labels: parsed_pie_counts.map(x => x._id[0]+'. '+x._id.split(' ')[1]),
    type: "pie",
    marker: {
      colors: ultimateColors,
    },
    domain: {
      row: 0,
      column: 0,
    },
    hoverinfo: "label+percent",
    textinfo: "percent+label",
    // textposition: "outside",
    automargin: true,
  },
];

var layout={
  margin: { t: 0, b: 0, l: 0, r: 0 },
  showlegend: false,
  fontsize: 18,
};

Plotly.newPlot("pieChart", data, layout, config);

// ------------------time series chart -----------------
Plotly.d3.csv(
  "https://raw.githubusercontent.com/plotly/datasets/master/finance-charts-apple.csv",
  function (err, rows) {
    function unpack(rows, key) {
      return rows.map(function (row) {
        return row[key];
      });
    }

    var trace1={
      type: "scatter",
      mode: "lines",
      name: "AAPL High",
      x: unpack(rows, "Date"),
      y: unpack(rows, "AAPL.High"),
      line: { color: "#17BECF" },
    };

    var trace2={
      type: "scatter",
      mode: "lines",
      name: "AAPL Low",
      x: unpack(rows, "Date"),
      y: unpack(rows, "AAPL.Low"),
      line: { color: "#7F7F7F" },
    };

    var data=[trace1, trace2];

    var layout={
      // title: "Time Series with Rangeslider",
      xaxis: {
        autorange: true,
        range: ["2015-02-17", "2017-02-16"],
        rangeselector: {
          buttons: [
            {
              count: 1,
              label: "1m",
              step: "month",
              stepmode: "backward",
            },
            {
              count: 6,
              label: "6m",
              step: "month",
              stepmode: "backward",
            },
            { step: "all" },
          ],
        },
        rangeslider: { range: ["2015-02-17", "2017-02-16"] },
        type: "date",
      },
      yaxis: {
        autorange: true,
        range: [86.8700008333, 138.870004167],
        type: "linear",
      },
    };

    Plotly.newPlot("timeSeriesChart", data, layout, config);
  }
);
