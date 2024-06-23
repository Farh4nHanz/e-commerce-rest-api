const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.usersRegister = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      street: req.body.street,
      apartment: req.body.apartment,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
    });

    const createUser = await user.save();

    createUser
      ? res.status(201).send(createUser)
      : res
          .status(400)
          .json({ success: false, message: "cannot create the user account" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.usersLogin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(404)
        .send({ message: "user not found", success: false });

    const userPassword = bcrypt.compareSync(
      req.body.password,
      user.passwordHash
    );

    const userData = {
      userId: user.id,
      isAdmin: user.isAdmin,
    };

    if (user && userPassword) {
      const secret = process.env.SECRET;
      const token = jwt.sign(userData, secret, {
        expiresIn: "1d",
      });

      res.status(200).send({ user: user.email, token: token });
    } else {
      res.status(400).send({ message: "wrong password" });
    }
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};