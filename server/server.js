const express = require('express')
const app = express()
const fs = require('fs')
const port = process.env.PORT || 5000
let data = {
    Data: [],
}

app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('/express', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(data)

    res.status = 200
})

app.post('/express', (req, res) => {
    data.Data.push(JSON.parse(req.query.params))
    res.send(req.query.params)
    res.status = 200
})
