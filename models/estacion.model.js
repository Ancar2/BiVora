const { default: mongoose } = require("mongoose");


const estacionSchema =  mongoose.Schema(
    {
    nombre:{
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 20,
        match: /^[a-zA-ZáéíóúüÁÉÍÓÚÜ\s]+$///solo letras y espacios
    },

    ubicacion:{
        direccion: {
            type: String,
            require: true
        },

        latitud: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },

        longitud: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        }
    },

    capacidad:{
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 5
    },

    bicicletasDisponibles:{
        type: Number,
        required: true,
        min: 0,
        default: 0,
        max: 5
    },
    
    bicicletas : [
        { type: mongoose.Schema.Types.ObjectId, 
        ref: 'bicicleta', 
        default : []
    }
        
    ],

     activo: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
})

const estacionModel = mongoose.model('estacione', estacionSchema)
module.exports = estacionModel
    

// {
//   "nombre": "Estacion Central",
//   "ubicacion": {
//     "direccion": "Cra 7 # 23-45, Bogotá",
//     "latitud": 4.60971,
//     "longitud": -74.08175
//   },
//   "bicicletasDisponibles": 0,
// }
