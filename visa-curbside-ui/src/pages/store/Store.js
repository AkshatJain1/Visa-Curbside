import React, { Component } from 'react';
import { useParams } from "react-router-dom";
import Pagination from '@material-ui/lab/Pagination';
import './store.css';
import Axios from 'axios';

// const RESULTS_PER_PAGE = 8;

export const Modifier = props => {
    return (
        <div className="modifier">
            {props.item.quantity === 0
                ? ( // show add button
                    <div className="add-button" onClick={() => props.modifyCart({ itemId: props.item.id, quant: 1 })}>
                        Add
                    </div>
                )
                : ( // show "added" with - and + selector
                    <div className="added-button">
                        <div onClick={() => props.modifyCart({ itemId: props.item.id, quant: props.item.quantity - 1 })} className="added-modifier">
                            -
                        </div>
                        {props.item.quantity} Added
                        <div onClick={() => props.modifyCart({ itemId: props.item.id, quant: props.item.quantity + 1 })} className="added-modifier">
                            +
                        </div>
                    </div>
                )
            }
        </div>
    )
}

class ResultsView extends Component {


    state = {
        selectedCategory: 0,
        pageNum: 1,
        pageCount: 1,
        pageResults: [],
        recommendations: [],
        categories: []
    }

    componentDidMount() {
        this.getCategories()
        this.getRecommendations();
    }

    modifyCart = (change) => {
        console.log(change);

        let items = this.state.pageResults;
        items.forEach(item => {
            if (item.id === change.itemId) {
                item.quantity = change.quant;
            }
        })
        this.setState({ pageResults: items })

        Axios.put(`/modifyCart?store_id=${this.props.storeId}`, change, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }).then(resp => {
            this.getRecommendations()
        })
            .catch(err => {
                console.log(err);
            })
        
    }

    modifyCartRec = (change) => {

        let items = this.state.recommendations;
        items.forEach(item => {
            if (item.id === change.itemId) {
                item.quantity = change.quant;
            }
        })
        this.setState({ recommendations: items })

        Axios.put(`/modifyCart?store_id=${this.props.storeId}`, change, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        }).then(resp => {
            this.refreshResults(this.state.selectedCategory)
        })
            .catch(err => {
                console.log(err);
            })
    }

    changePage = (number) => {
        console.log(number);
        this.setState({ pageNum: number });
        this.refreshResults();
    }

    getCategories = () => {
        Axios.get(`/getStoreCategories?store_id=${this.props.storeId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(resp => resp.data)
            .then(resp => {
                this.setState({ categories: resp });
                this.refreshResults(0);
            })
            .catch(err => {
                console.log(err)
                this.props.history.push("/err/500")
            })
    }

    refreshResults = (selCat) => {
        Axios.get(`/getStoreItems?store_id=${this.props.storeId}&category=${this.state.categories[selCat]}&skip=${8 * (this.state.pageNum - 1)}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(resp => resp.data)
            .then(resp => {
                console.log(resp)
                this.setState({ pageResults: resp["items"], pageCount: resp["pageCount"] })
            })
            .catch(error => {
                console.log(error);
                this.props.history.push("/err/500")
            })
    }

    getRecommendations = () => {

        Axios.get(`/getRecommendedItems?store_id=${this.props.storeId}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
            .then(resp => resp.data)
            .then(resp => {
                console.log(resp)
                this.setState({ recommendations: resp["recommendations"] })
            })
            .catch(error => {
                console.log(error);
                // this.props.history.push("/err/500")
            })
    }

    render() {
        
        return (
            <div>

                <div className="store">
                    <div className="category-list">

                        <div className="heading" style={{ marginTop: '25px' }}>Category</div>
                        <div className="category-links">
                            {
                                // Might want to export to categories component
                                this.state.categories.map((cat, index) => {
                                    let selectedStyle = index === this.state.selectedCategory
                                        ? "category selected"
                                        : "category"
                                    return (
                                        <div onClick={() => {
                                            this.setState({ selectedCategory: index, pageNum: 1 });
                                            this.refreshResults(index);
                                        }} className={selectedStyle} key={index}>
                                            {cat}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div style={{ flex: 4 }}>
                        <div className="heading" style={{ marginTop: '25px' }}>Results</div>
                        {
                            this.state.pageResults.map(res => {
                                // might want to make a separate `ItemCard` component
                                return (
                                    <div className="item-card" key={res.id}>
                                        {console.log(res.image)}
                                        <img
                                            src={Axios.defaults.baseURL+"/"+res.image}
                                            alt={`${res.description}`}
                                            height={150}
                                            width={150}
                                        />
                                        <div className="item-name"> {res.name} </div>
                                        <div className="item-price"> {res.price} </div>
                                        <Modifier modifyCart={this.modifyCart} item={res} />
                                    </div>
                                )
                            })
                        }

                        <div className="pagination">
                            <Pagination
                                count={this.state.pageCount}
                                page={this.state.pageNum}
                                hidePrevButton={this.state.pageNum === 1}
                                hideNextButton={this.state.pageNum === this.state.pageCount}
                                onChange={(event, number) => this.changePage(number)} />
                        </div>
                        
                    </div>
                </div>



                {this.state.recommendations.length > 0 && <>
                    <div className="heading" style={{ marginLeft: '20px' }}>Recommended for you</div>
                    <div className="rec-item-div">
                        {
                            this.state.recommendations.map(res => {
                                // might want to make a separate `ItemCard` component
                                // BUG: Modifier doesn't seem to be able to find the quantity to render the button correctly
                                return (
                                    <div className="item-card" key={res.id} style={{ marginBottom: '10px', marginRight: '20px', marginLeft: '20px' }}>
                                        <img
                                            src={Axios.defaults.baseURL+"/"+res.image}
                                            alt={`${res.description}`}
                                            height={150}
                                            width={150}
                                        />
                                        <div className="item-name"> {res.name} </div>
                                        <div className="item-price"> {res.price} </div>
                                        <Modifier modifyCart={this.modifyCartRec} item={res} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </>}
            </div>
        );
    }
}

const Store = (props) => {
    let { storeId } = useParams();
    return (
        <ResultsView storeId={storeId} history={props.history} />
    );
}

export default Store;
