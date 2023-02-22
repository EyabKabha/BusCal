import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AdminLogin from './Admin/AdminLogin';
import Company from './Company/Company';
import Customer from './Customer/Customer';
import Bid from './shared/Bid';
import WaitingRequests from './shared/WaitingRequests';
import Resetpassword from './Resetpassword';
import OrderHistory from './shared/OrderHistory';
import OrderList from './Company/OrderList';
import Admin from './Admin/Admin';
import Settings from './Admin/Settings';
import Employees from './Admin/Employees';
import Users from './Admin/Users';
import Home from './Home';
import Login from './Login';
import Salesman from './Admin/Salesman';
import SignUpEmployee from './Admin/SignUpEmployee';
import Support from './Admin/Support';
import SignUpEmployeCompany from './Company/SignUpEmployeCompany';
import EmployeesCompany from './Company/EmployeCompany';
import CompaniesRequests from './Company/CompaniesRequests';
import ClosedOrders from './Company/ClosedOrders';
import BusOffer from './Company/BusOffer';
import Authentication from './api/Authentication';
import AddOrder from './Admin/AddOrder';
import { CompanyContext } from './CompanyContext';
import SignUpDetails from './SignUpDetails';
import { createBrowserHistory } from 'history'
import MyOrders from './shared/MyOrders';
import fetcher from './api/fetcher';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [],
      citiesArray: (city) => {
        this.setState({ cities: [...this.state.cities, city] });
      }
    }
  }
  componentDidMount = async () => {
    try {
      console.log('in cities')
      // console.clear()
      const { data } = await fetcher.get('/cities');
      this.setState({ cities: data });

    } catch (error) {

    }
  }

  render() {

    return (

      <CompanyContext.Provider value={this.state}>

        <BrowserRouter>
          <Switch>
            <Route path="/support/bid/:id" render={props => <Authentication><Bid {...props} /></Authentication>}>
              {/* <Bid /> */}
            </Route>
            <Route path="/support/bus_offer/:id" render={props => <Authentication><BusOffer {...props} /></Authentication>}>
              {/* <Bid /> */}
            </Route>
            <Route path="/support/all_waiting_customer_orders/:id" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <Employees /> */}
            </Route>
            <Route path="/support/customer/waiting_requests/:id" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <Employees /> */}
            </Route>
            <Route path="/support/users/signup/:id" render={props => <Authentication><SignUpDetails {...props} /></Authentication>}>
              {/* <SignUpDetails /> */}
            </Route>

            <Route history={createBrowserHistory} path="/support" render={props => <Authentication><Support {...props} /></Authentication>}>
              {/* <Support /> */}
            </Route>

            <Route path="/admin/employees/signup/:id" render={props => <Authentication><SignUpEmployee {...props} /></Authentication>}>
              {/* <SignUpEmployee /> */}
            </Route>
            <Route path="/admin/employees/signup" render={props => <Authentication><SignUpEmployee {...props} /></Authentication>}>
              {/* <SignUpEmployee /> */}
            </Route>
            
            <Route path="/admin/users/signup/:id" render={props => <Authentication><SignUpDetails {...props} /></Authentication>}>
              {/* <SignUpDetails /> */}
            </Route>
            <Route path="/signup" render={props => <Authentication><SignUpDetails {...props} /></Authentication>}>
              {/* <SignUpDetails /> */}
            </Route>
            <Route path="/editInfo" render={props => <Authentication><SignUpDetails {...props} /></Authentication>}>
              {/* <SignUpDetails /> */}
            </Route>
            <Route path="/edit_employee_Info" render={props => <Authentication><SignUpEmployee {...props} /></Authentication>}>
              {/* <SignUpEmployee /> */}
            </Route>
            <Route path="/reset" render={props => <Authentication><Resetpassword {...props} /></Authentication>}>
              {/* <Resetpassword /> */}
            </Route>
            <Route path="/customer/bid" render={props => <Authentication><Bid {...props} /></Authentication>}>
              {/* <Bid /> */}
            </Route>

            <Route path="/customer/waiting_requests" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <WaitingRequests /> */}
            </Route>
            <Route path="company/bid/:id">
              <Bid />
            </Route>
            <Route path="/company/employees" render={props => <Authentication><EmployeesCompany {...props} /></Authentication>}>
              {/* <EmployeesCompany /> */}
            </Route>
            <Route path="/company/signup" render={props => <Authentication><SignUpEmployeCompany {...props} /></Authentication>}>
              {/* <SignUpEmployeCompany /> */}
            </Route>
            <Route path="/customer/history" render={props => <Authentication><OrderHistory {...props} /></Authentication>}>
              {/* <OrderHistory /> */}
            </Route>
            <Route path="/company/vehicle_orders/my_orders" render={props => <Authentication><MyOrders {...props} /></Authentication>}>
              {/* <OrderList /> */}
            </Route>
            <Route path="/company/order_list/my_orders" render={props => <Authentication><MyOrders {...props} /></Authentication>}>
              {/* <OrderList /> */}
            </Route>
            <Route path="/company/order_list" render={props => <Authentication><OrderList {...props} /></Authentication>}>
              {/* <OrderList /> */}
            </Route>
            <Route path="/company/bid" render={props => <Authentication><Bid {...props} /></Authentication>}>
              {/* <Bid /> */}
            </Route>

            <Route path="/company/waiting_requests" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <WaitingRequests /> */}
            </Route>
            <Route path="/company/companies_requests" render={props => <Authentication><CompaniesRequests {...props} /></Authentication>}>
              {/* <CompaniesRequests /> */}
            </Route>
            <Route path="/company/closed_orders" render={props => <Authentication><ClosedOrders {...props} /></Authentication>}>
              {/* <ClosedOrders /> */}
            </Route>
            <Route path="/company/history" render={props => <Authentication><OrderHistory {...props} /></Authentication>} >
              {/* <OrderHistory /> */}
            </Route>
            <Route path="/company/bus_offer" render={props => <Authentication><BusOffer {...props} /></Authentication>}>
              {/* <BusOffer /> */}
            </Route>
            <Route path="/customer" render={props => <Authentication><Customer {...props} /></Authentication>}>
              {/* <Customer /> */}
            </Route>
            <Route path="/company" render={props => <Authentication><Company {...props} /></Authentication>}>
              {/* <Company /> */}
            </Route>
            <Route path="/admin/customer/waiting_requests/:id" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <WaitingRequests /> */}
            </Route>
            <Route path="/admin/company/waiting_requests/:id" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <WaitingRequests /> */}
            </Route>
            <Route path="/admin/bus_offer/:id" render={props => <Authentication><BusOffer {...props} /></Authentication>}>
              {/* <BusOffer /> */}
            </Route>
            <Route path="/admin/users/addOrder" render={props => <Authentication><AddOrder {...props} /></Authentication>}>
              {/* <Users /> */}
            </Route>
            <Route path="/admin/users" render={props => <Authentication><Users {...props} /></Authentication>}>
              {/* <Users /> */}
            </Route>
            <Route path='/admin/bid/:id' render={props => <Authentication><Bid {...props} /></Authentication>}>
              {/* <Users /> */}
            </Route>
            <Route path="/admin/all_waiting_customer_orders/:id" render={props => <Authentication><WaitingRequests {...props} /></Authentication>}>
              {/* <Employees /> */}
            </Route>

            <Route path="/admin/settings" render={props => <Authentication><Settings {...props} /></Authentication>}>
              {/* <Settings /> */}
            </Route>
            <Route path="/admin/employees" render={props => <Authentication><Employees {...props} /></Authentication>}>
              {/* <Employees /> */}
            </Route>
            <Route path="/admin/sub_admin_edit_Info" render={props => <Authentication><SignUpEmployee {...props} /></Authentication>}>
              {/* <SignUpEmployee /> */}
            </Route>

            <Route path="/admin" render={props => <Authentication><Admin {...props} /></Authentication>}>
              {/* <Admin /> */}
            </Route> 
            <Route path="/subadmin" render={props => <Authentication><Admin {...props} /></Authentication>}>
              {/* <Admin /> */}
            </Route> 
            {/* subadmin */}
            <Route path="/adminlogin" render={props => <Authentication><AdminLogin {...props} /></Authentication>}>
              {/* <AdminLogin /> */}
            </Route>
            <Route path="/login" render={props => <Authentication><Login {...props} /></Authentication>}>
              {/* <Login /> */}
            </Route>

            <Route path="/salesman" render={props => <Authentication><Salesman {...props} /></Authentication>}>
              {/* <Salesman /> */}
            </Route>
            <Route path="/" >
              <Home />
            </Route>
          </Switch>
        </BrowserRouter>
      </CompanyContext.Provider>

    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"));



