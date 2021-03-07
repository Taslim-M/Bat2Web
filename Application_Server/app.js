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
    let num_detections = req.query.num_detections != "" ? parseInt(req.query.num_detections) : 15;

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
    msg = "Showing " +incidents.length +" results for " +sp_name +" from " + from_date.toDateString() + " to " + to_date.toDateString();
    res.render("index", { incidents: incidents, msg:msg });

});
app.get("/about-us", async function (req, res) {
    res.render("about-us");
});
app.get("/dashboard", function (req, res) {
    res.render("dashboard");
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
