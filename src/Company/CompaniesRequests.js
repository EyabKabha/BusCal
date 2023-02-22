import React from 'react';

import { Redirect } from 'react-router-dom';
import Navbar from '../Navbar';
import { Card, ListGroup } from 'react-bootstrap';
import Cards from '../shared/Cards';
import fetcher from '../api/fetcher';
import { validateFormFilterOrder } from '../shared/validation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default class CompaniesRequests extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            avaliable: false,
            backCompany: false,
            busOffer: false,
            busCard: false,
            vehicles: [],
            dataBuses: [],
            show: false,
            page: 1,
            size: 3,
            extras: [],
            dataTemp: [],
            dataFilterBus: {
                startdate: '',
                enddate: '',
                starttime: '',
                endtime: '',
                startpoint: '',
                destination: '',
                triptype: '',
                vehicletype: '',
                capacity: '',
                extra: [],
                stopstations: ''
            },
            tempVhicle: '',
            isFilter: false,
            checkMe: false,
            currentDate: '',
            formState: {},
            formMessages: {},
            validityState: {},
            emptyChecked: [],
            noResult: false,
            hasNext: false,
            hasPrev: false,
            windowWidth: window.innerWidth
        }
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    onChangeHandler = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const savedData = { ...this.state.dataFilterBus, [target.name]: value };
        if (target.value === "" && target.name === "vehicletype") {

            this.setState({ tempVhicle: '' });
        }
        this.setState({ dataFilterBus: savedData });
    };
    toggleMenu = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    isAvaliable = () => {
        this.setState({ avaliable: true })
    }
    backButtonCompany = () => {
        // this.setState({ backCompany: true });
        this.props.history.goBack();
    }

    onClickPrevNex = async (size, page, stateName) => {
        try {
            if (stateName === "hasNext") {
                await this.setState((prevState) => ({
                    page: (prevState.page += 1),
                }));
            } else {
                await this.setState((prevState) => ({
                    page: (prevState.page -= 1),
                }));
            }
            const { data } = await fetcher.get(
                `companies/available_vehicles?size=${size}&page=${this.state.page}`
            );
            this.setState({
                hasPrev: data.availableVehiclesNotFromMyCompany.hasPrev,
                hasNext: data.availableVehiclesNotFromMyCompany.hasNext,
                noResult: false,
                dataBuses: data.availableVehiclesNotFromMyCompany.av,
            });
        } catch (error) { }
    };
    updateFinalStateBuses = (stateFinalBuses) => {
        this.setState({
            dataBuses: stateFinalBuses
        })
    }
    onChangeCheckboxexs = (event) => {
        const target = event.target;
        const value = target.type === "checkbox" ? target.value : null;
        const checked = target.checked;
        this.addToStateArrayCheckBox(target.name, value, checked, target);
        this.state.emptyChecked.push(target)
    };

    addToStateArrayCheckBox = (stateName, id, checked, target) => {
        if (checked === true) {
            this.state.dataFilterBus[stateName].push(id);
        } else {
            var index = this.state.dataFilterBus[stateName].indexOf(id);
            this.state.dataFilterBus[stateName].splice(index, 1);
        }
    };
    componentDidMount = async () => {
        try {
            console.clear()

            var date = new Date(),
                month = '' + (date.getMonth() + 1),
                day = '' + date.getDate(),
                year = date.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            const finalDate = [year, month, day].join('-');
            this.setState({ currentDate: finalDate })
            const dataOrderList = await fetcher.get('/orders/order_details');
            this.setState({
                extras: dataOrderList.data.Extras,
                vehicles: dataOrderList.data.Vehicles,
            })
            const { data } = await fetcher.get(`companies/available_vehicles?size=${this.state.size}&page=${this.state.page}`);
            if (data.availableVehiclesNotFromMyCompany.av.length < 1) {
                this.setState({
                    noResult: true,
                    dataBuses: [],
                    hasPrev: false,
                    hasNext: false,
                });
            } else {
                this.setState({
                    hasPrev: data.availableVehiclesNotFromMyCompany.hasPrev,
                    hasNext: data.availableVehiclesNotFromMyCompany.hasNext,
                    noResult: false,
                    dataBuses: data.availableVehiclesNotFromMyCompany.av,
                    busCard: true,
                });
            }

        } catch (error) {

        }
    }

    myAvailableVehicles = () => {
        this.props.history.push('/company/vehicle_orders/my_orders')
    }

    onClickFilterBus = async () => {
        var vehicle = this.state.vehicles.filter(vehicle => {
            if (vehicle.id.toString() === this.state.dataFilterBus.vehicletype) {
                return vehicle.vehicle_type.type
            }
            //check this -- this line deleting the warning  "Expected to return a value at the end of arrow function"
            return null
        })
        if (vehicle.length >= 1) {
            var finalType = vehicle[0].vehicle_type.type

            await this.setState({
                dataFilterBus: {
                    ...this.state.dataFilterBus,
                    vehicletype: finalType,
                    capacity: vehicle[0].capacity
                },
                tempVhicle: vehicle[0].id.toString(),
            })
        }
        let requestURL = "";
        Object.keys(this.state.dataFilterBus).forEach((key) => {
            if (this.state.dataFilterBus[key] !== "") {
                requestURL = requestURL.concat(`&${key}=${this.state.dataFilterBus[key]}`);
            }
        });

        await this.setState({
            dataFilterBus: {
                ...this.state.dataFilterBus,
                vehicletype: this.state.tempVhicle
            },
        })
        requestURL = "/companies/available_vehicles?".concat(requestURL.slice(1));
        if (!validateFormFilterOrder(this.state.formState).done(this.handleValidationResult).hasErrors()) {
            const { data } = await fetcher.get(requestURL);
            this.setState({
                dataAfterFilter: data.availableVehiclesNotFromMyCompany.av,
                isModeFilter: true,
                requestURLFilter: requestURL,
            });

        }
    };

    onBlur = (fieldName, value) => {

        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });

        validateFormFilterOrder(nextState, fieldName)
            .done(this.handleValidationResult);
    }

    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };

        result.tested.forEach((fieldName) => {

            // if current field has errors
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
    onDeleteFilterBus = async () => {
        try {

            // const { dataFilter } = this.state
            if (this.state.emptyChecked.length >= 1) {
                this.state.emptyChecked.forEach(extra => {
                    extra.checked = false
                    // document.querySelector('.inputCheck').checked=false
                })
            }
            await this.setState({
                page: 1,
                size: 3,

                dataFilterBus: {
                    startdate: '',
                    enddate: '',
                    vehicletype: '',
                    starttime: "",
                    endtime: "",
                    extra: []
                },
                validityState: {
                    startdate: '',
                    enddate: '',
                },
                formMessages: {
                    startdate: '',
                    enddate: '',
                },
                emptyChecked: [],
                tempVhicle: ''

            })
            const { data } = await fetcher.get(`/companies/available_vehicles?size=${this.state.size}&page=${this.state.page}`);
            this.setState({ dataBuses: data.availableVehiclesNotFromMyCompany.av, isModeFilter: false, hasNext: data.availableVehiclesNotFromMyCompany.hasNext, hasPrev: data.availableVehiclesNotFromMyCompany.hasPrev })
        } catch (error) {

        }
    }

    render() {
        const show = (this.state.isOpen) ? "show" : "";

        return (
            <div>
                <Navbar />
                {/* <div>
                    
                    <Filter dataBuses={this.state.dataBuses} busCard={this.state.busCard}/>
                </div> */}

                <div className="container" >
                    <div className="mt-3 ml-5">
                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={this.myAvailableVehicles}
                        >
                            הזמנות שלי
                            </button>
                    </div>
                    <div className="mt-3 ml-5">
                        <button type="button" data-toggle="collapse" data-target="#filters" className="d-block d-md-none btn btn-primary btn-block mb-3" onClick={this.toggleMenu}>סינון</button>
                        <Card style={{ width: '' }} className={"d-md-block collapse" + show}>
                            <ListGroup variant="flush" >
                                <h4 htmlFor="inputFilter" className="text-center ml-3">סינון</h4>
                                <ListGroup.Item>
                                    <div className="row">

                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="fromDate" className="d-flex align-items-right col-sm-10 col-form-label">מתאריך</label>
                                                <div className="col-sm-10">
                                                    <input type="date" className={this.state.validityState.startdate || "form-control"} id="fromDate" name="startdate" value={this.state.dataFilterBus.startdate} onChange={this.onChangeHandler} min={this.state.currentDate} max="9999-12-31" onBlur={() => this.onBlur('startdate', this.state.dataFilterBus.startdate)} />
                                                    <label className="float-right text-danger">{this.state.formMessages.startdate}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="toDate" className="d-flex align-items-right col-sm-10 col-form-label">עד תאריך</label>
                                                <div className="col-sm-10">
                                                    <input type="date" className={this.state.validityState.enddate || "form-control"} id="toDate" name="enddate" value={this.state.dataFilterBus.enddate} onChange={this.onChangeHandler} min={this.state.currentDate} max="9999-12-31" onBlur={() => this.onBlur('enddate', this.state.dataFilterBus.enddate)} />
                                                    <label className="float-right text-danger">{this.state.formMessages.enddate}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="fromTime" className="d-flex align-items-right col-sm-10 col-form-label">משעה</label>
                                                <div className="col-sm-10">


                                                    <input type="time" className="form-control" id="fromTime" name="starttime" value={this.state.dataFilterBus.starttime} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="toTime" className="d-flex align-items-right col-sm-10 col-form-label">עד שעה</label>
                                                <div className="col-sm-10">
                                                    <input type="time" className="form-control" id="toTime" name="endtime" value={this.state.dataFilterBus.endtime} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="vehicleType" className="d-flex align-items-right col-sm-10 col-form-label">סוג רכב</label>
                                                <div className="col-sm-10">
                                                    <select className="form-control" id="vehicleType" name="vehicletype" value={this.state.dataFilterBus.vehicletype || ''} onChange={this.onChangeHandler} >
                                                        <option value="">סוג רכב</option>
                                                        {this.state.vehicles.map((vehicle, index) => <option key={index} value={vehicle.id}>{vehicle.vehicle_type.type} {vehicle.capacity}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2 ml-4"></div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <div>
                                                    <label htmlFor="capacity" className="d-flex align-items-right col-sm-10 col-form-label">&nbsp;</label>
                                                </div>
                                                {/* <div className="ml-3">

                                                </div> */}
                                                <button className="btn btn-primary btn-block ml-2" type="button" onClick={this.onClickFilterBus}>סנן</button>
                                                {/* <button className="btn btn-danger btn-block" type="button" onClick={this.onDeleteFilterBus}>בטל סינון</button> */}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                                <div>
                                                    <label htmlFor="capacity" className="d-flex align-items-right col-sm-10 col-form-label">&nbsp;</label>
                                                </div>
                                                {/* <div className="ml-3">

                                                </div> */}
                                                {/* <button className="btn btn-primary btn-block" type="button" onClick={this.onClickFilterBus}>סנן</button> */}
                                                <button className="btn btn-danger btn-block" type="button" onClick={this.onDeleteFilterBus}>בטל סינון</button>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group row">
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </div>
                    <div className="row">
                        {
                            this.state.isModeFilter ? this.state.dataAfterFilter.map(order => (
                                <Cards
                                    busCard={this.state.busCard}
                                    idBus={order.id}
                                    serial_number_Bus={order.serial_number}
                                    start_date={order.start_date}
                                    end_date={order.end_date}
                                    start_hour={order.start_hour}
                                    end_hour={order.end_hour}
                                    description={order.description}
                                    vehicle_type={order.vehicle}
                                    capacity={order.capacity}
                                    // capacity={order.vehicle.capacity}
                                    updateFinalStateBuses={this.updateFinalStateBuses}
                                    dataBuses={this.state.dataBuses}
                                    subscription={order.subscription || ''}
                                />
                            )) :
                                this.state.dataBuses.map(order => (
                                    <Cards
                                        busCard={this.state.busCard}
                                        idBus={order.id}
                                        serial_number_Bus={order.serial_number}
                                        start_date={order.start_date}
                                        end_date={order.end_date}
                                        start_hour={order.start_hour}
                                        end_hour={order.end_hour}
                                        description={order.description}
                                        vehicle_type={order.vehicle}
                                        capacity={order.capacity}
                                        // capacity={order.vehicle.capacity}
                                        updateFinalStateBuses={this.updateFinalStateBuses}
                                        dataBuses={this.state.dataBuses}
                                        subscription={order.subscription || ''}
                                    />
                                ))



                        }
                    </div>

                    <div className="float-right col-md-12 col-sm-8">


                        {this.state.backCompany && <Redirect to="/company" />}
                    </div>

                    {this.state.isModeFilter ? null :
                        <div className="row">
                            <div className="col-md-5 col-sm-2 col-5"></div>
                            <div className={this.state.windowWidth < 500 ? "text-center" : "mt-3 mb-2"}>
                                <button
                                    type="button"
                                    className="btn btn-primary ml-3"
                                    disabled={this.state.hasNext === false}
                                    onClick={() => {
                                        this.onClickPrevNex(
                                            this.state.size,
                                            this.state.page,
                                            "hasNext"
                                        );
                                    }}
                                    >
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="ml-2"
                                    ></FontAwesomeIcon>
                                    הבא
                                    </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    disabled={this.state.page === 1}
                                    onClick={(event) => {
                                        this.onClickPrevNex(this.state.size, this.state.page, 'hasPrev');
                                    }}
                                >
                                    הקודם
                  <FontAwesomeIcon
                                        icon={faArrowLeft}
                                        className="mr-2"
                                    ></FontAwesomeIcon>
                                </button>
                            </div>
                        </div>
                    }

                    {/* <div className="col-md-3"></div>
                        <div className="col-md-3"></div>
                    <div className="col-md-2 col-sm-10"></div> */}
                    {/* <button type="button" className="btn btn-danger" onClick={this.backButtonCompany}> חזרה</button> */}



                    {/* <div className="container"> */}

                    {/* </div>  */}
                    <div className="row">
                        <div className="col-2 float-right mt-3">
                            <button type="button" className="btn btn-danger btn-block" onClick={this.backButtonCompany}> חזרה</button>
                        </div>

                    </div>
                </div>


            </div>

        )

    }

}
