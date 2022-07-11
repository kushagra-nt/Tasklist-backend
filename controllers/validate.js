export default function validate(dueDate, period, periodType, res) {
  /* this function return true if both validations are true and false otherwise
     
    1) is period in period type format.

    2) for checking if given dueDate is after period if checks it with help of <= operator
      of javascript Date. notice the dueDate provided to the function is already in Date format
      and we are converting period in Date format before cheking.
  */

  if (periodType === "monthly") {
    // period type validation, must be in [mmm yyyy] format where mmm are characters
    // eg: Nov 2022
    if (!(/^[a-zA-Z]{3}\s[0-9]{4}/.test(period) && period.length === 8)) {
      res.status(403).json({ message: "Invalid period format" });
      return false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      res.status(403).json({ message: "due date must be after end of period." });
      return false;
    }
  } else if (periodType === "yearly") {
    // period type validation, must be in YYYY
    if (!(/^[0-9]{4}/.test(period) && period.length === 4)) {
      res.status(403).json({ message: "Invalid period format" });
      return false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      res.state(403).json({ message: "due date must be after end of period." });
      return false;
    }
  } else if (periodType === "quaterly") {
    // checking period must be in q-yyyy , where q is quarter and q must be in 1-4
    if (!(/^[1-4]{1}-[0-9]{4}/.test(period) && period.length === 6)) {
      res.status(403).json({ message: "invalid period format" });
      return false;
    }

    const [quarter, year] = period.split("-");

    //dueDate > period validation (notice +1 in month, because Date.getMonth() provide month with 0 index)
    if (!(dueDate.getFullYear() > year || (dueDate.getFullYear() === year && dueDate.getMonth() + 1 > quarter * 3))) {
      res.status(403).json({ message: "due date must be after end of period." });
      return false;
    }
  } else {
    // if period type is none of above.
    res.status(403).json({ message: "invalid period type", periodType: periodType });
    return false;
  }
  return true;
}
