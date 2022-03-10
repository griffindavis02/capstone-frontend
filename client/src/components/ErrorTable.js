import React, { useState } from 'react'

import useTable from './useTable'
import TableFooter from './TableFooter'

import PushTest from './PushTest'
import DeleteTest from './DeleteTest'
import { XLSXButton, CSVButton } from './ExportButtons'

const ErrorTable = props => {

    const rowsPerPage = 5
    const [page, setPage] = useState(1)
    const { slice, range } = useTable(props.selectedTest.data, page, rowsPerPage)

    return (
        <div className="container-lg mt-4">
            <table className="data-out">
                <tbody>
                    <tr className="headers">
                        <th
                            className="th-sticky"
                            data-column="Rate"
                            data-order="desc"
                        >
                            Error Rate
                        </th>
                        <th
                            className="th-sticky"
                            data-column="IterationNum"
                            data-order="desc"
                        >
                            Iteration
                        </th>
                        <th
                            className="th-sticky"
                            data-column="PreviousValue"
                            data-order="desc"
                        >
                            Previous Value
                        </th>
                        <th
                            className="th-sticky"
                            data-column="PreviousByte"
                            data-order="desc"
                        >
                            Previous Byte
                        </th>
                        <th
                            className="th-sticky"
                            data-column="IntBit"
                            data-order="desc"
                        >
                            Bit Significance
                        </th>
                        <th
                            className="th-sticky"
                            data-column="ErrorValue"
                            data-order="desc"
                        >
                            Error Value
                        </th>
                        <th
                            className="th-sticky"
                            data-column="ErrorByte"
                            data-order="desc"
                        >
                            Error Byte
                        </th>
                        <th
                            className="th-sticky"
                            data-column="DeltaValue"
                            data-order="desc"
                        >
                            Delta Value
                        </th>
                        <th
                            className="th-sticky"
                            data-column="When"
                            data-order="desc"
                        >
                            When
                        </th>
                        <th
                            className="th-sticky"
                            data-column="Message"
                        >
                            Message
                        </th>
                    </tr>
                    {!props.loading
                        ? slice.map((iteration, i) => (
                            <tr key={i}>
                                <td>{iteration.Rate}</td>
                                <td>{iteration.IterationNum}</td>
                                <td>{iteration.ErrorData.PreviousValue}</td>
                                <td>
                                    {highlightDiff(
                                        iteration.ErrorData.PreviousByte,
                                        iteration.ErrorData.ErrorByte
                                    )}
                                </td>
                                <td>
                                    {iteration.ErrorData.IntBits.map(
                                        (bit) => `${bit}`
                                    ).join(', ')}
                                </td>
                                <td>{iteration.ErrorData.ErrorValue}</td>
                                <td>
                                    {highlightDiff(
                                        iteration.ErrorData.ErrorByte,
                                        iteration.ErrorData.PreviousByte
                                    )}
                                </td>
                                <td>{iteration.ErrorData.DeltaValue}</td>
                                <td>{iteration.ErrorData.When}</td>
                                <td>{iteration.ErrorData.Msg}</td>
                            </tr>
                        ))
                        : null}
                </tbody>
            </table>

            {!props.loading ? (
                <TableFooter
                    range={range}
                    slice={slice}
                    setPage={setPage}
                    page={page}
                />
            ) : null}

            {props.loading ? (
                <div className="loading">
                    <div className="dot-flashing"></div>
                </div>
            ) : props.selectedTest._id === '' ? (
                <div className="d-flex flex-row justify-content-center my-4">
                    <PushTest
                        className="pt-5"
                        user=""
                        handler={props.handler}
                    />
                </div>
            ) : (
                <div className="d-flex flex-row justify-content-center my-4">
                    <XLSXButton selectedTest={props.selectedTest} api={props.api} />
                    <CSVButton selectedTest={props.selectedTest} api={props.api} />
                    <DeleteTest
                        selectedTest={props.selectedTest}
                        handler={props.handler}
                    />
                </div>
            )}
        </div>
    )
}

const highlightDiff = (hex1, hex2) => {
    let i = 2
    let indeces = []
    let prev = i
    while (i < hex1.length) {
        if (hex1[i] !== hex2[i]) {
            indeces.push({ prev, i })
            prev = i + 1
        }
        i++
    }

    return (
        <span>0x{indeces.map((index, i) => (
            <span key={i}>
                <span>{hex1.slice(index.prev, index.i)}</span>
                <span className="diff-highlight">{hex1.slice(index.i, index.i + 1)}</span>
            </span>
        ))}</span>
    )
}

export default ErrorTable;