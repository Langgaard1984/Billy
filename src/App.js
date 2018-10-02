import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios')
const accessToken = '5f25384115bca73441408a36a8da95c604a043a5'


class App extends Component {

constructor(props) {
    super(props)
    this.state = {contacts: [], isLoading: false, organizationId: null}; 
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const client = new BillyClient(accessToken)
    this.setState({isLoading: true})
    await getContacts(client).then(contacts => {
      this.setState({contacts, isLoading: false, organizationId: contacts[0].organizationId})
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="App-body">
        {!this.state.isLoading ? 
        <div className="list">
            {this.state.contacts.map(contact =>
              <div key={contact.id} className="item">
                <div className="">{contact.name}</div>
                <div className=""><button id={contact.id} onClick={this.handleDelete}>Delete</button></div>
              </div>)}
          </div> : null
        }
        <div className="form">
          <h>Ny kontakt</h>
          <div className="line">
          <label>Navn</label><input type="text"/>
          <button onClick={this.handleCreate}>Opret</button>
          </div>
        </div>
        </div>
      </div>
    );
  }

  async handleCreate(e) {
    e.preventDefault()
  }

  async handleDelete(e) {
    e.preventDefault()
    console.log(e.target.id)
    //const client = new BillyClient(accessToken)
    //this.setState({isLoading: true})
    //await deleteContact(client, e.target.id).then(contacts => {
    //  this.setState({contacts, isLoading: false})
    //})
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

//    async function deleteContact (client, contactId) {
//    const res = await client.request('DELETE', '/contacts', {Ids: [contactId]})
//    return res.contacts
//}

async function createContact (client, organizationId, name) {
    const contact = {
        'organizationId': organizationId,
        'name': name,
        'countryId': 'DK'
    }
    const res = await client.request('POST', '/contacts', { contact: contact })

    return res.contacts
}