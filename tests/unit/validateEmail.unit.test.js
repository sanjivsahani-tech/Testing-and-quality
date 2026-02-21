const validateEmail = require("../../utils/validateEmail");
const { invalidEmailSamples } = require("../helpers/userFixtures");
//  unit test case for validate email test 
describe("Unit | validateEmail", () => {
  describe("valid inputs", () => {
    test("returns true for a valid email", () => {
      expect(validateEmail("john.doe@example.com")).toBe(true);
    });
  });

  describe("invalid inputs", () => {
    test("returns false for invalid email values", () => {
      invalidEmailSamples.forEach((email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
});
