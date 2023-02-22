import React from 'react';

import '../assets/style.css';
import Navbar from '../Navbar';

import fetcher from '../api/fetcher';
import { AddDepModal } from '../Company/AddDepModal';
import { validateBidBus } from '../shared/validation';
export default class BusOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: true,
            backCompany: false,
            vehicles: [],
            currentDate:'',
            dataOrderState: {
                start_date: '',
                end_date: '',
                start_hour: '',
                end_hour: '',
                vehicle_id: '',
                capacity: '',
                description: ''
            },
            popupViewCreate: false,
            msgCreated: false,
            addModalShow: false,
            updatePopup: false,
            idBusOffer: '',
            updateBusOffer: false,
            formState: {},
            formMessages: {},
            validityState: {},
        }
    }

    vipHeaders = [
        { key: "id", value: "עצירות", toSort: false },
    ];
    vipData = [
        { key: 'כפר קרע' }, { key: 'עפולה' }
    ]

    handleCheck = () => {
        this.setState({ checked: !this.state.checked })
    }
    backButtonCompany = () => {
        // this.setState({ backCompany: true });
        this.props.history.goBack();
    }

    onChangeHandler = event => {
        const target = event.target;
        const value = target.value;
        const savedData = { ...this.state.dataOrderState, [target.name]: value };
        this.setState({ dataOrderState: savedData });
    }
    excludeFromStateArrayById = (stateName, id) => {
        let filteredArray = this.state.dataOrderState[stateName].filter(item => item.id !== id);
        this.setState({
            dataOrderState: {
                ...this.state.dataOrderState,
                [stateName]: filteredArray
            }
        })
    }

    onChangeCheckboxexs = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.value : null
        const checked = target.checked;
        this.addToStateArrayCheckBox(target.name, value, checked, target)
    }
    onBlur = (fieldName, value) => {

        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });

        validateBidBus(nextState, fieldName)
            .done(this.handleValidationResult);
    }
    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };

        // iterate over the updated fields
        // (or everything, when submitting)
        result.tested.forEach((fieldName) => {

            // if current field has errors
            if (result.hasErrors(fieldName)) {
                // set its message to the first error from the errors array
                // if(fieldName !== 'identity' && fieldName !== 'password' && fieldName !== 'confirmPassword' ){
                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';
                // }
                // if current field has warnings
            } else if (result.hasWarnings(fieldName)) {

                // set its message to the first warning from the warnings array
                msgs[fieldName] = result.getWarnings(fieldName)[0];
                validity[fieldName] = 'warning';
            } else {

                // otherwise, there's not much need for it.
                delete msgs[fieldName];
                validity[fieldName] = 'form-control is-valid';
            }

        });

        // setformMessages(msgs);
        this.setState({ formMessages: msgs, validityState: validity });
        // setValidityState(validity);
    }

    saveDataOrder = async () => {
        const dataOrder = {
            start_date: this.state.dataOrderState.start_date,
            end_date: this.state.dataOrderState.end_date,
            start_hour: this.state.dataOrderState.start_hour,
            end_hour: this.state.dataOrderState.end_hour,
            vehicle_id: this.state.dataOrderState.vehicle_id,
            description: this.state.dataOrderState.description
        }


        try {
            if (!validateBidBus(this.state.formState).done(this.handleValidationResult).hasErrors()) {
                const data = await fetcher.post('/companies/available_vehicles', dataOrder);
                if (data.status === 200) {
                    this.setState({ popupViewCreate: true, msgCreated: data.data, addModalShow: true })
                }
            }
        } catch (error) {

        }
    }
    addToStateArray = (stateName, data) => {
        if (stateName && data) {
            this.state.dataOrderState[stateName].push(data);
        }
        document.querySelector('#addNewStation').value = "";
    }


    addToStateArrayCheckBox = (stateName, id, checked, target) => {
        if (checked === true) {
            this.state.dataOrderState[stateName].push(id);
        } else {
            var index = this.state.dataOrderState[stateName].indexOf(id);
            this.state.dataOrderState[stateName].splice(index, 1);
        }


    }
    formatDate = () => {
        var d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        const finalDate = [year, month, day].join('-');
        this.setState({ currentDate: finalDate })

    }
    onUpdateBidOffer = async () => {

        try {
            const { data } = await fetcher.put(`http://localhost:3001/companies/available_vehicles/${this.state.idBusOffer}`, this.state.dataOrderState);
            this.setState({ updatePopup: true, addModalShow: true, message: data })
        } catch (error) {

        }
    }
    componentDidMount = async () => {
        try {
            console.clear()

            this.formatDate();
            const idOrder = window.location.pathname.split('/')[3];
            if (idOrder) {
                const { data } = await fetcher.get(`/companies/available_vehicles/${idOrder}`);
                const mappedOrder = this.mapApiResultToState(data);
                this.setState({ dataOrderState: mappedOrder, updateBusOffer: true, idBusOffer: idOrder })
            }
            const { data } = await fetcher.get('/orders/order_details');
            this.setState({ vehicles: data.Vehicles })

        } catch (error) {

        }
    }
    mapApiResultToState = orderBusOffer => {
        const mappedOrder = {
            start_date: orderBusOffer.start_date,
            end_date: orderBusOffer.end_date,
            start_hour: orderBusOffer.start_hour,
            end_hour: orderBusOffer.end_hour,
            vehicle_id: orderBusOffer.vehicle_id,
            description: orderBusOffer.description
        }

        return mappedOrder;
    }
    render() {
        return (
            <div>
                <Navbar />
                <div className="container mt-3">
                    {this.state.updatePopup &&
                        <AddDepModal
                            show={this.state.addModalShow}
                            onHide={() => false}
                            msg={this.state.message}
                            updatePopup={this.state.updatePopup} />
                    }
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-5">
                            <label htmlFor="inputFromDate" className="d-flex align-items-right">מתאריך</label>
                            <input type="date" className={this.state.validityState.start_date || "form-control mb-2"} id="inputFromDate" name="start_date" min={this.state.currentDate} max="9999-12-31" value={this.state.dataOrderState.start_date} onChange={this.onChangeHandler} onBlur={() => this.onBlur('start_date', this.state.dataOrderState.start_date)} />
                            <label className="float-right text-danger">{this.state.formMessages.start_date}</label>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="inputToDate" className="d-flex align-items-right">עד תאריך</label>
                            <input type="date" className={this.state.validityState.end_date || "form-control mb-2"} id="inputToDate" name="end_date" min={this.state.currentDate} max="9999-12-31" value={this.state.dataOrderState.end_date} onChange={this.onChangeHandler} onBlur={() => this.onBlur('end_date', this.state.dataOrderState.end_date)} />
                            <label className="float-right text-danger">{this.state.formMessages.end_date}</label>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-5">
                            <label htmlFor="inputExitTime" className="d-flex align-items-right">שעת יציאה משוערת</label>
                            <input type="time" className={this.state.validityState.start_hour || "form-control mb-2"} id="inputExitTime" name="start_hour" value={this.state.dataOrderState.start_hour} onChange={this.onChangeHandler} onBlur={() => this.onBlur('start_hour', this.state.dataOrderState.start_hour)} />
                            <label className="float-right text-danger">{this.state.formMessages.start_hour}</label>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="inputReturnTime" className="d-flex align-items-right">שעת חזרה משוערת</label>
                            <input type="time" className={this.state.validityState.end_hour || "form-control mb-2"} id="inputReturnTime" name="end_hour" value={this.state.dataOrderState.end_hour} onChange={this.onChangeHandler} onBlur={() => this.onBlur('end_hour', this.state.dataOrderState.end_hour)} />
                            <label className="float-right text-danger">{this.state.formMessages.end_hour}</label>
                        </div>
                        <div className="col-md-1"></div>

                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>

                        <div className="col-md-5">
                            <label htmlFor="inputCar" className="d-flex align-items-right mt-2">סוג רכב</label>
                            <select className={this.state.validityState.vehicle_id || "form-control"} id="inputCar" name="vehicle_id" value={this.state.dataOrderState.vehicle_id} onChange={this.onChangeHandler} onBlur={() => this.onBlur('vehicle_id', this.state.dataOrderState.vehicle_id)}>
                                <option value="">סוג רכב</option>
                                {this.state.vehicles.map((vehicle, index) => <option key={index} value={vehicle.id}>{vehicle.vehicle_type.type} {vehicle.capacity}</option>)}
                            </select>
                            <label className="float-right text-danger">{this.state.formMessages.vehicle_id}</label>

                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>

                        <div className="col-md-10 ml-5">
                            <div className="mt-2">
                                <label htmlFor="description" className="d-flex align-items-right mt-2">הערות</label>
                           
                        
                            </div>
                        </div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>

                        <div className="col-md-10">
                         
                            <textarea
                                id="description"
                                name="description"
                                value={this.state.dataOrderState.description}
                                onChange={this.onChangeHandler} className="form-control"
                                rows="3"
                                style={{ resize: "none" }}
                                placeholder="הערות...">
                            </textarea>
                           
                        </div>
                    </div>
                    <div className="row mt-4">
                    <div className="col-md-1"></div>
                        <div className="col-md-2 col-sm-10">
                            <div className="form-group d-flex align-items-right">
                                <button type="button" className="btn btn-danger btn-block" onClick={this.backButtonCompany}> חזרה</button>
                            </div>
                            {/* {this.state.backCompany && <Redirect to="/company" />} */}
                        </div>

                        {/* <div className="col-md-3"></div> */}
                        <div className="col-md-6"> </div>
                        <div className="col-md-2 col-sm-10">
                            {!this.state.updateBusOffer ?
                                <div className="form-group ">
                                    <button type="button" className="btn btn-danger btn-block" onClick={this.saveDataOrder}> בקשת הצעת מחיר</button>
                                </div> :
                                <div className="form-group ">
                                    <button type="button" className="btn btn-danger btn-block" onClick={this.onUpdateBidOffer}> עדכן הצעת מחיר</button>
                                </div>
                            }
                            {this.state.popupViewCreate &&
                                <AddDepModal
                                    show={this.state.addModalShow}
                                    onHide={() => false}
                                    popupViewCreate={this.state.popupViewCreate}
                                    messageCreated={this.state.msgCreated}

                                />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}