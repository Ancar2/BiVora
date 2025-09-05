const { default: mongoose } = require("mongoose");


const alquilerSchema =  mongoose.Schema(
    {
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'users', 
        required: true 
    },

    bicicleta: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'bicicleta', 
        required: true 
    },

    estacionInicio: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'estacione', 
        required: true 
    },

    estacionFin: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'estacione' 
    },

    fechaInicio: { 
        type: Date, 
        default: Date.now 
    },

    fechaFin: { 
        type: Date 
    },

    costo: { 
        type: Number, 
        min: 0 
    }

}, {
    timestamps: true
});

const alquilerModel = mongoose.model('alquilere', alquilerSchema)
module.exports = alquilerModel


//INICIAR
// {
//   "usuario": "",
//   "bicicleta": "",
//   "estacionInicio": ""
// }

//FINALIZAR
// {
//   "estacionFin": "",
//   "fechaFin": ""
// }