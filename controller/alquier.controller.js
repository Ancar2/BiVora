const alquilerModel = require("../models/alquiler.model");
const biciModel = require("../models/bicicleta.model");
const estacionModel = require("../models/estacion.model");

exports.createAlquiler = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.decode.id

    const estacion = await estacionModel.findById(data.estacionInicio);
    if (!estacion) {
      return res.status(404).json({ msj: "Estación de inicio no encontrada" });
    }

    const bici = await biciModel.findOne({_id: data.bicicleta, estacion: estacion._id});
    if (!bici) {
      return res.status(404).json({ msj: "Bicicleta no encontrada en esta estacion" });
    }

    await estacionModel.findByIdAndUpdate(estacion._id, {
      $pull: { bicicletas: bici._id },
      $inc: { bicicletasDisponibles: -1 }
    });

    bici.estado = "alquilada";
    await bici.save();

    const alquiler = new alquilerModel({
      usuario: userId,
      bicicleta: bici._id,
      estacionInicio: estacion._id
    });

    const guardado = await alquiler.save();

    res.status(201).json({ msj: "Alquiler iniciado", data: guardado });
  } catch (error) {
    res
      .status(500).json({ msj: "Error al crear alquiler", error: error.message });
  }
}

exports.finalizarAlquiler = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const userId =req.decode.id

    const alquiler = await alquilerModel.findOne({_id: id, usuario: userId}).populate("bicicleta");

    if (!alquiler) {
      return res.status(404).json({ msj: "Alquiler no encontrado o no eres quien hizo este alquiler" });
    }

    if (alquiler.fechaFin) {
      return res.status(400).json({ msj: "El alquiler ya fue finalizado" });
    }

    const estacion = await estacionModel.findById(data.estacionFin);
    if (!estacion) {
      return res.status(404).json({ msj: "Estación de entrega no encontrada" });
    }

    const fechaFin = new Date();
    alquiler.fechaFin = fechaFin;

    const diferenciaMs = fechaFin - alquiler.fechaInicio; 
    const diferenciaMin = Math.ceil(diferenciaMs / 60000);

    alquiler.costo = diferenciaMin * process.env.COSTO_MINUTO;

    await estacionModel.findByIdAndUpdate(estacion._id, {
      $push: { bicicletas: alquiler.bicicleta._id },
      $inc: { bicicletasDisponibles: 1 }
    });

    alquiler.estacionFin = estacion._id;
   
    await alquiler.save();


    const bici = await biciModel.findById(alquiler.bicicleta._id);
    bici.estado = "disponible";
    bici.estacion = estacion._id;
    await bici.save();

    res.status(200).json({ msj: "Alquiler finalizado", data: alquiler });
  } catch (error) {
    res
      .status(500).json({ msj: "Error para finalizar alquiler", error: error.message });
  }
};



exports.getAlquileres = async (req, res) => {
  try {
    const usuario = req.query.usuario;

    let filtro = {};
    if (usuario) {
      filtro.usuario = usuario;
    }

    const data = await alquilerModel
      .find(filtro)
      .populate("usuario", "nombre apellido correo")
      .populate("bicicleta", "serial estado")
      .populate("estacionInicio", "nombre ubicacion")
      .populate("estacionFin", "nombre ubicacion");

    res.status(200).json({ msj: "Lista de alquileres", data });
  } catch (error) {
    res
      .status(500).json({ msj: "Error al obtener alquileres", error: error.message });
  }
};

exports.getOneAlquiler = async (req, res) => {
  try {
    const id = req.params.id;

    const alquiler = await alquilerModel
      .findById(id)
      .populate("usuario", "nombre apellido correo")
      .populate("bicicleta", "serial estado")
      .populate("estacionInicio", "nombre ubicacion")
      .populate("estacionFin", "nombre ubicacion");

    if (!alquiler) {
      return res.status(404).json({ msj: "Alquiler no encontrado" });
    }

    res.status(200).json({ msj: "Alquiler encontrado", data: alquiler });
  } catch (error) {
    res
      .status(500).json({ msj: "Error al obtener alquiler", error: error.message });
  }
};
