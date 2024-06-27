require('dotenv').config()

module.exports = {
    port: 3000,
    secretKey:  process.env.SECRET_KEY,
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.AUTHORITY,
        clientSecret: process.env.CLIENT_SECRET, //use client value instead
    },
    system: {
        loggerOption: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(`LOGGER CALLBACK: Message: ${message}`)
            },
            piiLoggingEnabled: false,
            logLevel: 3
        }
    },
    scopes: ['user.read'], // scope
    redirectUri: `http://localhost:8081/auth/callback`,
}