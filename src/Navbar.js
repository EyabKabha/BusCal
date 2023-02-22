import React from 'react';
import { Redirect } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { getGuestUser, getUser, logout } from './api/auth';
import './assets/style.css';
export default class NavbarTool extends React.Component {
    constructor(props) {
        super(props)

        this.guestUser = getGuestUser();
        const loginDetailsCookie = getUser();
        let loginDetails = this.guestUser;
        if (loginDetailsCookie) {
            loginDetails = JSON.parse(loginDetailsCookie);
            this.setState({ loginDetails: loginDetails })
        } else {
            this.setState({ logoutStatus: true })
        }
        this.state = {
            homeBus: false,
            setting: false,
            settingAdmin: false,
            adminAndEmployeesSetting: false,
            logoutStatus: false,
            homeCompany: false,
            homeCustomer: false,
            homeSale: false,
            homeSupport: false,
            loginDetails: {
                firstname: loginDetails.firstname,
                lastname: loginDetails.lastname,
                role: { id: loginDetails.role.id, name: loginDetails.role.name }
            },
            dataSetting: [],
        }



    }

    onClickSetting = async () => {
        const usersRole = this.state.loginDetails;
        try {
            if (usersRole.role.name === 'support' || usersRole.role.name === 'admin' || usersRole.role.name === 'subAdmin') {
                // await fetcher.get('/employees/myDetails')
                // this.props.history.push('/edit_employee_Info/');
                this.setState({ adminAndEmployeesSetting: true })
            } else{
                // const {data} = await fetcher.get('/customers/myDetails')
                this.setState({ setting: true })
                // this.props.history.push('/editInfo/');
            }
        
        } catch (error) {
        }
    }

    onClickBUs = () => {
        const usersRole = this.state.loginDetails;
        if (usersRole.role.name === 'adminCompany' || usersRole.role.name === 'userCompany') {
            // this.setState({ homeCompany: true })
            this.props.history.push('/company/');
        } else if (usersRole.role.name === 'customer') {
            // this.setState({ homeCustomer: true })
            this.props.history.push('/customer/');
        } else if (usersRole.role.name === 'sale') {
            // this.setState({ homeSale: true })
            this.props.history.push('/salesman/');
        } else if (usersRole.role.name === 'support') {
            // this.setState({ homeSupport: true })
            
            this.props.history.push('/support/');
        } else if (usersRole.role.name === 'admin' || usersRole.role.name === 'subAdmin') {
            // this.setState({ homeAdmin: true })
            this.props.history.push('/admin');
        }
    }

    logout = () => {
        const roleUsers = this.state.loginDetails
        if (roleUsers.role.name === 'admin' || roleUsers.role.name === 'subAdmin' || roleUsers.role.name === 'sale' || roleUsers.role.name === 'support') {
            this.setState({ settingAdmin: true })
            // this.props.history.push('/adminlogin/');
            // this.props.history.push('/support/');
          
            logout();
            this.setState({ loginDetails: this.guestUser });
        } else {
            logout();
            this.setState({ loginDetails: this.guestUser });
        }
    }

    render() {

        return (
            <div>

                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                    <Navbar.Brand href=" " id="busCalLogo" onClick={this.onClickBUs}>BusCal</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <NavDropdown title="הגדרות " id="collasible-nav-dropdown">
                                {this.state.loginDetails.role.name === 'support' || this.state.loginDetails.role.name === 'sale' || this.state.loginDetails.role.name==='subAdmin'? null :
                                    <div>
                                        <NavDropdown.Item href="" onClick={this.onClickSetting}>פרטים אישיים</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                    </div>
                                }
                                <NavDropdown.Item href="" onClick={this.logout}>התנתק</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                {!this.state.loginDetails.role.name && <Redirect to="/login" />}
                {this.state.adminAndEmployeesSetting && <Redirect to="/edit_employee_Info" />}
                {this.state.homeAdmin && <Redirect to="/admin" />}
                {this.state.setting && <Redirect to="/editInfo/" />}
                {this.state.homeCompany && <Redirect to="/company" />}
                {this.state.homeCustomer && <Redirect to="/customer" />}
                {this.state.homeSale && <Redirect to="/salesman" />}
                {this.state.homeSupport && <Redirect to="/support" />}
                {this.state.settingAdmin && <Redirect to="/adminlogin" />}

            </div>
        )
    }
}
