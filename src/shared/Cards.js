import React from 'react';
import { Button, Card } from 'react-bootstrap';

import { AddDepModal } from '../Company/AddDepModal';
import fetcher from '../api/fetcher';

export default class Cards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            deps: [],
            addModalShow: false,
            isMoreDetails: false,
            addModalShowMoreDetails: false,
            dataOrderMapped: {
                vehicleType: { vehicle_type: '', capacity: '' },
                stopStations: [{ station: '', sequence: '' }],
                extra: [{ id: '', name: '' }],
                customerPhone: '',
            },
            dataOrderMappedBus: {},
            windowWidth: window.innerWidth

        }

    }
    toggleMenu = async (id) => {
        try {
            if (this.props.busCard) {

                const { data } = await fetcher.get(`/companies/available_vehicles/${id}`);
                await this.setState({ dataOrderMappedBus: data, isMoreDetailsBus: true })
                return;
            } else if (this.props.idList) {
                const { data } = await fetcher.get(`companies/order/${id}`);
                var arrayTempExtra = []
                for (let i = 0; i < this.props.extraOrders.length; i++) {
                    for (let j = 0; j < data.extra.length; j++) {
                        if (this.props.extraOrders[i].id === data.extra[j]) {
                            arrayTempExtra.push(this.props.extraOrders[i].name)
                        }
                    }
                }
                await this.setState({
                    dataOrderMapped: data, isMoreDetails: true,

                })
                await this.setState({
                    dataOrderMapped: {
                        ...this.state.dataOrderMapped,
                        extra: arrayTempExtra,
                    }
                })
                return
            }

        } catch (error) {

        }

    }
    addModalClosed = () => this.setState({ addModalShow: false, isMoreDetails: false, isMoreDetailsBus: false })
    addModalClosedBus = () => this.setState({ addModalShow: false, isMoreDetails: false, isMoreDetailsBus: false })


    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        console.clear()
        window.addEventListener("resize", this.handleResize);
    }


    render() {
        // const { windowWidth } = this.state;
        const show = (this.state.isOpen) ? "show" : "";
        return (

            <div>
                <div className="mt-3">
                    <div className="col-md-1 col-sm-3 mb-2"></div>
                    <div className="col-md-12 col-sm-6 col-3">

                        <Card style={this.state.windowWidth < 800 && this.state.windowWidth >= 500? { width: '375px' } : this.state.windowWidth >=800 ?{ width: '312px' } :{width:'270px'}}>
                            {this.props.busCard ?
                
                                <Card.Body className="text-right"  style={this.props.subscription === 'vip' ? { backgroundColor: 'PowderBlue' } : null}>

                                    <h5><u>אוטובוס זמין</u></h5>
                                    <Card.Text>

                                        <h6>{`מתאריך ${this.props.start_date}`}</h6>
                                        <h6>{`עד תאריך ${this.props.end_date}`}</h6>
                                        <h6 className="card-text">{`שעת יציאה : ${this.props.start_hour}`}</h6>
                                        <h6 className="card-text">{`שעת חזרה: ${this.props.end_hour}`}</h6>
                                        <h6 className="card-text">{`סוג רכב :  ${this.props.vehicle_type} ${this.props.capacity}`}</h6>
                                        {/* <AddDepModal show={this.state.addModalShow} onHide={addModalClosed} /> */}
                                        <AddDepModal
                                            show={this.state.addModalShow || this.state.isMoreDetailsBus}
                                            onHide={()=>false} 
                                            dataOrderMappedBus={this.state.dataOrderMappedBus}
                                            idBus={this.props.idBus}
                                            busCard={this.props.busCard}
                                            serial_number_Bus={this.props.serial_number_Bus}

                                            isMoreDetailsBus={this.state.isMoreDetailsBus}
                                            updateFinalStateBuses={this.props.updateFinalStateBuses}
                                            dataBuses={this.props.dataBuses} 
                                            addModalClosed={this.addModalClosedBus}/>

                                    </Card.Text>
                                </Card.Body>
                                : //font-weight-bold

                                <Card.Body className="text-right" style={this.props.subscription.length === 1 && this.props.subscription[0].subscription === 'vip' ? { backgroundColor: 'PowderBlue' } : null}>
                                    <h6 className={this.props.subscription.length === 1 && this.props.subscription[0].subscription === 'vip' ? 'font-weight-bold' : null}>{`הסעה מ ${this.props.start_point} עד ${this.props.destination}`}</h6>
                                    <Card.Text>

                                        <h6 className={this.props.subscription.length === 1 && this.props.subscription[0].subscription === 'vip' ? 'font-weight-bold' : null}>{`שם לקוח : ${this.props.customerFirstName} ${this.props.customerLastName}`}</h6>
                                        <h6 className={this.props.subscription.length === 1 && this.props.subscription[0].subscription === 'vip' ? 'font-weight-bold' : null}>{`טלפון לקוח : ${this.props.customerPhone}`}</h6>

                                        <AddDepModal
                                            isMoreDetails={this.state.isMoreDetails}
                                            onHide={()=>false} //addModalClosed
                                            show={this.state.addModalShow || this.state.isMoreDetails}
                                            addModalShowMoreDetails={this.state.addModalShowMoreDetails}
                                            closedOrders={this.closedOrders}
                                            dataOrderMapped={this.state.dataOrderMapped}
                                            idList={this.props.idList}
                                            serial_number={this.props.serial_number}
                                            dataOrders={this.props.dataOrders}
                                            updateFinalState={this.props.updateFinalState}
                                            addModalClosed={this.addModalClosed} />
                                        <div className="mb-2 mt-2 float-right">

                                            <div id="demo" className={"mt-2 text-right collapse" + show}>
                                                <h6 className="card-title">{`שם לקוח: ${this.state.dataOrderMapped.customerFirstName} ${this.state.dataOrderMapped.customerLastName}`}</h6>
                                            </div>
                                        </div>
                                    </Card.Text>
                                </Card.Body>}
                            <Button variant="primary" className="mb-2" onClick={() => this.setState({ addModalShow: true })}>משיכת הזמנה</Button>
                            <button type="button" className="btn btn-dark" data-toggle="collapse" onClick={() => (this.props.busCard) ? this.toggleMenu(this.props.idBus) : this.toggleMenu(this.props.idList)}>פרטים נוספים</button>
                        </Card>
                    </div>
                    <div className="col-sm-3 mb-2"></div>

                </div>
            </div>
        );

    }
}

