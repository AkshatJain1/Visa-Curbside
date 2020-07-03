import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import './login.css';
import axios from 'axios';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class Login extends Component {
    state = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        registerOpen: false,
        wrong: false
    }
    
    componentDidMount() {
        if (localStorage.getItem("token") != null) {
            window.location.assign("/");
        }
    }

    onLogin = (evt) => {
        // post this.state.email and this.state.password to auth api
        axios.post("/auth", { "email": this.state.email, "password": this.state.password })
            .then(resp => resp.data)
            .then(data => {
                localStorage.setItem("token", data["access_token"])
                if (data["role"] === "CUSTOMER") {
                    window.location.assign("/")
                } else {
                    window.location.assign("/merchant/viewOrders")
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    this.setState({ wrong: true })
                } else {
                    this.props.history.push('/err/500')
                }
            })
    }

    toggleRegister = (evt) => {
        // show additional register fields
        this.setState({
            registerOpen: !this.state.registerOpen
        })
    }

    onSignUp = (evt) => {
        // post this.state.email and this.state.password to auth api
        axios.post("/register", { "email": this.state.email, "password": this.state.password, "first_name": this.state.firstName, "last_name": this.state.lastName, "phone_number": this.state.phoneNumber })
            .then(resp => resp.data)
            .then(data => {
                localStorage.setItem("token", data["access_token"])
                console.log(data)
                if (data["role"] === "CUSTOMER") {
                    window.location.assign("/")
                } else {
                    window.location.assign("/merchant/viewOrders")
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    this.setState({ wrong: true })
                } else {
                    this.props.history.push('/err/500')
                }
            })
    }

    render() {
        return (
            <div className="center">
                <div className="login">
                    <div className="heading">Customer Login</div>
                    <input
                        className="credential-field"
                        type="text"
                        name="email"
                        placeholder="Email"
                        onChange={(evt) => this.setState({ email: evt.target.value })}
                    />
                    <input
                        className="credential-field"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={(evt) => this.setState({ password: evt.target.value })}
                    />
                    {this.state.registerOpen &&
                        <>
                            <input
                                className="credential-field"
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                onChange={(evt) => this.setState({ firstName: evt.target.value })}
                            />
                            <input
                                className="credential-field"
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                onChange={(evt) => this.setState({ lastName: evt.target.value })}
                            />
                            <input
                                className="credential-field"
                                type="number"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                onChange={(evt) => this.setState({ phoneNumber: evt.target.value })}
                            />
                        </>
                    }
                    <div className="buttons">
                        {!this.state.registerOpen &&
                            <>
                                <div className="submit-button" style={{ width: '80px' }} onClick={this.onLogin}>Login</div>
                                <div className="submit-button" style={{ width: '200px', backgroundColor: 'white', color: 'black' }} onClick={this.toggleRegister}>Create a new account</div>
                            </>
                        }
                        {this.state.registerOpen &&
                            <>
                                <div className="submit-button" style={{ width: '80px' }} onClick={this.onSignUp}>Sign Up</div>
                                <div className="submit-button" style={{ width: '200px', backgroundColor: 'white', color: 'black' }} onClick={this.toggleRegister}>Back to login</div>
                            </>
                        }
                    </div>
                    <Snackbar open={this.state.wrong} autoHideDuration={6000} onClose={() => this.setState({ wrong: false })}>
                        <Alert onClose={() => this.setState({ wrong: false })} severity="error">
                            Wrong email or password!
                    </Alert>
                    </Snackbar>
                </div>
            </div>
        );
    }
}

export default Login;