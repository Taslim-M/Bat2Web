var allLabels = [
  "Rhinopoma muscatellum",
  "Myotis emarginatus",
  "Pipistrellus kuhli",
  "Asellia tridens",
  "Rousettus aegyptius",
  "Eptesicus bottae",
  "Rhyneptesicus nasutus",
  "Taphozous perforatus",
];
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
var barColors = [
  "#a8e6cf",
  "#a3bded",
  "#e4dcf1",
  "#ff8b94",
  "#ffaaa5",
  "#ffd3b6",
  "#dcedc1",
  "#cbdadb",
];

/**
 * Get first letter followed by second name
 * @param {String} fullBatName
 */
function getShortBatName(fullBatName) {
  if (fullBatName.split(" ").length == 1) return fullBatName;
  return fullBatName[0] + ". " + fullBatName.split(" ")[1];
}

// ----------------bar chart--------------

var barData = [];
for (let i = 0; i < 8; ++i) {
  barData.push({
    x: months,
    y: parsed_bar_counts[allLabels[i]].counts,
    name: getShortBatName(allLabels[i]),
    type: "bar",
    marker: { color: barColors[i] },
  });
}
console.log(barData);

var layout = {
  xaxis: { title: "Month" },
  yaxis: { title: "Number of Detections" },
  barmode: "relative",
  margin: { t: 0, r: 0 }, // no left and bottom margin so that scale is visible
  fontsize: 18,
  marker: { color: "#2f4b7c" },
};
var config = { responsive: true };

Plotly.newPlot("barChart", barData, layout, config);

// --------------Pie chart-------------------

var ultimateColors = [
  "#003f5c",
  "#2f4b7c",
  "#665191",
  "#a05195",
  "#d45087",
  "#f95d6a",
  "#ff7c43",
  "#ffa600",
];

var data = [
  {
    values: parsed_pie_counts.map((x) => x.count),
    labels: parsed_pie_counts.map((x) => getShortBatName(x._id)),
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

var layout = {
  margin: { t: 0, b: 0, l: 0, r: 0 },
  showlegend: false,
  fontsize: 18,
};

Plotly.newPlot("pieChart", data, layout, config);

// ------- HISTOGRAM PLOT

var histData = [];
for (let i = 0; i < 8; ++i) {
  histData.push({
    x: parsed_all_dates[allLabels[i]],
    name: getShortBatName(allLabels[i]),
    type: "histogram",
    marker: { color: barColors[i] },
  });
}

Plotly.newPlot("histogram", histData, {
  barmode: "stack",
  autosize: true,
  bargap: 0,
});

// ----- TIMESERIES PLOT

var data = [
  {
    x: parsed_count_by_day.map((x) => x._id.yearMonthDay),
    y: parsed_count_by_day.map((x) => x.count),
    type: "scatter",
  },
];

var timeseriesData = [];
for (let i = 0; i < 8; ++i) {
  timeseriesData.push({
    type: "scatter",
    mode: "lines",
    name: getShortBatName(allLabels[i]),
    x: parsed_count_by_day_by_species[allLabels[i]].dates,
    y: parsed_count_by_day_by_species[allLabels[i]].counts,
    line: {
      color: barColors[i],
      width: 2,
    },
  });
}

//Add the total counts data
timeseriesData.push({
  type: "scatter",
  mode: "lines",
  name: "Total",
  x: parsed_count_by_day.map((x) => x._id.yearMonthDay),
  y: parsed_count_by_day.map((x) => x.count),
  line: {
    width: 1,
  },
});

var layout = {
  xaxis: {
    autorange: true,
    range: ["2020-01-01", "2021-03-15"],
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
    rangeslider: { range: ["2020-01-01", "2021-03-15"] },
    type: "date",
  },
  yaxis: {
    autorange: true,
    range: [0, 5],
    type: "linear",
  },
};

Plotly.newPlot("timeSeriesChart", timeseriesData, layout, config);

// ---------------overlay---------------------------------
var speciesCode = new Map();
speciesCode["Asellia tridens"] = 0;
speciesCode["Eptesicus bottae"] = 1;
speciesCode["Myotis emarginatus"] = 2;
speciesCode["Pipistrellus kuhli"] = 3;
speciesCode["Rhinopoma muscatellum"] = 4;
speciesCode["Rhyneptesicus nasutus"] = 5;
speciesCode["Rousettus aegyptius"] = 6;
speciesCode["Taphozous perforatus"] = 7;

var speciesOverlay = new Map();
speciesOverlay["Asellia tridens"] =
  "<h4>The trident bat or trident leaf-nosed bat (Asellia tridens) is a species of bat in the family Hipposideridae. It is widely distributed in the Middle East, South and Central Asia, and North, East, and Central Africa. Its natural habitats are subtropical or tropical dry forests, dry savanna, subtropical or tropical dry shrubland, caves and hot deserts. </h4> <h1>Trident bat: </h1> <br>  ";

speciesOverlay["Eptesicus bottae"] =
  "<h4>Botta's serotine (Eptesicus bottae) is a species of vesper bat, one of 25 in the genus Eptesicus. It can be found in Afghanistan, Azerbaijan, possibly Djibouti, Egypt, Iran, Iraq, Israel, Jordan, Kazakhstan, Kyrgyzstan, Mongolia, Oman, Pakistan, Saudi Arabia, Syrian Arab Republic, Tajikistan, Turkey, Turkmenistan, Uzbekistan, and Yemen. It is found in rocky areas and temperate desert.</h4> <h1>Bottae bat: </h1> <br>";
speciesOverlay["Myotis emarginatus"] =
  "<h4>M. emarginatus is a medium-sized bat with long and woolly fur. The dorsal side of the torso is rust-brown to fox-red and the ventral side is a poorly delineated pale yellowish-brown. The young animals are almost fully grey. The face is light brown. The ears are brown and they have an almost right-angled notch at the outer edge and many scattered, wart-like growths on the auricle. The tip of the tragus does not reach the notch on the edge of the ear. The wings are brown and broad. The edge of the tail membrane is supported by a straight calcar and part of it has short, straight and soft hairs</h4> <h1>Emarginatus bat: </h1><br>";
speciesOverlay["Pipistrellus kuhli"] =
  "<h4> Kuhl's pipistrelle (Pipistrellus kuhlii) is a species of vesper bat that lives over large areas of North Africa, southern Europe and Western Asia.[1] It can be found in temperate forests, subtropical or tropical dry shrubland, Mediterranean-type shrubby vegetation, temperate grassland, rural gardens, and urban areas.</h4><h1>Kuhli bat: </h1> <br>";
speciesOverlay["Rhinopoma muscatellum"] =
  "<h4> The small mouse-tailed bat (Rhinopoma muscatellum) is a species of bat in the Rhinopomatidae family. It is found in Afghanistan, Iran, Oman, and possibly Ethiopia. The small mouse-tailed bat ranges from the Seistan basin in Iran well into the Helmand River basin of south-western Afghanistan. Mouse tailed bats have a wingspan of 17–25 cm, a body length of 6–8 cm and a tail the same length as its body. Their diet is flying insects which they eat whilst flying. This species was demonstrated as distinct from R. hardwickei based on mutually exclusive morphological features: the small mouse-tailed bat has a nearly unridged skull with small teeth and large cavities filled with fluid</h4> <h1>Muscatellum bat:</h1> <br>";
speciesOverlay["Rhyneptesicus nasutus"] =
  "<h4> The Sind bat (Rhyneptesicus nasutus) is a species of vesper bat. It is found in Afghanistan, Iran, Iraq, Oman, Pakistan, Saudi Arabia, and Yemen. It is the only member of the genus Rhyneptesicus.</h4><h1>Nasutus bat: </h1> <br>";
speciesOverlay["Rousettus aegyptius"] =
  "<h4>The Egyptian fruit bat or Egyptian rousette (Rousettus aegyptiacus) is a species of megabat that is found in Africa, the Middle East, the Mediterranean, and the Indian subcontinent. It is one of three Rousettus species with an African-Malagasy range, though the only species of its genus found on continental Africa. The common ancestor of the three species colonized the region in the late Pliocene or early Pleistocene. The species is traditionally divided into six subspecies. It is considered a medium-sized megabat, with adults weighing 80–170 g (2.8–6.0 oz) and possessing wingspans of approximately 60 cm (24 in). Individuals are dark brown or grayish brown, with their undersides paler than their backs.The Egyptian fruit bat is a highly social species, usually living in colonies with thousands of other bats. It, along with other members of the genus Rousettus, are some of the only fruit bats to use echolocation, though a more primitive version than used by bats in other families. It has also developed a socially-complex vocalization system to communicate with conspecifics. The Egyptian fruit bat is a frugivore that consumes a variety of fruits depending on the season and local availability. Because of its consumption of commercially-grown fruits, the Egyptian fruit bat is considered a pest by farmers. It also acts as a pollinator and seed disperser for many species of trees and other plants. </h4><h1> Aegyptius bat: </h1> <br>";
speciesOverlay["Taphozous perforatus"] =
  "<h4>The Egyptian tomb bat (Taphozous perforatus) is a species of sac-winged bat in the family Emballonuridae. It is a medium- to large-sized microbat with a mass of approximately 30 g (1.1 oz). It is an aerial insectivore, foraging in open space. Based on individuals captured in Ethiopia, it is thought to feed predominantly on Lepidoptera, but is also known to feed on Isoptera, Coleoptera and Orthoptera. </h4><h1>Perforatus bat: </h1> <br>";
function on(species) {
  if (speciesCode[species] == 6) {
    $("#overlayText").css("top", "100%");
  } else if (speciesCode[species] == 2 || speciesCode[species] == 4) {
    $("#overlayText").css("top", "60%");
    // $("#overlayText").css("padding-top", "auto");
  } else {
    $("#overlayText").css("top", "50%");
  }
  $.ajax({
    url: "http://api.positionstack.com/v1/reverse",
    data: {
      access_key: "948300fa94cd60f25f5cc0807602a571",
      query:
        most_recent_unique_detections[speciesCode[species]].latitude +
        "," +
        most_recent_unique_detections[speciesCode[species]].longitude,
      output: "json",
      limit: 1,
    },
  }).done(function (Data) {
    document.getElementById("overlayText").innerHTML =
      "<h1>" +
      species +
      "</h1>" +
      speciesOverlay[species] +
      "<img src='.img/" +
      species +
      ".png' alt='" +
      species +
      "' width='500' height='400' style='border-radius: 50%;'> <br><br> <h5> <b>Most recent Detection:  </b>" +
      new Date(
        most_recent_unique_detections[speciesCode[species]].time
      ).toLocaleString("en-US") +
      "<br> <b> Coordinates of Detection: </b> [ " +
      most_recent_unique_detections[speciesCode[species]].latitude +
      " , " +
      most_recent_unique_detections[speciesCode[species]].longitude +
      "]<br> <b>Region of Detection:</b> " +
      Data.data[0].region +
      "</h5>";
  });

  document.getElementById("overlay").style.display = "block";
  console.log(species);
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

most_recent_unique_detections;
