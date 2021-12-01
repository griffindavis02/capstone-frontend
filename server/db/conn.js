const { MongoClient } = require('mongodb')
const dbo = process.env.ATLAS_URI
const client = new MongoClient(dbo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

let _dbo

module.exports = {
    connectToServer: (callback) => {
        client.connect((err, db) => {
            if (db) {
                _dbo = db.db('Capstone')
                console.log('Successfully connected to MongoDB.')
            }
            return callback(err)
        })
    },
    getDb: () => {
        return _dbo
    },
}
