/**
 * tests/validateEmail.test.js
 * ---------------------------
 * Unit tests for the email validation utility.
 * We test the function directly in isolation.
 */
const validateEmail = require("../utils/validateEmail");

describe("validateEmail utility", () => {
  // Happy path: valid email should pass.
  test("returns true for a valid email", () => {
    expect(validateEmail("john.doe@example.com")).toBe(true);
  });

  // Negative path: multiple invalid values should fail.
  test("returns false for invalid email values", () => {
    // Different invalid scenarios:
    // - missing parts
    // - malformed format
    // - non-string values
    const invalidEmails = [
      "",
      "plainaddress",
      "@no-local-part.com",
      "missing-at-sign.com",
      "missing-domain@",
      "spaces are@invalid.com",
      "missing-tld@domain",
      null,
      undefined,
      12345
    ];

    // Validate every invalid value in one concise loop.
    invalidEmails.forEach((email) => {
      expect(validateEmail(email)).toBe(false);
    });
  });
});
