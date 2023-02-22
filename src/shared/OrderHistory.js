import React from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from '../Navbar';
import Table from './Table';
import fetcher from '../api/fetcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFull } from '@fortawesome/free-solid-svg-icons';
export default class OrderHistory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history:[],
            historyOneTookThem:[],
            backCustomerHistory: false,
            backCompanyHistory: false,
            historyColor:false,
            allHistoryVehicles:[],
            closedVehicles:[],
            ifCompanyBus:false,
        }
    }
    vipHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "startDate", value: "תאריך יציאה", toSort: false },
        { key: "endDate", value: "תאריך חזרה", toSort: false },
        { key: "start", value: "נקודת יציאה", toSort: false },
        { key: "destination", value: "נקודת חזרה", toSort: false },
        { key: "customerName", value: "שם עובד", toSort: false },
        { key: "companyName", value: "שם חברה", toSort: false }
    ];

    vehicleHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "start", value: "תאריך יציאה", toSort: false },
        { key: "end", value: "תאריך חזרה", toSort: false },
        { key: "vehicleType", value: "סוג רכב", toSort: false },
        { key: "customerName", value: "שם עובד", toSort: false },
        { key: "companyName", value: "שם חברה", toSort: false }
    ];
    vipData = [
        { key: 'נסיעה מחיפה לתל אביב' },
        { key: 'נסיעה מעפולה לטבריה' },
        { key: 'נסיעה מכפר קרע לאפקה תל אביב' },
    ]

    componentDidMount = async() => {
        // const  checkRequest= await fetcher.get('/companies/closed_available_vehicles_by_my_company')
        try{
            console.clear()
            const pathCustomerOrCompany = window.location.pathname.split('/')[1];
            if (pathCustomerOrCompany === 'company') {
                //Green
                const {data} = await fetcher.get('/orders/getusercompanyordersandonetookthem');
                const closedVehicles = await fetcher.get('/companies/closed_available_vehicles_by_my_company_customer');
                this.setState({historyOneTookThem:data.ordersList,historyColor:true , closedVehicles: closedVehicles.data.closedOrders,ifCompanyBus:true })
                
                //Red
                const noOneTookOrder = await fetcher.get('/orders/getusercompanyordersandnoonetookthem');
                const vehicleExpired = await fetcher.get('/companies/customer_available_vehicles_expired');
             
                this.setState({history:data.ordersList.concat(noOneTookOrder.data.ordersList) , allHistoryVehicles: (closedVehicles.data.closedOrders.length > 0 || vehicleExpired.data.availableVehicles) ? (closedVehicles.data.closedOrders).concat(vehicleExpired.data.availableVehicles) : []});
            
            }else if (pathCustomerOrCompany === 'customer') {
                //Green
                const {data} = await fetcher.get('/orders/getuserordersandonetookthem');
                const  noOneTookOrderCustomer= await fetcher.get('/orders/getuserordersandnoonetookthem');
                // const  checkRequest= await fetcher.get('/companies/closed_available_vehicles_by_my_company')
                this.setState({history:data.ordersList.concat(noOneTookOrderCustomer.data.ordersList), historyOneTookThem:data.ordersList,historyColor:true })
            }
        }catch(error){

        }
    }
    backButtonCompanyOrCustomer = () => {
    //     const pathCustomerOrCompany = window.location.pathname.split('/')[1];
    //     if (pathCustomerOrCompany === 'company') {
    //         this.setState({ backCompanyHistory: true });
    //     } else if (pathCustomerOrCompany === 'customer') {
    //         this.setState({ backCustomerHistory: true });
    //     }
        this.props.history.goBack();
    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 text-right mt-5">
                            <h1>היסטורית הזמנות</h1>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-12 text-right">

                            <FontAwesomeIcon className="fa mt-2" icon={faSquareFull} color={'green'}></FontAwesomeIcon>
                            &nbsp;	
                            <label >הזמנות נשלפו ע"י חברות</label>
                   
                        </div>

                 </div>

                     <div className="row">
                        <div className="col-md-12 text-right">

                            <FontAwesomeIcon className="fa mt-2" icon={faSquareFull} color={'red'}></FontAwesomeIcon>
                            &nbsp;	
                            <label>הזמנות שלא נשלפו ע"י חברות או שעבר התאריך שלהם.</label>
                   
                        </div>

                 </div>
                    <div className="text-right mt-2">
                 
                    <Table
                    historyOneTookThem={this.state.historyOneTookThem.length}
                    historyColor={this.state.historyColor}
                    header={this.vipHeaders}
                    // expired={this.state.history.map(orderExpired=>{
                        //     return orderExpired.expired
                        // })}
                        history={this.state.history}
                        data={this.state.history.map(order => {
                            // order.expired ===1 ?startDate
                            return ({orderId: order.serial_number, start_date: order.startDate || order.start_date , endDate: order.endDate || order.end_date,
                                start: order.start_point, destination: order.destination,  customerName: order.customerName,
                                companyName: order.companyName || '-'  
                            })
                        })
                    }
                        sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                        >
                    </Table>
                    </div>
                    {this.state.ifCompanyBus ? 
                    <div>
                    {/* <h1 className="mb-4 pb-4 pt-4 float-right"> היסטורית אוטובוסים</h1> */}


                    <div className="row">
                        <div className="col-md-12 col-sm-12 text-right mt-5">
                            <h1>היסטורית אוטובוסים</h1>
                        </div>
                    </div>
                    
                    {/* <div className="text-right"> */}
                    <Table
                    closedVehiclesLength={this.state.closedVehicles.length} //8
                    historyColor={this.state.historyColor}
                        header={this.vehicleHeaders}
                        // expired={this.state.history.map(orderExpired=>{
                        //     return orderExpired.expired
                        // })}
                        allHistoryVehicles={this.state.allHistoryVehicles}
                        data={this.state.allHistoryVehicles.map(order => {
                            // order.expired ===1 ?
                            return ({orderId: order.serial_number, start: order.startDate || order.start_date, end:order.endDate || order.end_date,vehicleType: (order.type || order.vehicleType) + ' ' + order.capacity,
                            customerName: order.customerName,companyName: order.companyName|| '-'  
                            })
                        })
                    }
                        sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                        >
                    </Table>
                    {/* </div> */}
                    </div>:null
                     }
                    <div className="row">
                        <div className="col-md-2 col-sm-10">
                            <div className="form-group mt-3  d-flex align-items-right">
                                <button type="button" className="btn btn-danger btn-block" onClick={this.backButtonCompanyOrCustomer}> חזרה</button>
                            </div>
                        </div>
                    </div>


                </div>
                {this.state.backCompanyHistory && <Redirect to="/company" />}
                {this.state.backCustomerHistory && <Redirect to="/customer" />}
            </div>
        )
    }
}