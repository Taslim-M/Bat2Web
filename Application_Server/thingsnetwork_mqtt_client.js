var ttn = require("ttn")

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/bat_project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var Incident = require("./models/incidents");
//Convert index back to Label
var labels = ['Asellia tridens','Eptesicus bottae','Myotis emarginatus','Pipistrellus kuhli','Rhinopoma muscatellum','Rhyneptesicus nasutus', 'Rousettus aegyptius', 'Taphozous perforatus']

const appID = "esp32-device-bat-proj-2"
const accessKey = "ttn-account-v2.fTZB0y01h3PH4Bg1Pcn-5bu_KqNUEbqwA-Rbx7H80AA"

// discover handler and open mqtt connection
ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", async function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload.payload_fields.ASCII)
      str_arr = payload.payload_fields.ASCII.split(',');
      new_detection_data = {
        "bat_species": labels[str_arr[0]],
        "time": new Date(Date.now()),
        "latitude": str_arr[1],
        "longitude": str_arr[2]
      };
      console.log(new_detection_data);
      var incident = new Incident(new_detection_data);
      incident.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Incident inserted succussfully!");
      });
    })
  })
  .catch(function (error) {
    console.error("Error", error)
    process.exit(1)
  })
