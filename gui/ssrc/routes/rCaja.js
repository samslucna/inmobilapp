const express = require('express')
const router = express.Router()
const app = express()

app.use(router)


const rCaja = () => {}

rCaja.List = ()=>{
    router.get('/apocosi', (req, res) => {
        res.send(' que te dije man')
    })
}

console.log('la aplicacion esta corriendo correctamente')
module.exports = rCaja