import React, { Component } from 'react';
import { Store } from './Home.js'
import Axios from 'axios';
import './home.css'

export class StoreRecommendations extends Component {
  state = {
    recommendations: []
  }

  componentDidMount() {
    // load merchant data from backend api
    Axios.get(`/getRecommendedStores`, {
      headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
    })
      .then(resp => resp.data)
      .then(resp => {
        console.log(resp)
        this.setState({ recommendations: resp["recommendations"] }) // list of store ids
      })
      .catch(error => {
        console.log(error);
        this.props.history.push("/err/500")
      })
  }

  render() {
    return (<div>
      {this.state.recommendations.length > 0 &&
        <div className="recommendations">
          <div className="heading" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>Recommended Stores For You</div>
          {this.state.recommendations.map(mer => {
            return (
              <Store store={mer} />
            )
          })
          }
        </div>
      }
    </div>
    )
  }
}

export default StoreRecommendations
