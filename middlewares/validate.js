const validate = (req, res, next) => {
  /* this function set req.isValid to true if both validations are true and false otherwise
     
    1) is period in period type format.

    2) for checking if given dueDate is after period if checks it with help of <= operator
      of javascript Date.
  */
  req.isValid = true;

  /* 
    validating dueDate and converting indian format to ISO format
    first we get day month year from it
    and convert it to ISO format using javascript Date.
  */
  let dueDate = req.body.dueDate;
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dueDate)) {
    req.isValid = false;
    req.message = "invalid due date";
    next();
    return;
  }

  const [day, month, year] = dueDate.split("-");

  if (day > 31 || month > 12) {
    req.isValid = false;
    req.message = "invalid due date";
    next();
    return;
  }

  dueDate = new Date(year + "-" + month + "-" + day).toISOString();
  req.body.dueDate = dueDate;

  const { periodType, period } = req.body;

  if (periodType === "monthly") {
    // period type validation, must be in [mmm yyyy] format where mmm are characters
    // eg: Nov 2022
    if (!/^[a-zA-Z]{3}\s[0-9]{4}$/.test(period)) {
      req.message = "Invalid period format";
      req.isValid = false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      req.message = "due date must be after end of period.";
      req.isValid = false;
    }
  } else if (periodType === "yearly") {
    // period type validation, must be in YYYY
    if (!/^[0-9]{4}$/.test(period)) {
      req.message = "Invalid period format";
      req.isValid = false;
    }

    //dueDate > period validation
    if (dueDate <= new Date(period)) {
      req.message = "due date must be after end of period.";
      req.isValid = false;
    }
  } else if (periodType === "quaterly") {
    // checking period must be in q-yyyy , where q is quarter and q must be in 1-4
    if (!/^[1-4]{1}-[0-9]{4}$/.test(period)) {
      req.message = "invalid period format";
      req.isValid = false;
    }

    const [quarter, year] = period.split("-");
    quarter = parseInt(quarter);
    year = parseInt(year);

    //dueDate > period validation (notice +1 in month, because Date.getMonth() provide month with 0 index)
    if (!(dueDate.getFullYear() > year || (dueDate.getFullYear() === year && dueDate.getMonth() + 1 > quarter * 3))) {
      req.message = "due date must be after end of period.";
      req.isValid = false;
    }
  } else {
    // if period type is none of above.
    req.message = "invalid period type";
    req.isValid = false;
  }

  next();
};

export default validate;
