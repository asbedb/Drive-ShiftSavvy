// services/calculator.js

export function calculateShiftHours(shiftStart, shiftEnd, shiftBreak) {
  if (!shiftStart || !shiftEnd) {
    alert("Please Enter a Shift Start and End Time");
  } else {
    const start = new Date(`1970-01-01T${shiftStart}:00`);
    const end = new Date(`1970-01-01T${shiftEnd}:00`);
    let difference = end - start;
    if (difference < 0) {
      difference += 24 * 60 * 60 * 1000;
    }
    let shiftHours = difference / (1000 * 60 * 60);
    //Forced Break calculations to promote healthy driving habits
    if (
      (shiftHours >= 8 && shiftBreak < 30) ||
      (shiftHours >= 16 && shiftBreak < 60)
    ) {
      shiftBreak = Math.floor(shiftHours / 7.5) * 30;
    }
    shiftHours = Math.round(shiftHours - shiftBreak);
    return shiftHours;
  }
}

export function shiftEstimates(shiftType) {
  //Type of Shift checker
  if (shiftType == "rideshare") {
    return {
      jobsPerHour: 0.9,
      distancePerJobMiles: 6.2,
      payperJob: 30.5,
    };
  } else if (shiftType == "food-delivery") {
    return {
      jobsPerHour: 1.5,
      distancePerJobMiles: 3.1,
      payperJob: 15.0,
    };
  }
}

export function calculateDistanceFuelandProfits(
  rangeOutput,
  shiftHours,
  shiftBreak,
  jobsPerHour,
  distancePerJobMiles,
  payperJob,
  fuelPrice,
  shiftDay,
  shiftUnit
) {
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
