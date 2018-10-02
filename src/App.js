import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios')


class App extends Component {

constructor(props) {
    super(props)
    this.state = {contacts: [], isLoading: false}; 
  }

  async componentDidMount() {
    const client = new BillyClient('5f25384115bca73441408a36a8da95c604a043a5')
    this.setState({isLoading: true})
    await getContacts(client).then(contacts => {
      this.setState({contacts, isLoading: false})
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <body className="App-body">
        {!this.state.isLoading ? 
        <table className="contact-list">
          <tbody>
            {this.state.contacts.map(contact => 
              <tr>
                <td>{contact.name}</td> 
              </tr>)}
          </tbody>
        </table> : null
        }
        </body>
      </div>
    );
  }
}

export default App;



class BillyClient {
    constructor (apiToken) {
        this.apiToken = apiToken
    }

    async request (method, url, body) {
        try {
            const res = await axios({
                baseURL: 'https://api.billysbilling.com/v2',
                method,
                url,
                headers: {
                    'X-Access-Token': this.apiToken,
                    'Content-Type': 'application/json'
                },
                data: body
            })

            if (res.status >= 400) {
                throw new Error(`${method}: ${url} failed with ${res.status} - ${res.data}`)
            }

            return res.data
        } catch (e) {
            console.error(e)
            throw e
        }
    }

}

    async function getContacts (client) {
    const res = await client.request('GET', '/contacts')
    return res.contacts
}
