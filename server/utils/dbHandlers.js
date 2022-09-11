const ObjectId = require('mongodb').ObjectId
const dbo = require('../db/conn')

const clearTest = (req, res, next) => {
    let db_connect = dbo.getDb()
    let query = { email: req.params.email }

    db_connect.collection('users').findOne(query, (err, user) => {
        if (err) throw err

        if (user == null) {
            res.status(404)
            res.write(`User not found: ${req.params.email}`)
        } else if (user.admin) {
            when = new Date()
            when = `${when.toDateString()} ${when.toLocaleTimeString()}`
            db_connect.collection('user-tests').updateOne(
                { user_id: ObjectId(user._id) },
                {
                    $set: {
                        data: [],
                        user_id: ObjectId(user._id),
                        when: when
                    }
                }
            )
            res.write('Test cleared.')
        }
        else res.write('Not an admin')
    })

    return res.send()
}

module.exports = { clearTest }