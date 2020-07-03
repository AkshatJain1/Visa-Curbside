import React, { Component } from 'react'
import axios from 'axios';
import './viewOrders.css';

export class MerchantSettings extends Component {
  state = {
    slotFrequency: 15,
    slotCapacity: 5
  }

  componentDidMount() {
    axios.get("/storeSettings", {headers: {Authorization: "Bearer " + localStorage.getItem("token")} })
      .then(resp => resp.data)
      .then(resp => {
        this.setState(resp)
      })
  }

  updateFrequency = (evt) => {
    //TODO: replace dummy endpoint with the real one we create
    axios.post("/storeFrequency", { "slotFrequency": this.state.slotFrequency }, {headers: {Authorization: "Bearer " + localStorage.getItem("token")} })
      .catch(error => {
        console.log(error)
      })
  }

  updateCapacity = (evt) => {
    //TODO: replace dummy endpoint with the real one we create
    axios.post("/storeCapacity", { "slotCapacity": this.state.slotCapacity }, {headers: {Authorization: "Bearer " + localStorage.getItem("token")} })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    return (
      <div>
        <div className="heading" style={{ marginTop: '40px' }}>Settings</div>
        <div className="settings-line">
          <div className="settings-text">Currently taking orders every {this.state.slotFrequency} minutes</div>
          <input
            className="settings-field"
            type="text"
            name="slotFrequency"
            placeholder="New Frequency"
            onChange={(evt) => this.setState({ slotFrequency: evt.target.value })}
          />
          <div className="submit-button" style={{ width: '75px', marginBottom: '20px' }} onClick={this.updateFrequency}>Update</div>
        </div>
        <div className="settings-line">
          <div className="settings-text">Currently taking {this.state.slotCapacity} orders per time slot</div>
          <input
            className="settings-field"
            type="text"
            name="email"
            placeholder="New Capacity"
            onChange={(evt) => this.setState({ slotCapacity: evt.target.value })}
          />
          <div className="submit-button" style={{ width: '75px', marginBottom: '20px' }} onClick={this.updateCapacity}>Update</div>
        </div>
      </div>
    )
  }
}

export default MerchantSettings
