const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')
const crypto = require('crypto')
const fileExport = require('../utils/fileExport')
// const { requiresAuth } = require('express-openid-connect')
let data = {
    Data: [],
}

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

router.route('/auth-test').get(async (req, res) => {
    let db_connect = dbo.getDb()
    const user = {
        user: req.oidc.user.nickname,
        email: req.oidc.user.email,
        last_login: req.oidc.user.updated_at,
        hash: crypto
            .createHash('sha256')
            .update(req.oidc.user.email)
            .digest('hex'),
    }
    if (
        !(await db_connect
            .collection('users')
            .count({ hash: user.hash }, { limit: 1 }))
    ) {
        db_connect.collection('users').insertOne(user, (err, res) => {
            if (err) throw err
        })
    } else if (
        !(await db_connect
            .collection('users')
            .count({ hash: user.hash, last_login: user.last_login }))
    ) {
        db_connect
            .collection('users')
            .updateOne(
                { hash: user.hash },
                { $set: { last_login: req.oidc.user.updated_at } }
            )
    }
    res.json({ user })
})

router.route('/api/iteration').post((req, res) => {
    const iteration = JSON.parse(req.query.params)

    data.Data.push(iteration)
    res.json(iteration)
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
    res.json(test)
})

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

router.route('/api/current-test').get((req, res) => {
    res.json(data)
})

router.route('/api/delete/:id').delete((req, res) => {
    let db_connect = dbo.getDb()
    let query = { _id: ObjectId(req.params.id) }

    db_connect.collection('tests').deleteOne(query, (err, obj) => {
        if (err) throw err
    })
})

router.route('/api/test:id').get((req, res) => {
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
