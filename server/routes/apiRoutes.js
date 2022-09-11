const express = require('express')
const router = express.Router()
const axios = require('axios')
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')
const fileExport = require('../utils/fileExport')
const { clearTest } = require('../utils/dbHandlers')

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

// TODO: include password check
router.route('/api/iteration/:email').post((req, res) => {
    let db_connect = dbo.getDb()
    let query = { email: req.params.email }

    db_connect.collection('users').findOne(query, (err, user) => {
        if (err) throw err

        if (user == null) {
            res.status(404)
            res.send(`User not found: ${req.params.email}`)
        } else if (user.admin) {
            when = new Date()
            when = `${when.toDateString()} ${when.toLocaleTimeString()}`
            db_connect.collection('user-tests').updateOne(
                { user_id: ObjectId(user._id) },
                {
                    $push: {
                        data: req.body
                    },
                    $set: {
                        user_id: ObjectId(user._id),
                        when: when
                    }
                },
                { upsert: true }
            )
            res.send(req.body)
        }
        else res.send('Not an admin')
    })
})

router.route('/api/commit').post((req, res, next) => {
    console.log(req.body)
    let db_connect = dbo.getDb()
    db_connect.collection('user-tests').aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $match: { "user.email": req.body.email } },
        { $unset: "user" }
    ]).next((err, result) => {
        if (err) throw err
        if (result !== null) {
            const test = {
                test_name: req.body.test_name,
                user: req.body.email,
                data: result.data,
            }

            db_connect.collection('tests').insertOne(test, (err, res) => {
                if (err) throw err
            })
            res.write(`Test "${test.test_name}" pushed.`)
        }
    })
    // clear test cache
    req.params.email = req.body.email
    next()
}, clearTest)

router.route('/api/past-tests').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect
        .collection('tests')
        .find({})
        .toArray((err, result) => {
            if (err) throw err
            res.json(result)
        })
})

// TODO: Make a post request to secure password when added
router.route('/api/current-test/:email').get((req, res) => {
    let db_connect = dbo.getDb()
    db_connect.collection('user-tests').aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $match: { "user.email": req.params.email } },
        { $unset: "user" }
    ]).next((err, result) => {
        if (err) throw err
        if (result !== null)
            res.send(result.data)
        else {
            res.status(404)
            res.send(`User not found: ${req.params.email}`)
        }
    })
})

// TODO: include password check
router.route('/api/delete/:id').delete((req, res) => {
    let db_connect = dbo.getDb()
    let query = { _id: ObjectId(req.params.id) }

    db_connect.collection('tests').deleteOne(query, (err, obj) => {
        if (err) throw err
    })
})

// TODO: include password check
router.route('/api/clear/:email').post(clearTest)

router.route('/api/test/:id').get((req, res) => {
    let db_connect = dbo.getDb()
    let query = { _id: ObjectId(req.params.id) }

    db_connect.collection('tests').findOne(query, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

router.route('/api/download').get(async (req, res) => {
    // receive get request from client with id(s) and filetype
    // set appropriate content type in response headers
    let db_connect = dbo.getDb()
    let query = { _id: ObjectId(req.query.id) }

    const test = await db_connect.collection('tests').findOne(query)

    let stream = null
    switch (req.query.fileType) {
        case 'xlsx':
            stream = await fileExport.CreateXLSX(test.test_name, test.data)
            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${test.test_name}.xlsx"`
            )
            stream.pipe(res)
            break
        case 'json':
            stream = fileExport.CreateJSON(test.data)
            res.setHeader(
                'Content-Type',
                'application/json'
            )
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${test.test_name}.json"`
            )
            stream.pipe(res)
            break
        default:
            stream = await fileExport.CreateCSV(test.test_name, test.data)
            res.setHeader('Content-Type', 'text/csv')
            res.setHeader(
                'Content-Disposition',
                `attachment; filename="${test.test_name}.csv"`
            )
            stream.pipe(res)
    }
})

module.exports = router
