import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar'
import ErrorTable from './components/ErrorTable.jsx'
import SelectData from './components/SelectData.jsx'

class App extends Component {
  state = {
    pastTests: [],
    selectedTest: "",
    currentData: [],
    selectedData: [],
    loading: false,
    repeatFetch: function(){}
  }

  componentDidMount() {
    this.getTests()
    this.callBackendAPI()
      .catch(err => console.log(err));
      const repeatFetch = setInterval(this.callBackendAPI, 5000)
      this.setState({ repeatFetch: repeatFetch })
  }

  componentWillUnmount() {
    clearInterval(this.state.repeatFetch)
  }

  render() {
    return (
      <Router>
        <NavBar />
        <SelectData tests={this.state.pastTests} onChange={
          pId => {
            let index
            for (const [i, test] of this.state.pastTests.entries()) if(test._id === pId) index = i
            this.setState({
              selectedTest: pId,
              selectedData: pId ? this.state.pastTests[index].data : this.state.currentData,
              loading: true,
            })
            console.log(this.state.loading)
          }
        }/>
        <Fragment>
          <Routes>
            <Route exact path="/" element={<ErrorTable loading={this.state.loading}
              data={this.state.selectedData}/>} />
            {/* <Route path="/PushTest" element={<PushTest />} /> */}
          </Routes>
        </Fragment>
      </Router>
    );
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/api/current-test')
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    body.Data.length ? this.setState({ currentData: body.Data, loading: false }) : this.setState({ loading: true })
    this.state.selectedData.length ? this.setState({loading: false}) : this.setState({loading: true})

    return body
  }

  getTests = async () => {
    const response = await fetch('/api/past-tests')
    const body = await response.json()

    if (response.status !== 200 ) throw Error(body.message)

    body.Tests ? this.setState({ pastTests: body.Tests}) : this.setState({pastTests: []})
  }

}

export default App;
