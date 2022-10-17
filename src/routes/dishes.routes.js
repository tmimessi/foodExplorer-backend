const { Router } = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const dishesRoutes = Router()

const DishesController = require('../controllers/DishesController')
const dishesController = new DishesController()
const ensureAuthentication = require('../middlewares/ensureAuthentication')
const ensureIsAdmin = require('../middlewares/ensureIsAdmin')

dishesRoutes.use(ensureAuthentication)
const upload = multer(uploadConfig.MULTER)

dishesRoutes.post(
  '/',
  ensureIsAdmin,
  upload.single('img'),
  dishesController.create
)
dishesRoutes.get('/', dishesController.index)
dishesRoutes.get('/:id', dishesController.show)
dishesRoutes.put(
  '/:id',
  ensureIsAdmin,
  upload.single('img'),
  dishesController.update
)
dishesRoutes.delete('/:id', ensureIsAdmin, dishesController.delete)

module.exports = dishesRoutes
