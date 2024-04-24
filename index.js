// Load the GeoApify API Key in the .env file
require("dotenv").config();
const geoAPIKey = process.env.GEOAPIFY_API_KEY;

const axios = require("axios");
const express = require("express");
const app = express();
const port = 3000;

const path = require("path");

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
const weatherAPI = `https://api.weather.gov/points/${latitude},${longitude}`;

// GET route - Homepage
app.get("/", (req, res) => {
	res.render("home");
});

// GET route - API call for search results
app.get("/search", async (req, res) => {
	let { city, state, zipCode } = req.query;

	// convert the city to title case to ensure it matches the Geoapify response values
	// Convert the city to title case to ensure it matches the Geoapify response values
	const formattedCity = (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
	city = formattedCity(city);

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
			res.status(400).send("Bad Request. Please try again!");
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
		if (city && state && (firstResult.city !== city || firstResult.state_code !== state)) {
			res.status(404).send("Sorry! No results were found matching your city and/or state.");
		}

		// Otherwise, a match has been found, proceed with processing the results
		console.log(firstResult.lon);
		console.log(firstResult.lat);
		console.log(firstResult.city);
		console.log(firstResult.state);

		// Display the info
		res.send("Found a result!!!");
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
