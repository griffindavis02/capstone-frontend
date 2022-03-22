import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar'
import ErrorTable from './components/ErrorTable'
import SelectData from './components/SelectData'
import LoginButton from './components/Login'
import { withAuth0 } from '@auth0/auth0-react'

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
    currentData: [],
    repeatFetch: function () { }
  }

  componentDidMount() {
    // this.setState({
    //   repeatFetch: setInterval(async () => {
    //     const { isAuthenticated, getAccessTokenSilently } = this.props.auth0
    //     if (isAuthenticated) {
    //       try {
    //         const accessToken = await getAccessTokenSilently({
    //           audience: 'https://griffindavis02.us.auth0.com/api/v2/',
    //           scope: 'read:current_user'
    //         })

    //         console.log(accessToken)
    //       }
    //       catch (e) {
    //         console.log(e.message)
    //       }
    //     }

    //     // console.log(user.name)
    //   }, 5000)
    // })

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
    const { isAuthenticated } = this.props.auth0
    return (
      <div className="App">
        <Router>
          <NavBar />
          <Fragment>
            <Routes>
              <Route exact path="/" element={
                isAuthenticated ?
                  <div>
                    <SelectData tests={this.state.pastTests} onChange={
                      pId => {
                        let selectedTest = { _id: "", test_name: "", user: "", data: [] }
                        for (const test of this.state.pastTests) {
                          if (test._id === pId) {
                            selectedTest = test
                          }
                        }
                        if (!selectedTest._id) {
                          selectedTest.data = this.state.currentData
                        }
                        this.setState({
                          selectedTest: selectedTest,
                          selectedData: pId ? selectedTest.data : this.state.currentData,
                        })
                      }
                    } />
                    <ErrorTable api={this.state.api} loading={!this.state.selectedTest.data.length} selectedTest={this.state.selectedTest} handler={this.handlePushDelete} />
                  </div> :
                  <LoginButton />}
              />
            </Routes>
          </Fragment>
        </Router>
      </div>
    );
  }

  callBackendAPI = async () => {
    // const { isAuthenticated } = this.props.auth0
    // if (!isAuthenticated) return
    const response = await fetch(`${this.state.api}/api/current-test`)
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
      this.setState({ currentData: body.Data, selectedTest: test })
    }

    return body
  }

  getTests = async () => {
    // const { isAuthenticated } = this.props.auth0
    // if (!isAuthenticated) return
    const response = await fetch(`${this.state.api}/api/past-tests`)
    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)

    body ? this.setState({ pastTests: body }) : this.setState({ pastTests: [] })
  }

  handlePushDelete = async () => {
    await this.getTests()
    this.setState({
      selectedTest: {
        _id: "",
        test_name: "",
        user: "",
        data: this.state.currentData
      }
    })
  }

}

export default withAuth0(App);
