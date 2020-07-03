import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';
import { useHistory } from "react-router-dom";
import StoreRecommendations from './StoreRecommendations';
import './home.css'
import Axios from 'axios';

const containerStyle = {
    width: '90%',
    height: '60%',
    margin: 'auto'
};

const userLocationButtonStyle = {
    strokeColor: '#0000FF',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#0000FF',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 500,
    zIndex: 1
}

export const Store = props => {
    const history = useHistory();
    return (
        <div style={{ marginBottom: '40px' }}>
            <div className="store-div">
                <img src={`${Axios.defaults.baseURL}/${props.store.image}`} alt={props.store.desc} className="store-img" />
                <div className="store-inside">
                    <div className="store-name"><a target="blank" href={`https://maps.google.com/?q=${props.store.lat},${props.store.lng}`} >{props.store.name}</a></div>
                    <div className="store-line">{props.store.desc}</div>
                    <div className="store-line">{props.store.contactNumber}</div>
                    <div className="store-line">{props.store.start} - {props.store.end}</div>
                </div>
            </div>
            <div className="select-button" style={{ textAlign: 'center' }} onClick={() => history.push(`/store/${props.store.id}`)}>Select</div>
        </div>
    )
}

class Home extends Component {
    state = {
        userLoc: {
            lat: 0,
            lng: 0
        },
        merchants: [],
        selectedStore: null
    }

    componentDidMount() {
        let temp = this;
        navigator.geolocation.getCurrentPosition(function (position) {
            temp.setState({ userLoc: { lat: position.coords.latitude, lng: position.coords.longitude } })
        });

        // load merchant data from backend api
        Axios.get("/getStores", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(resp => resp.data)
            .then(data => {
                this.setState({ merchants: data },
                    console.log(data))
            })
    }

    render() {
        return (
            <div className="home-div">
                <div className="home">
                    <div className="heading" style={{ marginTop: '20px' }}>Where would you like to shop?</div>
                    <LoadScript
                        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    >
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            // center={this.state.userLoc}
                            center={{ lat: 29.749907, lng: -95.358421 }} // manually set to houston for now
                            zoom={10}
                        >
                            <Circle
                                center={this.state.userLoc}
                                options={userLocationButtonStyle}
                            />
                            {this.state.merchants.map(mer => {
                                return (
                                    <Marker
                                        key={mer.id}
                                        position={{ lat: mer.lat, lng: mer.lng }}
                                        title={mer.name}
                                        label={mer.name}
                                        onClick={() => this.setState({ selectedStore: mer })}
                                    />
                                )
                            })}
                        </GoogleMap>
                    </LoadScript>

                    {
                        this.state.selectedStore
                            ? (<Store store={this.state.selectedStore} />)
                            : (<></>)
                    }
                </div>
                {/* uncomment StoreRecommendations when store recommendations are filled out */}
                <StoreRecommendations />
            </div>
        );
    }
}

export default Home;