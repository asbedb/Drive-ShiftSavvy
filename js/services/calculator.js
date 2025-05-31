// services/calculator.js

import {
  MILES_LABEL,
  KILOMETERS_LABEL,
  KILOMETER_SELECTOR_LABEL,
  MILES_TO_KILOMETERS_MULTIPLIER,
  WEEKEND_SELECTOR_LABEL,
  WEEKEND_JOBS_MULTIPLIER,
  WEEKEND_PAY_MULTIPLIER,
  RIDESHARE_SELECTOR_LABEL,
  RIDESHARE_JOBS_PER_HOUR,
  RIDESHARE_DISTANCE_PER_JOB_MILES,
  RIDESHARE_PAY_PER_JOB,
  FOOD_DELIVERY_SELECTOR_LABEL,
  FOOD_DELIVERY_JOBS_PER_HOUR,
  FOOD_DELIVERY_DISTANCE_PER_JOB_MILES,
  FOOD_DELIVERY_PAY_PER_JOB,
  LOWER_LIMIT_SHIFT_HOURS_FOR_BREAK,
  UPPER_LIMIT_SHIFT_HOURS_FOR_BREAK,
  LOWER_LIMIT_MANDATORY_BREAK_MINUTES,
  UPPER_LIMIT_MANDATORY_BREAK_MINUTES,
  FULL_WORKING_DAY_HOURS,
  MINIMUM_BREAK_PER_WORKING_DAY_MINUTES,
  MILLISECONDS_PER_HOUR, 
  MINUTES_PER_HOUR,
  HOURS_PER_DAY
} from "../constants/definitions";

export function calculateShiftHours(shiftStart, shiftEnd, shiftBreak) {
  if (!shiftStart || !shiftEnd) {
    alert("Please Enter a Shift Start and End Time");
  } else {
    const start = new Date(`1970-01-01T${shiftStart}:00`);
    const end = new Date(`1970-01-01T${shiftEnd}:00`);
    let difference = end - start;
    if (difference < 0) {
      difference += HOURS_PER_DAY * MILLISECONDS_PER_HOUR;
    }
    let shiftHours = difference /  MILLISECONDS_PER_HOUR;
    //Forced Break calculations to promote healthy driving habits
    if (
      (shiftHours >= LOWER_LIMIT_SHIFT_HOURS_FOR_BREAK &&
        shiftBreak < LOWER_LIMIT_MANDATORY_BREAK_MINUTES) ||
      (shiftHours >= UPPER_LIMIT_SHIFT_HOURS_FOR_BREAK &&
        shiftBreak < UPPER_LIMIT_MANDATORY_BREAK_MINUTES)
    ) {
      shiftBreak =
        Math.floor(shiftHours / FULL_WORKING_DAY_HOURS) *
        MINIMUM_BREAK_PER_WORKING_DAY_MINUTES;
    }
    shiftHours = Math.round(shiftHours - shiftBreak);
    return shiftHours;
  }
}

export function shiftEstimates(shiftType) {
  //Type of Shift checker
  if (shiftType == RIDESHARE_SELECTOR_LABEL) {
    return {
      jobsPerHour: RIDESHARE_JOBS_PER_HOUR,
      distancePerJobMiles: RIDESHARE_DISTANCE_PER_JOB_MILES,
      payperJob: RIDESHARE_PAY_PER_JOB,
    };
  } else if (shiftType == FOOD_DELIVERY_SELECTOR_LABEL) {
    return {
      jobsPerHour: FOOD_DELIVERY_JOBS_PER_HOUR,
      distancePerJobMiles: FOOD_DELIVERY_DISTANCE_PER_JOB_MILES,
      payperJob: FOOD_DELIVERY_PAY_PER_JOB,
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
  let distanceUnit = MILES_LABEL;
  let totalJobs = Math.round((shiftHours - shiftBreak / MINUTES_PER_HOUR) * jobsPerHour);
  //Rate Multipliers
  if (shiftDay === WEEKEND_SELECTOR_LABEL) {
    totalJobs *= WEEKEND_JOBS_MULTIPLIER;
    payperJob *= WEEKEND_PAY_MULTIPLIER;
  }
  //Unit Conversions
  if (shiftUnit === KILOMETER_SELECTOR_LABEL) {
    totalDistance =
      totalJobs * distancePerJobMiles * MILES_TO_KILOMETERS_MULTIPLIER;
    distanceUnit = KILOMETERS_LABEL;
  } else {
    totalDistance = totalJobs * distancePerJobMiles;
    distanceUnit = MILES_LABEL;
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
