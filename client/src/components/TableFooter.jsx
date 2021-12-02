import React, {useEffect} from 'react'

// props.{range, setPage, page, slice}
const TableFooter = (props) => {
    useEffect(() => {
        if(props.slice.length <1 && props.page !== 1) {
            props.setPage(props.page-1)
        }
    }, [props])

    return (
        <div className="table-footer">
            {props.range.map((el, index) => {
                return <button key={index}
                className={`btn mx-1 ${
                    props.page === el ? 'btn-light' : 'btn-outline-light'
                }`}
                onClick={() => {props.setPage(el)}}>{el}</button>
            })}
        </div>
    )
}

export default TableFooter
