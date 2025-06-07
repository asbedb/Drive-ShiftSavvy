# Drive ShiftSavvy

Welcome to **Drive ShiftSavvy**, a comprehensive web application designed to help you estimate vehicle fuel efficiency and calculate shift earnings for rideshare and food delivery drivers.

All fuel consumptions and estimates rely on the US Government service for fuel utilising the API from https://www.fueleconomy.gov/

## Overview

This application provides an intuitive interface to input vehicle details, select shift parameters, and calculate various metrics such as total earnings, expenses, and travel distances. Whether you're a driver trying to optimize your work schedule or a vehicle owner curious about fuel consumption, this tool offers valuable insights to help you make informed decisions.

## Key Features

- **Vehicle Information**: Select your vehicle's year, make, model, and variant from a comprehensive database. View essential details such as fuel type and fuel efficiency in your preferred unit of measurement.
- **Shift Simulation**: Input shift start and end times, breaks, and shift type to estimate job counts, total earnings, and expenses.
- **Weekend Rates**: Calculate earnings with weekend multipliers to reflect higher earning potential on weekends.
- **Fuel Efficiency Calculation**: Determine fuel expenses based on your vehicle's efficiency and the total distance traveled during your shift.

## Getting Started

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/asbedb/Drive-ShiftSavvy.git

2. **If running locally ensure CORS-Anywhere or a similar Cross Origin Local Service is Installed**
    ```bash
    npm install cors-anywhere

3. **Run the Cors Anywhere Server**
    ```bash
    node server.js

4. **Ensure appropriate web-service is running and navigate to relevant landing page (http://localhost:80 as an example).**

## Code Structure

I have recently refactored this project to align to clean code practices, this was a great way for me to practice refactoring and applying my new founds skills in a useful way. The single JS file has now been broken into it's smaller components making maintenance and contributions to the project much easier. 

## Contributing
I welcome contributions to improve this project. Please refer to our contributing guidelines for more information on how to get involved.

## License
This project is licensed under the MIT License.