/* 
This was my first passion project and initially was committed as one file.
I revisit it every so often and refactor based on new knowledge/design skills. 

29/05/2025 - Currently refactoring this to match a broader system design pattern with components broken up. 

*/

//js/main.js - the main entry point for our application.
import { getVehicleData } from "./api/fuelEconomyApi.js";
import {
  yearSelect,
  makeSelect,
  modelSelect,
  variantSelect,
  measureSelectDistance,
  carSection,
  carSelectButton,
  simulateButton,
  hoursLabel,
  breakLabel,
  faresLabel,
  distanceLabel,
  grossLabel,
  expenseLabel,
  netLabel,
  shiftStartInput,
  shiftEndInput,
  shiftBreakInput,
  shiftTypeInput,
  shiftDayInput,
  shiftUnitInput,
  fuelPriceInput,
} from "./constants/selectors.js";
import {
  calculateShiftHours,
  shiftEstimates,
  calculateDistanceFuelandProfits,
} from "./services/calculator.js";

document.addEventListener("DOMContentLoaded", function () {
  async function populateYearDropDown() {
    const years = await getVehicleData("years");
    if (years) {
      yearSelect.innerHTML = '<option value="">Select a Year</option>';
      years.forEach((year) => {
        yearSelect.innerHTML += `<option value="${year.value}">${year.text}</option>`;
      });
    } else {
      console.error("Failed to load years.");
    }
  }

  async function populateMakeDropDown(year) {
    makeSelect.innerHTML = '<option value="">Select a Make</option>';
    modelSelect.innerHTML = '<option value="">Select a Model</option>';
    variantSelect.innerHTML = '<option value="">Select a Variant</option>';
    if (!year) return;

    const makes = await getVehicleData("makes", { year });
    if (makes) {
      makes.forEach((make) => {
        makeSelect.innerHTML += `<option value="${make.value}">${make.text}</option>`;
      });
    } else {
      console.error(`Failed to load makes for year ${year}.`);
      alert(`Error loading makes for ${year}. Please try again.`);
    }
  }

  async function populateModelDropDown(make, year) {
    modelSelect.innerHTML = '<option value="">Select a Model</option>';
    variantSelect.innerHTML = '<option value="">Select a Variant</option>';
    if (!make || !year) return;
    const models = await getVehicleData("models", { make, year });
    if (models) {
      models.forEach((model) => {
        modelSelect.innerHTML += `<option value ="${model.value}">${model.text}</option>`;
      });
    }
  }

  async function populateVariantDropDown(model, make, year) {
    variantSelect.innerHTML = '<option value="">Select a Variant</option>';
    if (!model || !make || !year) return;
    const variants = await getVehicleData("variants", { model, make, year });
    if (variants) {
      variants.forEach((variant) => {
        variantSelect.innerHTML += `<option value="${variant.value}">${variant.text}</option>`;
      });
    }
  }

  async function handleSelectCar() {
    const selectedVariantID = variantSelect.value;
    if (!selectedVariantID) {
      alert("Please select a vehicle variant.");
      return null;
    }

    const vehicleDetails = await getVehicleData("details", {
      variantId: selectedVariantID,
    });
    if (vehicleDetails) {
      let cityMPG = vehicleDetails.cityMPG;
      if (measureSelectDistance.value === "KPL") {
        cityMPG = (cityMPG / 2.352).toFixed(2);
      } else {
        cityMPG = cityMPG.toFixed(2);
      }
      carSection.innerHTML = `
                <h3>Your Selected Car:</strong> ${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model} ${vehicleDetails.variant}</h3>
                <p><strong>Fuel Type:</strong> ${vehicleDetails.fuelType}<br>
                <strong>Cylinders:</strong> V${vehicleDetails.cylinders}<br>
                <strong>${measureSelectDistance.value} (City Driving):</strong> ${cityMPG}<br>
                <button id="reset" type="button">Reset</button>
            `;
      const resetButton = document.getElementById("reset");
      if (resetButton) {
        resetButton.addEventListener("click", () => location.reload());
      } else {
        console.error("Reset button not found after rendering car details.");
      }
      return parseFloat(cityMPG);
    } else {
      alert("Failed to retrieve car details. Please try again.");
      return null;
    }
  }

  function simulateShift(
    grossIncome,
    netIncome,
    fuelExpense,
    totalJobs,
    totalDistance,
    shiftHours,
    shiftBreak,
    distanceUnit
  ) {
    hoursLabel.innerText = shiftHours;
    breakLabel.innerText = shiftBreak;
    faresLabel.innerText = totalJobs;
    distanceLabel.innerText = totalDistance + " " + distanceUnit;
    grossLabel.innerText = grossIncome;
    expenseLabel.innerText = fuelExpense;
    netLabel.innerText = netIncome;
    grossLabel.classList.add("profit");
    expenseLabel.classList.add("loss");
    netIncome <= 0
      ? netLabel.classList.add("loss")
      : netLabel.classList.add("profit");
  }

  //make a save functionality
  function saveDetails() {
    //TO-DO Next
  }

  simulateButton.addEventListener("click", async () => {
    const rangeOutput = await handleSelectCar();
    if (rangeOutput !== null) {
      const shiftHours = calculateShiftHours(
        shiftStartInput.value,
        shiftEndInput.value,
        shiftBreakInput.value
      );
      const { jobsPerHour, distancePerJobMiles, payperJob } = shiftEstimates(
        shiftTypeInput.value
      );
      const shiftBreak = shiftBreakInput.value;
      if (
        shiftHours !== null &&
        shiftBreak !== null &&
        jobsPerHour !== null &&
        distancePerJobMiles !== null &&
        payperJob !== null
      ) {
        // Calculate distance, fuel, and profits
        const {
          grossIncome,
          netIncome,
          fuelExpense,
          totalJobs,
          totalDistance,
          distanceUnit,
        } = calculateDistanceFuelandProfits(
          rangeOutput,
          shiftHours.hours,
          shiftBreak,
          jobsPerHour,
          distancePerJobMiles,
          payperJob,
          fuelPriceInput.value,
          shiftDayInput.value,
          shiftUnitInput.value
        );
        simulateShift(
          grossIncome,
          netIncome,
          fuelExpense,
          totalJobs,
          totalDistance,
          shiftHours.hours,
          shiftBreak,
          distanceUnit
        );
      } else {
        alert("Something Went Wrong - Please Try Again");
        console.log(error);
      }
    }
  });

  carSelectButton.addEventListener("click", handleSelectCar);

  // Populate vehicle years on page load
  populateYearDropDown();

  // Event listeners to handle user selections
  yearSelect.addEventListener("change", (event) => {
    const selectedYear = event.target.value;
    populateMakeDropDown(selectedYear);
  });

  makeSelect.addEventListener("change", (event) => {
    const selectedMake = event.target.value;
    const selectedYear = yearSelect.value;
    populateModelDropDown(selectedMake, selectedYear);
  });

  modelSelect.addEventListener("change", (event) => {
    const selectedModel = event.target.value;
    const selectedMake = makeSelect.value;
    const selectedYear = yearSelect.value;
    populateVariantDropDown(selectedModel, selectedMake, selectedYear);
  });
});
