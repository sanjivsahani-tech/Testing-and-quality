function createMockReq({ body = {}, params = {}, query = {} } = {}) {
  return { body, params, query };
}

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn()
  };
}

module.exports = {
  createMockReq,
  createMockRes
};
