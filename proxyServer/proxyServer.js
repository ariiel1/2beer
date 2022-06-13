const express = require('express');
const morgan = require("morgan");
const cors = require('cors');
const { default: axios } = require('axios');
const bodyParser = require('body-parser')

// Create Express Server
const app = express();

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({extended:true}))

// Configuration
// const PORT = 4000;
const HOST = "localhost";
const AUTH_URL = "https://backend.cloud.nodeflux.io/auth/signatures";
const OCR_URL = "https://api.cloud.nodeflux.io/syncv2/analytics/ocr-ktp"
const ACCESS_KEY = "JWOYAM50616MPDAXORTCNE65H";
const SECRET_KEY = "e5IDFsojdZ2sJeXTvr9tC_PIIUgoO_fKzya_yMsAg9fGNkMkVslZRn04IPE3lFvi"

// Logging
app.use(morgan('dev'));



app.post('/nodeflux', async (req, res) => {
    const IMG = req.body.image
    const authData = await axios.post(AUTH_URL, {
        'access_key': ACCESS_KEY,
        'secret_key': SECRET_KEY
    }, {})
    .then(response => response.data)
    .catch(err => err)

    const DATE = authData.headers['x-nodeflux-timestamp'].slice(0, 8)
    const TIMESTAMP = authData.headers['x-nodeflux-timestamp']
    const TOKEN = authData.token
    const AUTH_KEY = 'NODEFLUX-HMAC-SHA256 Credential=' + ACCESS_KEY + '/' + DATE + '/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, SignedHeaders=x-nodeflux-timestamp, Signature=' + TOKEN
    
    
    const ocrKTP = await axios.post(OCR_URL, {
        "images": [IMG]
    }, {
        headers: {
            'Authorization': AUTH_KEY,
            'Content-Type': 'application/json',
            'x-nodeflux-timestamp': TIMESTAMP
        }
    })
    .then(response => response.data)
    .catch(err => err)

    res.json(ocrKTP);
})



// Start the Proxy
app.listen(process.env.PORT || 4000, () => {
    console.log(`Starting Proxy, hopefully it workss`);
 });
 


