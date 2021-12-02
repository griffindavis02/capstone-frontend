import { useEffect, useState } from 'react'

const useTable = (data, page, rowsPerPage) => {
    const [tableRange, setTableRange] = useState([])
    const [slice, setSlice] = useState([])

    useEffect(() => {
        const range = calculateRange(data, rowsPerPage)
        setTableRange([...range])

        const slice = sliceData(data, page, rowsPerPage)
        setSlice([...slice])
    }, [data, setTableRange, page, setSlice, rowsPerPage])

    return { slice, range: tableRange }
}

const calculateRange = (data, rowsPerPage) => {
    const range = []
    const limit = Math.ceil(data.length / rowsPerPage)
    for (let i = 1; i < limit; i++) {
        range.push(i)
    }
    return range
}

const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage)
}

export default useTable
