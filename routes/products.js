const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const fileUpload = require("../helpers/file-upload");

router
  .get("/", productController.getAllProducts)
  .get("/:id", productController.getProductById)
  .post("/", fileUpload.single("image"), productController.createProduct)
  .put('/images-gallery/:id', fileUpload.array('images', 5) ,productController.updateImagesGallery)
  .put("/:id", productController.updateProductById)
  .delete('/', productController.deleteAllProducts)
  .delete("/:id", productController.deleteProductById);

module.exports = router;
