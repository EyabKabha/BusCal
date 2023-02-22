import React from 'react';
import Table from '../shared/Table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import fetcher from '../api/fetcher';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../assets/style.css';
import Navbar from '../Navbar';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { AddDepModal } from '../Company/AddDepModal';

import { Redirect } from 'react-router-dom';
import { CompanyContext } from '../CompanyContext';
import { validateBid } from './validation';
class Bid extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false,
            message: '',
            updatePopup: false,
            addModalShow: false,
            backCompany: false,
            backCustomer: false,
            backCompanyFromEdit: false,
            backCustomerFromEdit: false,
            updateBid: false,
            popupViewCreate: false,
            countSeq: 0,
            vehicles: [],
            trips: [],
            extras: [],
            citiesArr: [],
            id: null,
            currentDate: '',
            msgCreated: '',
            increment_index: 1,
            dataOrderState: {
                stopStation: '',
                start_date: '',
                end_date: '',
                start_point: '',
                destination: '',
                start_hour: '',
                end_hour: '',
                vehicle_id: '',
                trip_id: '',
                description: '',
                stop_stations: [],
                extra: [],
            },
            selectedCityEndPoint: '',
            defaultCity: '',
            selectedCityStartPoint: '',
            formState: {},
            formMessages: {},
            validityState: {},

        }
    }
    top100Films = [
        { title: 'אום אל קוטוף' },
        { title: 'אבו סנאן' },
        { title: 'באקה אל גרביה' },
        { title: 'כפר קרע' }]


    vipHeaders = [
        { key: "id", value: "עצירות", toSort: false },
        { key: "id", value: "", toSort: false },
    ];
    vipData = [
        { key: 'כפר קרע' }, { key: 'עפולה' }
    ]
    onBlur = (fieldName, value) => {

        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });

        validateBid(nextState, fieldName)
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
    handleCheck = (event) => {
        this.setState({ checked: !this.state.checked })
        if (this.state.checked) {

        } else {
            delete this.state.formMessages['stopStation'];
            delete this.state.validityState['stopStation'];
            this.setState({
                dataOrderState:{
                    ...this.state.dataOrderState,
                    stopStation:'',
                }
            })

        }
    }

    onClickStation = () => {
        this.setState({ increment_index: this.state.increment_index + 1 })
        const addNewStation = document.querySelector('#addNewStation').value;
        if (addNewStation) {
            this.setState({ countSeq: this.state.dataOrderState.stop_stations.length + 1 })
            this.setState({ countSeq: this.state.countSeq + 1 })
            this.addToStateArray('stop_stations', { id: `NEW_${this.state.increment_index}`, name: addNewStation, sequence: this.state.countSeq + 1 })
        }
    }

    addToStateArray = (stateName, data) => {
        console.log(data)
        if (stateName && data && !validateBid(this.state.formState).done(this.handleValidationResult).hasErrors('stopStation')) {
            this.state.dataOrderState[stateName].push(data);
        }
        this.setState({
            dataOrderState: {
                ...this.state.dataOrderState,
                stopStation: '',
            }
        })
        delete this.state.validityState['stopStation'];
        delete this.state.formMessages['stopStation'];

    }

    excludeFromStateArrayById = (stateName, id) => {

        var filteredArray = this.state.dataOrderState[stateName].filter(item => item.id !== id);
        var findIndexArray = this.state.dataOrderState[stateName].findIndex(item => item.id === id);

        var arrTempFilter = [] // here we push the values until the index 
        for (let index = 0; index < findIndexArray; index++) {
            arrTempFilter.push(filteredArray[index])
        }
        for (let index = findIndexArray; index < filteredArray.length; index++) {
            var seqMin = filteredArray[findIndexArray].sequence - 1
            arrTempFilter.push({ id: filteredArray[findIndexArray].id, name: filteredArray[findIndexArray].name, sequence: seqMin })
            findIndexArray++;
        }
        this.setState({
            dataOrderState: {
                ...this.state.dataOrderState,
                [stateName]: arrTempFilter
            },
            countSeq: this.state.countSeq - 1
        })
    }


    onChangeHandler = event => {
        const target = event.target;
        const value = target.value;
        const savedData = { ...this.state.dataOrderState, [target.name]: value };
        this.setState({ dataOrderState: savedData });
    }

    onChangeCheckboxexs = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.value : null
        const checked = target.checked;
        this.addToStateArrayCheckBox(target.name, value, checked, target)
    }

    backButtonCompanyOrCustomer = () => {
        // const id = window.location.pathname.split('/')[3];
        // const pathCustomerOrCompany = window.location.pathname.split('/')[1];
        this.props.history.goBack();


    }

    addToStateArrayCheckBox = (stateName, id, checked, target) => {
        if (checked === true) {
            this.state.dataOrderState[stateName].push(parseInt(id));
        } else {
            var index = this.state.dataOrderState[stateName].indexOf(parseInt(id));
            this.state.dataOrderState[stateName].splice(index, 1);
        }
    }

    saveDataOrder = async () => {
        const dataOrder = {
            start_date: this.state.dataOrderState.start_date,
            end_date: this.state.dataOrderState.end_date,
            start_point: this.state.dataOrderState.start_point,
            destination: this.state.dataOrderState.destination,
            start_hour: this.state.dataOrderState.start_hour,
            end_hour: this.state.dataOrderState.end_hour,
            vehicle_id: this.state.dataOrderState.vehicle_id,
            trip_id: this.state.dataOrderState.trip_id,
            description: this.state.dataOrderState.description,
            stop_stations: this.state.dataOrderState.stop_stations,
            extra: this.state.dataOrderState.extra
        }

        try {
            if (!validateBid(this.state.formState).done(this.handleValidationResult).hasErrors()) {
                const data = await fetcher.post('/orders', dataOrder);
                if (data.status === 200) {
                    this.setState({ popupViewCreate: true, msgCreated: data.data, addModalShow: true })
                }
            }
        } catch (error) {

        }
    }
    componentDidMount = async () => {
        try {
            this.formatDate();
            console.clear()

            const idOrder = window.location.pathname.split('/')[3];
            if (idOrder) {
                const { data } = await fetcher.get(`/orders/${idOrder}`);
                const mappedOrder = this.mapApiResultToState(data);
                if (data.stopStations.length >= 1) {
                    await this.setState({ checked: true })
                }
                this.setState({
                    formState: {
                        ...mappedOrder,
                    },
                    dataOrderState: mappedOrder,
                    updateBid: true,
                    id: idOrder,

                    countSeq: data.stopStations.length,
                    defaultCity: mappedOrder.start_point
                }, () => {
                    const { cities } = this.context
                    const selectedCityStartPoint = cities.find(city => city.name === mappedOrder.start_point)
                    const selectedCityEndPoint = cities.find(city => city.name === mappedOrder.destination)
                    this.setState({ selectedCityStartPoint, selectedCityEndPoint })
                })

            }

            const dataOrderDet = await fetcher.get('/orders/order_details');
            this.setState({
                vehicles: dataOrderDet.data.Vehicles,
                trips: dataOrderDet.data.Trips,
                extras: dataOrderDet.data.Extras,

            })
        } catch (error) {

        }
    }

    mapApiResultToState = order => {

        const mappedOrder = {
            start_date: order.start_date,
            end_date: order.end_date,
            start_point: order.start_point,
            destination: order.destination,
            start_hour: order.start_hour,
            end_hour: order.end_hour,
            vehicle_id: order.vehicleType.id,
            trip_id: order.tripType.id,
            description: order.description,
            stop_stations: order.stopStations,
            extra: order.extra
        }
        return mappedOrder;
    }



    onUpdateBid = async () => {

        try {
            if (!validateBid(this.state.formState).done(this.handleValidationResult).hasErrors()) {
                var extraTemp = this.state.dataOrderState.extra.map(element => {
                    return element.toString();
                })
                await this.setState({
                    dataOrderState: {
                        ...this.state.dataOrderState,
                        extra: extraTemp
                    }
                })
                const { data } = await fetcher.put(`/orders/${this.state.id}`, this.state.dataOrderState);
                this.setState({ updatePopup: true, addModalShow: true, message: data })
            }
        } catch (error) {

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
    getValue = () => {
        var valueInput = document.querySelector('#combo-box-demo').value = this.state.dataOrderState.destination
        return valueInput
    }
    render() {
        const { cities } = this.context;
        return (

            <div>
                <Navbar />
            
                <div className="container mt-3" >
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
                            <input type="date" className={this.state.validityState.start_date || 'form-control mb-2'} date id="inputFromDate" name="start_date" min={this.state.currentDate} max="9999-12-31" value={this.state.dataOrderState.start_date} onChange={this.onChangeHandler} onBlur={() => this.onBlur('start_date', this.state.dataOrderState.start_date)} style={{textAlign:'right'}} />
                            <label className="float-right text-danger">{this.state.formMessages.start_date}</label>
                        </div>

                        <div className="col-md-5">
                            <label htmlFor="inputToDate" className="d-flex align-items-right">עד תאריך</label>
                            <input type="date" className={this.state.validityState.end_date || 'form-control mb-2'} id="inputToDate" name="end_date" min={this.state.currentDate} max="9999-12-31" value={this.state.dataOrderState.end_date} onChange={this.onChangeHandler} onBlur={() => this.onBlur('end_date', this.state.dataOrderState.end_date)} style={{textAlign:'right'}}/>
                            <label className="float-right text-danger">{this.state.formMessages.end_date}</label>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-5">
                            <label htmlFor="inputExitTime" className="d-flex align-items-right">שעת יציאה משוערת</label>
                            <input type="time" className={this.state.validityState.start_hour || 'form-control mb-2'} id="inputExitTime" name="start_hour" value={this.state.dataOrderState.start_hour} onChange={this.onChangeHandler}  onBlur={() => this.onBlur('start_hour', this.state.dataOrderState.start_hour)}style={{textAlign:'right'}} />
                            <label className="float-right text-danger">{this.state.formMessages.start_hour}</label>
                        </div>

                        <div className="col-md-5">
                            <label htmlFor="inputReturnTime" className="d-flex align-items-right">שעת חזרה משוערת</label>
                            <input type="time" className={this.state.validityState.end_hour || 'form-control mb-2'} id="inputReturnTime" name="end_hour" value={this.state.dataOrderState.end_hour} onChange={this.onChangeHandler} onBlur={() => this.onBlur('end_hour', this.state.dataOrderState.end_hour)}style={{textAlign:'right'}} />
                            <label className="float-right text-danger">{this.state.formMessages.end_hour}</label>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                        <div className="col-md-1"></div>
                        <div className="col-md-5">
                            <label htmlFor="exitFrom" className="d-flex align-items-right">מוצא</label>

                            <Autocomplete
                                id="combo-box-demo"
                                className={this.state.validityState.start_point || 'form-control'}
                                options={cities}
                                getOptionLabel={(option) => option.name}
                                onChange={((evt, city) => {
                                    if (city) {
                                        let { dataOrderState } = this.state
                                        dataOrderState.start_point = city.name

                                        const { cities } = this.context
                                        const selectedCityStartPoint = cities.find(city => city && city.name === dataOrderState.start_point)

                                        this.setState({ dataOrderState, selectedCityStartPoint })
                                    }
                                })}
                                noOptionsText={'ישוב לא קיים'}
                                style={{ direction: 'rtl' }}
                                disableClearable={true}
                                wrapperStyle={{ position: 'relative', display: 'inline-block', color: 'red' }}
                                defaultValue={this.state.selectedCityStartPoint}
                                onBlur={() => this.onBlur('start_point', this.state.dataOrderState.start_point)}
                                value={this.state.selectedCityStartPoint}
                                renderInput={(params) => <TextField {...params} placeholder="מוצא" size='small' InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                            />
                            <label className="float-right text-danger">{this.state.formMessages.start_point}</label>

                        </div>
                        <div className="col-md-5">
                            <label htmlFor="target" className="d-flex align-items-right">יעד</label>
                            <Autocomplete
                                id="combo-box-demo"
                                className={this.state.validityState.destination || 'form-control'}
                                options={cities}
                                getOptionLabel={(option) => option.name}
                                onChange={((evt, city) => {
                                    if (city) {
                                        let { dataOrderState } = this.state
                                        dataOrderState.destination = city.name

                                        const { cities } = this.context
                                        const selectedCityEndPoint = cities.find(city => city && city.name === dataOrderState.destination)

                                        this.setState({ dataOrderState, selectedCityEndPoint })
                                    }
                                })}
                                defaultValue={this.state.selectedCityEndPoint}
                                onBlur={() => this.onBlur('destination', this.state.dataOrderState.destination)}
                                value={this.state.selectedCityEndPoint}
                                noOptionsText={'ישוב לא קיים'}
                                style={{ direction: 'rtl' }}
                                disableClearable={true}
                                wrapperStyle={{ position: 'relative', display: 'inline-block', color: 'red' }}
                                renderInput={(params) => <TextField {...params} placeholder="יעד" size='small' InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                            />
                            <label className="float-right text-danger">{this.state.formMessages.destination}</label>
                        </div>
                        <div className="col-md-1"></div>    
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-5">
                            <label htmlFor="inputCar" className="d-flex align-items-right mt-2">סוג רכב</label>
                            <select className={this.state.validityState.vehicle_id || 'form-control mb-2'} id="inputCar" name="vehicle_id" value={this.state.dataOrderState.vehicle_id} onChange={this.onChangeHandler} onBlur={() => this.onBlur('vehicle_id', this.state.dataOrderState.vehicle_id)} >
                                <option  value="">סוג רכב</option>
                                {this.state.vehicles.map((vehicle, index) => <option key={index} value={vehicle.id}>{vehicle.vehicle_type.type} {vehicle.capacity}</option>)}
                            </select>
                            <label className="float-right text-danger">{this.state.formMessages.vehicle_id}</label>
                        </div>
                        <div className="col-md-5">
                            <label htmlFor="inputTrip" className="d-flex align-items-right mt-2">סוג נסיעה</label>
                            <select className={this.state.validityState.trip_id || 'form-control mb-2'} id="inputTrip" name="trip_id" value={this.state.dataOrderState.trip_id} onChange={this.onChangeHandler} onBlur={() => this.onBlur('trip_id', this.state.dataOrderState.trip_id)}>
                                <option value="">סוג נסיעה</option>
                                {this.state.trips.map((trip, index) => <option key={index} value={trip.id}>{trip.type} </option>)}
                            </select>
                            <label className="float-right text-danger">{this.state.formMessages.trip_id}</label>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-4">
                            <div className="form-group row">
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input ml-3" type="checkbox" name="stop" id="inlineNo" value="noNotification" onClick={this.handleCheck} checked={this.state.checked === true} onBlur={() => this.onBlur('checked', this.state.checked)} />
                                    <label className="form-check-label" htmlFor="inlineNo">מאספת</label>
                                </div>
                            </div>
                            {this.state.checked ?
                                <div>

                                    <div class="input-group mb-3">
                                        <input type="text" className={this.state.validityState.stopStation || 'form-control '} placeholder="" name="stopStation" onChange={this.onChangeHandler} value={this.state.dataOrderState.stopStation} id="addNewStation" aria-label="" aria-describedby="basic-addon1" onBlur={() => this.onBlur('stopStation', this.state.dataOrderState.stopStation)} />
                                        <div className="ml-3"></div>
                                        <div class="input-group-append">
                                            <button className="btn btn-outline-secondary" type="button" onClick={this.onClickStation}>הוספה</button>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-right">
                                        <label className="text-danger">{this.state.formMessages.stopStation}</label>
                                    </div>

                                    <div className="text-right">
                                        <Table
                                            header={this.vipHeaders}
                                            data={this.state.dataOrderState.stop_stations.map(data => {
                                                return ({ name: data.name, action: <button id={data.id} type="button" title="Delete" className="btn btn-outline float-left" onClick={() => this.excludeFromStateArrayById('stop_stations', data.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button> });
                                            })}
                                            sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                                        </Table>
                                    </div>
                                </div> : null
                            }
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-6">
                            <div className="form-group row">

                                <label className="d-flex align-items-right col-sm-10 col-form-label">תוספות</label>

                                <div className="form-check form-check-inline">
                                    {this.state.extras.map((extra) => {
                                        return [<input id={extra.id} value={extra.id} defaultChecked={this.state.dataOrderState.extra.some(ex => ex === parseInt(extra.id))} className="form-check-input ml-1" type="checkbox" name="extra" onChange={this.onChangeCheckboxexs} />,
                                        <label className="form-check-label ml-2" htmlFor={extra.id}>{extra.name}</label>]

                                    })}

                                </div>

                            </div>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-10">
                            <div className="form-group row">
                                <label htmlFor="description" className="d-flex align-items-right col-sm-10 col-form-label">הערות</label>
                            </div>
                            <textarea
                                id="description"
                                name="description"
                                value={this.state.dataOrderState.description}
                                onChange={this.onChangeHandler}
                                className="form-control"
                                rows="3"
                                style={{ resize: "none" }}
                                placeholder="הערות...">
                            </textarea>
                        </div>
                        <div className="col-md-1"></div>
                    </div>
                    <div className="row">
                    <div className="col-md-1"></div>
                        <div className="col-md-2 col-sm-10">
                            <div className="form-group mt-3 d-flex align-items-right">
                                <button type="button" className="btn btn-danger btn-block" onClick={this.backButtonCompanyOrCustomer}> חזרה</button>
                            </div>
                        </div>

                        <div className="col-md-3">

                        </div>
                        <div className="col-md-3">

                        </div>
                        <div className="col-md-2 col-sm-10">
                            {!this.state.updateBid ?
                                <div className="form-group mt-3">
                                    <button type="button" className="btn btn-danger btn-block" onClick={this.saveDataOrder}> בקשת הצעת מחיר</button>
                                </div> :
                                <div className="form-group mt-3">
                                    <button type="button" className="btn btn-danger btn-block" onClick={this.onUpdateBid}> עדכן הצעת מחיר</button>
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
                {this.state.backCompanyFromEdit && <Redirect to="/company/waiting_requests" />}
                {this.state.backCompany && <Redirect to="/company" />}
                {/* {this.state.backCustomerFromEdit && <Redirect to="/customer/waiting_requests" />} */}
                {this.state.backCustomer && <Redirect to="/customer" />}
            </div>
        )
    }
}

Bid.contextType = CompanyContext;

export default Bid;