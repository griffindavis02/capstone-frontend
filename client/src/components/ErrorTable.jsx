import PushTest from './PushTest.jsx'
import DeleteTest from './DeleteTest.jsx'
import CreateExcel from './CreateExcel.jsx'

const ErrorTable = props => {

    return (
      <div>
        <table className="data-out">
          <tbody>
          <tr className="headers">
            <th className="th-sticky" data-column="Rate" data-order="desc">Error Rate</th>
            <th className="th-sticky" data-column="IterationNum" data-order="desc">Iteration</th>
            <th className="th-sticky" data-column="PreviousValue" data-order="desc">Previous Value</th>
            <th className="th-sticky" data-column="PreviousByte" data-order="desc">Previous Byte</th>
            <th className="th-sticky" data-column="IntBit" data-order="desc">Bit Significance</th>
            <th className="th-sticky" data-column="ErrorValue" data-order="desc">Error Value</th>
            <th className="th-sticky" data-column="ErrorByte" data-order="desc">Error Byte</th>
            <th className="th-sticky" data-column="DeltaValue" data-order="desc">Delta Value</th>
            <th className="th-sticky" data-column="When" data-order="desc">When</th>
          </tr>
          {!props.loading ? props.selectedTest.data.map(iteration => (
              <tr>
                <td>{iteration.Rate}</td>
                <td>{iteration.IterationNum}</td>
                <td>{iteration.ErrorData.PreviousValue}</td>
                <td>{highlightDiff(iteration.ErrorData.PreviousByte, iteration.ErrorData.ErrorByte)}</td>
                <td>{iteration.ErrorData.IntBits.map(bit => (`${bit}`)).join(', ')}</td>
                <td>{iteration.ErrorData.ErrorValue}</td>
                <td>{highlightDiff(iteration.ErrorData.ErrorByte, iteration.ErrorData.PreviousByte)}</td>
                <td>{iteration.ErrorData.DeltaValue}</td>
                <td>{iteration.ErrorData.When}</td>
              </tr>
          )) : null}
          </tbody>
          </table>
          {
            props.loading ? 
            <div className="loading">
              <div className="dot-flashing"></div>
            </div>
              : props.selectedTest._id ==="" ?
              <div>
                <PushTest user="" handler={props.handler}/>
              </div>
              :
              <div>
                <DeleteTest selectedTest={props.selectedTest} handler={props.handler} />
                <CreateExcel selectedTest={props.selectedTest} />
              </div>
          }
        </div>
    )
}

const highlightDiff = (hex1, hex2) => {
      let i = 2
      let indeces = []
      let prev = i
      while (i < hex1.length) {
        if (hex1[i] !== hex2[i]) {
          indeces.push({prev, i})
          prev = i+1
        }
        i++
      }

      return (
        <span>0x{indeces.map( index => (
          <span>
            <span>{hex1.slice(index.prev,index.i)}</span>
            <span className="diff-highlight">{hex1.slice(index.i, index.i+1)}</span>
          </span>
        ))}</span>
      )
    }

export default ErrorTable;