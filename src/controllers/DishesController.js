const knex = require('../database/knex')
const DiskStorage = require('../providers/DiskStorage')

class DishesController {
  async create(request, response) {
    const { title, description, ingredients, price, category } = request.body

    //const { filename: imageFilename } = request.file

    const diskStorage = new DiskStorage()

    //const filename = await diskStorage.saveFile(imageFilename)

    const dishes_id = await knex('dishes').insert({
      //img: filename,
      title,
      description,
      price,
      category
    })

    const ingredientsInsert = ingredients.map(name => ({
      name,
      dishes_id
    }))

    await knex('ingredients').insert(ingredientsInsert)

    return response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const dish = await knex('dishes').where({ id }).first()
    const ingredient = await knex('ingredients')
      .where({ dishes_id: id })
      .orderBy('name')

    return response.json({
      ...dish,
      ingredient
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('dishes').where({ id }).delete()

    return response.status(200).json()
  }

  async index(request, response) {
    const { title, ingredients } = request.query

    let dishes

    // se existir ingredientes
    if (ingredients) {
      const filterIngredients = ingredients.split(',').map(tag => tag.trim())

      dishes = await knex('ingredients')
        .select([
          'dishes.id',
          'dishes.title',
          'dishes.description',
          'dishes.price',
          'dishes.img',
          'dishes.category'
        ])
        .whereLike('dishes.title', `%${title}%`)
        .whereIn('name', filterIngredients)
        .innerJoin('dishes', 'dishes.id', 'ingredients.dishes_id')
        .groupBy('dishes.id')
        .orderBy('dishes.title')
    }

    if (title) {
      dishes = await knex('dishes')
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    // Retorna todos os dishes caso nao passe nenhum filtro
    dishes = await knex('dishes')

    const listIngredients = await knex('ingredients')

    const dishesWithIngredients = dishes.map(dish => {
      const dishIngredients = listIngredients.filter(
        ingredient => ingredient.dishes_id === dish.id
      )

      return {
        ...dish,
        ingredients: dishIngredients
      }
    })

    return response.json(dishesWithIngredients)
  }

  async update(request, response) {
    const { title, description, price, ingredients, category } = request.body
    const { id } = request.params
    const { filename: imageFilename } = request.file
    const diskStorage = new DiskStorage()
    const dish = await knex('dishes').where({ id }).first()

    if (dish.img) {
      await diskStorage.deleteFile(dish.img)
    }

    const filename = await diskStorage.saveFile(imageFilename)

    dish.img = filename
    dish.title = title ?? dish.title
    dish.description = description ?? dish.description
    dish.price = price ?? dish.price
    dish.ingredients = ingredients ?? dish.ingredients
    dish.category = category ?? dish.category

    await knex('dishes').where({ id }).update(dish)

    return response.json()
  }
}

module.exports = DishesController
