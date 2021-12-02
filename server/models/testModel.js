const { model, Schema } = require('mongoose')

const errorSchema = new Schema(
    {
        PreviousValue: Number,
        PreviousByte: String,
        IntBits: [Number],
        ErrorValue: Number,
        ErrorByte: String,
        DeltaValue: Number,
        When: String,
    },
    {
        strict: false,
    }
)

const iterationSchema = new Schema({
    Rate: Number,
    IterationNum: Number,
    ErrorData: errorSchema,
})

const testSchema = new Schema({
    Data: [iterationSchema],
})

const Test = model('Test', testSchema)

module.exports = { Test, iterationSchema, errorSchema }
