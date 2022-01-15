import clock from "clock";
import document from "document";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { me as appbit } from "appbit";
import { battery } from "power";
import * as weather from "fitbit-weather/app";

clock.granularity = "minutes";

clock.ontick = (evt) => {
  
  let now = evt.date;
  let hours = now.getHours();
  let mins = now.getMinutes();
  if (mins < 10) mins = "0" + mins;  
  document.getElementById("time").text = hours + ":" + mins;
  
  let steps = today.adjusted.steps;
  document.getElementById("steps").text = steps + " steps";

  document.getElementById("battery").text = battery.chargeLevel + " %";

  weather.fetch(30 * 60 * 1000)
  .then(weather => {
    document.getElementById("weather").text = Math.round(weather.temperatureC) + " °C";
    document.getElementById("description").text = weather.description;
  })
  .catch(error => {
    console.log(error) 
  });

}

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    let hr = hrm.heartRate;
    document.getElementById("heart").text = hr + " bpm";
  });
  hrm.addEventListener("error", (error) => {
    console.log(JSON.stringify(error));
  });
  display.addEventListener("change", () => {
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}
