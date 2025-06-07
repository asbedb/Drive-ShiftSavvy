// constants/definitions.js

// Measurement
export const MILES_LABEL = "Mi";
export const KILOMETERS_LABEL = "Km";
export const KILOMETER_SELECTOR_LABEL = "unit-kilometers";
export const MILES_TO_KILOMETERS_MULTIPLIER = 1.609;
export const MILLISECONDS_PER_SECOND = 1000; 
export const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * 60;
export const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
export const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;

// Weekend Label and Multiplier
export const WEEKEND_SELECTOR_LABEL = "weekend-rate";
export const WEEKEND_JOBS_MULTIPLIER = 1.25;
export const WEEKEND_PAY_MULTIPLIER = 1.25;

// Rideshare
export const RIDESHARE_SELECTOR_LABEL = "rideshare";
export const RIDESHARE_JOBS_PER_HOUR = 0.9;
export const RIDESHARE_DISTANCE_PER_JOB_MILES = 6.2;
export const RIDESHARE_PAY_PER_JOB = 30.5;

// Food Delivery
export const FOOD_DELIVERY_SELECTOR_LABEL = "food-delivery";
export const FOOD_DELIVERY_JOBS_PER_HOUR = 1.5;
export const FOOD_DELIVERY_DISTANCE_PER_JOB_MILES = 3.1;
export const FOOD_DELIVERY_PAY_PER_JOB = 15.0;

// Calculator Bounds
export const LOWER_LIMIT_SHIFT_HOURS_FOR_BREAK = 8;
export const UPPER_LIMIT_SHIFT_HOURS_FOR_BREAK = 16;
export const LOWER_LIMIT_MANDATORY_BREAK_MINUTES = 30;
export const UPPER_LIMIT_MANDATORY_BREAK_MINUTES = 60;
export const FULL_WORKING_DAY_HOURS = 7.5;
export const MINIMUM_BREAK_PER_WORKING_DAY_MINUTES = 30;