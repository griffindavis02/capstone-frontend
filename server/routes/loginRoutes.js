const express = require('express')
const router = express.Router()
const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')
const { auth } = require('express-openid-connect')

router.route('/').get((req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Not logged')
})

router.route('/callback').get((req, res) => {
    res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Not logged')
})

// router.route('/').post((req, res) => {

// })

// router.route('/logout').get((req, res) => {

// })

// router.route('/logout').post((req, res) => {

// })

module.exports = router