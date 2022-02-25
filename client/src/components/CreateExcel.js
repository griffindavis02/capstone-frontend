import React from 'react'
import ReactExport from 'react-data-export'

const ExcelFile = ReactExport.ExcelFile
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet

const CreateExcel = (props) => {
    const columnStyle = {
        font: { sz: 14, bold: true, color: { rgb: 'FFFFFF' } },
        fill: { patternType: 'solid', fgColor: { rgb: '566573' } },
    }
    let excelIterations = [
        {
            columns: [
                { title: 'Error Rate', width: { wch: 15 }, style: columnStyle },
                { title: 'Iteration', width: { wch: 10 }, style: columnStyle },
                {
                    title: 'Previous Value',
                    width: { wch: 40 },
                    style: columnStyle,
                },
                {
                    title: 'Previous Byte',
                    width: { wch: 40 },
                    style: columnStyle,
                },
                {
                    title: 'Bit Significance',
                    width: { wch: 20 },
                    style: columnStyle,
                },
                {
                    title: 'Error Value',
                    width: { wch: 40 },
                    style: columnStyle,
                },
                { title: 'Error Byte', width: { wch: 40 }, style: columnStyle },
                {
                    title: 'Delta Value',
                    width: { wch: 15 },
                    style: columnStyle,
                },
                { title: 'When', width: { wch: 30 }, style: columnStyle },
                { title: 'Message', width: { wch: 100 }, style: columnStyle },
            ],
            data: [],
        },
    ]

    const grayStyle = { fill: { patternType: 'solid', fgColor: { rgb: 'ABB2B9' } } }
    const whiteStyle = { fill: { patternType: 'solid', fgColor: { rgb: 'FFFFFF' } } }

    for (const [i, iteration] of props.selectedTest.data.entries()) {
        const style = i % 2 ? grayStyle : whiteStyle
        excelIterations[0].data.push([
            { value: iteration.Rate, style: style },
            { value: iteration.IterationNum, style: style },
            { value: iteration.ErrorData.PreviousValue, style: style },
            { value: iteration.ErrorData.PreviousByte, style: style },
            {
                value: iteration.ErrorData.IntBits.join(', '),
                style: style,
            },
            { value: iteration.ErrorData.ErrorValue, style: style },
            { value: iteration.ErrorData.ErrorByte, style: style },
            { value: iteration.ErrorData.DeltaValue, style: style },
            { value: iteration.ErrorData.When, style: style },
            { value: iteration.ErrorData.Msg, style: style },
        ])
    }

    return (
        <div>
            <ExcelFile filename={props.selectedTest.test_name} element={
                <button className="btn btn-success">Export to Excel</button>
            }>
                <ExcelSheet dataSet={excelIterations} name={props.selectedTest.test_name} />
            </ExcelFile>
        </div>
    )

}

export default CreateExcel
