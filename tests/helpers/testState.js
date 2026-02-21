const userController = require("../../controllers/userController");

async function resetUserState() {
  await userController.__resetUsers();
}

module.exports = {
  resetUserState
};
