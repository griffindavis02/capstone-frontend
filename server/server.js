const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './.env' })

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/', require('./routes/apiRoutes'))
app.use('/auth', require('./routes/loginRoutes'))
const dbo = require('./db/conn')

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if (err) console.error(err)
    })
    console.log(`Listening on port ${port}`)
})
