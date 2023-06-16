import React, { useCallback, useEffect, useState } from "react";
import classes from "./MainScreen.module.css";
import images from "./images";
import moment from "moment/moment";

const MainScreen = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const getWeatherData = useCallback((location) => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=14ecbdda2c8d4f5c9a1121301231506&q=${location}&days=5&aqi=yes`
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
        {!showInfo && (
          <>
            <div style={{ display: "flex", gap: "10px" }}>
              <img
                src={images?.location}
                alt="location"
                style={{ alignSelf: "center" }}
              />
              {weatherData?.location.name}, {weatherData?.location.region}
            </div>
            <input
              placeholder="Search location"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getWeatherData(e.target.value);
                }
              }}
              style={{ width: "60%" }}
            />
          </>
        )}
      </div>
      <div
        className={`${classes["location-container"]}`}
        onClick={(e) => {
          setShowInfo((prev) => !prev);
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
          {showInfo &&
            `${weatherData?.location.name}, ${weatherData?.location.region}`}
          <div>
            {moment(weatherData?.current.last_updated).format(
              "ddd, DD MMMM YYYY   hh:mm A"
            )}
          </div>
          <div>
            Last Updated:{" "}
            {moment
              .unix(weatherData?.current.last_updated_epoch)
              .format("hh:mm A")}
          </div>
        </div>
        <div></div>
      </div>
      <div className={classes["hour-container"]}>
        <h2>Hourly Weather</h2>
        <div className={classes["hour"]}>
          {weatherData?.forecast.forecastday[0].hour.map((h) => {
            return (
              moment().unix() < h.time_epoch && (
                <div className={classes["hour-single"]}>
                  <img
                    src={h.condition.icon}
                    alt="cloud"
                    style={{ height: "70%", alignSelf: "center" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontSize: "15px",
                      alignSelf: "center",
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>{h.temp_c}º</div>
                    <div style={{ fontSize: "14px" }}>
                      {moment.unix(h.time_epoch).format("hh.mmA")}
                    </div>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      {!showInfo && (
        <div className={classes["days-container"]}>
          <h3>Daily</h3>
          {weatherData?.forecast.forecastday.map((d, index) => {
            if (index === 0) return <></>;
            return (
              <div
                className={`${classes["days"]} ${
                  classes[`${index === 1 ? "next" : ""}`]
                } `}
              >
                <div className={classes["day-weather"]}>
                  <img
                    src={d.day.condition.icon}
                    alt="clouds"
                    style={{ height: "5vh" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingLeft: "10px",
                    }}
                  >
                    <div style={{ fontWeight: "600" }}>
                      {moment.unix(d.date_epoch).format("dddd")}
                    </div>
                    <div style={{ fontSize: "14px" }}>
                      {d.day.condition.text}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "15px" }}>{d.day.avgtemp_c}º C</div>
              </div>
            );
          })}
        </div>
      )}
      {showInfo && (
        <div className={classes["detailed_information"]}>
          <h3> Detailed Information </h3>
          <div className={classes["aqi"]}>
            <img src={images?.loader} alt="loader" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "20px" }}>
                AQI - Very Good
              </div>
              <div style={{ fontSize: "15px" }}>
                The air quality in your area is currently very good. There is no
                air pollution that causes various diseases.
              </div>
            </div>
          </div>
          <div className={classes["extra-info"]}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div className={classes["extra"]}>
                <img src={images?.humidity} alt="" />
                <h3 style={{ paddingLeft: "20px" }}>
                  {weatherData?.current.humidity}%
                </h3>
                <div className={classes["info"]}>Humidity</div>
              </div>
              <div className={classes["extra"]}>
                <img src={images?.velocity} alt="velocity" />
                <h3 style={{ paddingLeft: "20px" }}>
                  {weatherData?.current.wind_kph} km/h
                </h3>
                <div className={classes["info"]}>Wind Velocity</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div className={classes["extra"]}>
                <img src={images?.pressure} alt="pressure" />
                <h3 style={{ paddingLeft: "20px" }}>
                  {weatherData?.current.pressure_mb} hPa
                </h3>
                <div className={classes["info"]}>Pressure</div>
              </div>
              <div className={classes["extra"]}>
                <img src={images?.fog} alt="fog" />
                <h3 style={{ paddingLeft: "20px" }}>
                  {weatherData?.current.cloud}%
                </h3>
                <div className={classes["info"]}>Fog</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainScreen;
