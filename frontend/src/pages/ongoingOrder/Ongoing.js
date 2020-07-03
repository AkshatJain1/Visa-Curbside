import React, { Component } from 'react';
import ReviewCart from "../checkout/ReviewCart";
import './ongoing.css'
import Axios from 'axios';

class OngoingOrder extends Component {
    state = {
        parkingSpot: "",
        orderPickupTime: "7:30pm",
        orderPickupStore: "HEB",
        lat: 0, 
        lng: 0
    }

    componentDidMount() {
        // query API to get existing Order Details: "" if parkingSpot not set
        Axios.get("/myLatestOrder", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(resp => resp.data)
        .then(resp => {
            console.log(resp)
            this.setState({parkingSpot: resp["parking_number"], 
            orderPickupTime: resp["pickup_slot"], orderPickupStore: resp["store_name"], 
            lat: resp["lat"], 
            lng: resp["lng"] })
        })
        .catch(err => {
            console.log(err)
        })

    }

    changeParkingSpot = () => {
        // call api to set this.state.parkingSpot
        Axios.post("/orderParking", {parkingNum: this.state.parkingSpot}, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
    }

    render() {
        return (
            <div style={{marginTop: "5%", textAlign: "center"}}>
                <div className="heading">Your order is set for {this.state.orderPickupTime} at <a target="blank" href={`https://maps.google.com/?q=${this.state.lat},${this.state.lng}`}>{this.state.orderPickupStore}</a> </div>
                
                <div style={{ marginTop: "5%", display: "flex", justifyContent: "space-around", alignContent: "center", }}>
                    <ReviewCart />
                    
                    <div className="parking-info">
                        <div className="heading">Arrived?</div>
                        <div style={{marginBottom: '20px'}}>Select your parking spot</div>
                        <input className="checkout-field" type="number" value={this.state.parkingSpot} onChange={(evt) => this.setState({parkingSpot: evt.target.value})} />
                        <div className="submit-button" onClick={this.changeParkingSpot}>Send</div>                
                    </div>
                </div>
            </div>
        );
    }
}

export default OngoingOrder;