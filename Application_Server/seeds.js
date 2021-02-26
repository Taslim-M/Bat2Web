var mongoose = require("mongoose");
var Incident = require("./models/incidents");

var seed_incident = [
    {
        bat_species: "Astetri",
        time: Date.now(),
        location: {lat: 25.3026511, lng:55.4818249}
    },
    {
        bat_species: "H.Alaska",
        time: Date.now(),
        location: {lat: 25.3026512, lng:55.4818259}
    }
];

async function seedDB() {
    try {
        await Incident.remove({});

        for (const seed of seed_incident) {
            let incident = await Incident.create(seed);
            incident.save();
        }
    } catch (err) {
        console.log(err);
    }

};

module.exports = seedDB;