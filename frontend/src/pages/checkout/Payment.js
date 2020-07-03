import React, { Component } from 'react';

class Payment extends Component {
    render() {
        return (
            <div style={{ textAlign: "center" }}>
                <div className="heading" style={{ marginTop: '25px' }}>Checkout</div>
                <div dangerouslySetInnerHTML={{ __html: '<iframe src="visaCheckout.html?time=' + this.props.time + '" frameBorder="0" width="400" height="550"></iframe>' }} />
            </div>
        );
    }
}

export default Payment;
