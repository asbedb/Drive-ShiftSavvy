//when creating local save reload/reset will delete/reset local save.

import {
  MILLISECONDS_PER_HOUR,
  MILLISECONDS_PER_MINUTE,
  MILLISECONDS_PER_SECOND,
  SECONDS_PER_MINUTE,
  MINUTES_PER_HOUR,
} from "../constants/definitions";

export function reload() {
  location.reload();
}

export function convertUnitToMilliseconds(value, unitType) {
  const lowerCaseUnitType = unitType.toLowerCase();
  if (lowerCaseUnitType === "hour") {
    return value * MILLISECONDS_PER_HOUR;
  } else if (lowerCaseUnitType === "minute") {
    return value * MILLISECONDS_PER_MINUTE;
  } else if (lowerCaseUnitType === "seconds") {
    return value * MILLISECONDS_PER_SECOND;
  } else {
    throw new TypeErrorerror(`Invalid Unit Type: "${unitType}"`);
  }
}

export function convertMilliSecondsToDuration(milliseconds) {
  const absMilliseconds = Math.abs(milliseconds);
  const totalSeconds = Math.floor(absMilliseconds / MILLISECONDS_PER_SECOND);
  const seconds = totalSeconds % SECONDS_PER_MINUTE;
  const totalMinutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const minutes = totalMinutes % MINUTES_PER_HOUR;
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  return { hours, minutes, seconds };
}
