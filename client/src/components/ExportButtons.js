import React from 'react'

const XLSXButton = (props) => {
    return (
        <a className="btn btn-success mx-1" href={`${props.api}/api/download?id=${props.selectedTest._id}&fileType=xlsx`}>Export to XLSX</a>
    )
}

const CSVButton = (props) => {
    return (
        <a className="btn btn-light mx-1" href={`${props.api}/api/download?id=${props.selectedTest._id}&fileType=csv`}>Export to CSV</a>
    )
}

export { XLSXButton, CSVButton }
