import React, { Component } from 'react';
import MerchantSettings from './MerchantSettings';
import './viewOrders.css';
import Axios from 'axios';

function OrderItems(props) {
    return (
        <div>
            {
                props.items.map((item, index) => {
                    return (
                        <div key={index}>
                            <div >{item.quantity} x {item.itemName}</div>
                        </div>
                    )
                })
            }
        </div>
    )
}

function OneOrder(props) {
    return (
        <div className="one-order">
            <div className="order-info">
                <div className="view-orders-subheading">{props.order.time}</div> 
                {props.order.parkingSpot && <div className="view-orders-subheading" style={{ color: 'rgb(0,180,0)' }}>
                                                        Waiting in spot {props.order.parkingSpot}</div>} 
                {props.order.first} {props.order.last}
                <div className="submit-button" onClick={props.onChange}>Mark Complete</div>
            </div>
            <OrderItems items={props.order.items} />
        </div>
    )
}

class ViewOrders extends Component {
    state = {
        orders: []
    }

    setOrders = () => {
        // query API for updated orders
        // set state to new orders
        Axios.get("/orders", {headers: {Authorization: "Bearer " + localStorage.getItem("token")}})
            .then(resp => resp.data)
            .then(resp => {
                this.setState({orders: resp})
            })
            .catch(err => {
                console.log(err)
            })
    }

    markOrderComplete = id => {
        let canComplete = true;
        this.state.orders.forEach(order => {
            if (order.id === id && !order.parkingSpot) {
                alert("Error: Cannot mark complete if the customer does not have an assigned spot.")
                canComplete = false;
            }
        });

        if (canComplete) {
            Axios.put("/markComplete", {order_id: id}, {headers: {Authorization: "Bearer " + localStorage.getItem("token")}})
                .catch(err => {
                    console.log(err)
                })
            this.setState({ orders: this.state.orders.filter(obj => obj.id !== id) })
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.setOrders, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="view-orders">
                <div>
                    
                    <div className="heading">New Orders</div>
                    {
                        this.state.orders.map(order => {
                            return (
                                <OneOrder key={order.id} order={order} onChange={() => this.markOrderComplete(order.id)} />
                            )
                        })
                    }
                    <MerchantSettings />
                </div>
            </div>
        );
    }
}

export default ViewOrders;