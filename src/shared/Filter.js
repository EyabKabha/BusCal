import React from 'react'
import fetcher from '../api/fetcher';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            extras: [],
            vehicles: [],
            dataTemp: [],
            dataFilter: {
                startdate: '',
                enddate: '',
                starttime: '',
                endtime: '',
                startpoint: '',
                destination: '',
                triptype: '',
                vehicletype: '',
                extra: [],
                stopstations: ''
            },
            isFilter: false,
            checkMe: false,
        }
    }

    onClickFilter = async () => {

        let requestURL = '';
        Object.keys(this.state.dataFilter).forEach(key => {
            if (this.state.dataFilter[key] !== '') {
                requestURL = requestURL.concat(`&${key}=${this.state.dataFilter[key]}`)
            }
        })
        requestURL = '/companies/orders?'.concat(requestURL.slice(1))
        const { data } = await fetcher.get(requestURL);
        this.setState({ dataTemp: data.ordersList, isFilter: true })
    }

    onChangeCheckboxexs = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.value : null
        const checked = target.checked;
        this.addToStateArrayCheckBox(target.name, value, checked, target)
    }

    addToStateArrayCheckBox = (stateName, id, checked, target) => {
        if (checked === true) {
            this.state.dataFilter[stateName].push(id);
        } else {
            var index = this.state.dataFilter[stateName].indexOf(id);
            this.state.dataFilter[stateName].splice(index, 1);
        }
    }

    toggleMenu = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }

    componentDidMount = async () => {
        try {
            console.clear()
            const { data } = await fetcher.get('http://localhost:3001/orders/order_details');
            this.setState({
                extras: data.Extras,
                vehicles: data.Vehicles,
            })
        } catch (error) {

        }
    }

    onChangeHandler = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.dataFilter, [target.name]: value };
        this.setState({ dataFilter: savedData });
        // Object.keys(this.state.dataFilter).forEach(key => {
        //     if (this.state.dataFilter[key] == '') {
        //         this.setState({ isFilter: true })
        //     }
        // })
        // if (event.target.value === ''){
        //     this.setState({ isFilter: false })
        //     return
        // }

    }

    checkIfFilter = () => {
        Object.keys(this.state.dataFilter).forEach(key => {
            if (this.state.dataFilter[key] !== '') {
                return true
            }
        })
        return false
    }

    render() {
        return (
            <div>
                {/* <div class="container" >
                    <div className="mt-3 ml-5">
                        <button type="button" data-toggle="collapse" data-target="#filters" className="d-block d-md-none btn btn-primary btn-block mb-3" onClick={this.toggleMenu}>סינון</button>
                        <Card style={{ width: '' }} className={"d-md-block collapse" + show}>
                            <ListGroup variant="flush" >

                                <h4 htmlFor="inputFilter" className="text-center ml-3">סינון</h4>

                                <ListGroup.Item>
                                    <div class="row">

                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="fromDate" className="d-flex align-items-right col-sm-10 col-form-label">מתאריך</label>
                                                <div className="col-sm-10">
                                                    <input type="date" className="form-control" id="fromDate" name="startdate" value={this.state.dataFilter.startdate} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="toDate" className="d-flex align-items-right col-sm-10 col-form-label">עד תאריך</label>
                                                <div className="col-sm-10">
                                                    <input type="date" className="form-control" id="toDate" name="enddate" value={this.state.dataFilter.enddate} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="fromTime" className="d-flex align-items-right col-sm-10 col-form-label">משעה</label>
                                                <div className="col-sm-10">


                                                    <input type="time" className="form-control" id="fromTime" name="starttime" value={this.state.dataFilter.starttime} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="toTime" className="d-flex align-items-right col-sm-10 col-form-label">עד שעה</label>
                                                <div className="col-sm-10">
                                                    <input type="time" className="form-control" id="toTime" name="endtime" value={this.state.dataFilter.endtime} onChange={this.onChangeHandler} />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <label htmlFor="vehicleType" className="d-flex align-items-right col-sm-10 col-form-label">סוג רכב</label>
                                                <div className="col-sm-10">
                                                    <select className="form-control" id="vehicleType" name="vehicletype" value={this.state.dataFilter.vehicletype} onChange={this.onChangeHandler} >
                                                        <option selected value="">סוג רכב</option>
                                                        {this.state.vehicles.map((vehicle, index) => <option key={index} value={vehicle.vehicle_type.type}>{vehicle.vehicle_type.type} {vehicle.capacity}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-5">
                                            <div className="form-group row">
                                                <label htmlFor="vehicleType" className="d-flex align-items-right col-sm-10 col-form-label mb-2">תוספות</label>
                                                <div className="form-check form-check-inline">
                                                    {this.state.extras.map((extra) => {
                                                        return [<input id={extra.id} value={extra.name} className="form-check-input ml-1" type="checkbox" name="extra" onChange={this.onChangeCheckboxexs} />,
                                                        <label className="form-check-label ml-2" htmlFor={extra.id}>{extra.name}</label>]

                                                    })}

                                                </div>
                                            </div>
                                        </div>

                                        <div class="col-md-3">
                                            <div className="form-group row">
                                                <div>
                                                    <label htmlFor="capacity" className="d-flex align-items-right col-sm-10 col-form-label">&nbsp;</label>
                                                </div>
                                                <div className="ml-3">

                                                </div>
                                                <button className="btn btn-primary btn-block" type="button" onClick={this.onClickFilter}>סנן</button>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
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
                            this.props.busCard ?
                                this.props.dataBuses.map(order => (

                                    <Cards
                                        idBus={order.id}
                                        busCard={this.props.busCard}
                                        start_date={order.start_date}
                                        end_date={order.end_date}
                                        start_hour={order.start_hour}
                                        end_hour={order.end_hour}
                                        description={order.description}
                                        vehicle_type={order.vehicle.vehicle_type.type}
                                        capacity={order.vehicle.capacity}
                                    />
                                ))
                                : null
                        }
                        {
                            this.props.orderListData && !(this.state.isFilter) ?
                                this.props.dataOrders.map(order => (
                                    <Cards
                                        idList={order.id}
                                        start_point={order.start_point}
                                        destination={order.destination}
                                        customerFirstName={order.customerFirstName}
                                        customerLastName={order.customerLastName}
                                        customerPhone={order.customerPhone}
                                        dataOrders={this.props.dataOrders} />
                                ))
                                :
                                this.state.dataTemp.map(order => (
                                    <Cards
                                        idList={order.id}
                                        start_point={order.start_point}
                                        destination={order.destination}
                                        customerFirstName={order.customerFirstName}
                                        customerLastName={order.customerLastName}
                                        customerPhone={order.customerPhone} />
                                ))
                        }



                    </div>
                </div> */}
                
            </div>
        )
    }
}
