const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const config = require('./config')

const base64URLEncode = (buffer) => {
    return buffer.toString('base64') 
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const generateCodeVerifer = () => {
    return base64URLEncode(crypto.randomBytes(32));
}

function generateCodeChallenge(codeVerifier) {
    return base64URLEncode(crypto.createHash('sha256').update(codeVerifier).digest());
}

const signToken = async (token) => await jwt.sign({token}, config.secretKey, {expiresIn: '1h'})

const verifyToken = async (token) => {
    return await jwt.verify(token.toString(), config.secretKey);
}

module.exports = {
    base64URLEncode,
    generateCodeVerifer,
    generateCodeChallenge,
    signToken,
    verifyToken
}