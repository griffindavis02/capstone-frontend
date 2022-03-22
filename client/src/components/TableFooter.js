import React, { useEffect } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'

// props.{range, setPage, page, slice}
const TableFooter = (props) => {
    const rowOptions = [5, 10, 25, 50, 100, 'All']
    const maxPagesVisible = 11

    const changeHandler = e => {
        if (e.target.value === 'All') {
            props.setRowsPerPage(props.maxRows)
        } else {
            props.setRowsPerPage(e.target.value)
        }
    }

    useEffect(() => {
        if (props.slice.length < 1 && props.page !== 1) {
            props.setPage(props.page - 1)
        }
    }, [props])

    return (
        <div className="table-footer mt-2 d-flex justify-content-center">
            {props.page !== 1
                ? <div className="pageLeft mt-3">
                    <a href="#test-btns" className="link-light text-decoration-none mx-1" onClick={() => props.setPage(1)}>&lt;&lt;</a>
                    <a href="#test-btns" className="link-light text-decoration-none mx-1" onClick={() => props.setPage(props.page - 1)}>&lt;</a>
                </div>
                : null}
            {props.range.length > maxPagesVisible && props.page > 1
                ? <button
                    key={1}
                    className={`btn mx-1 ${props.page === 1
                        ? 'btn-light'
                        : 'btn-outline-light'
                        }`}
                    onClick={() => {
                        props.setPage(1)
                    }}
                >
                    {1}
                </button>
                : null
            }
            {props.range.length > maxPagesVisible
                && props.page > 2
                // ellipses
                ? <h3 className="mt-2 text-light">&#8230;</h3>
                : null
            }
            {props.range.length <= maxPagesVisible
                // map all available pages
                ? props.range.map((el, index) => {
                    return (
                        <button
                            key={index}
                            className={`btn mx-1 ${props.page === el
                                ? 'btn-light'
                                : 'btn-outline-light'
                                }`}
                            onClick={() => {
                                props.setPage(el)
                            }}
                        >
                            {el}
                        </button>
                    )
                })
                // limit pages for formatting
                : props.range.slice(props.page - 1 + maxPagesVisible > props.range.length
                    ? props.range.length - maxPagesVisible
                    : props.page - 1, props.page + maxPagesVisible - 1).map((el, index) => {
                        // TODO: slice into left side as well and add ellipses
                        return (
                            <button
                                key={index}
                                className={`btn mx-1 ${props.page === el
                                    ? 'btn-light'
                                    : 'btn-outline-light'
                                    }`}
                                onClick={() => {
                                    props.setPage(el)
                                }}
                            >
                                {el}
                            </button>
                        )
                    })
            }
            {props.range.length > maxPagesVisible
                && props.page + maxPagesVisible - 1 < props.range.length
                // ellipses
                ? <h3 className="mt-2 text-light">&#8230;</h3>
                : null
            }
            {props.range.length > maxPagesVisible
                && props.page + maxPagesVisible - 1 < props.range.length
                // final page
                ? <button
                    key={props.range.length - 1}
                    className={`btn mx-1 ${props.page === props.range.length
                        ? 'btn-light'
                        : 'btn-outline-light'
                        }`}
                    onClick={() => {
                        props.setPage(props.range.length)
                    }}
                >
                    {props.range.length}
                </button>
                : null
            }
            <div style={{ width: '15%' }} className="mx-1 mt-1">
                <FloatingLabel
                    controlId="floatingRowsPerPage"
                    label="Rows Per Page"
                >
                    <Form.Select onChange={changeHandler}>
                        {rowOptions.map(row => (
                            <option value={row} key={row}>{row}</option>
                        ))}
                    </Form.Select>
                </FloatingLabel>
            </div>
            {props.page !== props.range[props.range.length - 1] && props.range.length
                ? <div className="pageRight mt-3">
                    <a href="#test-btns" className="link-light text-decoration-none mx-1" onClick={() => props.setPage(props.page + 1)}>&gt;</a>
                    <a href="#test-btns" className="link-light text-decoration-none mx-1" onClick={() => props.setPage(props.range[props.range.length - 1])}>&gt;&gt;</a>
                </div>
                : null}
        </div>
    )
}

export default TableFooter
