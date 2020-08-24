const { Schema } = require('mongoose')
const { utils: { Email } } = require('cook-wise-commons')
const recipes = require('./recipes')
const { SchemaTypes: { ObjectId } } = require('mongoose')

const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
const TIMELINE = ["lunch", "dinner"]

module.exports = new Schema({
    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: [Email.validate, 'invalid e-mail']
    },

    password: {
        type: String,
        required: true
    },

    recipes:  [{
        type: ObjectId,
        ref: 'Recipes'
    }],

    favoriterecipes: [{
            type: ObjectId,
            ref: 'Recipes'
    }],

    schedule :[
        {
            weekday : { type: String, enum: WEEKDAYS},
            timeline : {type: String, enum: TIMELINE},
            recipe: {
                type: ObjectId,
                ref: 'Recipes'
            }
        }
    ] 
})
