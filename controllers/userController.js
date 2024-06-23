const { User } = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    const userList = await User.find().select("name phone email");

    if (!userList) return res.status(400).json({ success: false });

    res.send({
      userCount: userList.length,
      users: userList,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    user
      ? res.send(user)
      : res.status(404).send({ message: "cannot find user with the given id" });
  } catch (err) {
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

exports.getUsersCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    userCount
      ? res.status(200).send({ userCount: userCount })
      : res.status(400).send({ success: false, message: "cannot count users" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        apartment: req.body.apartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
      },
      { new: true }
    );

    const newUser = await user.save();

    newUser
      ? res
          .status(201)
          .send({ success: true, message: "user data has been updated" })
      : res
          .status(400)
          .send({ success: false, message: "cannot update user data" });
  } catch (err) {
    res.status(500).send({
      message: "internal server error",
      error: err.message,
    });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.params.id);

    user
      ? res
          .status(200)
          .send({ success: true, message: "user has been deleted" })
      : res.status(404).send({ success: false, message: "user not found" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err.message,
    });
  }
};
