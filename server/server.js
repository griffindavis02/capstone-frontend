const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config({ path: './.env' })
// const { auth } = require('express-openid-connect')

const port = process.env.PORT || 5000
// const config = {
//     authRequired: false,
//     auth0Logout: true,
//     secret: process.env.SECRET_AUTH,
//     baseURL: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ?
//         'http://localhost:5000' : 'https://brrg-mongo-conn.herokuapp.com',
//     clientID: 'N8WIuRr18oXawFdFQ0nLblPVzhuNMo9A',
//     issuerBaseURL: 'https://griffindavis02.us.auth0.com'
// }

app.use(cors())
app.use(express.json())
// app.use(auth(config))

app.use('/', require('./routes/apiRoutes'))
// app.use('/login', require('./routes/loginRoutes'))
const dbo = require('./db/conn')

app.listen(port, () => {
    dbo.connectToServer((err) => {
        if (err) console.error(err)
    })
    console.log(`Listening on port ${port}`)
})
