const isValid = (value) => {
  if (typeof value !== "string" || value.length == 0) return false;
  return true;
};

const isValidEmail = (email) => {
  if (/^[a-zA-Z_\.0-9]+[@][a-z]{3,6}[.][a-z]{2,4}$/.test(email)) return false;
  return true;
};

module.exports = { isValid, isValidEmail };
