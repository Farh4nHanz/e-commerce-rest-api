const mongoose = require("mongoose");
const { Product } = require("../models/product");
const { Category } = require("../models/category");

// get all product
exports.getAllProducts = async (req, res) => {
  let filter = {};

  if (req.query.categories) {
    filter = { category: req.query.categories.split(",") };
  }

  const productList = await Product.find(filter).select(
    "name image category stock"
  );
  // add .populate('category') before semicolon, if want to show the category detail in product table
  // .populate('category')

  if (!productList) {
    res.status(500).json({ success: false });
  }

  res.send({
    count: productList.length,
    products: productList,
  });
};

// get product by id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({
      success: false,
      message: "product with the given id was not found",
    });
  }

  res.status(200).send(product);
};

// create new product
exports.createProduct = async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("invalid category");

    const file = req.file;
    if (!file) return res.status(400).send({ message: "required an image" });

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    const fileName = req.file.filename;

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}/${fileName}`,
      images: req.body.images,
      brand: req.body.brand,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
      dateCreated: req.body.dateCreated,
    });

    const createProduct = await product.save();
    res.status(201).json(createProduct);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "product cannot be created",
      error: err,
    });
  }
};

// update product by id
exports.updateProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send("invalid product id");

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).send("invalid category");

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        dateCreated: req.body.dateCreated,
      },
      {
        new: true,
      }
    );

    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "update product failed" });

    res.status(201).send(product);
  } catch (err) {
    res.status(500).json({
      error: err,
      message: "internal server error",
      success: false,
    });
  }
};

// update image-gallery
exports.updateImagesGallery = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res.status(400).send({ message: "invalid product id" });

    const basePath = `${req.protocol}://${req.get("host")}/public/uploads`;
    const files = req.files;
    let images = [];

    if (files) {
      files.map((file) => {
        images.push(`${basePath}/${file.filename}`);
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        images: images,
      },
      {
        new: true,
      }
    );

    product
      ? res
          .status(201)
          .send({
            message: "added images gallery successfully,",
            product: product,
          })
      : res
          .status(400)
          .send({ success: false, message: "cannot updated images-gallery" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server error",
      error: err,
    });
  }
};

// delete product by id
exports.deleteProductById = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete(req.params.id);

    if (product)
      return res
        .status(200)
        .json({ success: true, message: "product deleted" });

    res.status(404).json({ success: false, message: "product not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

// delete all products
exports.deleteAllProducts = async (req, res) => {
  try {
    const deleteAll = await Product.deleteMany();

    deleteAll
      ? res
          .status(200)
          .send({ success: true, message: "all products has been deleted" })
      : res
          .status(400)
          .send({ success: false, message: "cannot delete all products" });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "internal server erro",
      error: err,
    });
  }
};
