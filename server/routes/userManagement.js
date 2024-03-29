const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')

router.route('/').get((req, res) => {
    hrefs = ''
    for (const route of router.stack) {
        route.route.methods.get
            ? (hrefs += `<li><a href=${route.route.path}>${route.route.path}</a></li>
        `)
            : null
    }
    res.send(`<p><a href='/login'>Login</a><a href='/logout'>Logout</a></p>
    <ul>${hrefs}</ul>`)
})

router.route('/get-users').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection('users')
        .find({})
        .toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
})

router.route('/get-user/:email').get((req, res) => {
    let db_connect = dbo.getDb()
    let query = { email: req.params.email }

    db_connect.collection('users').findOne(query, (err, result) => {
        if (err) throw err
        if (result == null) {
            res.status(404)
            res.send(`User not found: ${req.params.email}`)
        } else res.json(result)
    })
})

router.route('/get-admins').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection('users')
        .find({ admin: true })
        .toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
})

router.route('/get-non-admins').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection('users')
        .find({ admin: false })
        .toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
})

router.route('/add-update-user').post((req, res) => {
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
                last_access: req.body.update.last_access,
                admin: req.body.update.admin
            }
        },
        { upsert: true })
    res.send('User updated.')
})

router.route('/add-admins').post((req, res) => {
    let db_connect = dbo.getDb()
    const arrID = req.body._ids.map(_id => { return ObjectId(_id) })
    db_connect.collection('users').updateMany(
        { _id: { $in: arrID } },
        {
            $set: {
                admin: true
            }
        })
    res.send('Admins added.')
})

module.exports = router