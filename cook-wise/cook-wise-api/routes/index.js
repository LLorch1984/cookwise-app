const { env: { SECRET } } = process

const { Router } = require('express')
const { 
    registerUser, 
    authenticateUser, 
    createIngredient,
    createRecipe,
    searchRecipe,
    toogleFavorite,
    retrieveFavorite,
    retrieveUser,
    toogleMenu,
    retriveDay,
    groceryList,
    recipeIdeas,
    deleteRecipe,
    deleteTimelineMenu,
    deleteDayMenu,
    retrieveRecipe,
    retrieveMenu
} = require('./handlers')

const bodyParser = require('body-parser')
const { jwtVerifierExtractor } = require('../middlewares')
const { handleError } = require('../helpers')





const parseBody = bodyParser.json()
const verifyExtractJwt = jwtVerifierExtractor(SECRET, handleError)

const api = new Router()

api.post('/users', parseBody, registerUser)

api.post('/users/auth', parseBody, authenticateUser)

api.post('/ingredients', parseBody, createIngredient)

api.post('/recipes', parseBody, verifyExtractJwt, createRecipe)

api.get('/searchrecipes', verifyExtractJwt, searchRecipe)

api.patch('/toogle/:recipeId',[verifyExtractJwt],toogleFavorite)

api.get('/retrievefavorites', verifyExtractJwt, retrieveFavorite)

api.get('/users/retrieve', verifyExtractJwt, retrieveUser)

api.patch('/tooglemenu',[parseBody,verifyExtractJwt],toogleMenu)

api.get('/day/:weekday',verifyExtractJwt,retriveDay)

api.get('/grocerylist',verifyExtractJwt,groceryList)

api.get('/ideas',verifyExtractJwt,recipeIdeas)

api.get('/:recipeId',verifyExtractJwt,retrieveRecipe)

api.get('/retrieve/menu', verifyExtractJwt, retrieveMenu)

api.delete('/deleterecipe',parseBody,verifyExtractJwt,deleteRecipe)

api.delete('/deletetimelinemenu',parseBody,verifyExtractJwt,deleteTimelineMenu)

api.delete('/deletedaymenu',parseBody,verifyExtractJwt,deleteDayMenu)

module.exports = {
    api
}