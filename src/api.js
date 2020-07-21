const express = require("express");
const app = express();

app.get("/availableTrains", function(req, res) {
  res.send(["6601", "7801", "6603", "17753"]);
});

app.get("/availableSeats/:trainId", function(req, res) {
  const trainId = req.params.trainId;
  switch (trainId) {
    case "6603":
      res.send({
        seats: [
          { coach: 18, seat: 114 },
          { coach: 18, seat: 115 }
        ]
      });

    case "17753":
      res.send({
        seats: [
          { coach: 7, seat: 11 },
          { coach: 7, seat: 12 }
        ]
      });

    default:
      res.send(null);
  }
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
