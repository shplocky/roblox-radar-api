const express = require("express");
const fetch = require("node-fetch");

const app = express();

let cache = {
  frames: [],
  lastUpdate: 0
};

async function updateRadar() {
  try {
    const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
    const data = await res.json();

    const latest = data.radar.past[data.radar.past.length - 1];

    const frameUrl = `https://tilecache.rainviewer.com/v2/radar/${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;

    cache.frames = [frameUrl];
    cache.lastUpdate = Date.now();

    console.log("Radar updated");
  } catch (err) {
    console.log("Radar error:", err);
  }
}

setInterval(updateRadar, 300000);
updateRadar();

app.get("/radar", (req, res) => {
  res.json(cache);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Radar API running on", PORT);
});
