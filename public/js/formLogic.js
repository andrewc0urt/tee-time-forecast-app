// Form logic to ensure the user either enters a valid zip code OR a city AND state
const zipCodeInput = document.querySelector("#zipCode");
const cityInput = document.querySelector("#city");
const stateSelect = document.querySelector("#state");
const submitButton = document.querySelector("#submit-button");

// initiall disable the submit button
submitButton.disabled = true;

// event listener to enable the submit button if the user has entered a 5-digit zip code
zipCodeInput.addEventListener("input", (event) => {
	if (zipCodeInput.value === "" || zipCodeInput.value.length < 5) {
		cityInput.required = true;
		stateSelect.required = true;
		submitButton.disabled = true;
	}

	// require the city input and state input
	else {
		cityInput.required = false;
		stateSelect.required = false;
		submitButton.disabled = false;
	}
});

// event listener for user adding input to the city field (step 1 of 2 for enabling button)
cityInput.addEventListener("input", () => {
	if (cityInput.value === "" || stateSelect.value === "") {
		zipCodeInput.required = true;
		submitButton.disabled = true;
	} else {
		zipCodeInput.required = false;
		submitButton.disabled = false;
	}
});

// event listener for user selecting a state in the state field (step 2 of 2 for enabling button)
stateSelect.addEventListener("change", () => {
	if (cityInput.value === "" || stateSelect.value === "") {
		zipCodeInput.required = true;
		submitButton.disabled = true;
	} else {
		zipCodeInput.required = false;
		submitButton.disabled = false;
	}
});
