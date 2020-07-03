import React, { Component } from 'react';
import "./checkout.css";

import ReviewCart from "./ReviewCart"
import TimeSelection from './TimeSelection';
import Payment from './Payment';

class Checkout extends Component {
    state = {
        page: 1,
        storeId: -1,
        time: ''
    }

    setStoreId = (storeId) => {
        if (this.state.storeId === -1) {
            this.setState({ storeId: storeId })
        }
    }

    changePage(pg) {
        this.setState({ page: pg })
    }

    selectPickupTime = (timeValue) => {
        this.setState({time: timeValue})
    }

    render() {
        return (
            <div>
                <div className="checkout-div">
                    <ReviewCart canModify={true} setStoreId={this.setStoreId} />
                    {
                        this.state.storeId !== -1
                            ? <TimeSelection storeId={this.state.storeId} selectPickupTime={this.selectPickupTime} />
                            : <></>
                    }
                    <Payment time={this.state.time} />
                </div>
            </div>
        );
    }
}

export default Checkout;