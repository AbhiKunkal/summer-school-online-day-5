document.addEventListener("DOMContentLoaded", () => {
  const getWeatherBtn = document.getElementById("getWeather");
  const searchBtn = document.getElementById("searchWeather");
  const locationInput = document.getElementById("location-input");
  const weatherBox = document.getElementById("weather");
  const loader = document.getElementById("loader");
  const iconImg = document.getElementById("weather-icon");
  const unitToggle = document.getElementById("unit-toggle");

  if (!getWeatherBtn || !searchBtn || !locationInput || !weatherBox || !loader || !iconImg || !unitToggle) {
    console.error("Missing one or more DOM elements.");
    return;
  }

  const apiKey = "f086011503764459bc1100730250707";

  function displayWeather(data) {
    const city = data.location.name;
    const region = data.location.region;
    const tempC = data.current.temp_c;
    const tempF = data.current.temp_f;
    const condition = data.current.condition.text;
    const iconUrl = `https:${data.current.condition.icon}`;

    const result = { city, region, tempC, tempF, condition, iconUrl };
    localStorage.setItem("lastWeather", JSON.stringify(result));

    const temp = unitToggle.checked ? `${tempF}°F` : `${tempC}°C`;

    weatherBox.innerHTML = `
      <p><strong>${city}, ${region}</strong></p>
      <p>${temp}, ${condition}</p>
    `;

    iconImg.src = iconUrl;
    iconImg.style.display = "block";
  }

  getWeatherBtn.addEventListener("click", () => {
    weatherBox.innerHTML = "";
    iconImg.style.display = "none";
    loader.style.display = "block";

    if (!navigator.geolocation) {
      loader.style.display = "none";
      weatherBox.innerHTML = "Geolocation is not supported by your browser.";
      return;
    }

    navigator.geolocation.getCurrentPosition(success, error);

    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          loader.style.display = "none";
          if (data.error) {
            weatherBox.innerHTML = `Error: ${data.error.message}`;
            return;
          }
          displayWeather(data);
        })
        .catch(() => {
          loader.style.display = "none";
          weatherBox.innerHTML = "Failed to fetch weather data.";
        });
    }

    function error() {
      loader.style.display = "none";
      weatherBox.innerHTML = "Location permission denied.";
    }
  });

  searchBtn.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (!location) return;

    weatherBox.innerHTML = "";
    iconImg.style.display = "none";
    loader.style.display = "block";

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        loader.style.display = "none";
        if (data.error) {
          weatherBox.innerHTML = `Error: ${data.error.message}`;
          return;
        }
        displayWeather(data);
      })
      .catch(() => {
        loader.style.display = "none";
        weatherBox.innerHTML = "Failed to fetch weather data.";
      });
  });

  unitToggle.addEventListener("change", () => {
    const stored = localStorage.getItem("lastWeather");
    if (!stored) return;

    const data = JSON.parse(stored);
    const temp = unitToggle.checked ? `${data.tempF}°F` : `${data.tempC}°C`;

    weatherBox.innerHTML = `
      <p><strong>${data.city}, ${data.region}</strong></p>
      <p>${temp}, ${data.condition}</p>
    `;

    iconImg.src = data.iconUrl;
    iconImg.style.display = "block";
  });
});




