import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar'
import ErrorTable from './components/ErrorTable'
import SelectData from './components/SelectData'
import { addUser } from './components/UserManagement'
import { withAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

class App extends Component {
  state = {
    api: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ?
      'http://localhost:5000' : 'https://brrg-mongo-conn.herokuapp.com',
    pastTests: [],
    selectedTest: {
      _id: "",
      test_name: "",
      user: "",
      data: []
    },
    repeatFetch: function () { }
  }

  componentDidMount() {
    this.getTests()
    this.callBackendAPI(false)
      .catch(err => console.log(err));
    const repeatFetch = setInterval(() => this.callBackendAPI(false), 5000)
    this.setState({ repeatFetch: repeatFetch })
  }

  componentWillUnmount() {
    clearInterval(this.state.repeatFetch)
  }

  render() {
    const { isAuthenticated, user } = this.props.auth0
    if (isAuthenticated) {
      addUser(this.state.api, user)
    }
    return (
      <div className="App">
        <Router>
          <NavBar api={this.state.api} />
          <Fragment>
            <Routes>
              <Route exact path="/" element={
                isAuthenticated ?
                  <div>
                    {/* TODO: restructure pastTests to be mapped with id for O(1) query
                    then sub for-loop for try-catch block where the catch gets
                    the current data from the test cache because it won't have
                    an id */}
                    <SelectData tests={this.state.pastTests} onChange={
                      pId => {
                        let selectedTest = { _id: "", test_name: "", user: "", data: [] }
                        for (const test of this.state.pastTests) {
                          if (test._id === pId) {
                            selectedTest = test
                          }
                        }
                        if (!selectedTest._id) {
                          this.callBackendAPI(true)
                        } else {
                          clearInterval(this.state.repeatFetch)
                          this.setState({
                            selectedTest: selectedTest,
                            repeatFetch: function () { }
                          })
                        }
                      }
                    } />
                    <ErrorTable api={this.state.api} loading={!this.state.selectedTest.data.length} selectedTest={this.state.selectedTest} handler={this.handlePushDelete} email={user.email} />
                  </div> :
                  <div className="loading">
                    <div className="dot-flashing"></div>
                  </div>}
              />
            </Routes>
          </Fragment>
        </Router>
      </div>
    );
  }

  callBackendAPI = async (refreshState) => {
    const { isAuthenticated, user } = this.props.auth0
    if (!isAuthenticated) return
    const response = await axios.get(`${this.state.api}/api/current-test/${encodeURIComponent(user.email)}`)
    const body = response.data

    if (response.status !== 200) {
      throw Error(body.message)
    }

    const test = {
      _id: "",
      test_name: "",
      user: user.nickname,
      data: body
    }
    if (body.length && this.state.selectedTest._id === "") {
      this.setState({ selectedTest: test })
    }

    if (refreshState) {
      const repeatFetch = setInterval(() => this.callBackendAPI(false), 5000)
      this.setState({
        selectedTest: test,
        repeatFetch: repeatFetch
      })
    }

    return body
  }

  getTests = async () => {
    const response = await axios.get(`${this.state.api}/api/past-tests`)
    const body = response.data

    if (response.status !== 200) throw Error(body.message)

    body ? this.setState({ pastTests: body }) : this.setState({ pastTests: [] })
  }

  handlePushDelete = async () => {
    await new Promise(r => setTimeout(r, 1000)) // wait 3 seconds for db update
    await this.getTests()
    this.setState({
      selectedTest: {
        _id: "",
        test_name: "",
        user: "",
        data: []
      }
    })
  }

}

export default withAuth0(App);
