const { addShop, getShops, getShop } = require("../controllers/shops");

const shopsRoute = require("express").Router();

shopsRoute.get("/", getShops);
shopsRoute.get("/:shopId", getShop);
shopsRoute.post("/", addShop);

module.exports = shopsRoute;
