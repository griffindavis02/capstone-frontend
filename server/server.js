const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './.env' })

const port = process.env.PORT || 5000
const webapp = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
    'http://localhost:3000' : 'https://brrg-webapp.herokuapp.com'

app.use(cors({ origin: webapp }))
app.use(express.json())

app.use('/', require('./routes/apiRoutes'))
app.use('/user-management', require('./routes/userManagement'))
const dbo = require('./db/conn')

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if (err) console.error(err)
    })
    console.log(`Listening on port ${port}`)
})
