import React from 'react';
import Navbar from '../Navbar';
import { getUser } from '../api/auth';
import fetcher from '../api/fetcher';
import '../assets/style.css';
import ContactUs from '../shared/ContactUs.js';

export default class Company extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isBid: false,
            isWaiting: false,
            isHistory: false,
            isOrderList: false,
            isEmployee: false,
            isCompanyRequest: false,
            isClosedOrders: false,
            isBusOffer: false,
            personalInfo: {},
            personalInfoCompany: {
                role: {}
            }
        }
    }

    onClickBusOffer = () => {
        // this.setState({ isBusOffer: true });
        this.props.history.push('/company/bus_offer');
    }
    onClickBid = () => {
        // this.setState({ isBid: true });
        this.props.history.push('/company/bid');
    }
    onClickWaitingRequests = () => {
        // this.setState({ isWaiting: true });
        this.props.history.push('/company/waiting_requests');
    }
    onClickHistory = () => {
        // this.setState({ isHistory: true });
        this.props.history.push('/company/history');
    }
    onClicOrderList = () => {
        // this.setState({ isOrderList: true });
        this.props.history.push('/company/order_list');
    }
    onClickEmployee = () => {
        // this.setState({ isEmployee: true });
        this.props.history.push('/company/employees');
    }
    onClickCompanyRequest = () => {
        // this.setState({ isCompanyRequest: true });
        this.props.history.push('/company/companies_requests');
    }
    onClickHistoryRequest = () => {
        // this.setState({ isClosedOrders: true });
        this.props.history.push('/company/closed_orders');
    }    
    componentDidMount = async () => {
        console.clear()

        var person = JSON.parse(getUser());
        const { data } = await fetcher.get('/customers/myDetails');
        await this.setState({ personalInfo: data })
        await this.setState({ personalInfoCompany: person })
    }
  
    render() {

        return (
            <div  >
            {/* <body dir="rtl"> */}
                <Navbar />
                <div className="container"  >
                    <div className="row mt-3">
                        <h2 className="mr-2 font-weight-bold"> {`שלום ${this.state.personalInfo.first_name} ${this.state.personalInfo.last_name}`} </h2>
                    </div>
                    <div className="row">
                        <div className="col"></div>
                        <div className="col-md-6 col-sm-6 col-8 ">
                            <div>
                                <button id="idCompanyColor" type="button" className="btn btn-block mt-3 btn-round" onClick={this.onClicOrderList}>לוח הזמנות</button>
                            </div>
                            {/* {this.state.isOrderList && <Redirect to="/company/order_list" />} */}
                            <div>
                          
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round" onClick={this.onClickBid}>בקשת הצעת מחיר</button>
                            </div>
                            {/* {this.state.isBid && <Redirect to="/company/bid" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round" onClick={this.onClickWaitingRequests}>בקשות בהמתנה</button>
                            </div>
                            {/* {this.state.isWaiting && <Redirect to="/company/waiting_requests" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round " onClick={this.onClickHistory}>היסטורית הזמנות</button>
                            </div>
                            {/* {this.state.isHistory && <Redirect to="/company/history" />} */}
                            {this.state.personalInfoCompany.role.name === 'userCompany' ? null :
                                <div>
                                    <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round" onClick={this.onClickEmployee}>עובדים</button>
                                </div>
                            }
                            {/* {this.state.isEmployee && <Redirect to="/company/employees" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round" onClick={this.onClickHistoryRequest}>היסטורית הזמנות שמשכתי</button>
                            </div>
                            <div>
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round" onClick={this.onClickCompanyRequest}>אוטובוסים זמיניים</button>
                            </div>
                            {/* {this.state.isClosedOrders && <Redirect to="/company/closed_orders" />} */}
                            <div>
                                <button id="idCompanyColor" type="button" className="btn  btn-block mt-3 btn-round " onClick={this.onClickBusOffer}>הצעת אוטובוס</button>
                            </div>
                            {/* {this.state.isBusOffer && <Redirect to="/company/bus_offer" />} */}
                        </div>
                        <div className="col">
                            
                        </div>
                    </div>
                </div>
                        <ContactUs/>
             </div>
        )
    }
}
