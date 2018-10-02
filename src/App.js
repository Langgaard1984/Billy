import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const axios = require('axios')
const accessToken = '5f25384115bca73441408a36a8da95c604a043a5'


class App extends Component {
  client = null

constructor(props) {
    super(props)
    this.client = new BillyClient(accessToken)
    this.state = {contacts: [], isLoading: false, organizationId: null, name: ''}
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    const contacts = await this.getContacts()
    this.setState({contacts, isLoading: false, organizationId: contacts.length > 0 ? contacts[0].organizationId : null})
    
  }

  render() {
    const {contacts, name, isLoading} = this.state

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <div className="App-body">
        {!isLoading && contacts.length > 0 && 
          <ul className="list">
            {contacts.map(contact =>
              <li key={contact.id} className="item">
                <div>{contact.name}</div>
                <button id={contact.id} onClick={() => {this.handleDelete(contact.id)}}>Delete
                </button>
              </li> )}
          </ul> }
          <form>
            <h2>Ny kontakt</h2>
            <div className="line">
              <label>Navn</label>
              <input type="text" name="name" value={name} onChange={this.handleChange} />
            </div>
            <button onClick={this.handleCreate}>Opret</button>
          </form>
        </div>
      </div>
    );
  }

  handleChange = (e) => {
    this.setState({name: e.target.value})
  }

  handleCreate = async(e) => {
    e.preventDefault()
    const {name, organizationId} = this.state

    this.setState({isLoading: true})
    await this.createContact(organizationId, name)

    // update list
    const contacts = await this.getContacts()
    this.setState({contacts, isLoading: false, name: ''})
    
  }

  handleDelete = async(id) => {
    this.setState({isLoading: true})
    await this.client.request('DELETE', `/contacts?ids[]=${id}`)

    // update list
    const contacts = await this.getContacts()
    this.setState({contacts, isLoading: false})
      
  }

  getContacts = async () => {
    const res = await this.client.request('GET', '/contacts')
    return res.contacts
  }

  createContact = async (organizationId, name) => {
    const contact = {
        organizationId,
        name,
        'countryId': 'DK'
    }
    const res = await this.client.request('POST', '/contacts', { contact: contact })

    return res.contacts
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



//    async function deleteContact (client, contactId) {
//    const res = await client.request('DELETE', '/contacts', {Ids: [contactId]})
//    return res.contacts
//}