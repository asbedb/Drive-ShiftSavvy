// js/api/fuelEconomyApi.js
import { parseXML, parseXMLToArray } from "../utils/domParser.js";

const CORS_PROXY_URL = "http://localhost:8080/";
const BASE_API_URL = "https://www.fueleconomy.gov/ws/rest/vehicle";

export async function fetchData(endpoint) {
  try {
    //add ${CORS_PROXY_URL} prior to ${endpoint} for burl cases
    const url = `${CORS_PROXY_URL}${endpoint}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        //ensure your origin is correctly set
        // 'Origin': 'http://asbedb.github.io/Drive-ShiftSavvy/',
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function buildEndpoint(type, params = {}) {
  switch (type) {
    case "years":
      return `${BASE_API_URL}/menu/year`;
    case "makes":
      if (!params.year) throw new Error("Year is required for fetching makes.");
      return `${BASE_API_URL}/menu/make?year=${params.year}`;
    case "models":
      if (!params.year || !params.make)
        throw new Error("Year and Make are required for fetching models.");
      return `${BASE_API_URL}/menu/model?year=${params.year}&make=${params.make}`;
    case "variants":
      if (!params.year || !params.make || !params.model)
        throw new Error(
          "Year, Make, and Model are required for fetching variants."
        );
      return `${BASE_API_URL}/menu/options?year=${params.year}&make=${params.make}&model=${params.model}`;
    case "details":
      if (!params.variantId)
        throw new Error("Variant ID is required for fetching vehicle details.");
      return `${BASE_API_URL}/${params.variantId}`;
    default:
      throw new Error(`Unknown API request type: ${type}`);
  }
}

export async function getVehicleData(type, params = {}) {
  try {
    const endpoint = buildEndpoint(type, params);
    const xmlString = await fetchData(endpoint);
    if (!xmlString) return null; // Or return an empty array if type is a list
    const xmlDoc = parseXML(xmlString);
    if (type === "details") {
      try {
        const make = xmlDoc.querySelector("make")?.textContent;
        const model = xmlDoc.querySelector("model")?.textContent;
        const year = xmlDoc.querySelector("year")?.textContent;
        const variant = xmlDoc.querySelector("trany")?.textContent; // 'trany' often means transmission
        const fuelType = xmlDoc.querySelector("fuelType")?.textContent;
        const cylinders = xmlDoc.querySelector("cylinders")?.textContent;
        const cityMPG = xmlDoc.querySelector("city08")?.textContent;
        return {
          make: make,
          model: model,
          year: year,
          variant: variant,
          fuelType: fuelType,
          cylinders: cylinders,
          cityMPG: parseFloat(cityMPG), // Convert to number
        };
      } catch (error) {
        console.error(
          `Error parsing vehicle details for type '${type}':`,
          error
        );
        return null;
      }
    } else {
      const tagName = "menuItem";
      return parseXMLToArray(xmlDoc, tagName);
    }
  } catch (error) {
    console.error(
      `Error in getFuelEconomyData for type '${type}':`,
      error.message
    );
    return null; // Ensure a null return on any processing error
  }
}


async function handleSelectCar() {
  const selectedVariant = variantSelect.value;
  if (selectedVariant) {
    const endpoint = `${BASE_API_URL}${selectedVariant}`;
    const xmlString = await fetchData(endpoint);
    const xmlDoc = parseXML(xmlString);
    const make = xmlDoc.querySelector("make").textContent;
    const model = xmlDoc.querySelector("model").textContent;
    const year = xmlDoc.querySelector("year").textContent;
    const variant = xmlDoc.querySelector("trany").textContent;
    const fueltype = xmlDoc.querySelector("fuelType").textContent;
    const cylinders = xmlDoc.querySelector("cylinders").textContent;
    let cityMPG = xmlDoc.querySelector("city08").textContent;
    cityMPG = parseInt(cityMPG, 10).toFixed(2);

    if (measureSelectDistance.value == "KPL") {
      cityMPG = parseInt(cityMPG / 2.352, 10);
      cityMPG = cityMPG.toFixed(2);
    }

    carSection.innerHTML = `
            <h3>Your Selected Car:</strong> ${year} ${make} ${model} ${variant}</h3>
            <p><strong>Fuel Type:</strong> ${fueltype}<br>
            <strong>Cylinders:</strong> V${cylinders}<br>
            <strong>${measureSelectDistance.value} (City Driving):</strong> ${cityMPG}<br>
            <button id="reset" type="button">Reset</button>
            `;
    document.getElementById("reset").addEventListener("click", reload);
    return cityMPG;
  } else {
    console.log(variantSelect.value);
    alert("Please Update Car Details");
  }
}
