const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userAuth = require("../auth/userAuth");

router
  .post("/register", userAuth.usersRegister)
  .post("/login", userAuth.usersLogin)
  .get("/", userController.getAllUsers)
  .get("/count", userController.getUsersCount)
  .get("/:id", userController.getUserById)
  .put("/:id", userController.updateUserById)
  .delete("/:id", userController.deleteUserById);

module.exports = router;
