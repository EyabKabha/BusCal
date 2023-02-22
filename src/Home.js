import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import ContactUs from './shared/ContactUs.js';
import './assets/style.css'
export default class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
        }

    }

    onClickLogin = () => {
        this.setState({ isLogin: true });
    }

    render() {
        return (

            
            <div>
            {/* <a className="btn btn-primary btn-block" href="https://app.icount.co.il/m/70e63/c45461p3u5f1c67f34e"></a> */}
                <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">

                    <Navbar.Text>
                        <a href="/login">כניסה לאיזור האישי</a>
                    </Navbar.Text>
                    <Nav className="mr-auto">
                        <Navbar.Text>
                            <a href="/signup">הרשמה</a>
                        </Navbar.Text>

                    </Nav>
                </Navbar>
                <div className="container">
                    <div className="row mt-5">
                        {/* <h1 className="mr-2"> מסך ראשי </h1> */}
                    </div>
                    <div className="row mt-5">
                        <div className="col"></div>
                        <div className="col-md-5 col-sm-6">
                            <div className="text-center">
                                <img src={'./buspic.jpg'} alt="Logo" width={'200px'} style={{ color: 'white' }}></img>
                            </div>
                            <div className="text-center">
                                <img  src={'./logoFinal/logo03.jpeg'} alt="Logo" width={'330px'}></img>
                                {/* <button type="button" className="btn btn-primary btn-block mt-3" onClick={this.onClickLogin}>כניסה</button> */}
                            </div>
                            {/* {this.state.isLogin && <Redirect to="/login" />} */}
                        </div>
                        <div className="col">

                        </div>
                    </div>
                </div>
                <div id="homepage">
                <ContactUs/>

                </div>
                </div>
        )
    }
}
