const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')

router.route('/add-update-general-user').post((req, res) => {
    // FIXME ensure request is coming from web app
    // FIXME must increment by 0.5 until cached test is implemented
    // FIXME and multiple state changes doesn't run this function twice
    let db_connect = dbo.getDb()
    db_connect.collection('users').updateOne(
        { email: req.body.update.email },
        {
            $inc: { access_count: 0.5 },
            $set: {
                user: req.body.update.user,
                email: req.body.update.email,
                picture: req.body.update.picture,
                last_access: req.body.update.last_access
            }
        },
        { upsert: true })
})

router.route('/add-admin-user').post((req, res) => {
    // NOTE receive user ObjectId
    db_connect.collection('users').findOne()
})

router.route('')

module.exports = router