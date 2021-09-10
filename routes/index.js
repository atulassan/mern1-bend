var express = require('express');
var router = express.Router();

var Authorize = require('../controllers/auth.controller');
var Product = require('../controllers/product.controller');
var CategoryProduct = require('../controllers/CategoryProduct.controller');

//Authorize(register, login, )
router.post("/api/v1/register", Authorize.register);
router.post("/api/v1/login", Authorize.login);
router.get("/api/v1/profile", Authorize.verifyToken, Authorize.profile);

router.get("/api/v1/products", Authorize.verifyToken, Product.listProducts);
router.post("/api/v1/addproduct", Authorize.verifyToken, Product.createProduct);

router.get("/api/v1/productcategories", Authorize.verifyToken, CategoryProduct.listCategories);
router.post("/api/v1/addproductcategory", Authorize.verifyToken, CategoryProduct.createCategory);

module.exports = router;