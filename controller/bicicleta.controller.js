const { default: mongoose } = require("mongoose")
const biciModel = require("../models/bicicleta.model")
const estacionModel = require("../models/estacion.model")


exports.createBici = async (req, res) => {
    try {
        let data = req.body
        const role = req.decode.role

        if (role !== 'owner') {
            return res.status(400).json({  msj: `No tienes permisos para crear bicicletas`})
        }

        const countEstacion = await estacionModel.countDocuments()
        const maxBicicletas = countEstacion * 5
        const countBici = await biciModel.countDocuments()

        if (countBici >= maxBicicletas) {
            return res.status(400).json({  msj: `No se pueden crear mas bicicletas. Maximo permitido: ${maxBicicletas}`})
        }

        let estacion
        if (mongoose.Types.ObjectId.isValid(data.estacion)) {
            estacion = await estacionModel.findById(data.estacion);
        } else {
         estacion = await estacionModel.findOne({ nombre: data.estacion });
        }

        if (!estacion) {
            return res.status(400).json({  msj: `Estacion no existe`})
        }

        if (estacion.bicicletas.length>= estacion.capacidad) {
            return res.status(400).json({ msj: `La estacion ${estacion.nombre} está llena. Elige otra estacion.`})
        }
        
        const newBici = new biciModel(data)
        const guardado = await newBici.save()

        estacion.bicicletas.push(guardado._id)
        estacion.bicicletasDisponibles = estacion.bicicletas.length
        await estacion.save()

        res.status(200).json({msj: 'Bici creada', data: guardado})
    } catch (error) {
        res.status(500).json({msj: 'error al crear bicicleta', error: error.message})
    }
}


exports.getBicicletas = async (req, res) => {
    try {
        const deEstacion = req.query.estacion

        if (!deEstacion) {
            let data = await biciModel.find({}).populate({
            path: 'estacion',
            select: 'nombre ubicacion'
        })
            return res.status(200).json({msj: 'todas las bicicletas!', data: data})
        }
        
        let data = await biciModel.find({estacion: deEstacion}).populate({
            path: 'estacion',
            select: 'nombre ubicacion'
        })

        res.status(200).json({msj: 'bicicletas en la estacion!', data: data})
        
    } catch (error) {
        res.status(500).json({msj: 'error al obtener bicicletas', error: error.message})
    }
}


exports.getOneBici = async (req, res) => {
    try {
        const id = req.params.id
        const bicicleta = await biciModel.findOne({_id:id}).populate({
            path: 'estacion',
            select: 'nombre ubicacion'
        })

        if (!bicicleta) {
            return res.status(400).json({msj: 'no se encontro bicicleta'})
        }
        res.status(200).json({ msj: 'bicicleta encontrada!', data: bicicleta })
    } catch (error) {
        res.status(500).json({msj: 'error al obtener bicicleta', error: error.message})
    }
}


exports.updateBici = async (req, res) => {
    try {
        const id = req.params.id
        const role = req.decode.role
        let data = req.body

        if (role !== 'owner') {
            res.status(403).json({msj: 'no tienes autorizacion para modificar una bici'})
        }

        const bicicleta = await biciModel.findById(id)
       
        if (!bicicleta) {
            res.status(404).json({msj: 'bicicleta no existe'})
        }

        const update = await biciModel.findByIdAndUpdate(id, {$set: data, $inc: { __v: 1 }},{new: true})
        res.status(200).json({msj: 'bicicleta modificada!', data: update})

    } catch (error) {
        res.status(500).json({msj: 'error al modificar bicicleta', error: error.message})
    }
}


exports.deleteBici = async (req, res) => {
    try {
    const id = req.params.id
    const role = req.decode.role

    if (role !== 'owner') {
        res.status(403).json({msj: 'no tienes autorizacion para eliminar una bici'})
    }
    
    const bicicleta = await biciModel.findById(id)

    if (!bicicleta) {
         return res.status(404).json({ msj: 'bicicleta no encontrada' })
    }

    await estacionModel.findByIdAndUpdate(bicicleta.estacion, {$pull: { bicicletas: bicicleta._id }},{ new: true });

    await biciModel.findByIdAndDelete(id)

    const estacion = await estacionModel.findById(bicicleta.estacion);
    if (estacion) {
      estacion.bicicletasDisponibles = estacion.bicicletas.length;
      await estacion.save();
    }

    return res.status(200).json({msj: 'bicleta eliminada permanentemente'})
                 
    } catch (error) {
        res.status(500).json({msj: 'error al eliminar bicicleta', error: error.message})
    }
}

