import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import fetcher from '../api/fetcher';
import '../assets/style.css'
import { getUser } from '../api/auth';
import { Redirect } from 'react-router-dom';
import Cards from '../shared/Cards';
import Swal from 'sweetalert2';

import { validateFormClosedOrdersByCompany } from '../shared/validation';
export class AddDepModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOrderMapped: {
                vehicleType: { vehicle_type: '', capacity: '' },
                stopStations: [{ station: '', sequence: '' }],
            },
            updatedOrders: this.props.dataOrderMapped,
            backCompany: false,
            backCustomer: false,
            updatedOn: false,
            backAdmin: false,
            backWaitingCompany: false,
            backAdminCustomer: false,
            Sequm: false,
            messageOrder: false,

            backSupportFromInfo: false,
            backCompanyFromEditInfo: false,
            backCustomerFromEditInfo: false,
            roleUserRoute: {
                role: { id: '', role: '' }
            },
            dataOrdersPop: [],
            dataClosedOrders: {
                serial_number: null,
                serial_number_Bus: null,
                price: null,
                order_id: null,
                description: '',
                customerEmail: '',
                availableVehiclesId: null
            },
            backAfterUpdateAdmin: false,
            backAdminCompanyToEmployees: false,
            backCompanyEmployee: false,
            formState: {},
            formMessages: {},
            validityState: {},
            idStateOrder: '',
            countDisplay: 10,
            hideBtn: false,
        }

    }

    onBackUpdate = async () => {
        if (this.state.roleUserRoute.role.name === 'userCompany' || this.state.roleUserRoute.role.name === 'adminCompany') {
            if (this.props.editInfoShow === 'editInfo') {
                this.setState({ backCompanyFromEditInfo: true })
            } else if (this.props.editEmployeeAdmin) {
                this.setState({ backAdminCompanyToEmployees: true })
            }
            else {
                this.setState({ backWaitingCompany: true });
            }
        } else if (this.state.roleUserRoute.role.name === 'customer') {
            if (this.props.editInfoShow === 'editInfo') {
                this.setState({ backCustomerFromEditInfo: true })
            } else {
                this.setState({ backCustomer: true });
            }
        } else if (this.state.roleUserRoute.role.name === 'admin' || this.state.roleUserRoute.role.name === 'subAdmin') {
            if (this.props.editInfoShow === 'editInfo') {
                this.setState({ backAfterUpdateAdmin: true })
            } else if (this.props.backCustomerAdmin === 'customer') {
                this.setState({ backAdminCustomer: true })
            } else if (this.props.updatePopup) {
                this.setState({ backAfterUpdateAdmin: true })
            } else if (this.props.updatePopupFromAdmin) {
                this.setState({ backAdmin: true })
            }
            else {
                this.setState({ backAdmin: true });
            }
        } else if (this.state.roleUserRoute.role.name === 'support') {

            if (this.props.backSupportFromInfo === 'support') {
                this.setState({ backSupportFromInfo: true })
            } else if ('support' === window.location.pathname.split('/')[1]) {
                this.setState({ backSupportFromInfo: true })
            } else {
                this.setState({ backAdmin: true });
            }
        }
    }

    onCreateNewBid = async () => {
        if (this.state.roleUserRoute.role.name === 'userCompany' || this.state.roleUserRoute.role.name === 'adminCompany') {
            if (this.props.createEmployeeCompany) {
                this.setState({ backCompanyEmployee: true })
            } else {
                this.setState({ backCompany: true });
            }
        } else if (this.state.roleUserRoute.role.name === 'customer') {
            this.setState({ backCustomer: true });
        }
    }
    componentDidMount = async () => {
        console.clear()

        var roleUser = JSON.parse(getUser())
        await this.setState({ roleUserRoute: roleUser })
    }

    onChangeHandler = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.dataClosedOrders, [target.name]: value.toUpperCase() };
        this.setState({ dataClosedOrders: savedData, errorShow: false });

    }
    onBlur = (fieldName, value) => {
        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState});
        if(fieldName==='price'){
            validateFormClosedOrdersByCompany(nextState, fieldName)
            .done(this.handleValidationResult);
        }else{
            validateFormClosedOrdersByCompany(nextState, fieldName, this.state.serial_number, this.state.serial_number_Bus)
                .done(this.handleValidationResult);
        }

    }

    UNSAFE_componentWillReceiveProps(nextProps) {

        if (nextProps.idList) {

            this.setState({
                dataClosedOrders: {
                    ...this.state.dataClosedOrders,
                    order_id: nextProps.idList
                }, serial_number: nextProps.serial_number
            });
        } else {
            this.setState({
                dataClosedOrders: {
                    ...this.state.dataClosedOrders,
                    availableVehiclesId: nextProps.idBus
                },
                serial_number_Bus: nextProps.serial_number_Bus
            });
        }

    }
    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };

        result.tested.forEach((fieldName) => {


            if (result.hasErrors(fieldName)) {

                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';

            } else if (result.hasWarnings(fieldName)) {

                msgs[fieldName] = result.getWarnings(fieldName)[0];
                validity[fieldName] = 'warning';
            } else {

                // otherwise, there's not much need for it.
                delete msgs[fieldName];
                validity[fieldName] = 'form-control is-valid';

            }
        });


        this.setState({ formMessages: msgs, validityState: validity });

    }
    onCancelOrderCompany = async () => {
        await this.setState({
            hideBtn: false,
            dataClosedOrders: {
                serial_number: null,
                serial_number_Bus: null,
                price: null,
                order_id: null,
                description: '',
                customerEmail: '',
                availableVehiclesId: null
            },
            messageOrder: false,
            countDisplay: 10,
            validityState: {
                price: 'form-control',
                order_id: 'form-control',
            },
            formState: {},
            formMessages: {}
        })
        clearInterval(this.myInterval);
        clearInterval(this.myIntervalBus);
        this.props.addModalClosed()
    }
    closedOrders = async (id) => {
        try {
            if (!validateFormClosedOrdersByCompany(this.state.formState,'',this.state.serial_number, this.state.serial_number_Bus).done(this.handleValidationResult).hasErrors()) {

                if (this.props.idList) {
                    this.props.dataOrders.forEach(async (email, index) => {

                        if (id === this.props.dataOrders[index].id) {
                            await this.setState({
                                dataClosedOrders: {
                                    ...this.state.dataClosedOrders,
                                    customerEmail: this.props.dataOrders[index].customerEmail

                                }
                            })

                            this.myInterval = setInterval(async () => {
                                this.setState({ countDisplay: this.state.countDisplay - 1 });
                                this.setState({ hideBtn: true, messageOrder: true })
                                if (this.state.countDisplay === 0) {

                                    const data = await fetcher.post('/companies/summary', this.state.dataClosedOrders);
                                    const updatedOrders = this.props.dataOrders.filter(element => element.id !== id);
                                    this.props.updateFinalState(updatedOrders)
                                    this.setState({
                                        dataClosedOrders: {},
                                        messageOrder: '',
                                        countDisplay: 10,
                                        validityState: {
                                            order_id: 'form-control',
                                            price: 'form-control',
                                        },
                                        hideBtn: false
                                    })
                                    this.props.onHide()

                                    clearInterval(this.myInterval);
                                   
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: `${data.data}`,
                                            showConfirmButton: false,
                                            timer: 1500
                                          })
                                    
                                }
                            }, 1000)

                        }
                    })


                } else if (this.props.busCard) {
                    this.props.dataBuses.forEach(async (email, index) => {
                        if (id === this.props.dataBuses[index].id) {
                            await this.setState({
                                dataClosedOrders: {
                                    ...this.state.dataClosedOrders,
                                    customerEmail: this.props.dataBuses[index].customerEmail

                                }
                            })

                            this.myIntervalBus = setInterval(async () => {
                                this.setState({ countDisplay: this.state.countDisplay - 1 });
                                this.setState({ hideBtn: true, messageOrder: true })
                                if (this.state.countDisplay === 0) {

                                    const data = await fetcher.post('/companies/vehicle_summary', this.state.dataClosedOrders)
                                    const updatedOrdersBuses = this.props.dataBuses.filter((element) => element.id !== id);
                                    this.props.updateFinalStateBuses(updatedOrdersBuses)
                                    this.setState({
                                        dataClosedOrders: {},
                                        messageOrder: '',
                                        countDisplay: 10,
                                        validityState: {
                                            availableVehiclesId: 'form-control',
                                            price: 'form-control',
                                        },
                                        hideBtn: false,
                                    })
                                    this.props.onHide(this.setState({ addModalShow: false }))
                                    clearInterval(this.myIntervalBus);
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: `${data.data}`,
                                        showConfirmButton: false,
                                        timer: 1500
                                      })
                                }
                            }, 1000);
                        }
                    })

                }
            }
        } catch (error) {


        }
    }

    render() {

        return (
            <div>
                {this.props.updatePopup || this.props.popupViewCreate || this.props.createEmployeeCompany || this.props.updatePopupFromAdmin ?
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">

                                <div>
                                    <h5 id="header">סטטוס</h5>
                                </div>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-right">
                            {this.props.updatePopup || this.props.createEmployeeCompany || this.props.updatePopupFromAdmin ?
                                <h3>{this.props.msg}</h3> :
                                <h3>{this.props.messageCreated}</h3>
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            {this.props.updatePopup || this.props.updatePopupFromAdmin ?

                                <Button variant="success" onClick={this.onBackUpdate}>חזרה</Button> :
                                <Button variant="success" onClick={this.onCreateNewBid}>סיום</Button>
                            }
                        </Modal.Footer>

                        {(this.state.backCompany || this.state.backCompanyFromEditInfo) && <Redirect to="/company/" />}
                        {this.state.backCustomerFromEditInfo && <Redirect to="/customer/" />}
                        {this.state.backSupportFromInfo && <Redirect to="/support/" />}
                        {this.state.backWaitingCompany && <Redirect to="/company/waiting_requests" />}
                        {this.state.backCustomer && <Redirect to="/customer/waiting_requests" />}
                        {this.state.backAdmin && <Redirect to="/admin/employees/" />}
                        {this.state.backAdminCustomer && <Redirect to="/admin/users" />}
                        {this.state.backAfterUpdateAdmin && <Redirect to="/admin" />}
                        {(this.state.backAdminCompanyToEmployees || this.state.backCompanyEmployee) && <Redirect to="/company/employees" />}

                    </Modal>
                    :
                    <div>

                        <Modal
                            {...this.props}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>

                            <Modal.Header>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    {this.props.show && !this.props.isMoreDetails && !this.props.isMoreDetailsBus ?
                                        <h5 id="header">סיכום עסקה</h5> :
                                        <div>
                                            <div>פרטים נוספים</div>
                                        </div>
                                    }
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                {
                                    this.props.isMoreDetailsBus ?
                                        <div className="text-right">
                                            <h6 className="card-title">{`שם מספק: ${this.props.dataOrderMappedBus.firstName} ${this.props.dataOrderMappedBus.lastName}`}</h6>
                                            <h6 className="card-text">{`טלפון: ${this.props.dataOrderMappedBus.customer_phone}`}</h6>
                                            <h6 className="card-text">{`פקס: ${this.props.dataOrderMappedBus.customer_fax}`}</h6>
                                            <h6 className="card-text">{`דוא''ל: ${this.props.dataOrderMappedBus.customer_email || this.props.dataOrderMappedBus.customerEmail}`}</h6>
                                            <h6 className="card-text">{`חברת: ${this.props.dataOrderMappedBus.company}`}</h6>
                                        </div>
                                        :
                                        this.props.show && !this.props.isMoreDetails ?
                                            <div className="container">
                                                <div className="form-group row">
                                                    <label htmlFor="priceInput" className="d-flex align-items-right col-sm-5 col-form-label">הצעת מחיר</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" placeholder="הצעת מחיר" id="priceInput" disabled={this.state.hideBtn ? true : null} className={this.state.validityState.price || "form-control text-right"} name="price" onChange={this.onChangeHandler} value={this.state.dataClosedOrders.price} onBlur={() => this.onBlur('price', this.state.dataClosedOrders.price)} />
                                                        <label className="float-right text-danger">{this.state.formMessages.price}</label>

                                                    </div>

                                                    <label htmlFor="orderInput" className="d-flex align-items-right col-sm-5 col-form-label">מספר הזמנה</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" placeholder="מספר הזמנה" disabled={this.state.hideBtn === true} id="orderInput" className={this.state.validityState.serial_number || this.state.validityState.serial_number_Bus || "form-control text-right"} name={this.props.serial_number ? "serial_number" : "serial_number_Bus"} onChange={this.onChangeHandler} value={this.props.serial_number ? this.state.dataClosedOrders.serial_number : this.state.dataClosedOrders.serial_number_Bus} onBlur={() => this.onBlur(this.props.serial_number ? 'serial_number' : 'serial_number_Bus', this.props.serial_number ? this.state.dataClosedOrders.serial_number : this.state.dataClosedOrders.serial_number_Bus)} />
                                                        <label className="float-right text-danger">{this.props.serial_number ? this.state.formMessages.serial_number : this.state.formMessages.serial_number_Bus}</label>
                                                    </div>

                                                    <label htmlFor="inputPhone2Company" className="d-flex align-items-right col-sm-5 col-form-label">הערות</label>
                                                    <div className="col-sm-12">
                                                        <textarea
                                                            id="descInput"
                                                            name="description"
                                                            value={this.state.dataClosedOrders.description}
                                                            onChange={this.onChangeHandler}
                                                            className="form-control"
                                                            rows="3"
                                                            disabled={this.state.hideBtn === true}
                                                            style={{ resize: "none" }}
                                                            placeholder="הערות...">
                                                        </textarea>

                                                    </div>
                                                </div>



                                                {this.state.messageOrder ?
                                                    <div>
                                                        <div>
                                                            <div className="float-right text-success font-weight-bold">{this.state.messageOrder}</div>
                                                        </div>
                                                        <div>
                                                            <button class="btn btn-danger float-right" onClick={this.onCancelOrderCompany}>ביטול</button>
                                                            <h3><span class="badge badge-success">ייסגר בעוד : {this.state.countDisplay}</span></h3>
                                                        </div>
                                                    </div> : null
                                                }

                                            </div> : null
                                }
                                {

                                    this.props.isMoreDetails ?
                                        <div div className="text-right">
                                            <div className="card-text">{`טלפון לקוח: ${this.props.dataOrderMapped.customerPhone}`}</div>
                                            <div className="card-text">{`מתאריך: ${this.props.dataOrderMapped.start_date}`}</div>
                                            <div className="card-text">{`עד תאריך: ${this.props.dataOrderMapped.end_date}`}</div>
                                            <div className="card-text">{`מוצא: ${this.props.dataOrderMapped.start_point}`}</div>
                                            <div className="card-text">{`יעד: ${this.props.dataOrderMapped.destination}`}</div>
                                            <div className="card-text">{`שעת יציאה : ${this.props.dataOrderMapped.start_hour}`}</div>
                                            <div className="card-text">{`שעת חזרה: ${this.props.dataOrderMapped.end_hour}`}</div>
                                            <div className="card-text">{`הערות: ${this.props.dataOrderMapped.description}`}</div>
                                            <div className="card-text">{`סוג רכב: ${this.props.dataOrderMapped.vehicleType.vehicle_type.type} ${this.props.dataOrderMapped.vehicleType.capacity}`}</div>
                                            <div className="card-text"><u>תחנות:</u></div>
                                            {this.props.dataOrderMapped.stopStations.map(stopStation => (
                                                <div className="card-text">{`${stopStation.sequence} - ${stopStation.name}`}</div>
                                            ))}
                                            <div className="card-text"><u>תוספות:</u></div>
                                            {this.props.dataOrderMapped.extra.map((extraBus, index) => (
                                                <div className="card-text">{"- " + extraBus}</div>
                                            ))}
                                        </div> : null
                                }
                                {/* {this.props.updatePopup ? <div>{this.props.message}</div>:null} */}
                            </Modal.Body>

                            {this.props.show && !(this.props.isMoreDetails || this.props.isMoreDetailsBus) ?
                                this.state.hideBtn ? null :
                                    <Modal.Footer>
                                        <div className="col-1">
                                            <button class="btn btn-danger float-right " onClick={this.onCancelOrderCompany}>ביטול</button>

                                        </div>
                                        <div className="col"></div>
                                        <div className="col-3">
                                            <button class="btn btn-danger" onClick={() => this.props.busCard ? this.closedOrders(this.props.idBus) : this.closedOrders(this.props.idList)}>סיום עסקה</button>

                                        </div>

                                    </Modal.Footer> :
                                <Modal.Footer>
                                    <Button variant="danger" onClick={this.props.addModalClosed}>סגור</Button>
                                </Modal.Footer>
                            }
                        </Modal>
                    </div>}
                {this.state.Sequm && this.state.dataOrdersPop.map(order => (
                    <Cards
                        idList={order.id}
                        start_point={order.start_point}
                        destination={order.destination}
                        customerFirstName={order.customerFirstName}
                        customerLastName={order.customerLastName}
                        customerPhone={order.customerPhone}
                    />
                ))}
            </div>
        )

    }
}