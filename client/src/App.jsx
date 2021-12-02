import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar'
import ErrorTable from './components/ErrorTable.jsx'
import SelectData from './components/SelectData.jsx'

class App extends Component {
  state = {
    pastTests: [],
    selectedTest: {
      _id: "",
      test_name: "",
      user: "",
      data: []
    },
    currentData: [],
    loading: true,
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
      <div className="App">
        <Router>
          <NavBar />
          <SelectData tests={this.state.pastTests} onChange={
            pId => {
              let selectTest = {_id: "", test_name: "", user: "", data: []}
              for (const test of this.state.pastTests) {
                if(test._id === pId) {
                  selectTest = test
                }
              }
              if(!selectTest._id) {
                selectTest.data = this.state.currentData
              }
              this.setState({
                selectedTest: selectTest,
                selectedData: pId ? selectTest.data : this.state.currentData,
                loading: selectTest.data.length ? false : true
              })
            }
          }/>
          <Fragment>
            <Routes>
              <Route exact path="/" element={<ErrorTable loading={this.state.loading}
                selectedTest={this.state.selectedTest} handler={this.handlePushDelete} />} />
            </Routes>
          </Fragment>
        </Router>
      </div>
    );
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/api/current-test')
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    if (body.Data.length && this.state.selectedTest._id === "") {
      const test = {
        _id: "",
        test_name: "",
        user: "",
        data: body.Data
      }
      this.setState({ currentData: body.Data, selectedTest: test, loading: false })
    } else if (this.state.selectedTest._id !=="" && this.state.selectedTest.data.length) {
      this.setState({loading: false})
    } else {
      this.setState({loading: true})
    }

    // body.Data.length ? this.setState({ currentData: body.Data, loading: false }) : this.setState({ loading: true })
    // if(this.state.selectedTest === "") this.setState({ selectedData: this.state.currentData })
    // this.state.selectedData.length ? this.setState({loading: false}) : this.setState({loading: true})

    return body
  }

  getTests = async () => {
    const response = await fetch('/api/past-tests')
    const body = await response.json()

    if (response.status !== 200 ) throw Error(body.message)

    body.Tests ? this.setState({ pastTests: body.Tests}) : this.setState({pastTests: []})
  }

  handlePushDelete = async () => {
    await this.getTests()
    this.setState({ loading: true,
      selectedTest: {
      _id: "",
      test_name: "",
      user: "",
      data: this.state.currentData
    }})
    console.log(this.state.selectedTest._id)
  }

}

export default App;
