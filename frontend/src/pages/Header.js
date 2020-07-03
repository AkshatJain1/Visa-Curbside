import React, { Component } from 'react';
import logo from '../../dist/assets/visa.png'
import cart from '../../dist/assets/cart.png'
import './pages.css'
import { withRouter, Link } from 'react-router-dom';

const Header = withRouter(props => <HeaderConfig {...props} />);

class HeaderConfig extends Component {

    conPaths = ["/login", "/", "/ongoing"]
    notLogoutPaths = ["/login"]

    constructor(props) {
        super(props);
        this.state = {
            query: ""
          };
    }

    search = (e) => {
        if(e.key === 'Enter') {
            // query is already saved in state, execute search logic now  
            console.log(this.state.query);    
        }
    }

    saveQuery = (event) => {
        this.setState({
          query: event.target.value
        })
      }

    render() {
        return (
            <div className="header">
                <Link to="/">
                    <img src={logo} className="header-img" alt="Visa Logo" />
                </Link>
                {
                    this.conPaths.includes(this.props.location.pathname)
                    ? <></>
                    : (<>
                    {/* <input
                        type="text"
                        placeholder="Search for products"
                        className="header-search"
                        onChange={this.saveQuery}
                        onKeyDown={this.search}
                    /> */}

                        {/* replace with shopping cart link when completed  */}
                        <Link to="/checkout">
                            <img src={cart} className="header-img" alt="Shopping Cart" />
                        </Link>
                        </>
                    )
                }
                {
                    this.notLogoutPaths.includes(this.props.location.pathname)
                    ? <></>
                    : <div className="submit-button" style={{width:'100px'}} onClick={() => {localStorage.clear(); window.location.assign("/login")}}>Logout</div>
                }
            </div>
        );
    }
}

export default Header;