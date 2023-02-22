import React from 'react';
import CardsMyOrder from './CardsMyOrder';
import fetcher from '../api/fetcher';
export default class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myOrdersArray: [],
      myVehicleOrders: false,
      myDataVehicle: []
    }
  }
  componentDidMount = async () => {
    try {
      console.clear()
      const pathMyOrderOrderOrVehicle = window.location.pathname.split('/')[2];

      if (pathMyOrderOrderOrVehicle === 'order_list') {
        const { data } = await fetcher.get('/companies/orders');
        this.setState({ myOrdersArray: data.myOrders.orders })
      } else {
        const { data } = await fetcher.get('companies/available_vehicles');
        this.setState({
          myDataVehicle: data.availableVehiclesFromMyCompany.av,
          myVehicleOrders: true,
        })
      }

    } catch (error) {

    }
  }
  render() {
    return (
        
      <div className="container mt-5">
      <h1 className="mt-5 text-right">הזמונת שלי</h1>
        {this.state.myVehicleOrders ?
          this.state.myDataVehicle.map((order) => (
            <CardsMyOrder
              idList={order.id}
              start_date={order.start_date}
              end_date={order.end_date}
              start_hour={order.start_hour}
              end_hour={order.end_hour}
              vehicle={order.vehicle}
              myVehicleOrders={this.state.myVehicleOrders}
            />))
          :
          this.state.myOrdersArray.map((order) => (
            <CardsMyOrder
              idOrderList={order.id}
              start_point={order.start_point}
              destination={order.destination}
              description={order.description}
            />
          ))
        }


      </div>
    )
  }
}