import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    data: [],
    loading: false,
    repeatFetch: function(){}
  }

  componentDidMount() {
    this.callBackendAPI()
      .catch(err => console.log(err));
      const repeatFetch = setInterval(this.callBackendAPI, 5000)
      this.setState({ repeatFetch: repeatFetch })
  }

  componentWillUnmount() {
    clearInterval(this.state.repeatFetch)
  }

    // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    console.log("fetching")
    const response = await fetch('/express')
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    body.Data ? this.setState({ data: body.Data, loading: false }) : this.setState({ loading: true })

    return body
  }

  render() {
    const pushGAS = async () => {
      const query = JSON.stringify(this.state.data)
      const headers = { method: 'POST',
                        headers : {'Content-Type' : 'text/plain'},
                        redirect: 'follow',
                        dataType: 'text/plain',
                        body: query }
      let GASApp = 'https://script.google.com/macros/s/AKfycbxQ9aR2O2xckJi5KKxOxz6GSF2OO_rW4i58wz3vcyV3n4WXou1T9-s4Co_ujYEnjy5eEg/exec'
      await fetch(GASApp /*+ "?" + query*/, headers)
      .then((res, req) => {
        console.log(res)
      })
      .catch(err => alert(err))
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
      console.log(indeces)

      return (
        <span>0x{indeces.map( index => (
          <span>
            <span>{hex1.slice(index.prev,index.i)}</span>
            <span className="diff-highlight">{hex1.slice(index.i, index.i+1)}</span>
          </span>
        ))}</span>
      )
    }
    return (
      <div className="App">
        <h1 className="title">Error Injection</h1>
        <table className="data-out">
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

          {!this.state.loading ? this.state.data.map(rate => (
            <tbody>
            {rate.FlipData ? rate.FlipData.map(iter => (
              <tr>
                <td>{rate.Rate}</td>
                <td>{iter.IterationNum}</td>
                <td>{iter.ErrorData.PreviousValue}</td>
                <td>{highlightDiff(iter.ErrorData.PreviousByte, iter.ErrorData.ErrorByte)}</td>
                <td>{iter.ErrorData.IntBits.map(bit => (`${bit}`)).join(', ')}</td>
                <td>{iter.ErrorData.ErrorValue}</td>
                <td>{highlightDiff(iter.ErrorData.ErrorByte, iter.ErrorData.PreviousByte)}</td>
                <td>{iter.ErrorData.DeltaValue}</td>
                <td>{iter.ErrorData.When}</td>
              </tr>
            )) : <tr><td>{rate.Rate}</td><td>null</td><td>null</td><td>null</td><td>null</td><td>null</td><td>null</td><td>null</td><td>null</td></tr>}
            </tbody>
          )) : null}
          </table>
          {this.state.loading ? <div className="loading">
            <div className="dot-flashing"></div>
            </div>
             : null/*<button className="push-GAS" onClick={pushGAS}>Push to GAS</button>*/}
      </div>
    );
  }
}

export default App;
