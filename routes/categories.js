const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router
  .get("/", categoryController.getAllCategories)
  .get("/:id", categoryController.getCategoryById)
  .post("/", categoryController.createCategory)
  .put("/:id", categoryController.updateCategoryById)
  .delete("/:id", categoryController.deleteCategoryById);

module.exports = router;
