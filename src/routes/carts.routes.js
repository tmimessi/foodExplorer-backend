const { Router } = require('express')
const cartsRoutes = Router()

const ensureIsAdmin = require("../middlewares/ensureIsAdmin");

const CartsController = require('../controllers/CartsController')
const cartsController = new CartsController()

const ensureAuthentication = require("../middlewares/ensureAuthentication");
cartsRoutes.use(ensureAuthentication);

cartsRoutes.post("/", cartsController.create)
cartsRoutes.get("/:id", cartsController.show)
cartsRoutes.get("/", ensureIsAdmin, cartsController.index)
cartsRoutes.delete("/:id", cartsController.delete)
cartsRoutes.put("/", cartsController.update);

module.exports = cartsRoutes