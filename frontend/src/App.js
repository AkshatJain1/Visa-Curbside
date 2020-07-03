import React, {Component} from 'react';
import './App.css';
import Header from './pages/Header'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

// PAGES
import Home from "./pages/home/Home";
import Store from "./pages/store/Store";
import Login from "./pages/login/Login";
import Checkout from "./pages/checkout/Checkout";
import OngoingOrder from './pages/ongoingOrder/Ongoing';
import ViewOrders from './pages/merchant/viewOrders/ViewOrders';
import axios from 'axios';

axios.defaults.baseURL = "https://visa-curbside-fastapi.herokuapp.com"


const ErrorPage = () => {
  return (
    <div style={{textAlign: "center"}}>
      <h1> 404: Page Not Found</h1>
    </div>
  );
};

const ErrorPageServer = () => {
  return (
    <div style={{textAlign: "center"}}>
      <h1> 500: Internal Server Error</h1>
    </div>
  );
};

const RedirectLogin = () => {
  return (
      <Redirect to="/login" />
  );
};

const RedirectOngoing = () => {
  return (
      <Redirect to="/ongoing" />
  );
};


class App extends Component {

  state = {
    hasOngoingOrder: false
  }

  componentDidMount() {
    console.log("hi")
    axios.get("/me/hasOngoing", {headers: {Authorization: "Bearer " + localStorage.getItem("token")}})
      .then(resp => resp.data )
      .then(resp => {
        console.log(resp)
        this.setState({hasOngoingOrder: resp.hasOngoing});
      })

  }

  ongoingOrderProtection = comp => {
    if (localStorage.getItem("token") == null) {
      return RedirectLogin;
    }
    // TODO: else if check if user has role of customer; 404 if not
    // TODO: check if user has an ongoing order, redirect to Home if he doesn't
    else {
      return comp;
    }
  }

  merchantRouteProtection = comp => {
    if (localStorage.getItem("token") == null) {
      return RedirectLogin;
    }
    // TODO: else if check if user has role of customer, redirect to Home if he does
    else {
      return comp;
    }
  }

  firstRouteCustomer = comp => {
    if (localStorage.getItem("token") == null) {
      return RedirectLogin; 
    }
    // TODO: else if check if user has role of customer; 404 if not
    // TODO: else if check if the user has an ongoing order; OngoingOrder if he does
    else {
      console.log(this.state.hasONgoing)
      if (this.state.hasOngoingOrder) {
        return RedirectOngoing;
      } else {
        return comp;
      }
    }
  }

  render() {
    return (
      <Router>
        <Header />
        <Switch>
          <Route path="/checkout" component={this.firstRouteCustomer(Checkout)} />
          <Route path="/login" component={Login} />
          <Route path="/store/:storeId" component={this.firstRouteCustomer(Store)} />
          <Route path="/ongoing" component={this.ongoingOrderProtection(OngoingOrder)} />
          <Route exact path='/' component={this.firstRouteCustomer(Home)} />
          
          <Route exact path='/merchant/viewOrders' component={this.merchantRouteProtection(ViewOrders)} />
          <Route path='/err/500' component={ErrorPageServer} />
          
          <Route component={ErrorPage} />
  
        </Switch>
      </Router>
    );
  }
}

export default App;