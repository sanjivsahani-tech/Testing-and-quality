function validUser(overrides = {}) {
  return {
    name: "Alice",
    email: "alice@example.com",
    ...overrides
  };
}

const invalidEmailSamples = [
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

module.exports = {
  validUser,
  invalidEmailSamples
};
