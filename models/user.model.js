const { default: mongoose } = require("mongoose");


const userSchema =  mongoose.Schema({

    nombre:{
        type: String,
        required: true,
        minlenght: 3,
        maxlenght: 10,
        match: /^[a-zA-ZáéíóúüÁÉÍÓÚÜ]+$/
    },

    apellido:{
        type: String,
        minlenght: 3,
        maxlenght: 10,
        match: /^[a-zA-ZáéíóúüÁÉÍÓÚÜ]+$/
    },

    correo:{
        type: String,
        lowercase: true,
        required: true,
        minlenght: 7,
        maxlenght: 50,
        unique: true,
        match: [/[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/, 'ingresa un correo valido'],
        set: v => v.replace(/\s+/g, '') //quitar espacios
    },

     role: {
      type: String,
      enum: ["owner", "cliente"],
      required: true,
    },

     password:{
        type: String,
        required: true,
        minlenght: 4,
        maxlenght: 20,
    },

    activo: {
        type: Boolean,
        default: true
    }
},{
    timestamps: true,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


const userModel = mongoose.model('users', userSchema)
module.exports = userModel

// {
//   "nombre": "Andres",
//   "apellido": "Cardenas",
//   "correo": "andres@gmail..com",
//   "password": "Andres"
// }