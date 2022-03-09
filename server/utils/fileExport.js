const Excel = require('exceljs')
const { Readable } = require('stream')

const CreateXLSX = async (name, data) => {
    // TODO: add worksheets per test when combination of tests is included
    const wb = new Excel.Workbook()
    const ws = wb.addWorksheet(name, {
        views: [{ state: 'frozen', ySplit: 1 }], // re-incorporate xSplit: 1 ?
    })
    const headerStyle = {
        font: { size: 14, bold: true, color: { argb: 'FFFFFF' } },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '566573' },
        },
    }

    // TODO: will 'style:' work here? not sure.
    ws.columns = [
        { header: 'Error Rate', width: 15 },
        { header: 'Iteration', width: 10 },
        {
            header: 'Previous Value',
            width: 40,
        },
        {
            header: 'Previous Byte',
            width: 40,
        },
        {
            header: 'Bit Significance',
            width: 20,
        },
        {
            header: 'Error Value',
            width: 40,
        },
        { header: 'Error Byte', width: 40 },
        {
            header: 'Delta Value',
            width: 15,
        },
        { header: 'When', width: 30 },
        { header: 'Message', width: 100 },
    ]

    ws.getRow(1).font = headerStyle.font
    ws.getRow(1).fill = headerStyle.fill

    // TODO: Grab IntBits column and change cell type to number if contains comma?
    for (const iteration of data) {
        ws.addRow(
            [
                iteration.Rate,
                iteration.IterationNum,
                iteration.ErrorData.PreviousValue,
                iteration.ErrorData.PreviousByte,
                iteration.ErrorData.IntBits.join(', '),
                iteration.ErrorData.ErrorValue,
                iteration.ErrorData.ErrorByte,
                iteration.ErrorData.DeltaValue,
                iteration.ErrorData.When,
                iteration.ErrorData.Msg,
            ],
            'n'
        )
    }

    // convert the number of headers to corresponding column letter in xlsx
    // and append number of values
    const lastCell =
        String.fromCharCode(ws.getRow(1).cellCount + 96).toUpperCase() + // 96 => A = 1
        (data.length + 1).toString()

    ws.addConditionalFormatting({
        ref: `A2:${lastCell}`,
        rules: [
            {
                type: 'expression',
                formulae: ['=MOD(ROW(),2)=1'],
                style: {
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        bgColor: { argb: 'ABB2B9' },
                    },
                },
            },
        ],
    })

    const buf = await wb.xlsx.writeBuffer()
    const stream = new Readable()
    stream.push(buf)
    stream.push(null)
    return stream
}

const CreateCSV = async (name, data) => {
    const xlsxStream = await CreateXLSX(name, data)
    const wb = new Excel.Workbook()
    await wb.xlsx.read(xlsxStream)
    const buf = await wb.csv.writeBuffer()
    const stream = new Readable()
    stream.push(buf)
    stream.push(null)
    return stream
}

const CreateMAT = (name, data) => {}

module.exports = { CreateXLSX, CreateCSV, CreateMAT }
