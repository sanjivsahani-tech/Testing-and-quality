/**
 * utils/validateEmail.js
 * ----------------------
 * Small utility function to validate email format.
 * Returns true for valid format, false otherwise.
 */
function validateEmail(email) {
  // Guard clause: only string values can be validated as email text.
  if (typeof email !== "string") {
    return false;
  }

  // Regex explanation:
  // ^[^\s@]+      -> one or more characters before @ (no spaces, no @)
  // @             -> literal at symbol
  // [^\s@]+       -> one or more characters for domain name
  // \.            -> literal dot
  // [^\s@]+$      -> one or more characters for domain extension till end
  // This is a simple educational regex, not full RFC validation.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Trim to ignore accidental spaces around the email.
  return emailRegex.test(email.trim());
}

module.exports = validateEmail;
