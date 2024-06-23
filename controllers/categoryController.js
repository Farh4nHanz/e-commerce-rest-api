const { Category } = require("../models/category");

// get all categories
exports.getAllCategories = async (req, res) => {
  const categoryList = await Category.find();

  if (!categoryList) {
    res.status(500).json({ success: false });
  }

  res.send(categoryList);
};

// get category by id
exports.getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(500).json({
      success: false,
      message: "category with the given id was not found",
    });
  }

  res.status(200).send(category);
};

// create new category
exports.createCategory = async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });

    const addCategory = await category.save();
    res.status(201).json(addCategory);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "category cannot be created",
      error: err,
    });
  }
};

// update category by id
exports.updateCategoryById = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      {
        new: true,
      }
    );

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "update category failed" });
    }

    res.status(201).send(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

// delete category by id
exports.deleteCategoryById = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete(req.params.id);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "category deleted" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "category not found" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err });
  }
};
