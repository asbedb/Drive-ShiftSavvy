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
} from "./constants/selectors.js";

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
      // Assuming 'reload' is a global or imported helper function
      document
        .getElementById("reset")
        .addEventListener("click", () => location.reload()); // Use location.reload() for full page reload
      return parseFloat(cityMPG); // Return parsed float
    } else {
      alert("Failed to retrieve car details. Please try again.");
      return null;
    }
  }

  function calculateShiftHours() {
    const shiftStart = document.getElementById("shift-start").value;
    const shiftEnd = document.getElementById("shift-end").value;
    let shiftBreak = document.getElementById("shift-break").value;
    if (!shiftStart || !shiftEnd) {
      alert("Please Enter a Shift Start and End Time");
      console.log("Shift Start:", shiftStart);
      console.log("Shift End:", shiftEnd);
    } else {
      const start = new Date(`1970-01-01T${shiftStart}:00`);
      const end = new Date(`1970-01-01T${shiftEnd}:00`);
      let difference = end - start;
      if (difference < 0) {
        difference += 24 * 60 * 60 * 1000;
      }
      let shiftHours = difference / (1000 * 60 * 60);
      if (
        (shiftHours >= 8 && shiftBreak < 30) ||
        (shiftHours >= 16 && shiftBreak < 60)
      ) {
        shiftBreak = Math.floor(shiftHours / 7.5) * 30;
      }
      shiftHours = Math.round(shiftHours);
      return { shiftHours, shiftBreak };
    }
  }

  function shiftTypeFunction() {
    const shiftType = document.getElementById("shift-type").value;
    let jobsPerHour;
    let distancePerJobMiles;
    let payperJob;
    //Type of Shift checker
    if (shiftType == "rideshare") {
      jobsPerHour = 0.9;
      distancePerJobMiles = 6.2;
      payperJob = 30.5;
    } else if (shiftType == "food-delivery") {
      jobsPerHour = 1.5;
      distancePerJobMiles = 3.1;
      payperJob = 15.0;
    }
    console.log(jobsPerHour + " " + distancePerJobMiles + " " + payperJob);
    return {
      jobsPerHour,
      distancePerJobMiles,
      payperJob,
    };
  }

  function calculateDistanceFuelandProfits(
    rangeOutput,
    shiftHours,
    shiftBreak,
    jobsPerHour,
    distancePerJobMiles,
    payperJob
  ) {
    const fuelPrice = document.getElementById("shift-fuel").value;
    const shiftDay = document.getElementById("shift-day").value;
    const shiftUnit = document.getElementById("shift-unit").value;
    let totalDistance = 0;
    let distanceUnit = "Mi";
    let totalJobs = Math.round((shiftHours - shiftBreak / 60) * jobsPerHour);
    //Rate Multipliers
    if (shiftDay === "weekend-rate") {
      totalJobs *= 1.25;
      payperJob *= 1.25;
    }
    //Unit Conversions
    if (shiftUnit === "unit-kilometers") {
      totalDistance = totalJobs * distancePerJobMiles * 1.609;
      distanceUnit = "Km";
    } else {
      totalDistance = totalJobs * distancePerJobMiles;
      distanceUnit = "Mi";
    }
    const fuelExpense = (totalDistance / rangeOutput) * fuelPrice;
    const grossIncome = totalJobs * payperJob;
    const netIncome = grossIncome - fuelExpense;
    return {
      grossIncome: grossIncome.toFixed(2),
      netIncome: netIncome.toFixed(2),
      fuelExpense: fuelExpense.toFixed(2),
      totalJobs,
      totalDistance: totalDistance.toFixed(2),
      distanceUnit,
    };
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
      const { shiftHours, shiftBreak } = calculateShiftHours();
      const { jobsPerHour, distancePerJobMiles, payperJob } =
        shiftTypeFunction();
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
          shiftHours,
          shiftBreak,
          jobsPerHour,
          distancePerJobMiles,
          payperJob
        );
        simulateShift(
          grossIncome,
          netIncome,
          fuelExpense,
          totalJobs,
          totalDistance,
          shiftHours,
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
