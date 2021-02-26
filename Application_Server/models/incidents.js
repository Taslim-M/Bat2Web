var mongoose = require('mongoose');

var incidentSchema = new mongoose.Schema({
    bat_species: {type: String,  required: true},
    time: {type: Date,  required: true},
    location: {lat: Number, lng: Number}
});

module.exports = mongoose.model("Incident", incidentSchema);