module.exports = {
    iterationsToTest: (iterations) => {
        const data = { Data: [] }
        let rateExists = false
        for (rate of data.Data)
            if (rate.Rate === iterations.Rate) rateExists = true
        if (!rateExists)
            data.Data.push({
                Rate: iterations.Rate,
                FlipData: [],
            })
        // populate
    },
}
