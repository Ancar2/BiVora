const jwt = require ('jsonwebtoken')

exports.middlewareJWT = (req, res, next) => {
    try {
        let token = req.headers.authorization  
        if (!token) {
            return res.status(401).json({error:'token undefine'})
        } 
       

        token = token.split(' ')[1]
        jwt.verify(token,process.env.SECRET_JWT_KEY,(error, decode) =>{
            if (error) {
                return res.status(401).json({msj: 'error verify', detalle: error.message})
            }
            req.decode = decode
            next()
        })
        
    } catch (error) {
        res.status(500).json({msj: 'error middlewareJWT',detalle: error.message})
    }
}