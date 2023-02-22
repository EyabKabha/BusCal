import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import fetcher from '../api/fetcher';
import PopUp from '../shared/PopUp';

import Navbar from '../Navbar';
import Table from '../shared/Table';
import Swal from 'sweetalert2'

import { validateSettingAdminTrip, validateSettingAdminVehicle } from '../shared/validation';
export default class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            onCancel: false,
            increment_index: 0,
            allVehicles: [],
            allTrips: [],
            deleteSetting: false,
            addModalShow: false,
            messageSet: '',
            stateDelete: '',
            idDelete: '',
            formState: {},
            formMessages: {},
            validityState: {},
            dataSetting: {
                tripValue: '',
                vehicleType: '',
                capacity: ''
            },
            validateTripOnly: false,
        }
    }

    onCancelClicked = () => {
        // this.setState({ onCancel: true });
        this.props.history.goBack();
    }
    onBlur = (fieldName, value) => {
        if (fieldName === 'tripValue') {
            var nextState = { ...this.state.formState, [fieldName]: value };
            this.setState({ formState: nextState });
            validateSettingAdminTrip(nextState, fieldName)
                .done(this.handleValidationResult);
        } else {
            var nextStateVehicle = { ...this.state.formState, [fieldName]: value };
            this.setState({ formState: nextStateVehicle });
            validateSettingAdminVehicle(nextStateVehicle, fieldName)
                .done(this.handleValidationResult);
        }
    }
    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };

        // iterate over the updated fields
        // (or everything, when submitting)
        result.tested.forEach((fieldName) => {

            // if current field has errors
            if (result.hasErrors(fieldName)) {

                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';

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
        this.setState({ formMessages: msgs, validityState: validity });
    }
    carTypeHeaders = [
        { car_type: "car_name", value: "סוג רכב", toSort: false },
        { car_action: "car_type", value: "כמות נוסעים", toSort: false },
        { car_action: "car_action", value: "", toSort: false }
    ];

    tripTypeHeaders = [
        { car_type: "trip_name", value: "שם נסיעה", toSort: false },
        { car_action: "car_action", value: "", toSort: false }
    ];

    onChangeHandler = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.dataSetting, [target.name]: value };
        this.setState({ dataSetting: savedData });
    }

    addTableDataCar = () => {
        if (!validateSettingAdminVehicle(this.state.formState).done(this.handleValidationResult).hasErrors()) {
            this.setState({ increment_index: this.state.increment_index + 1 })
            const type = document.querySelector('#addVehicle').value;
            const quantityCar = document.querySelector('#searchAmount').value;
            if (type && quantityCar) {
                this.addToStateArray('allVehicles', { id: `NEW_${this.state.increment_index}`, vehicle_type: { type }, capacity: quantityCar })
            }
        }
    }

    addTableDataTrip = () => {
        if (!validateSettingAdminTrip(this.state.formState).done(this.handleValidationResult).hasErrors('tripValue')) {

            this.setState({ increment_index: this.state.increment_index + 1 })
            const trip = document.querySelector('#addNewTrip').value;

            if (trip) {
                this.addToStateArray('allTrips', { id: `NEW_${this.state.increment_index}`, type: trip });
            }

        }
    }

    addToStateArray = async (stateName, dataVehicleOrTrip) => {

        try {
            if (stateName === 'allVehicles') {
                const dataVehicle = await fetcher.post('/admin/newVehicle', dataVehicleOrTrip);
                if (dataVehicle.status === 200) {
                    this.setState({ allVehicles: [...this.state.allVehicles, dataVehicleOrTrip] })
                    // window.location.reload(false);
                    this.setState({
                        validityState: {},
                        dataSetting: {
                            vehicleType: '',
                            capacity: ''
                        }
                    })
                }

            } else if (stateName === 'allTrips') {
                const tripData = await fetcher.post('/admin/newtrip', dataVehicleOrTrip);
                if (tripData.status === 200) {
                    this.setState({ allTrips: [...this.state.allTrips, dataVehicleOrTrip] })
                    // window.location.reload(false);
                    this.setState({
                        validityState: {},
                        dataSetting: {
                            tripValue: '',
                        }
                    })
                }
            }
        } catch (error) {

        }
    }

    onPupUpSetting = (stateName, id) => {
        this.setState({ deleteSetting: true, addModalShow: true, stateDelete: stateName, idDelete: id })
    }

    setStateLabel = () => {
        this.setState({
            validityState: {
                ...this.state.validityState,
                password: 'form-control'
            },

        })
    }

    excludeFromStateArrayById = async (stateName, id, password) => {
        const data = await fetcher.post('/admin/password', password)
        if (stateName === 'allTrips' && data.status === 200) {
            try {

                const dataTrip = await fetcher.delete(`/admin/trip/${id}`);
                if (dataTrip.status === 200) {
                    const updatedTrips = this.state.allTrips.filter(function (element) { return element.id !== id; });
                    this.setState({ allTrips: updatedTrips, addModalShow: false });
                    Swal.fire({
                        title: `${dataTrip.data}`,
                        showClass: {
                          popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                          popup: 'animate__animated animate__fadeOutUp'
                        }
                      })
                } else {
                    this.setState({ messageSet: dataTrip.data })
                }
            } catch (error) {
                this.changePopView(error.response.data)
            }
        } else if (stateName === 'allVehicles' && data.status === 200) {
            try {
                const dataVehicle = await fetcher.delete(`/admin/vehicle/${id}`);
                if (dataVehicle.status === 200) {
                    const updatedVehicles = this.state.allVehicles.filter(function (element) { return element.id !== id; });
                    this.setState({ allVehicles: updatedVehicles, addModalShow: false });
                    
                    Swal.fire({
                        title: `${dataVehicle.data}`,
                        showClass: {
                          popup: 'animate__animated animate__fadeInDown'
                        },
                        hideClass: {
                          popup: 'animate__animated animate__fadeOutUp'
                        }
                      })
                } else {
                    this.setState({ messageSet: dataVehicle.data })
                }
            } catch (error) {
                this.changePopView(error.response.data)
            }
        }
        if (data.status !== 200) {
            this.setState({
                validityState: {
                    ...this.state.validityState,
                    password: 'form-control is-invalid'
                }
            })
            this.setState({ messageSet: data.data })
        }
    }

    changePopView = (errorMessage) => {
        this.setState({ messageSet: errorMessage, errormsg: true })
    }

    componentDidMount = async () => {
        try {
            console.clear()

            const { data } = await fetcher.get('/admin');
            this.setState({
                allVehicles: data.allVehicles,
                allTrips: data.allTrips,
            })
        } catch (error) {

        }
    }

    render() {
        let addModalClosed = () => this.setState({ addModalShow: false, addModalShowEdit: false, messageSet: '' })
        return (
            <div>
                <Navbar />
               
                <div className="container">
                <h1 className="d-flex align-items-center mt-2 mr-3">הגדרות מנהל</h1>
                    <div className="row mt-3">
                        <div className="col-md-5 col-sm-6">
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="addVehicle" className="d-flex align-items-right col-md-12 col-sm-12 col-form-label">הגדרת רכב חדש</label>
                                    <div className="col-sm-12 text-right">
                                        <input type="text" value={this.state.dataSetting.vehicleType} className={this.state.validityState.vehicleType || "form-control"} id="addVehicle" placeholder="הגדרת רכב חדש" onChange={this.onChangeHandler} name="vehicleType" onBlur={() => this.onBlur('vehicleType', this.state.dataSetting.vehicleType)} />
                                        <label className="text-right text-danger">{this.state.formMessages.vehicleType}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 col-sm-6">
                            <div className="form-group">
                                {/* <div className="form-group"> */}
                                    <label htmlFor="searchAmount" className="d-flex align-items-right col-sm-12 col-form-label"> כמות</label>
                                    <div className="col-sm-12 text-right">
                                        <input type="text" value={this.state.dataSetting.capacity} className={this.state.validityState.capacity || "form-control"} id="searchAmount" placeholder="כמות" onChange={this.onChangeHandler} name="capacity" onBlur={() => this.onBlur('capacity', this.state.dataSetting.capacity)} />
                                        <label className="text-right text-danger">{this.state.formMessages.capacity}</label>
                                    </div>
                                {/* </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="form-group">
                                    <div className="text-right col-sm-10">
                                        <button type="button" className="btn btn-outline-success btn-block" onClick={this.addTableDataCar}>הוספה</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-4"></div>
                    </div>
                    <div className="row ml-2">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center mr-3" >
                            <Table
                                header={this.carTypeHeaders}
                                data={this.state.allVehicles.map(data => {
                                    return ({ vehicles: data.vehicle_type.type, capacity: data.capacity, action: typeof (data.id) === 'string' ? null : <button id={data.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpSetting('allVehicles', data.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button> });
                                })}
                                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                // className="col-lg-8 col-md-8 col-sm-12 col-xs-12"
                                >
                            </Table>

                        </div>
                        {/* <div className="col-md-2"></div> */}
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="addNewTrip" className="d-flex align-items-right col-sm-10 col-form-label">הגדרת נסיעה חדשה</label>
                                    <div className="col-sm-10">
                                        <input type="text" className={this.state.validityState.tripValue || 'form-control'} id="addNewTrip" placeholder="הגדרת נסיעה חדשה" name="tripValue" value={this.state.dataSetting.tripValue || ''} onChange={this.onChangeHandler} onBlur={() => this.onBlur('tripValue', this.state.dataSetting.tripValue)} />
                                        <label className="text-right  text-danger">{this.state.formMessages.tripValue}</label>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="form-group">
                                    <div className="text-right col-sm-10">
                                        <button type="button" className="btn btn-outline-success btn-block" onClick={this.addTableDataTrip}>הוספת נסיעה חדשה</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-4"></div>
                    </div>
                    <div className="row ml-2">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center mr-3" >
                            <Table
                                header={this.tripTypeHeaders}
                                data={this.state.allTrips.map(trip => {
                                    return ({ trips: trip.type, action: typeof (trip.id) === 'string' ? null :<button id={trip.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpSetting('allTrips', trip.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button> });
                                })}
                                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                // className="col-lg-8 col-md-8 col-sm-12 col-xs-12"
                                >
                            </Table>
                        </div>
                    </div>
                    {this.state.deleteSetting &&
                        <PopUp
                            show={this.state.addModalShow}
                            onHide={addModalClosed}
                            deleteSetting={this.state.deleteSetting}
                            idDelete={this.state.idDelete}
                            stateDelete={this.state.stateDelete}
                            // onClickDeleteUser={this.onClickDeleteUser}
                            // idDelete={this.state.idDelete}
                            messageSet={this.state.messageSet}
                            changePopView={this.changePopView}
                            // errormsg={this.state.errormsg}
                            setStateLabel={this.setStateLabel}
                            validityState={this.state.validityState.password}
                            excludeFromStateArrayById={this.excludeFromStateArrayById}
                        />

                    }
                    <div className="row">
                        <div className="col-md-6">
                            <button type="button" className="btn btn-danger float-right mr-3" onClick={this.onCancelClicked}> חזרה</button>
                        </div>
                    </div>
                    {/* {this.state.onCancel && <Redirect to="/admin" />} */}
                </div>
               
            </div>
        )
    }
}