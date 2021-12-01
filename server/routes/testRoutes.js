const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')
// const { Test, iterationSchema } = require('../models/testModel')
let data = {
    Data: [],
}

router.route('/api/iteration').post((req, res) => {
    const iteration = req.body

    data.Data.push(
        new testmodel.iterationSchema({
            Rate: iteration.Rate,
            IterationNum: iteration.IterationNum,
            ErrorData: new testmodel.errorSchema(iteration.ErrorData),
        })
    )
    res.send(iteration)
    res.status = 200
})

router.route('/api/iteration').get((req, res) => {
    const iteration = {
        Rate: 0.5,
        IterationNum: 0,
        ErrorData: {
            PreviousValue: 50000000000000000,
            PreviousByte: '0xb1a2bc2ec50000',
            IntBits: [
                0, 1, 3, 4, 6, 8, 9, 13, 15, 18, 21, 22, 25, 27, 30, 32, 33, 34,
                35, 38, 39, 40, 46, 50, 54, 55,
            ],
            ErrorValue: 33182657024205659,
            ErrorByte: '0x75e37364a1a35b',
            DeltaValue: -16817342975794341,
            When: '11-23-2021 15:28:05.952612200',
        },
    }

    data.Data.push(iteration)
    let db_connect = dbo.getDb()
    const test = {
        test_name: 'Need Data',
        user: 'gdavis12',
        data: data.Data,
    }
    db_connect.collection('tests').insertOne(test, (err, res) => {
        if (err) throw err
    })

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
        console.log(`Document ${query._id} deleted.`)
        response.status(obj)
    })
})

module.exports = router
