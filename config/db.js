const mongoose = require('mongoose')

const connectionDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('DB connected')
    } catch (error) {
        console.log({mjs: 'connection fail', error: error.message});
    }
}

module.exports = connectionDB

