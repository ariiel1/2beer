import { auth, fs } from 'firebase-config';

const ACCESS_KEY = J33OPBIQ67SIO68ZKLUC11ZJQ
const SECRET_ACCESS_KEY = _LXi8JMFHxbYwbj-lUhmtg0hOz5oJ0Mxi_iSqfqeD3V98GYjBRmYwJMlR2_dfdYj


export const nodefluxAuth = async () => {
    return await fetch("https://backend.cloud.nodeflux.io/auth/signatures", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "access_key": ACCESS_KEY,
            "secret_key": SECRET_ACCESS_KEY
        })
    }).then(response => {
        return response.json()
    }).then(authorization => {
        const DATE = authorization.headers['x-nodeflux-timestamp'].slice(0, 8)
        const TOKEN = authorization.token
        return {
            "auth_key": `NODEFLUX-HMAC-SHA256 Credential=${ACCESS_KEY}/${DATE}/nodeflux.api.v1beta1.ImageAnalytic/StreamImageAnalytic, SignedHeaders=x-nodeflux-timestamp, Signature=${TOKEN}`,
            "timestamp": authorization.headers['x-nodeflux-timestamp']
        }
    }).catch(e => { console.log(e.message) })
}