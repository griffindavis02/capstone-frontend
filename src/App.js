import React, { Component } from 'react';
import './App.css';
import ErrorTable from './components/ErrorTable'

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

  render() {
    return (
      <div className="App">
        <h1 className="title">Error Injection</h1>
        <ErrorTable loading={this.state.laoding} data={this.state.data}/>
        {this.state.loading ? <div className="loading">
          <div className="dot-flashing"></div>
          </div>
            : null}
      </div>
    );
  }

  // fetching the GET route from the Express server which matches the GET route from server.js
  callBackendAPI = async () => {
    const response = await fetch('/express')
    const body = await response.json()

    if (response.status !== 200) {
      throw Error(body.message) 
    }

    body.Data ? this.setState({ data: body.Data, loading: false }) : this.setState({ loading: true })
    console.log(body.Data)

    return body
  }

}

export default App;
