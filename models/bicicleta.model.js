const { default: mongoose } = require("mongoose");


const biciSchema =  mongoose.Schema({
    serial:{
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 20,
        match: /^[a-zA-Z0-9áéíóúüÁÉÍÓÚÜ\s]+$///letras, numeros y espacios
    },

    estado:{
        type: String,
        required: true,
        enum: ['disponible', 'alquilada', 'mantenimiento'],
        default: 'disponible'
    },

    estacion :{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'estaciones' },
},{
    timestamps: true,       
})

const biciModel = mongoose.model('bicicleta', biciSchema)
module.exports = biciModel

// {
//   "serial": "BICI123",
//   "estacion": ""
// }
