const userModel = require("../models/user.model")


exports.createUser = async (req, res) => {
    try {
        const data = req.body

        let owner = await userModel.findOne({role: 'owner'})

        if(!owner){
            data.role = 'owner'
        }else{
            data.role = 'cliente'
        }

        const user = new userModel(data)
        const guardado = await user.save()
        res.status(201).json(guardado)
    } catch (error) {
        res.status(400).json({msj: 'error al crear usuario', error: error.message})
    }
}

exports.getUsers = async (req, res) => {
    try {
        let data = await userModel.find({}, '-password')
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({msj: 'error al obtener usuarios', error: error.message})
    }
}

exports.getOneUser = async (req, res) => {
    try {
        const id = req.params.id
        let user = await userModel.findById(id, '-password')
        if(!user){
            return res.status(404).json({msj: 'usuario no encontrado'})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({msj: 'error al obtener usuario', error: error.message})
    }
}

exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body
        let userId = req.decode.id
        let role = req.decode.role

        
        const user = await userModel.findById(id)
       
        if (userId == user._id || role == 'owner') {
            let update = await userModel.findByIdAndUpdate(id, {$set: data},{new: true})
            res.status(200).json({msj: 'usuario actualizado', data: update})
        }else{
            res.status(403).json({msj: 'no tienes permiso para actualizar este usuario'})
        }
         
        

    } catch (error) {
        res.status(500).json(error)
    }
}


exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const eliminar = req.query.eliminar == 'true'
        let userId = req.decode.id
        let role = req.decode.role
        
        const user = await userModel.findById(id)
        
        if (userId != user._id && role == 'cliente') {
            return res.status(403).json({msj: 'no tienes permisos para eliminar otro usuario'})
        }


        if (user.role == 'owner') {
            return res.status(403).json({msj: 'este usuario "owner" no se puede eliminar'})
        }
        

        if (eliminar) {
            await userModel.findByIdAndDelete(id)
            return res.status(200).json({msj: 'usuario permamentemente eliminado'})
        }else{
            if (user.activo == false) {
                return res.status(410).json({msj: 'usuario ya fue eliminado'})
            } else{
                user.activo = false
                user.inactiveAt = new Date()
                await user.save()

                return res.status(200).json({msj: 'usuario eliminado', data: user})
            }
        }

    } catch (error) {
        res.status(500).json({msj: 'error al actualizar usuario', error: error.message})
    }
}



