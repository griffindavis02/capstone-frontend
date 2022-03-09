const fileExport = require('./fileExport')
const app = require('express')()
const fs = require('fs')
const { Readable } = require('stream')

app.listen(process.env.PORT || 5000)

app.get('/', (req, res) => {
    fs.readFile('./test61a8756e0daef1bbdfe2af12.json', async (err, data) => {
        data = JSON.parse(data.toString())
        const buffer = await fileExport.CreateXLSX(data.test_name, data.data)
        // res.contentType =
        //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        res.setHeader('Content-Disposition', 'attachment; filename="test.xlsx"')
        const stream = new Readable()
        stream.push(buffer)
        stream.push(null)
        stream.pipe(res)
        stream.on('close', () => {
            console.log('done')
        })
    })
})
