import React, { Component } from 'react';
import Axios from 'axios';
import "./checkout.css";

class TimeSelection extends Component {

    state = {
        timeArr: [],
        time: "",
    }

    componentDidMount() {
        Axios.get(`/storeAvailability?store_id=${this.props.storeId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
            .then(resp => resp.data)
            .then(resp => {
                this.setState({ timeArr: resp })
            })
            .catch(error => {
                console.log(error);
            })
    }

    setTime = (ntime) => {
        this.setState({time: ntime})
        this.props.selectPickupTime(ntime)
    }


    render() {
        return (
            <div className="time-select">
                <div className="heading">Select Your Time</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {
                        this.state.timeArr.map((day, index) => {
                            let header;
                            if (index !== 0) {
                                header = day[0]["value"].split(",")[0]
                            } else {
                                header = "Today"
                            }
                            return (
                                <div key={index}>
                                    <h3>{header}</h3>
                                    <div>
                                        {
                                            day.map((time, ind) => {
                                                let style = {}
                                                if (this.state.time === time["value"]) {
                                                    style = {fontWeight: "bold", backgroundColor: "lightblue"}
                                                }
                                                return (
                                                    <div key={time["value"]} onClick={() => this.setTime(time["value"])} className="time" style={style}>{time["text"]}</div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

export default TimeSelection;