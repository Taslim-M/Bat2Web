var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  querystring = require("querystring"),
  Incident = require("./models/incidents"),
  seedDb = require("./seeds");

mongoose.connect("mongodb://localhost:27017/bat_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

seedDb();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
  const incidents = await Incident.find({}).sort({ time: "desc" }).limit(30);
  res.render("index", { incidents: incidents });
});

app.get("/filter", async function (req, res) {
  let sp_name = req.query.species_name;
  let from_date_str = req.query.from_date;
  let to_date_str = req.query.to_date;
  let num_detections =
    req.query.num_detections != "" ? parseInt(req.query.num_detections) : 15;

  var from_date = new Date(2020, 02, 23); //oldest possible date
  var to_date = new Date(Date.now());
  //replace dates if given
  if (from_date_str) from_date = new Date(from_date_str);
  if (to_date_str) to_date = new Date(to_date_str);

  console.log(sp_name);
  console.log(from_date);
  console.log(to_date);

  const incidents = await Incident.find({
    bat_species: sp_name,
    time: {
      $gte: from_date,
      $lt: to_date,
    },
  })
    .sort({ time: "desc" })
    .limit(num_detections);
  msg =
    "Showing " +
    incidents.length +
    " results for " +
    sp_name +
    " from " +
    from_date.toDateString() +
    " to " +
    to_date.toDateString();
  res.render("index", { incidents: incidents, msg: msg });
});

app.get("/about-us", async function (req, res) {
  res.render("about-us");
});

app.get("/dashboard", async function (req, res) {
  // -------------- Dashboard Panels data
  let total_counts = await Incident.countDocuments({});

  let most_recent_detection = await Incident.find({})
    .sort({ time: "desc" })
    .limit(1);

  let unique_species_count = await Incident.distinct("bat_species");
  // --------------- Pie chart data
  let pie_counts = await Incident.aggregate([
    {
      $group: {
        _id: "$bat_species",
        count: { $sum: 1 },
      },
    },
  ]);

  // --------------- Bar chart data
  let counts_by_species_and_month = await Incident.aggregate([
    {
      $group: {
        _id: { month: { $month: "$time" }, bat_species: "$bat_species" },
        count: { $sum: 1 },
      },
    },
  ]);

  //Restructuring data serverside to fit Plotly reqs
  bar_counts = {};
  for (let record of counts_by_species_and_month) {
    if (bar_counts[record._id.bat_species] == null) {
      bar_counts[record._id.bat_species] = {
        counts: new Array(12).fill(0),
      };
    } else {
      bar_counts[record._id.bat_species].counts[record._id.month - 1] =
        record.count;
    }
  }

  // ----- Histogram data
  let all_detections = await Incident.find({});
  //Restructuring data serverside to fit Plotly reqs
  //Final structure: { <speciesName> : [ <dateOfDetection1>, ... ], ... }
  let all_dates_by_species = {};
  for (let detection of all_detections) {
    if (all_dates_by_species[detection.bat_species] == null) {
      all_dates_by_species[detection.bat_species] = [detection.time];
    } else {
      all_dates_by_species[detection.bat_species].push(detection.time);
    }
  }

  // ----- Time series data

  //Query for total detections per day
  let count_by_day = await Incident.aggregate([
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
      },
    },
    {
      $group: {
        _id: { yearMonthDay: "$yearMonthDay" },
        count: { $sum: 1 },
      },
    },
  ]).sort({ "_id.yearMonthDay": "asc" });

  //Query for detections per species per day
  let raw_count_by_day_by_species = await Incident.aggregate([
    {
      $project: {
        yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$time" } },
        bat_species: "$bat_species",
      },
    },
    {
      $group: {
        _id: { yearMonthDay: "$yearMonthDay", bat_species: "$bat_species" },
        count: { $sum: 1 },
      },
    },
  ]).sort({ "_id.yearMonthDay": "asc" });

  //Restructuring data serverside to fit Plotly reqs
  //Final structure: { <speciesName> : { dates: [] , counts : [] }, ...}
  let count_by_day_by_species = {};
  for (let summary of raw_count_by_day_by_species) {
    if (count_by_day_by_species[summary._id.bat_species] == null) {
      count_by_day_by_species[summary._id.bat_species] = {
        dates: [summary._id.yearMonthDay],
        counts: [summary.count],
      };
    } else {
      count_by_day_by_species[summary._id.bat_species].dates.push(
        summary._id.yearMonthDay
      );
      count_by_day_by_species[summary._id.bat_species].counts.push(
        summary.count
      );
    }
  }

  const most_recent_unique_detections = await Promise.all(
    unique_species_count.map(async (x) => {
      detection = await Incident.find({ bat_species: x })
        .sort({ timestamp: -1 })
        .limit(1);
      return detection[0];
    })
  );
  console.log(Array.from(most_recent_unique_detections));
  res.render("dashboard", {
    pie_counts: pie_counts,
    total_counts: total_counts,
    most_recent_detection: most_recent_detection[0],
    bar_counts: bar_counts,
    all_dates: all_dates_by_species,
    count_by_day: count_by_day,
    count_by_day_by_species: count_by_day_by_species,
    unique_species_count: unique_species_count,
    most_recent_unique_detections: most_recent_unique_detections,
  });
});

// custom 404 page
app.use(function (req, res) {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});
//start server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server Started");
});
