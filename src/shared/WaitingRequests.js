import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Redirect, Link } from 'react-router-dom';
import PopUp from '../shared/PopUp';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Table from './Table';
import Navbar from '../Navbar';
import fetcher from '../api/fetcher';
import Swal from 'sweetalert2';
// var CryptoJS = require("crypto-js");

export default class WaitingRequests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            backCompanyWating: false,
            backCustomerWating: false,
            isCancelWait: false,
            dataWatingTable: [],
            customerOrCompany: '',
            addModalShow: false,
            idDelete: false,
            isDeleteOrder: false,
            availableVehiclesWaiting: [],
            companyTable: false,
            stateName: '',
            role: '',
            customerPath: '',
            hasNext: false,
            hasPrev: false,
            hasNext2: false,
            hasPerv2: false,
            page: 1,
            size: 5,

            page2: 1,
            size2: 5,
            pathCustomerOrCompanyFromAdminID: null
        }
    }
    vipHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "id", value: "מוצא", toSort: false },
        { key: "id", value: "יעד", toSort: false },
        { key: "idEmployee", value: "שם עובד", toSort: false },
        { key: "id", value: "", toSort: false }
    ];

    vehiclesHeaders = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "id", value: "תאריך יציאה", toSort: false },
        { key: "id", value: "תאריך חזרה", toSort: false },
        // { key: "id", value: "סוג רכב", toSort: false },
        { key: "id", value: "שם עובד", toSort: false },
        { key: "id", value: "", toSort: false }
    ];

    vipHeadersCustomer = [
        { key: "id", value: "מס' הזמנה", toSort: false },
        { key: "id", value: "מוצא", toSort: false },
        { key: "id", value: "יעד", toSort: false },
        // { key: "idEmployee", value: "שם עובד", toSort: false },
        { key: "id", value: "", toSort: false }
    ];

    onPupUpClicked = (id, stateName) => {
        this.setState({ isDeleteOrder: true, addModalShow: true, idDelete: id, stateName: stateName })
    }

    onCancelClicked = () => {
        this.setState({ isCancelWait: true });
    }
    componentDidMount = async () => {
        try {
            console.clear();
            // const { redirctRole } = this.props.location.state
            // await this.setState({ role: redirctRole })
            const pathCustomerOrCompany = window.location.pathname.split('/')[1];
            this.setState({ customerPath: pathCustomerOrCompany })
            const pathCustomerOrCompanyFromAdminID = window.location.pathname.split('/')[3];
            const pathCustomerOrCompanyFromAdmin = window.location.pathname.split('/')[2];

            if (pathCustomerOrCompany === 'company') {

                const { data } = await fetcher.get(`/orders/company_waiting_orders`);

                const availableBus = await fetcher.get(`/companies/customer_company_available_vehicles?size=${this.state.size2}`);
                if (data.ordersList.length < 1 && availableBus.data.availableVehicles.length < 1) {
                    this.setState({ noResult: true, dataWatingTable: [], availableVehiclesWaiting: [], hasPrev: false, hasNext: false, hasPrev2: false, hasNext2: false })
                } else {
                    await this.setState({ dataWatingTable: data.ordersList, availableVehiclesWaiting: availableBus.data.availableVehicles, hasNext2: availableBus.data.hasNext, hasPrev2: availableBus.data.hasPrev, hasNext: data.hasNext, hasPrev: data.hasPrev });

                }

            } else if (pathCustomerOrCompany === 'customer') {
                const { data } = await fetcher.get('/orders/waiting_orders');
                await this.setState({ dataWatingTable: data.ordersList, hasNext: data.hasNext, hasPrev: data.hasPrev, companyTable: true })

            } else if (pathCustomerOrCompanyFromAdminID) {
                const { data } = await fetcher.get(`/admin/waiting_orders/${pathCustomerOrCompanyFromAdminID}`);
                this.setState({ dataWatingTable: data })
                if (pathCustomerOrCompanyFromAdmin !== 'customer') {
                    const dataBus = await fetcher.get(`/admin/waiting_available_vehicles/${pathCustomerOrCompanyFromAdminID}`)
                    if (dataBus.data.length >= 0) {
                        this.setState({ availableVehiclesWaiting: dataBus.data })
                    }
                } else {
                    this.setState({ companyTable: true })
                }
                // this.setState({ noResult: true, dataWatingTable: [], availableVehiclesWaiting: [], hasPrev: false, hasNext: false, hasPrev2: false, hasNext2: false })
            }
            this.setState({ customerOrCompany: pathCustomerOrCompany, pathCustomerOrCompanyFromAdminID: pathCustomerOrCompanyFromAdminID })

        } catch (error) {

        }
    }

    excludeFromStateArrayById = async (id, stateName) => {
        try {
            if (stateName === 'order') {
                const data = await fetcher.delete(`/orders/${id}`);
                let filteredArray = this.state.dataWatingTable.filter(item => item.id !== id);
                this.setState({ ...this.state.dataWatingTable, dataWatingTable: filteredArray, addModalShow: false });
                if (data.status === 200) {
                    Swal.fire({
                        title: `${data.data}`,
                        icon: 'success',
                        confirmButtonText: 'סיום',
                    })
                }
            } else if (stateName === 'busOffer') {
                const data = await fetcher.delete(`/companies/available_vehicles/${id}`);
                let filteredArray = this.state.availableVehiclesWaiting.filter(item => item.id !== id);
                this.setState({ ...this.state.availableVehiclesWaiting, availableVehiclesWaiting: filteredArray, addModalShow: false });
                if (data.status === 200) {
                    Swal.fire({
                        title: `${data.data}`,
                        icon: 'success',
                        confirmButtonText: 'סיום',
                    })
                }
            }
        } catch (error) {

        }
    }

    backButtonCompanyOrCustomer = () => {

        // const pathCustomerOrCompany = window.location.pathname.split('/')[1];

        // if (pathCustomerOrCompany === 'company') {

        //     this.setState({ backCompanyWating: true });
        // } else if (pathCustomerOrCompany === 'customer') {
        //     this.setState({ backCustomerWating: true });
        // }

        this.props.history.goBack();
        // this.setState({customerOrCompany: pathCustomerOrCompany})
    }
    onClickPrevNextCompany = async (size, page, stateName) => {
        try {
            if (stateName === 'hasNext') {
                await this.setState(prevState => ({
                    page: prevState.page += 1
                }))
            } else {
                await this.setState(prevState => ({
                    page: prevState.page -= 1
                }))
            }
            const { data } = await fetcher.get(`/orders/company_waiting_orders?size=${size}&page=${this.state.page}`);
            this.setState({ hasPrev: data.hasPrev, hasNext: data.hasNext, noResult: false, dataWatingTable: data.ordersList })
        } catch (error) {

        }
    }

    onClickPrevNextCompanyVehicles = async (size, page, stateNameVehicle) => {
        try {
            if (stateNameVehicle === 'hasNextVehicle') {
                await this.setState(prevState => ({
                    page2: prevState.page2 += 1
                }))
            } else {
                await this.setState(prevState => ({
                    page2: prevState.page2 -= 1
                }))
            }
            const { data } = await fetcher.get(`/companies/customer_company_available_vehicles?size=${this.state.size2}&page=${this.state.page2}`);
            this.setState({ hasPrev2: data.hasPrev, hasNext2: data.hasNext, noResult: false, availableVehiclesWaiting: data.availableVehicles })
        } catch (error) {

        }
    }
    render() {

        let addModalClosed = () => this.setState({ addModalShow: false, addModalShowEdit: false })
        return (
            <div>
                <Navbar />
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 text-right mt-5">
                            <h1>בקשות להצעת מחיר בהמתנה</h1>
                        </div>
                    </div>
                    <div className="text-right mt-2">

                        <Table

                            header={this.state.customerPath === 'customer' ? this.vipHeadersCustomer : this.vipHeaders}
                            data={this.state.customerPath === 'customer' ? this.state.dataWatingTable.map(data => {
                                return ({

                                    idOrder: data.serial_number, orderName: data.start_point, destination: data.destination,
                                    actions: [<button type="button" title="Edit" className="btn btn-outline float-left"><Link to={`/${this.state.customerOrCompany}/bid/${data.id}`}><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon></Link></button>,
                                    <button type="button" title="Delete" className="btn btn-outline float-left" onClick={() => this.onPupUpClicked(data.id, 'order')}><FontAwesomeIcon className="fa-lg " icon={faTrashAlt} color='red'> </FontAwesomeIcon></button>, <button type="button" className="btn btn-warning"> בהמתנה <span className="badge badge-light"></span></button>]
                                });
                            }) : this.state.dataWatingTable.map(data => {
                                return ({

                                    idOrder: data.serial_number, orderName: data.start_point, destination: data.destination, employeeName: data.customerName,
                                    actions: [<button type="button" title="Edit" className="btn btn-outline float-left"><Link to={`/${this.state.customerOrCompany}/bid/${data.id}`}><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon></Link></button>,
                                    <button type="button" title="Delete" className="btn btn-outline float-left" onClick={() => this.onPupUpClicked(data.id, 'order')}><FontAwesomeIcon className="fa-lg " icon={faTrashAlt} color='red'> </FontAwesomeIcon></button>, <button type="button" className="btn btn-warning"> בהמתנה <span className="badge badge-light"></span></button>]
                                });
                            })}

                            sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                        </Table>

                    </div>
                    <div className="text-right mt-2">

                        <div className="col-md-5"></div>
                        <div className="col-md-4 mt-5">
                            {this.state.hasNext &&
                                <button type="button" className="btn btn-primary ml-3" onClick={() => {
                                    this.onClickPrevNextCompany(this.state.size, this.state.page, this.state.isSearch, 'hasNext');
                                }}><FontAwesomeIcon icon={faArrowRight} className="ml-2"></FontAwesomeIcon>הבא
                              </button>
                            }

                            {this.state.hasPrev &&
                                <button type="button" className="btn btn-primary"
                                    onClick={event => {
                                        this.onClickPrevNextCompany(this.state.size, this.state.page, this.state.isSearch, 'hasPrev');
                                    }}>הקודם
                                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2"></FontAwesomeIcon>
                                </button>
                            }

                        </div>
                        <div className="col-md-5"></div>

                    </div>
                    {this.state.companyTable ? null :
                        <div className="text-right mt-4">
                            <Table
                                header={this.vehiclesHeaders}
                                data={this.state.availableVehiclesWaiting.map(data => {
                                    return ({

                                        idOrder: data.serial_number, orderName: data.startDate, destination: data.endDate, employeeName: data.customerName,
                                        actions: [<button type="button" title="Edit" className="btn btn-outline float-left"><Link to={`/${this.state.customerOrCompany || this.state.pathCustomerOrCompanyFromAdminID}/bus_offer/${data.id}`}><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon></Link></button>,
                                        <button type="button" title="Delete" className="btn btn-outline float-left" onClick={() => this.onPupUpClicked(data.id, 'busOffer')}><FontAwesomeIcon className="fa-lg " icon={faTrashAlt} color='red'> </FontAwesomeIcon></button>, <button type="button" className="btn btn-warning"> בהמתנה <span className="badge badge-light"></span></button>]
                                    });
                                })}
                                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                            </Table>

                        </div>


                    }
                    <div className="row">

                        <div className="col-md-5"></div>
                        <div className="col-md-4 mt-5">
                            {this.state.hasNext2 &&
                                <button type="button" className="btn btn-primary ml-3" onClick={() => {
                                    this.onClickPrevNextCompanyVehicles(this.state.size2, this.state.page2, 'hasNextVehicles');
                                    this.setState(prevState => ({
                                        page2: prevState.page2++
                                    }))

                                }}><FontAwesomeIcon icon={faArrowRight} className="ml-2"></FontAwesomeIcon>הבא
                        </button>
                            }

                            {this.state.hasPrev2 &&
                                <button type="button" className="btn btn-primary"
                                    onClick={event => {
                                        this.onClickPrevNextCompanyVehicles(this.state.size2, this.state.page2, 'hasPrevVehicles');
                                    }}>הקודם
                                <FontAwesomeIcon icon={faArrowLeft} className="mr-2"></FontAwesomeIcon>
                                </button>
                            }

                        </div>
                        <div className="col-md-5"></div>

                    </div>
                    <div className="col-md-2"></div>
                    {this.state.isDeleteOrder && <PopUp show={this.state.addModalShow}
                        onHide={addModalClosed}
                        isDeleteOrder={this.state.isDeleteOrder}
                        excludeFromStateArrayById={this.excludeFromStateArrayById}
                        idDelete={this.state.idDelete}
                        errormsg={this.state.errormsg}
                        message={this.state.message}
                        stateName={this.state.stateName} />

                    }

                    <div className="row">
                        <div className="col-md-2 col-sm-10 text-right">
                            <div className="form-group">
                                <button type="button" className="btn btn-danger btn-block" onClick={this.backButtonCompanyOrCustomer}>חזרה </button>
                            </div>
                            {this.state.backCompany && <Redirect to="/company" />}
                        </div>
                    </div>
                    {this.state.backCompanyWating && <Redirect to="/company" />}
                    {this.state.backCustomerWating && <Redirect to="/customer" />}
                </div>
            </div>
        )
    }
}