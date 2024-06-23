require("dotenv/config");
require("./config/database");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const jwtAuth = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

// cross-origin
app.use(cors());
app.options("*", cors());

// port
const PORT = process.env.PORT;

// middleware
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(jwtAuth());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// routes
const productsRoutes = require("./routes/products");
const categoriesRoutes = require("./routes/categories");
const usersRoutes = require("./routes/users");
const ordersRoutes = require("./routes/orders");

app.use("/products", productsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", usersRoutes);
app.use("/orders", ordersRoutes);

// start server
app.listen(PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
