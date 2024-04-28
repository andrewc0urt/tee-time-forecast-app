const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

// Load the GeoApify API Key in the .env file
require("dotenv").config();
const geoAPIKey = process.env.GEOAPIFY_API_KEY;
const openWeatherAPIKey = process.env.OPENWEATHER_API_KEY;

// Define a fetchWeatherData function to make multiple API calls to the National Weather Service API and then the OpenWeather API
async function fetchWeatherData(latitude, longitude) {
	try {
		// First, make an API call to the National Weather Service to get the metatdata for a given latitude/longitude point; This will contain the URL needed to get the multiday weather forecast for the area
		const nationalWeatherServiceAPI = `https://api.weather.gov/points/${latitude},${longitude}`;
		const response1 = await axios.get(nationalWeatherServiceAPI);
		const weatherMetadata = response1.data;

		console.log(`Weather API URL: ${nationalWeatherServiceAPI}`);
		console.log(`Weather Metadata: ${weatherMetadata}`);

		// Extract the URL used to get the multiday weather forecast and the URL to be used to get the local weather station code (which will then be used to get the current weather data)
		const forecastURL = weatherMetadata.properties.forecast;
		const allObservationStationsURL = weatherMetadata.properties.observationStations;

		console.log(`Forecast URL: ${forecastURL}`);
		console.log(`All Stations URL: ${allObservationStationsURL}`);

		// Make the second API call to get the closest (in proximity) observation station URL
		const response2 = await axios.get(allObservationStationsURL);
		const allStationsData = response2.data;

		console.log(`All Stations Data: ${allStationsData}`);

		// Extract the first observation station URL (meaning it's the closest in proxmity to user's location)
		const currentWeatherURL = allStationsData.observationStations[0];
		console.log(`Current Weather URL: ${currentWeatherURL}`);

		// Make the third API call to get the CURRENT weather from National Weather Service
		const response3 = await axios.get(`${currentWeatherURL}/observations/latest`);
		const currentWeatherData = response3.data;

		console.log(`Current Weather Daa: ${currentWeatherData}`);

		// Make the FOURTH API call to get the multiday weather forecast from National Weather Service
		const response4 = await axios.get(forecastURL);
		const forecastData = response4.data;

		console.log(`Future Forecast Data: ${forecastData}`);

		// OpenWeather API - To get better CURRENT weather data
		const openWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherAPIKey}&units=imperial`;

		// API call to OpeanWeather API to get the current weather data
		const response5 = await axios.get(openWeatherAPI);
		const currentWeatherConditionsData = response5.data;
		console.log("THIS IS THE NEWWW INFO");
		console.log(currentWeatherConditionsData);

		// Return all necessary weather data
		return { currentWeatherData, forecastData, currentWeatherConditionsData };
	} catch (error) {
		// Handle any errors for the API calls
		console.error("Error fetching data:", error.message);
		throw error;
	}
}

// tell the app to use EJS (Embedded JavaScript) framework by setting the view enging to ejs
app.set("view engine", "ejs");

// configure Express to use a specific directory to locate the view templates
app.set("views", path.join(__dirname, "/views"));

// serve the css stylesheet and other static files by using the absolute path of the direcotry that is to be served
app.use(express.static(path.join(__dirname, "public")));

// for parsing application/json
app.use(express.json());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

let latitude;
let longitude;
// Access the Weather Channel API
const nationalWeatherServiceAPI = `https://api.weather.gov/points/${latitude},${longitude}`;

// GET route - Homepage
app.get("/", (req, res) => {
	res.render("homepage");
});

// GET route - API call for search results
app.get("/search", async (req, res) => {
	let { city, state, zipCode, formatted } = req.query;

	// convert the city to title case to ensure it matches the Geoapify response values
	// Convert the city to title case to ensure it matches the Geoapify response values
	// const formattedCity = (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

	// Define the formattedCity function so that all cities entered by a user in the form are converted to title case, including cities with multiple words (i.e. "jefferson city" --> "Jefferson City")
	function titleCaseCityInput(someCity) {
		// Split the city string by spaces
		const words = someCity.split(" ");

		// Capitalize the first letter of each word
		const capitalizedWords = words.map(
			(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
		);

		// Join the capitalized words back together
		const formattedCity = capitalizedWords.join(" ");
		console.log(`FORMATTED CITY: ${formattedCity}`);

		return formattedCity;
	}
	city = titleCaseCityInput(city);

	try {
		// declare variables for the api url and it's required paramaters
		let apiURL;
		let queryParams;

		// if the user submitted a city and state through the form
		if (city && state) {
			apiURL = "https://api.geoapify.com/v1/geocode/search";
			queryParams = `text=${city}%2C%20${state}`;
		}

		// if the user submitted the zip code
		else if (zipCode) {
			apiURL = "https://api.geoapify.com/v1/geocode/search";
			queryParams = `text=${zipCode}`;
		} else {
			return res.status(400).send("Bad Request. Please try again!");
		}

		const response = await axios.get(`${apiURL}?${queryParams}&format=json&apiKey=${geoAPIKey}`);

		// response object
		const results = response.data.results;
		// console.log(results);

		// Check to see if the API call returned any results
		if (results.length === 0) {
			res.status(404).send("No results found. Please try again.");
		}

		// Check to see if the first result's city and state match the user's input
		const firstResult = results[0];

		// Check to ensure that firstResult object contains a city and state
		// if (city && state) {
		// 	// Check if either the city or the name matches the user input
		// 	// firstResult should have either a city property or a name property (i.e. Keystone, CO --> has a name property, but not city property)
		// 	if (
		// 		(firstResult.city && firstResult.city !== city) ||
		// 		(!firstResult.city && firstResult.name !== city)
		// 	) {
		// 		return res
		// 			.status(404)
		// 			.send("Sorry! No results were found matching your city and/or state.");
		// 	}

		// 	// Check if the state code is a match to the user input
		// 	if (firstResult.state_code !== state) {
		// 		return res
		// 			.status(404)
		// 			.send("Sorry! No results were found matching your city and/or state.");
		// 	}
		// }

		// if the user doesn't submit a zip code and chooses to submit a city/state, check to make sure the returned result matches the state code
		if (!zipCode) {
			// Check if the state code is a match to the user input
			if (firstResult.state_code !== state) {
				return res
					.status(404)
					.send("Sorry! No results were found matching your city and/or state.");
			}
		}
		// // Check if the state code is a match to the user input
		// if (firstResult.state_code !== state) {
		// 	return res.status(404).send("Sorry! No results were found matching your city and/or state.");
		// }

		// Otherwise, a match has been found, proceed with processing the results
		console.log(firstResult.lon);
		console.log(firstResult.lat);
		// console.log(firstResult.city);
		// console.log(firstResult.state);
		console.log(firstResult.formatted);

		console.log(firstResult);

		// Call fetchWeatherData here, passing latitude and longitude
		const { currentWeatherData, forecastData, currentWeatherConditionsData } =
			await fetchWeatherData(firstResult.lat, firstResult.lon);

		console.log("-------------INFO BELOW ----------------");
		console.log(currentWeatherData);
		console.log("----------------------------");
		console.log(forecastData);
		console.log(forecastData.properties.periods[0]);
		if (forecastData.properties.periods[0].isDaytime) {
			console.log("Daytime is true");
		} else {
			console.log("Day time is false");
		}

		// Weather Condition Object - holds path to weather condition icon based on the currentWeatherConditionsData.weather[0].icon in the OpenWeather API response json object

		const weatherConditions = {
			"01d": "images/weather/day/sunny.svg",
			"01n": "images/weather/night/night.svg",

			"02d": "images/weather/day/partlyCloudy.svg",
			"02n": "images/weather/night/night.svg",

			"03d": "images/weather/day/cloudy.svg",
			"03n": "images/weather/night/cloudy.svg",

			"04d": "images/weather/day/cloudy.svg",
			"04n": "images/weather/night/cloudy.svg",

			"09d": "images/weather/day/rainShowers.svg",
			"09n": "public/images/weather/night/nightRainShowers.svg",

			"10d": "images/weather/day/rain.svg",
			"10d": "images/weather/day/rain.svg",

			"11d": "images/weather/day/thunderstorm.svg",
			"11n": "images/weather/night/thunderstorm.svg",

			"13d": "images/weather/day/snow.svg",
			"13n": "images/weather/night/snow.svg",

			"50d": "images/weather/day/snow.svg",
			"50n": "images/weather/night/snow.svg",
		};

		console.log(weatherConditions);
		console.log("-----------------------");
		console.log(weatherConditions[currentWeatherConditionsData.weather[0].main]);

		// Display the info
		// res.send("Found a result!!!");
		res.render("searchResults", {
			firstResult,
			currentWeatherData,
			forecastData,
			currentWeatherConditionsData,
			weatherConditions,
		});
	} catch (error) {
		// Some internal server error has occurred
		console.log(`Error: ${error}`);
		res.status(500).send("Internal server error. Please wait a moment and try again.");
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Tee Time Forecast app listening on port ${port}`);
});
