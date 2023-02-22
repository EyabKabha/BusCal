import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../assets/style.css';
import { Redirect } from 'react-router-dom';
import { getUser, getGuestUser } from '../api/auth';


export default class PopUp extends React.Component {
    constructor(props) {
        super(props)
        this.guestUser = getGuestUser();
        const loginDetailsCookie = getUser();
        let loginDetailsPersonal = this.guestUser

        if (loginDetailsCookie) {
            loginDetailsPersonal = JSON.parse(loginDetailsCookie);
            this.setState({ loginDetails: loginDetailsPersonal })

        }
        this.state = {
            passwordData: {
                password: '',
            },
            msg: !(this.props.errormsg),
            btnHome: false,
            loginDetails: {
                firstname: loginDetailsPersonal.firstname,
                lastname: loginDetailsPersonal.lastname,
                role: { id: loginDetailsPersonal.role.id, name: loginDetailsPersonal.role.name }
            },
            homeBtnSale: false,
            btnEmployee: false,
            btnCompany: false,
            fileWithOutPic: [],

        }
    }
    onChangeHandler = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.passwordData, [target.name]: value };
        this.setState({ passwordData: savedData, msg: false });
        this.props.changePopView(() => this.setState({ errormsg: false }))
        this.props.setStateLabel()
    }

    backHomeBtn = () => {
        if (this.state.loginDetails.role.name === 'sale') {
            this.setState({ homeBtnSale: true })
            // this.props.history.push('/salesman')
        }
        else if (this.state.loginDetails.role.name === 'admin' || this.state.loginDetails.role.name === 'subAdmin') {
            this.setState({ btnEmployee: true })
            // this.props.history.push('/admin/employees')
        }
        else if (this.state.loginDetails.role.name === 'adminCompany' || this.state.loginDetails.role.name === 'userCompany') {
            this.setState({ btnCompany: true })
        }
        else {
            // this.props.history.push('/login')
            this.setState({ btnHome: true })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.show === false) {
            this.setState({
                passwordData: {
                    ...this.state.passwordData,
                    password: ''
                },
            })

        }
    }
  
    render() {
        var allowedExtension = ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'jfif'];
        return (
            <div>
                {this.props.isDelete || this.props.deleteSetting ?
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                <div>
                                    <h5 id="header">מחיקה</h5>
                                </div>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-right">
                            <h1>האם אתה בטוח למחוק?</h1>
                            <div className="form-group row">
                                <label htmlFor="passConfirm" className="d-flex align-items-right col-sm-3 col-form-label">הקש סיסמה לאישור</label>
                                <div className="col-sm-10">
                                    <input id="passConfirm" type="password" className={this.props.validityState || 'form-control'} name="password" value={this.state.passwordData.password} onChange={this.onChangeHandler} />
                                </div>
                            </div>
                            {this.props.isDelete ?
                                <div id="errorInput" className="text-danger font-weight-bold">{this.props.message}</div> :
                                <div id="errorInput" className="text-danger font-weight-bold">{this.props.messageSet}</div>
                            }

                        </Modal.Body>
                        <Modal.Footer>
                            {this.props.isDelete ?
                                <Button variant="warning" onClick={() => this.props.onClickDeleteUser(this.props.idDelete, this.state.passwordData)}>אשר מחיקה</Button>
                                :
                                <Button variant="danger" onClick={() => this.props.excludeFromStateArrayById(this.props.stateDelete, this.props.idDelete, this.state.passwordData)}>אשר מחיקה</Button>
                            }
                        </Modal.Footer>

                    </Modal> : null
                }
                {this.props.isCreate ?
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">

                                <div>
                                    <h5 id="header">יצירה</h5>
                                </div>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-right">
                            <h1>{this.props.msg}</h1>
                        </Modal.Body>
                        <Modal.Footer>
                            {this.props.updatePopup ? null :
                                this.props.typeSubscription === 'regular' ? <a id="regularSub" className="btn btn-outline-primary btn-block" href="https://app.icount.co.il/m/70e63/c45461p3u5f1c67f34e">מעבר לתשלום</a> :
                                    this.props.typeSubscription === 'vip' ? <a id="regularSub" className="btn btn-outline-primary btn-block" href="https://app.icount.co.il/m/cc94e/c45461p4u5f284b9b73">מעבר לתשלום</a> : null
                            }
                            {/* <Button variant="warning" onClick={this.backHomeBtn}>חזרה</Button> */}

                        </Modal.Footer>
                        {this.state.btnHome && <Redirect to="/login" />}
                        {this.state.btnEmployee && <Redirect to="/admin/users" />}
                        {this.state.homeBtnSale && <Redirect to="/salesman" />}
                        {this.state.btnCompany && <Redirect to="/company" />}
                    </Modal> : null
                }
                {

                    this.props.isCreateEmployee ?
                        <Modal
                            {...this.props}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>
                            <Modal.Header>
                                <Modal.Title id="contained-modal-title-vcenter">

                                    <div>
                                        <h5 id="header">יצירה</h5>
                                    </div>

                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-right">
                                <h1>{this.props.msg}</h1>
                            </Modal.Body>
                            <Modal.Footer>
                                {this.props.updatePopup ? null :
                                    this.props.typeSubscription === 'regular' ? <a id="regularSub" className="btn btn-outline-primary btn-block" href="https://app.icount.co.il/m/70e63/c45461p3u5f1c67f34e">מעבר לתשלום</a> :
                                        this.props.typeSubscription === 'vip' ? <a id="regularSub" className="btn btn-outline-primary btn-block" href="https://app.icount.co.il/m/cc94e/c45461p4u5f284b9b73">מעבר לתשלום</a> : null
                                }
                                <Button variant="warning" onClick={this.backHomeBtn}>חזרה</Button>

                            </Modal.Footer>
                            {this.state.btnHome && <Redirect to="/login" />}
                            {this.state.btnEmployee && <Redirect to="/admin/employees" />}
                            {this.state.homeBtnSale && <Redirect to="/salesman" />}
                            {this.state.btnCompany && <Redirect to="/company" />}
                        </Modal> : null
                }
                {this.props.isDeleteOrder ?
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                <div>
                                    <h5 id="header">מחיקה</h5>
                                </div>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-right">
                            <h1>האם אתה בטוח למחוק?</h1>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={() => this.props.excludeFromStateArrayById(this.props.idDelete, this.props.stateName)}>אשר מחיקה</Button>
                        </Modal.Footer>

                    </Modal> : null
                }
                {this.props.showDetails ?
                    <Modal
                        {...this.props}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header>
                            <Modal.Title id="contained-modal-title-vcenter">
                                <div>
                                    <h5 id="header">פרטים נוספים</h5>
                                </div>

                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="text-right">
                            <div className="card">
                                <div className="card-body">
                                    <h5 classNmae="card-title">{this.props.dataShowCust.company_name}</h5>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="card-text">שם לקוח : {this.props.dataShowCust.first_name + ' ' + this.props.dataShowCust.last_name}</div>
                                            <div className="card-text">נייד : {this.props.dataShowCust.company_phone}</div>
                                            <div className="card-text">מספר פקס :  {this.props.dataShowCust.company_fax}</div>
                                            <div className="card-text">דוא"ל :  {this.props.dataShowCust.company_email}</div>
                                            {/* <label className="card-text"><u>* לחץ על התמונה להורדה</u></label> */}
                                        </div>
                                        <div className="col-md-6">
                                            <div className="card-text">ח.פ./עוסק מורשה : {this.props.dataShowCust.code}</div>
                                            <div className="card-text">מספר טלפון : {this.props.dataShowCust.company_t_phone}</div>
                                            <div className="card-text">כתובת חברה : {this.props.dataShowCust.company_city}</div>
                                            <div className="card-text">מיקוד : {this.props.dataShowCust.postal_code}</div>
                                            {/* <a class="card-text" href={this.props.file1[1]}>קובץ 101</a> */}
                                        </div>
                                        {this.props.file1.map((file, index) => {

                                            return <div className="text-left mt-2 mr-3"> <a href={file} download>
                                                {
                                                    allowedExtension.indexOf(file.split(/[\s.]+/)) ? <img src={file} alt={file} width="160" height="145" /> : null
                                                }
                                            </a></div>
                                        })}
                                        <div className="text-left">
                                            {this.props.file1.map((file, index) => {
                                                return <div className="text-left mt-2 mr-3"> <a href={file} download>
                                                    {
                                                        allowedExtension.indexOf(file.split(/[\s.]+/)) ? null : <a href={file}>{file}</a>
                                                    }
                                                </a></div>
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>

                        </Modal.Footer>

                    </Modal> : null


                }
            </div>
        )
    }
}