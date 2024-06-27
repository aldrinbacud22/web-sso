const { verifyToken } = require('./utls')
const config = require('./config');

const validateToken = async(req,res,next) => {
    const token  = req.session.accessToken;

    if (!token) {
        return res.status(401).send('Access token is requried');
    }

    try {

        await verifyToken(token,config.secretKey);
        next();
        
    } catch (error) {
        console.log(error, 'ERROR JWT')
        return res.status(403).send('Invalid token');
    }

}

module.exports = {
    validateToken,
}