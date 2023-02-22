import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Navbar';
import fetcher from '../api/fetcher';
import ContactUs from '../shared/ContactUs.js'
export default class Customer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isBid: false,
            isWaiting: false,
            isHistory: false,
            personalInfo: {

            }
        }

    }
    onClickBid = () => {
        
        this.props.history.push('/customer/bid');
        // this.setState({ isBid: true });
    }
    onClickRequestsInWaiting = () => {

        this.props.history.push('/customer/waiting_requests');

        // this.setState({ isWaiting: true });
    }
    onClickHistory = () => {
        this.props.history.push('/customer/history');
        // this.setState({ isHistory: true });
    }
    componentDidMount = async () => {
        console.clear()

        const { data } = await fetcher.get('/customers/myDetails');
        await this.setState({ personalInfo: data })
    }


    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row mt-4">
                        <h1 className="mr-2"> {`שלום ${this.state.personalInfo.first_name} ${this.state.personalInfo.last_name}`} </h1>
                    </div>
                    <div className="row mt-4">
                        <div className="col"></div>
                        <div className="col-md-6 col-sm-6 col-8 ">
                            <div>
                                <button id="idCompanyColor" type="button" className="btn btn-round btn-block mt-3" onClick={this.onClickBid}>בקשת הצעת מחיר</button>
                            </div>
                            {/* {this.state.isBid && <Redirect to="/customer/bid" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn btn-round btn-block mt-3" onClick={this.onClickRequestsInWaiting}>בקשות בהמתנה</button>
                            </div>
                            {/* {this.state.isWaiting && <Redirect to="/customer/waiting_requests" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn btn-round btn-block mt-3" onClick={this.onClickHistory}>היסטורית הזמנות</button>
                            </div>
                            {/* {this.state.isHistory && <Redirect to="/customer/history" />} */}
                        </div>
                        <div className="col"></div>
                    </div>
                </div>
                <div id="customerPage">
                <ContactUs/>

                </div>
            </div>
        )
    }
}
