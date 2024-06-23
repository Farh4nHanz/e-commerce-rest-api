const { Order } = require("../models/order");
const { OrderItem } = require("../models/order-item");

exports.getAllOrderLists = async (req, res) => {
  try {
    const orders = await Order.find()
      .select("user orderItems status")
      .populate("user", "name")
      .sort({ dateOrdered: -1 }); // -1 is mean order by newest to oldest

    orders
      ? res.status(200).send({ orderList: orders })
      : res.status(400).send({ success: false, message: "cannot get orders" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name")
      .populate("orderItems");

    order
      ? res.status(200).send({ order: order })
      : res.status(404).send({
          success: false,
          message: "order with the given id was not found",
        });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.addNewOrders = async (req, res) => {
  try {
    // add order items data into orderItems table
    const orderItemsIds = Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItems = new OrderItem({
          product: orderItem.product,
          quantity: orderItem.quantity,
        });

        newOrderItems = await newOrderItems.save();

        return newOrderItems._id;
      })
    );

    const orderItemResolve = await orderItemsIds;

    // calculate the total price of the order
    const totalPrices = await Promise.all(
      orderItemResolve.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate(
          "product",
          "price"
        );
        const totalPrice = orderItem.product.price * orderItem.quantity;

        return totalPrice;
      })
    );

    const totalPrice = totalPrices.reduce((a, b) => a + b);

    let newOrders = await new Order({
      orderItems: orderItemResolve,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      totalPrice: totalPrice,
      user: req.body.user,
    });

    newOrders = await newOrders.save();

    newOrders
      ? res.status(201).send({
          success: true,
          message: "ordered successful",
          order: newOrders,
        })
      : res
          .status(400)
          .send({ success: false, message: "cannot make an order" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    order
      ? res.status(201).send({
          success: true,
          message: "order successfully updated",
          updatedOrder: order,
        })
      : res.status(404).send({
          success: false,
          message: "cannot find order with the given id",
        });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete(req.params.id);

    if (order) {
      await Promise.all(
        order.orderItems.map(async (orderItem) => {
          await OrderItem.findOneAndDelete(orderItem);
        })
      );

      res.status(200).send({
        success: true,
        message: "order has been deleted",
      });
    } else {
      res.status(404).send({
        success: false,
        message:
          "cannot delete order because the order with the given id was not found",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.countOrders = async (req, res) => {
  try {
    const orders = await Order.countDocuments();

    orders
      ? res.status(200).send({ ordersCount: orders })
      : res
          .status(400)
          .send({ success: false, message: "cannot count orders" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.getTotalSales = async (req, res) => {
  try {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
    ]);

    totalSales
      ? res.status(200).send({ totalSales: totalSales.pop().totalsales })
      : res
          .status(400)
          .send({ success: false, message: "total price cannot be generated" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.params.userid }).sort({
      dateOrdered: -1,
    });

    res.status(200).send({ userOrders: userOrders });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};
