const { Router } =  require("express")
const routes = Router()

const usersRouter = require('./users.routes')
const dishesRouter = require('./dishes.routes')
const sessionsRouter = require('./sessions.routes')
const cartsRouter = require("./carts.routes");

routes.use("/carts", cartsRouter)
routes.use('/users', usersRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/dishes', dishesRouter)

module.exports = routes