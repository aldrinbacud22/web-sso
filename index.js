const express = require('express');
const msal = require('@azure/msal-node');
const config = require('./config')
const { generateCodeVerifer, generateCodeChallenge, signToken } = require('./utls');
const { validateToken } = require('./middleware')
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
require('dotenv').config()
const port = 3000;


const cca = new msal.ConfidentialClientApplication({
    auth: config.auth
})

//set up express
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


const codeVerifier = generateCodeVerifer();
const codeChallenge = generateCodeChallenge(codeVerifier);


//Generate URL and redirect to Azure
// app.get('/login', async(req,res) => {

//     const authCodeURlParameters = {
//         scopes: config.scopes,
//         redirectUri: config.redirectUri,
//         // codeChallenge,
//         // codeChallengeMethod: 'S256'
//     }

//     try {

//         const authCodeResponse = await cca.getAuthCodeUrl(authCodeURlParameters)
//         console.log(`authCodeResponse uri: ${authCodeResponse}`);
//         res.redirect(authCodeResponse)
        
//     } catch (error) {
//         console.log(`ERROR sa pag login palang sa Azure`)
//         console.log(`ERROR message: ${error}`)
//     }
// })

app.get('/login', async(req,res) => {

    const authCodeURlParameters = {
        scopes: config.scopes,
        redirectUri: config.redirectUri,
    }

    try {

        const authCodeResponse = await cca.getAuthCodeUrl(authCodeURlParameters)
        res.redirect(authCodeResponse)
        
    } catch (error) {
        res.status(500).send(error)
    }
})

//receive auzre respose (Code) use to aquire token
// app.get('/auth/callback', async(req,res) => {

//     console.log(`---API callback call---`)

//     const authCodeURlParameters = {
//         code: req.query.code,
//         scopes: config.scopes,
//         redirectUri: config.redirectUri,
//         // codeVerifier
//     }

//     console.log(`Request aquire token: ${authCodeURlParameters}`)

//     try {

//         const acquireTokenByCodeResponse = await cca.acquireTokenByCode(authCodeURlParameters);
//         req.session.accessToken =  await signToken(acquireTokenByCodeResponse.accessToken);
//         res.redirect("/home")
        
//     } catch (error) {
//         res.status(500).send(JSON.stringify(`${error}`))
//     }
// })

app.get('/token', async(req,res) => {

    if (!req.query.code) {
        res.status(401).send({
            message: 'Code is required.'
        })
    }
    const authCodeURlParameters = {
        code: req.query.code,
        scopes: config.scopes,
        redirectUri: config.redirectUri,
    }

    console.log(authCodeURlParameters)


    try {

        const acquireTokenByCodeResponse = await cca.acquireTokenByCode(authCodeURlParameters);
        const accessToken =  await signToken(acquireTokenByCodeResponse.accessToken);
        
        res.json({
            token: accessToken
        })
        
    } catch (error) {
        res.status(500).send(error)
    }
})

app.get('/home', validateToken, async(req,res) => {
    if (req.session.accessToken) {
        res.status(200).send(JSON.stringify(req.session.accessToken));
    }else {
        res.status(500).send("Please Login")
    }
})

app.listen(port, (req, res) => {
    console.log(`Server is running on port ${port}`);
})