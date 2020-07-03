import React, { Component } from 'react';
import { Modifier } from '../store/Store';
import Axios from 'axios';

export default class ReviewCart extends Component {

    state = {
        pageResults: [],
        storeId: 0
    }

    componentDidMount() {
        // get pageResults from API
        Axios.get("/myLatestCart", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(resp => resp.data)
            .then(resp => {
                this.setState({ pageResults: resp.items, storeId: resp.store_id })
                this.props.setStoreId(resp.store_id)
            })
            .catch(err => {
                console.log(err)
            })

    }

    modifyCart = (change) => {
        let items = this.state.pageResults;
        items.forEach(item => {
            if (item.id === change.itemId) {
                item.quantity = change.quant;
            }
        })
        this.setState({ pageResults: items })

        Axios.put(`/modifyCart?store_id=${this.state.storeId}`, change, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        let totalPrice = 0;
        this.state.pageResults.forEach(item => totalPrice += item.price * item.quantity)
        return (
            <div className="review">
                <div className="cart-heading">
                    <div>Cart</div>
                    <div>${totalPrice.toFixed(2)}</div>
                </div>
                <div className="cart-div">
                    {
                        this.state.pageResults.map(item => {
                            return (
                                <div key={item.id} className="cart-item" >
                                    <h1 style={{ width: 80 }}>{item.quantity} x</h1>
                                    <img src={Axios.defaults.baseURL+"/"+item.image} alt={item.name} width={100} height={100} />
                                    <h4 style={{ width: 100 }}>{item.name}</h4>
                                    {
                                        (this.props.canModify)
                                            ? <div style={{ width: 120 }}><Modifier item={item} modifyCart={this.modifyCart} /></div>
                                            : <></>
                                    }
                                    <b style={{ width: 100 }}>${item.price}</b>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
