const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')
// const { Test, iterationSchema } = require('../models/testModel')
let data = {
    Data: [],
}

router.route('/api/iteration').post((req, res) => {
    const iteration = JSON.parse(req.query.params)

    data.Data.push(iteration)
    res.send(iteration)
    res.status = 200
})

router.route('/api/commit').post((req, res) => {
    let db_connect = dbo.getDb()
    const test = {
        test_name: req.body.test_name,
        user: req.body.user,
        data: data.Data,
    }
    db_connect.collection('tests').insertOne(test, (err, res) => {
        if (err) throw err
    })
    data.Data = []
    res.send(test)
})

router.route('/api/past-tests').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection('tests')
        .find({})
        .toArray((err, result) => {
            if (err) throw err
            res.json({ Tests: result })
        })
})

router.route('/api/current-test').get((req, res) => {
    res.send(data)
})

router.route('/api/delete/:id').delete((req, res) => {
    let db_connect = dbo.getDb()
    let query = { _id: ObjectId(req.params.id) }

    db_connect.collection('tests').deleteOne(query, (err, obj) => {
        if (err) throw err
        res.status(obj)
        res.send(`Document ${req.params.id} deleted.`)
    })
})

module.exports = router
