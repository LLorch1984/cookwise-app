const { Schema } = require('mongoose')

const { SchemaTypes: { ObjectId } } = require('mongoose')



module.exports = new Schema({
    name: {
        type: String,
        required: true
    },

    author: {
        type: String,
        required: true
    },


    ingredients: [{
        ingredient: {
            type: ObjectId,
            ref: 'Ingredients'
        },
        quantity: {
            type: Number
        }
    }],


    description: {
        type: String,
        required: true
    },

    time: {
        type: Number,
        required: true
    },

    
})