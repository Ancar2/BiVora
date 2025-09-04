const express= require('express');

const { middlewareJWT } = require('../middleware/jwt');
const { login } = require('../controller/login.controller');

const controllUser = require('../controller/user.controller');
const controllEstacion = require('../controller/estacion.controller');
const controllBici = require('../controller/bicicleta.controller');
const controllAlquiler = require('../controller/alquier.controller');



const router = express.Router();


//rutas de usuario
router.get('/users', controllUser.getUsers)
router.get('/users/:id', controllUser.getOneUser)
router.post('/users/create', middlewareJWT, controllUser.createUser)
router.put('/users/update/:id',middlewareJWT, controllUser.updateUser)
router.delete('/users/delete/:id',middlewareJWT, controllUser.deleteUser)

//rutas de estaciones
router.get('/estaciones',controllEstacion.getEstaciones)
router.get('/estaciones/:id',controllEstacion.getOneEstacion)
router.post('/estaciones/create',middlewareJWT, controllEstacion.createEstacion)
router.put('/estaciones/update/:id',middlewareJWT,controllEstacion.updateEstacion)
router.delete('/estaciones/delete/:id',middlewareJWT,controllEstacion.deleteEstacion )

//rutas de bicicletas
router.get('/bicicletas',controllBici.getBicicletas) //?idestacion
router.get('/bicicletas/:id',controllBici.getOneBici)
router.post('/bicicletas/create',middlewareJWT,controllBici.createBici)
router.put('/bicicletas/update/:id',middlewareJWT,controllBici.updateBici)
router.delete('/bicicletas/delete/:id',middlewareJWT,controllBici.deleteBici)

//rutas de Alquiler
router.get('/alquiler',controllAlquiler.getAlquileres) //?idestacion
router.get('/alquiler/:id',controllAlquiler.getOneAlquiler)
router.post('/alquiler/create',middlewareJWT,controllAlquiler.createAlquiler)
router.put('/alquiler/update/:id',middlewareJWT,controllAlquiler.finalizarAlquiler)


//Login
router.post('/login', login)


module.exports = router;