var mongoose = require('mongoose');

var incidentSchema = new mongoose.Schema({
    bat_species: {type: String,  required: true},
    time: {type: Date,  required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}
});

module.exports = mongoose.model("Incident", incidentSchema);