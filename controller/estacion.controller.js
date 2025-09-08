const estacionModel = require("../models/estacion.model")


exports.createEstacion = async (req, res) => {
  try {
    const data = req.body;
    const role = req.decode.role;

    if (role !== "owner") {
      return res.status(403).json({ msj: "No tienes permisos para crear una Estacion" });
    }

 
    const newEstacion = new estacionModel(data);
    const guardado = await newEstacion.save();

    res.status(201).json({msj:"Estacion creada", data: guardado});

  } catch (error) {
    res.status(500).json({ msj: "Error al crear la Estacion", error: error.message });
  }
};


exports.getEstaciones = async (req, res) => {
    try {
        let data = await estacionModel.find().populate({
            path: 'bicicletas',
            select: 'serial estado img',
        })

        if (!data || data.length == 0) {
            return res.status(400).json({ msj: 'no hay estaciones a mostrar' })
        }

        res.status(200).json({ msj: 'estaciones obtenidas', data: data })
    } catch (error) {
        res.status(500).json({msj: 'error al obtener Estaciones', error: error.message})
    }
}


exports.getOneEstacion = async (req, res) => {
    try {
        let id = req.params.id
        let estacion = await estacionModel.find({ _id: id, activo: true }).populate({
            path: 'bicicletas',
            select: 'serial estado img',
        })

        if (estacion) {
            res.status(200).json(estacion)
        } else {
            res.status(400).json({ msj: 'estacion no encontrada o desactivada' })
        }
    } catch (error) {
        res.status(500).json(error)
    }
}



exports.updateEstacion = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body
        let role = req.decode.role


        let estacion = await estacionModel.findOne({_id: id})
        if (!estacion) {
             return res.status(403).json({ msj: 'la estacion no existe' })
        }

        if (role == 'owner') {
            let update = await estacionModel.findByIdAndUpdate(id, { $set: data, $inc: { __v: 1 } }, { new: true })
            res.status(200).json({ msj: 'estacion modificada', data: update })
        } else {
            res.status(403).json({ msj: 'tu no tienes permisos para actualizar estacion' })
        }



    } catch (error) {
        res.status(500).json({msj: 'error al actualizar estacion' ,error: error.message})
    }
}


exports.deleteEstacion = async (req, res) => {
    try {
        let id = req.params.id
        let eliminar = req.query.delete == 'true'
        let role = req.decode.role

        const estacion = await estacionModel.findById(id)

        if (role == 'owner') {
            if (eliminar) {
                await estacionModel.findByIdAndDelete(id)
                return res.status(200).json({ msj: 'estacion eliminada permanentemente' })
            } else {
                if (estacion.activo == false) {
                    return res.status(410).json({ msj: 'estacion ya a sido eliminada antes' })
                } else {
                    estacion.activo = false
                    estacion.inactiveAt = new Date()
                    await estacion.save()

                    return res.status(200).json({ msj: 'estacion desactivada', data: estacion })
                }
            }

        } else {
            return res.status(404).json({ message: 'no tienes permisos para eliminar estaciones' })
        }



    } catch (error) {
        res.status(500).json({msj: 'error al eliminar estacion' ,error: error.message})
    }
}

