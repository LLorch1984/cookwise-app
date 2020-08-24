const { model } = require('mongoose')
const { user, ingredients, ingredientsQuantity, recipes} = require('./schemas')

module.exports = {
    User: model('User',user),
    Ingredients: model('Ingredients',ingredients),
    
    Recipes: model('Recipes', recipes)
}