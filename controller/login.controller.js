const userModel = require("../models/user.model")
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcrypt')


exports.login = async(req, res) =>{
    try {
        let data = req.body
        let user = await userModel.findOne({correo: data.correo})

        if (user) {
            const esValida = await bcrypt.compare(data.password, user.password);

            if (esValida) {
                let token = jwt.sign(

                    {
                    nombre: user.nombre,
                    correo: user.correo,
                    id : user._id,
                    role: user.role
                    },

                    process.env.SECRET_JWT_KEY,

                    {
                      expiresIn: process.env.TOKEN_EXPIRE
                    })

                res.status(200).json({Welcome:`${user.nombre}`,token})

            }else{
                return res.status(401).json({error:'password incorrecto'})
            }

        }else{
            return res.status(401).json({error: 'Correo no existe!'})
        }
        
    } catch (error) {
        res.status(500).json({error: 'login error'})
    }
}