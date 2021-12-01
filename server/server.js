const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './.env' })
// const mongoose = require('mongoose')
// const testmodel = require('./models/testModel')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// mongoose.connect('mongodb://localhost:27017')

app.use('/', require('./routes/testRoutes'))
const dbo = require('./db/conn')

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if (err) console.error(err)
    })
    console.log(`Listening on port ${port}`)
})

// app.get('/api/test', (req, res) => {
//     res.setHeader('Content-Type', 'application/json')
//     res.send(data)

//     res.status = 200
// })

// app.post('/api/iteration', (req, res) => {
//     const iteration = req.query.params
//     data.Data.push(
//         new testmodel.iterationSchema({
//             Rate: iteration.Rate,
//             IterationNum: iteration.IterationNum,
//             ErrorData: new testmodel.errorSchema(iteration.ErrorData),
//         })
//     )
//     res.send(iteration)
//     res.status = 200
// })

// app.get('/api/commit', (req, res) => {
//     const newTest = new testmodel.Test({ data })
//     newTest.save()
// })
