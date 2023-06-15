import React, { useCallback, useEffect, useState } from "react";
import classes from "./MainScreen.module.css";
import images from "./images";
import moment from "moment/moment";
const MainScreen = () => {
  const [weatherData, setWeatherData] = useState(null);

  const getWeatherData = useCallback((location) => {
    fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=14ecbdda2c8d4f5c9a1121301231506&q=${location}&days=5`
    )
      .then((resp) => resp.json())
      .then((response) => {
        if (response.error) {
          navigator.geolocation.getCurrentPosition((position) => {
            getWeatherData(
              `${position.coords.latitude},${position.coords.longitude}`
            );
          });
          return;
        }
        setWeatherData(response);
      });
  }, []);

  useEffect(() => {
    if (!weatherData) {
      navigator.geolocation.getCurrentPosition((position) => {
        getWeatherData(
          `${position.coords.latitude},${position.coords.longitude}`
        );
      });
    }
  }, [getWeatherData, weatherData]);

  return (
    <div className={classes["main-container"]}>
      <div className={classes["header"]}>
        {weatherData?.location.name}, {weatherData?.location.region}
        <input
          placeholder="Search location"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              getWeatherData(e.target.value);
            }
          }}
          style={{ width: "70%" }}
        />
      </div>
      <div
        className={classes["location-container"]}
        onClick={(e) => {
          alert("clicked");
        }}
      >
        <div className={classes["weather-container"]}>
          <img src={weatherData?.current.condition.icon} alt="clouds" />
          <div className={classes["weather"]}>
            <div className={classes["temp"]}>
              {weatherData?.current.feelslike_c}º C
            </div>
            <div className={classes["location"]}>
              {weatherData?.location.name}
            </div>
          </div>
        </div>
        <div className={classes["time"]}>
          <div>
            {moment(weatherData?.current.last_updated).format(
              "ddd, DD MMMM YYYY   hh:mm A"
            )}
          </div>
          <div>
            Last Updated{" "}
            {moment(weatherData?.current.last_updated_epoch).format("hh:mm A")}
          </div>
        </div>
        <div></div>
      </div>
      <div className={classes["hour-container"]}>
        <h2>Hourly Weather</h2>
        <div className={classes["hour"]}>
          {weatherData?.forecast.forecastday[0].hour.map((h) => {
            return (
              <div className={classes["hour-single"]}>
                <img src={h.condition.icon} alt="cloud" />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: "15px",
                    alignSelf: "center",
                  }}
                >
                  <div>{h.temp_c}º</div>
                  <div>{moment.unix(h.time_epoch).format("hh.mmA")}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className={classes["days-container"]}></div>
    </div>
  );
};

export default MainScreen;
