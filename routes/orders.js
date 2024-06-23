const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router
  .get("/", orderController.getAllOrderLists)
  .get("/count", orderController.countOrders)
  .get("/total-sales", orderController.getTotalSales)
  .get("/:id", orderController.getOrderById)
  .get('/user-orders/:userid', orderController.getUserOrders)
  .post("/", orderController.addNewOrders)
  .put("/:id", orderController.updateOrderById)
  .delete("/:id", orderController.deleteOrderById);

module.exports = router;
