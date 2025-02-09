    /*
              ___.              .______.            .___                /\  _______________   ________    _____  
_____    _____\_ |__   ____   __| _/\_ |__        __| _/_______  __    / /  \_____  \   _  \  \_____  \  /  |  | 
\__  \  /  ___/| __ \_/ __ \ / __ |  | __ \      / __ |/ __ \  \/ /   / /    /  ____/  /_\  \  /  ____/ /   |  |_
 / __ \_\___ \ | \_\ \  ___// /_/ |  | \_\ \    / /_/ \  ___/\   /   / /    /       \  \_/   \/       \/    ^   /
(____  /____  >|___  /\___  >____ |  |___  / /\ \____ |\___  >\_/   / /     \_______ \_____  /\_______ \____   | 
     \/     \/     \/     \/     \/      \/  \/      \/    \/       \/              \/     \/         \/    |__| 
    */

document.addEventListener('DOMContentLoaded', function () {
    // Base URL for your Cross Origin Server parsing prior to API Call (Used for local hosting primarily)
    //const baseUrl = 'http://github.io/'; 

    //base constants for vehicle input form
    const yearSelect = document.getElementById('vehicle-year');
    const makeSelect = document.getElementById('vehicle-make');
    const modelSelect = document.getElementById('vehicle-model');
    const variantSelect = document.getElementById('vehicle-variant');
    const measureSelectDistance = document.getElementById('vehicle-fuel-measurement');
    const carSection = document.getElementById('car-info');
    const carSelectButton = document.getElementById('car-select');
    const simulateButton = document.getElementById('simulate');


    //base variables for simulation labels
    let hoursLabel = document.getElementById('total-hours');
    let breakLabel = document.getElementById('total-breaks');
    let faresLabel = document.getElementById('total-fares');
    let distanceLabel = document.getElementById('total-travel');
    let grossLabel = document.getElementById('total-earnings-gross');
    let expenseLabel = document.getElementById('total-expenses');
    let netLabel =  document.getElementById('total-earnings-net');

    function parseXML(xmlString) {
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, 'text/xml');
    }

    function parseXMLToArray(xmlDoc, tagName) {
        const items = xmlDoc.getElementsByTagName(tagName);
        return Array.from(items).map(item => ({
            value: item.getElementsByTagName('value')[0].textContent,
            text: item.getElementsByTagName('text')[0].textContent
        }));
    }

    //when creating local save reload/reset will delete/reset local save.
    function reload(){
        location.reload();
    }

    //to add a functionality here where it will try local storage first
    async function fetchData(endpoint) {
        try {
            //add ${baseUrl} prior to ${endpoint} for burl cases
            const url = `${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    //ensure your origin is correctly set
                    // 'Origin': 'http://asbedb.github.io/Drive-ShiftSavvy/',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function populateYears() {
        const endpoint = 'https://www.fueleconomy.gov/ws/rest/vehicle/menu/year';
        const xmlString = await fetchData(endpoint);
        const xmlDoc = parseXML(xmlString);
        const years = parseXMLToArray(xmlDoc, 'menuItem');
        yearSelect.innerHTML = '<option value="">Select a Year</option>';
        years.forEach(year => {
            yearSelect.innerHTML += `<option value="${year.value}">${year.text}</option>`;
        });
    }

    async function populateMakes(year) {
        const endpoint = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/make?year=${year}`;
        const xmlString = await fetchData(endpoint);
        const xmlDoc = parseXML(xmlString);
        const makes = parseXMLToArray(xmlDoc, 'menuItem');
        makeSelect.innerHTML = '<option value="">Select a Make</option>';
        makes.forEach(make => {
            makeSelect.innerHTML += `<option value="${make.value}">${make.text}</option>`;
        });
        modelSelect.innerHTML = '<option value="">Select a Model</option>';
        variantSelect.innerHTML = '<option value="">Select a Variant</option>';
    }

    async function populateModels(make, year) {
        const endpoint = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/model?year=${year}&make=${make}`;
        const xmlString = await fetchData(endpoint);
        const xmlDoc = parseXML(xmlString);
        const models = parseXMLToArray(xmlDoc, 'menuItem');
        modelSelect.innerHTML = '<option value="">Select a Model</option>';
        models.forEach(model => {
            modelSelect.innerHTML += `<option value="${model.value}">${model.text}</option>`;
        });
        variantSelect.innerHTML = '<option value="">Select a Variant</option>';
    }

    
    async function populateVariants(model, make, year) {
        const endpoint = `https://www.fueleconomy.gov/ws/rest/vehicle/menu/options?year=${year}&make=${make}&model=${model}`;
        const xmlString = await fetchData(endpoint);
        const xmlDoc = parseXML(xmlString);
        const variants = parseXMLToArray(xmlDoc, 'menuItem');
        variantSelect.innerHTML = '<option value="">Select a Variant</option>';
        variants.forEach(variant => {
            variantSelect.innerHTML += `<option value="${variant.value}">${variant.text}</option>`;
        });
    }

    async function handleSelectCar(){
        const selectedVariant = variantSelect.value;
        if(selectedVariant){
            const endpoint = `https://www.fueleconomy.gov/ws/rest/vehicle/${selectedVariant}`;
            const xmlString = await fetchData(endpoint);
            const xmlDoc = parseXML(xmlString);
            const make = xmlDoc.querySelector('make').textContent;
            const model = xmlDoc.querySelector('model').textContent;
            const year = xmlDoc.querySelector('year').textContent;
            const variant = xmlDoc.querySelector('trany').textContent;
            const fueltype = xmlDoc.querySelector('fuelType').textContent;
            const cylinders = xmlDoc.querySelector('cylinders').textContent;
            let cityMPG = xmlDoc.querySelector('city08').textContent;
            cityMPG = parseInt(cityMPG, 10).toFixed(2);

            
            if(measureSelectDistance.value == "KPL"){
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
            document.getElementById('reset').addEventListener('click', reload);
            return cityMPG;
        }else{
            console.log(variantSelect.value);
            alert("Please Update Car Details");
        }
        
    }

    function calculateShiftHours(){
        const shiftStart = document.getElementById('shift-start').value;
        const shiftEnd = document.getElementById('shift-end').value;
        let shiftBreak = document.getElementById('shift-break').value;
        if(!shiftStart || !shiftEnd){
            alert("Please Enter a Shift Start and End Time");
            console.log('Shift Start:', shiftStart);
            console.log('Shift End:', shiftEnd);
        }else{
            const start = new Date(`1970-01-01T${shiftStart}:00`);
            const end = new Date(`1970-01-01T${shiftEnd}:00`);
            let difference = end - start;
            if (difference < 0) {
                difference += 24 * 60 * 60 * 1000; 
            }
            let shiftHours = difference / (1000 * 60 * 60);
            if(shiftHours >= 8 && shiftBreak < 30 || shiftHours >= 16 && shiftBreak < 60){
                shiftBreak = Math.floor(shiftHours / 7.5) * 30;
            }
            shiftHours = Math.round(shiftHours);
            return {shiftHours, shiftBreak};
        }              
    }

    function shiftTypeFunction(){
        const shiftType = document.getElementById('shift-type').value;
        let jobsPerHour;
        let distancePerJobMiles;
        let payperJob;
        //Type of Shift checker
        if(shiftType == "rideshare"){
            jobsPerHour = 0.9;
            distancePerJobMiles = 6.2;
            payperJob = 30.50;
        }else if(shiftType == "food-delivery"){
            jobsPerHour = 1.5;
            distancePerJobMiles = 3.1;
            payperJob = 15.00;
        }
        console.log(jobsPerHour + " " + distancePerJobMiles +" " + payperJob );
        return {
            jobsPerHour,
            distancePerJobMiles,
            payperJob
        };  
    }

    function calculateDistanceFuelandProfits(rangeOutput, shiftHours, shiftBreak, jobsPerHour, distancePerJobMiles, payperJob){
        const fuelPrice = document.getElementById('shift-fuel').value;
        const shiftDay = document.getElementById('shift-day').value;
        const shiftUnit = document.getElementById('shift-unit').value
        let totalDistance = 0;
        let distanceUnit = "Mi";
        let totalJobs = Math.round((shiftHours - (shiftBreak / 60)) * jobsPerHour);
        //Rate Multipliers
        if (shiftDay === "weekend-rate") {
            totalJobs *= 1.25;
            payperJob *= 1.25;
        }
        //Unit Conversions
        if(shiftUnit === "unit-kilometers"){
            totalDistance = (totalJobs * distancePerJobMiles) * 1.609;
            distanceUnit = "Km"
        } else{
            totalDistance = totalJobs * distancePerJobMiles;
            distanceUnit = "Mi"
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
            distanceUnit
        };  
    }

    function simulateShift(grossIncome, netIncome, fuelExpense, totalJobs, totalDistance, shiftHours, shiftBreak, distanceUnit){
        hoursLabel.innerText = shiftHours; 
        breakLabel.innerText = shiftBreak;
        faresLabel.innerText = totalJobs;
        distanceLabel.innerText = totalDistance + " " + distanceUnit;
        grossLabel.innerText = grossIncome;
        expenseLabel.innerText = fuelExpense;
        netLabel.innerText = netIncome;
        grossLabel.classList.add("profit");
        expenseLabel.classList.add("loss");
        netIncome <= 0 ? netLabel.classList.add("loss") : netLabel.classList.add("profit");
    }

    //make a save functionality
    function saveDetails(){
        //TO-DO Next
    }

    simulateButton.addEventListener('click', async () => {
        const rangeOutput = await handleSelectCar(); 
        if (rangeOutput !== null) {
            const { shiftHours, shiftBreak } = calculateShiftHours();
            const { jobsPerHour, distancePerJobMiles, payperJob } = shiftTypeFunction();
            if (shiftHours !== null && shiftBreak !== null && jobsPerHour !== null && distancePerJobMiles !== null && payperJob !== null) {
                // Calculate distance, fuel, and profits
                const { grossIncome, netIncome, fuelExpense, totalJobs, totalDistance, distanceUnit } = calculateDistanceFuelandProfits(rangeOutput, shiftHours, shiftBreak, jobsPerHour, distancePerJobMiles, payperJob);
                simulateShift(grossIncome, netIncome, fuelExpense, totalJobs, totalDistance, shiftHours, shiftBreak, distanceUnit);
            } else {
                alert("Something Went Wrong - Please Try Again");
                console.log(error);
            }
        }
    });

    carSelectButton.addEventListener("click", handleSelectCar);


    // Populate vehicle years on page load
    populateYears();

    // Event listeners to handle user selections
    yearSelect.addEventListener('change', (event) => {
        const selectedYear = event.target.value;
        populateMakes(selectedYear);
    });
    
    makeSelect.addEventListener('change', (event) => {
        const selectedMake = event.target.value;
        const selectedYear = yearSelect.value;
        populateModels(selectedMake, selectedYear);
    });

    modelSelect.addEventListener('change', (event) => {
        const selectedModel = event.target.value;
        const selectedMake = makeSelect.value;
        const selectedYear = yearSelect.value;
        populateVariants(selectedModel, selectedMake, selectedYear);
    });
});
