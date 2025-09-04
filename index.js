const express = require('express');
const connectionDB = require('./config/db');
const router = require('./routes/route');
const app = express()
const cors = require('cors')
require('dotenv').config()

connectionDB()

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use('/api/health', (req, res) => {
    res.status(200).json({msj: 'API Bicicletas is Ok' })
})

app.listen(process.env.PORT, () => {
    console.log(`running on port ${process.env.PORT}`)
})