import React from 'react';

import { Redirect } from 'react-router-dom';
import Navbar from '../Navbar';
import Table from '../shared/Table';
import fetcher from '../api/fetcher';

export default class ClosedOrders extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cancelBtn: false,
            closedOrders: [],
            dataAvailableVehicles:[],
        }
    }
    vipHeaders = [
        { key: "id", value: "הזמנות שבוצעו", toSort: false },
    ];
    vehiclesHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "id", value: "תאריך יציאה", toSort: false },
        { key: "id", value: "תאריך חזרה", toSort: false },
        { key: "id", value: "שעת יציאה", toSort: false },
        { key: "id", value: "שעת חזרה", toSort: false },
        { key: "id", value: "סוג רכב", toSort: false },
        { key: "id", value: "שם חברה", toSort: false },
        { key: "id", value: "שם עובד", toSort: false },
    ];
    ordersHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "id", value: "נקודת התחלה", toSort: false },
        { key: "id", value: "נקודת סיום", toSort: false },
        { key: "id", value: "תאריך יציאה", toSort: false },
        { key: "id", value: "תאריך חזרה", toSort: false },
        { key: "id", value: "שם לקוח", toSort: false },
        { key: "id", value: "שם עובד", toSort: false },
    ];
    vipData = [
        { key: 'נסיעה מחיפה לתל אביב משעה 10:00 עד שעה 17:00' },
        { key: '  נסיעה מעפולה לטבריה משעה 8:00 עד שעה 14:00' },
        { key: '  נסיעה מעפולה לנצרת משעה 9:00 עד שעה 21:00' },
    ]
    vehicleHeaders = [
        { key: "id", value: "אוטובוסים שנמשכו", toSort: false },
    ];

    onCancelClicked = () => {
        // this.setState({ cancelBtn: true })
        // this.props.history.push('/company')
        this.props.history.goBack();
    }

    componentDidMount = async () => {
        try {
            console.clear()

            // const pathCustomerOrCompany = window.location.pathname.split('/')[1];
            // if (pathCustomerOrCompany === 'company') {
            const dataOrders  = await fetcher.get('/companies/get_closed_orders_by_my_company');
            const dataAvailableVehicles = await fetcher.get('/companies/closed_available_vehicles_by_my_company');
            await this.setState({ closedOrders: dataOrders.data.closed , dataAvailableVehicles: dataAvailableVehicles.data.closedOrders});
            // } 
        } catch (error) {

        }
    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="container text-right">
                    <h1 className=" pt-4"> היסטורית הזמנות </h1>
                    <h4 className="font-weight-bold mt-3" style={{color:"green"}}> הזמנות אשר נשלפו ע''י אחד מעובדי החברה </h4>
                    <div className="">
                        <Table
                            header={this.ordersHeaders}
                            data={this.state.closedOrders.map(data => {
                                return ({
                                    closedOrderId: data.serial_number,
                                    start_point: data.start_point, destination: data.destination,
                                    orderStartDate: data.orderStartDate, orderEndDate: data.orderEndDate, customerName: data.customerName, userCompanyName:data.userCompanyName 
                                });
                            })}
                            sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                            className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        </Table>

                    </div>
                    <h1 className="pt-4"> היסטורית אוטובוסים </h1>
                    <h4 className="font-weight-bold mt-3" style={{color:"green"}}>  הזמנות אשר נשלפו ע''י אחד מעובדי החברה אשר נשלפו מחברות אחרות</h4>
                    <Table
                        header={this.vehiclesHeaders}
                        data={this.state.dataAvailableVehicles.map(data => {
                            return ({ closedOrderId: data.serial_number,
                                 start_hour: data.startDate,end_hour:data.endDate,
                                 availableVehicleStartDate:data.startHour, availableVehicleEndDate:data.endHour,
                                 vehicleType:data.vehicleType + ' ' + data.capacity,companyName: data.companyName,customerName:data.userCompanyName
                                });
                            })}
                            sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                            className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                        </Table>
                    <div className="row">
                        <div className="col-md-2 col-sm-10">
                            <div className="form-group mt-3 d-flex align-items-right">
                                <button type="button" className="btn btn-danger btn-block" onClick={this.onCancelClicked}> חזרה</button>
                            </div>
                            {this.state.cancelBtn && <Redirect to="/company" />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}