const currentWeatherConditionsData = JSON.parse(
	document.currentScript.dataset.currentWeatherConditionsData
);
const weatherForecastData = JSON.parse(document.currentScript.dataset.weatherForecast);

console.log(weatherForecastData);

// access the section element that holds the current weather conditions information
const currentWeatherContainer = document.querySelector(".item-3");

try {
	// if it's currently night time, make the background image of the current conditions the night.jpg image
	if (!weatherForecastData.properties.periods[0].isDaytime) {
		currentWeatherContainer.style.backgroundImage =
			"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/night.jpg')";
	}

	// it's daytime...make the background image correspond to the current weather conditions
	else {
		// Use a switch statement where each case is the icon key for the OpenWeather API weather icons
		switch (currentWeatherConditionsData.weather[0].icon) {
			case "01d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/sunnyClear.jpg')";
				break;

			case "02d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/partlyCloudy.jpg')";
				break;

			case "03d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/cloudy.jpg')";
				break;

			case "04d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/cloudy.jpg')";
				break;

			case "09d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/raining.jpg')";
				break;

			case "10d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/raining.jpg')";
				break;

			case "11d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/thunderstorm.jpg')";
				break;

			case "13d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/snowing.jpg')";
				break;

			case "50d":
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/snowing.jpg')";
				break;

			// if for some reason there are no images that match the current conditions, display the sunnyclear as the background image
			default:
				currentWeatherContainer.style.backgroundImage =
					"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/sunnyClear.jpg')";
				break;
		}
	}
} catch (error) {
	console.error("Error setting background image:", error);
	currentWeatherContainer.style.backgroundImage =
		"linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../images/weather/sunnyClear.jpg')";
}
