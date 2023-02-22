import React from 'react';
import { Collapse, Button, Card } from 'reactstrap';
import fetcher from '../api/fetcher';

class CardsMyOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,

            dataSpecificOrder: {
                vehicleType: { vehicle_type: '', capacity: '' },
                stopStations: [{ station: '', sequence: '' }],
                extra: [{ id: '', name: '' }],
            },
        }

    }
    onClickCollape = async () => {

        const { data } = await fetcher.get(`companies/order/${this.props.idOrderList}`);
        const dataExtra = await fetcher.get('http://localhost:3001/orders/order_details');
        var arrayTempExtra = []
        for (let i = 0; i < dataExtra.data.Extras.length; i++) {
            for (let j = 0; j < data.extra.length; j++) {
                if (dataExtra.data.Extras[i].id === data.extra[j]) {
                    arrayTempExtra.push(dataExtra.data.Extras[j].name)
                }
            }
        }
        this.setState({ isOpen: !this.state.isOpen, dataSpecificOrder: data });
        this.setState({
            dataSpecificOrder: {
                ...this.state.dataSpecificOrder,
                extra: arrayTempExtra
            }
        })
    }
    render() {

        return (

            <div className="text-right">

                {this.props.myVehicleOrders ?
                    <div className="card mb-2">

                        <div className="card-body text-right">
                            <div className="card-text mr-3">{`מתאריך ${this.props.start_date} עד ${this.props.end_date}`}.</div>
                            <div className="card-text mr-3">{`משעה ${this.props.start_hour} עד ${this.props.end_hour}`}.</div>
                            <div className="card-text mr-3">{`${this.props.vehicle}`}.</div>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="card">
                            <div className="card-header text-right" style={{ backgroundColor: '#90EE90' }}>
                                <div className="card-text text-primary font-weight-bold">{`${this.props.start_point} ${this.props.destination}`}.</div>
                            </div>
                            <div className="card-body text-right">

                                <h5 class="card-title">{this.props.description}</h5>
                                <Button color="primary" onClick={this.onClickCollape} style={{ marginBottom: '1rem' }}>פרטים נוספים</Button>
                                <Collapse isOpen={this.state.isOpen}>
                                    <Card >
                                        <div className="card-text mr-3 mt-2">{`הסעה מ ${this.props.start_point} עד ${this.props.destination}`}.</div>
                                        <div className="card-text mr-3">{`מתאריך ${this.state.dataSpecificOrder.start_date} עד ${this.state.dataSpecificOrder.end_date}`}.</div>
                                        <div className="card-text mr-3">{`שעת יציאה : ${this.state.dataSpecificOrder.start_hour}`}</div>
                                        <div className="card-text mr-3">{`שעת חזרה: ${this.state.dataSpecificOrder.end_hour}`}</div>
                                        <div className="card-text mr-3">{`הערות: ${this.state.dataSpecificOrder.description}`}</div>
                                        <div className="card-text mr-3">{`סוג רכב: ${this.state.dataSpecificOrder.vehicleType.vehicle_type.type} ${this.state.dataSpecificOrder.vehicleType.capacity}`}</div>
                                        <div className="card-text mr-3"><u>תחנות:</u></div>
                                        {this.state.dataSpecificOrder.stopStations.map(stopStation => (
                                            <div className="card-text mr-3">{`${stopStation.sequence} - ${stopStation.name}`}</div>
                                        ))}
                                        <div className="card-text mr-3"><u>תוספות:</u></div>
                                        {this.state.dataSpecificOrder.extra.map(extra => (
                                            <div className="card-text mr-3">{`- ${extra}`}</div>
                                        ))}
                                    </Card>
                                </Collapse>
                            </div>
                        </div>
                    </div>


                }
            </div>
        )
    }
}

export default CardsMyOrder;