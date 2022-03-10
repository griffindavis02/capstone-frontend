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
    api: '',
    pastTests: [],
    selectedTest: {
      _id: "",
      test_name: "",
      user: "",
      data: []
    },
    currentData: [],
    loading: true,
    repeatFetch: function () { }
  }

  componentDidMount() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      this.setState({ api: 'http://localhost:5000' })
    } else {
      this.setState({
        api: 'https://brrg-mongo-conn.herokuapp.com' // did have /api/current-test
      })
    }

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
                        let selectTest = { _id: "", test_name: "", user: "", data: [] }
                        for (const test of this.state.pastTests) {
                          if (test._id === pId) {
                            selectTest = test
                          }
                        }
                        if (!selectTest._id) {
                          selectTest.data = this.state.currentData
                        }
                        this.setState({
                          selectedTest: selectTest,
                          selectedData: pId ? selectTest.data : this.state.currentData,
                          loading: selectTest.data.length ? false : true
                        })
                      }
                    } />
                    <ErrorTable api={this.state.api} loading={this.state.loading} selectedTest={this.state.selectedTest} handler={this.handlePushDelete} />
                  </div> :
                  <LoginButton />}
              />
              {/* <Route exact path="/login" element={<Login />} /> */}
            </Routes>
          </Fragment>
        </Router>
      </div>
    );
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    // const { isAuthenticated } = this.props.auth0
    // if (!isAuthenticated) return
    const response = await fetch(`${this.state.api}/api/current-test`)
    // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    //   response = await fetch('/api/current-test')
    // } else {
    //   response = await fetch('https://brrg-mongo-conn.herokuapp.com/api/current-test')
    // }
    // const response = await fetch('https://brrg-mongo-conn.herokuapp.com/api/current-test')//`${process.env.API}/api/current-test`)
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
    } else if (this.state.selectedTest._id !== "" && this.state.selectedTest.data.length) {
      this.setState({ loading: false })
    } else {
      this.setState({ loading: true })
    }

    // body.Data.length ? this.setState({ currentData: body.Data, loading: false }) : this.setState({ loading: true })
    // if(this.state.selectedTest === "") this.setState({ selectedData: this.state.currentData })
    // this.state.selectedData.length ? this.setState({loading: false}) : this.setState({loading: true})

    return body
  }

  getTests = async () => {
    // const { isAuthenticated } = this.props.auth0
    // if (!isAuthenticated) return
    const response = await fetch(`${this.state.api}/api/past-tests`)
    // if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    //   response = await fetch('/api/past-tests')
    // } else {
    //   response = await fetch('https://brrg-mongo-conn.herokuapp.com/api/past-tests')
    // }
    // const response = await fetch('https://brrg-mongo-conn.herokuapp.com/api/past-tests')//`${process.env.API}/api/past-tests`)
    const body = await response.json()

    if (response.status !== 200) throw Error(body.message)

    body ? this.setState({ pastTests: body }) : this.setState({ pastTests: [] })
  }

  handlePushDelete = async () => {
    await this.getTests()
    this.setState({
      loading: true,
      selectedTest: {
        _id: "",
        test_name: "",
        user: "",
        data: this.state.currentData
      }
    })
    console.log(this.state.selectedTest._id)
  }

}

export default withAuth0(App);
