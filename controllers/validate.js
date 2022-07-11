export default function validate(dueDate, period, periodType, res) {
  
  /* this function return true if both validations are true and false otherwise
     
    1) for checking period type first it converts period to given period type and check
      if this converted period matches the period provided by client.

    2) for checking if given dueDate is after period if checks it with help of <= operator
      of javascript Date. notice the dueDate provided to the function is already in Date format
      and we convert period in Date format before cheking.
  */

  if (periodType === "monthly") {
    // period type validation
    if (period !== new Date(period).toLocaleDateString("en-US", { month: "short", year: "numeric" })) {
      res.status(403).json({ message: "period type is monthly but period is not in monthly format" });
      return false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      res.status(403).json({ message: "due date must be after end of period." });
      return false;
    }
  }

  if (periodType === "yearly") {
    // period type validation
    if (period !== new Date(period).toLocaleDateString("en-US", { year: "numeric" })) {
      res.status(403).json({ message: "period type is yearly but period is not in yearly format" });
      return false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      res.state(403).json({ message: "due date must be after end of period." });
      return false;
    }
  }

  if (periodType === "quaterly") {
    //first we split period in quater format (eg: 2-2022) to get quarter and year
    let [quarter, year] = period.split("-");
    year = parseInt(year);
    quarter = parseInt(quarter);

    // period type validation
    if ((quarter < 1) | (quarter > 4) | (year < 0)) {
      res.status(403).json({ message: "invalid period" });
      return false;
    }

    //dueDate > period validation (notice +1 in month, because Date.getMonth() provide month with 0 index)
    if (!(dueDate.getFullYear() > year || (dueDate.getFullYear() === year && dueDate.getMonth() + 1 > quarter * 3))) {
      res.status(403).json({ message: "due date must be after end of period." });
      return false;
    }
  }
   else {
    // if period type is none of above.
    res.status(403).json({ message: "invalid period type" });
    return false;
  }
  return true;
}
