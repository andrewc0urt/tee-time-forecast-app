// Load the GeoApify API Key in the .env file
require("dotenv").config();
const apiKey = process.env.GEOAPIFY_API_KEY;

console.log(process.env); // remove this

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
app.get("/search", (req, res) => {
	const { city, state, zipCode } = req.query;
	console.log(city);
	console.log(state);
	console.log(zipCode);
	try {
		// Make API request using Axios based on city/state OR zip code entered by user
		if (city && state) {
		} else if (zipCode) {
			const config = {
				method: "get",
				url: `https://api.geoapify.com/v1/geocode/search?text=${zipCode}&format=json&apiKey=${apiKey}`,
				headers: {},
			};

			axios(config)
				.then(function (response) {
					console.log(response.data);
					console.log(response.data.results[0].lon);
					console.log(response.data.results[0].lat);
				})
				.catch(function (error) {
					console.log(error);
				});
		} else {
			// Handle the case where neither
			throw new Error("Please provide either city/state OR zip code.");
		}

		res.send("Results page!");
	} catch (error) {
		console.log("Errorrrrr");
		res.send("ISSUE");
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Tee Time Forecast app listening on port ${port}`);
});
