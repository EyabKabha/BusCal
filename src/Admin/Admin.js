import React from 'react';
import { CompanyContext } from '../CompanyContext';
import Navbar from '../Navbar';
import Table from '../shared/Table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStreetView, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";
import fetcher from '../api/fetcher';
import PopUp from '../shared/PopUp';
import Swal from 'sweetalert2';
import { getUser } from '../api/auth';

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            newCustomers: [],
            isUsers: false,
            isEmployees: false,
            isSettings: false,
            personalInfoAdmin: {},
            waiting_customers: [],
            dataShow: [],
            showDetails: false,
            addModalShow: false,
            deleteWaiting: false,
            msgDelete: '',
            msgDataConfirm: '',
            dataIdSave: { id: '' },
            confirmUser: false,
            fileWaiting: [],
            imagePreviewUrlWait: null,
            arrayFiles: [],
        }
    }
    vipHeaders = [
        { key: "id", value: 'לקוחות בהמתנה', toSort: false },
        { key: "name", value: "שם חברה", toSort: false },
        { key: "username", value: "תאריך הרשמה", toSort: false }
    ];
    vipData = [
        { key: [<div className="mb-2"><button type="button" className="btn btn-success float-right col-md-5 col-sm-12 mb-2">אשר לקוח</button> <button type="button" className="btn btn-info col-md-5  col-sm-12">פרטים נוספים</button></div>], vipValue: 'עלימי בע"מ', regValue: '05/11/2020' },
        { key: [<div className="mb-2"><button type="button" className="btn btn-success float-right col-md-5 col-sm-12 mb-2">אשר לקוח</button> <button type="button" className="btn btn-info col-md-5  col-sm-12">פרטים נוספים</button></div>], vipValue: 'עלימי בע"מ', regValue: '05/11/2020' },
        { key: [<div className="mb-2"><button type="button" className="btn btn-success float-right col-md-5 col-sm-12 mb-2">אשר לקוח</button> <button type="button" className="btn btn-info col-md-5  col-sm-12">פרטים נוספים</button></div>], vipValue: 'עלימי בע"מ', regValue: '05/11/2020' },
        { key: [<div className="mb-2"><button type="button" className="btn btn-success float-right col-md-5 col-sm-12 mb-2">אשר לקוח</button> <button type="button" className="btn btn-info col-md-5  col-sm-12">פרטים נוספים</button></div>], vipValue: 'עלימי בע"מ', regValue: '05/11/2020' },
    ]
    onClickUsers = () => {
        this.setState({ isUsers: true });
    }

    onClickEmployees = () => {
        // this.setState({ isEmployees: true });
        this.props.history.push('/admin/employees');
    }

    onClickSettings = () => {
        // this.setState({ isSettings: true });
        this.props.history.push('/admin/settings');
    }

    usersSystem = () => {
        // this.setState({ isUsers: true });
        this.props.history.push('/admin/users');
    }

    componentDidMount = async () => {
        try {   
            console.clear()
            if(getUser()){
                var person = JSON.parse(getUser());
                const { data } = await fetcher.get("/customers/waiting");
                // const myDetails = await fetcher.get('/employees/myDetails')
                await this.setState({ personalInfoAdmin: person, waiting_customers: data }) 
            }   
        } catch (error) {
        }
    }
  
    onSaveCustomer = async (id) => {
        try {
            const idState = this.state.dataIdSave.id
            const { data } = await fetcher.post('/signup/confirm_waiting_customer', this.state.dataIdSave);
            const filterData = this.state.waiting_customers.filter(function (element) { return element.id !== idState });
            this.setState({ waiting_customers: filterData, msgDataConfirm: data, confirmUser: true })
            Swal.fire({
                title: `${data}`,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })

        } catch (error) {

        }
    }
    moreDetailsCustomer = async (id) => {
        try {
            const { data } = await fetcher.get(`/customers/waiting/${id}`)
            const file1 = await fetcher.get(`/companies/load_waiting_files/${id}`)

            this.setState({
                dataIdSave: {
                    id: data.id
                }
            })
            this.setState({ dataShow: data, showDetails: true, addModalShow: true, arrayFiles: file1.data })
       

        } catch (error) {

        }
    }

    deleteWatingUser = async (id) => {
        try {
            // const alert = useAlert();
            const { data } = await fetcher.delete(`/customers/waiting/${id}`);
            const filterData = this.state.waiting_customers.filter(function (element) { return element.id !== id; });
            this.setState({ waiting_customers: filterData, msgDelete: data, deleteWaiting: true })
            Swal.fire({
                title: `${data}`,
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                }
            })
        } catch (error) {

        }
    }


    render() {
        let addModalClosed = () => this.setState({ addModalShow: false })

        return (
            <body dir="rtl">
                <Navbar />
               
                
                <div className="container">
                    <div className="text-right mt-4">
                        <div>
                            <h1> {`שלום ${this.state.personalInfoAdmin.firstname} ${this.state.personalInfoAdmin.lastname}`} </h1>
                        </div>
                    </div>
                    <div className="row mt-4">

                        <div className="col-md-4">

                            <button type="button" className="btn btn-primary btn-block mt-3" onClick={this.onClickEmployees}>עובדים
                            <i className="mr-2"><FontAwesomeIcon className="fa-lg" icon={faStreetView}></FontAwesomeIcon></i>
                            </button>


                        </div>
                        <div className="col-md-4">

                            <button type="button" className="btn btn-success btn-block mt-3" onClick={this.usersSystem}>משתמשים
                            <i className="mr-2"><FontAwesomeIcon className="fa-lg" icon={faUsers} ></FontAwesomeIcon></i>
                            </button>
                        </div>
                        <div className="col-md-4">

                            <button type="button" className="btn btn-warning btn-block mt-3" onClick={this.onClickSettings}>הגדרות
                            <i className="mr-2"><FontAwesomeIcon className="fa-lg" icon={faCog} ></FontAwesomeIcon></i>
                            </button>

                        </div>

                        {/* {this.state.isUsers && <Redirect to="/admin/users" />} */}
                        {/* {this.state.isEmployees && <Redirect to="/admin/employees" />} */}
                        {/* {this.state.isSettings && <Redirect to="/admin/settings" />} */}

                        <div className="col mt-3 text-center">


                            <Table
                                header={this.vipHeaders}
                                // data={this.vipData}
                                data={this.state.waiting_customers.map(customer => {
                                    return ({
                                        actions: [
                                            <div className="mb-2">
                                                {/* <button type="button" className="btn btn-success float-right col-md-4 col-sm-12 mb-2" onClick={this.onSaveCustomer}>אשר לקוח</button> */}
                                                <button type="button" className="mb-2 btn btn-outline-danger col-md-3 ml-3 col-sm-12" onClick={() => this.deleteWatingUser(customer.id)}>מחיקת לקוח</button>
                                                <button type="button" className="mb-2 btn btn-success col-md-3 ml-3 col-sm-12" onClick={this.onSaveCustomer}>אשר לקוח</button>
                                                <button type="button" className="mb-2 btn btn-info col-md-3  ml-3 col-sm-12" onClick={() => this.moreDetailsCustomer(customer.id)}>פרטים נוספים</button>
                                            </div>
                                        ],
                                        companyName: customer.company_name,
                                        creationDate: customer.creation_date
                                    });
                                })}

                                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                            </Table>
                        </div>
                        {this.state.showDetails &&
                            <PopUp show={this.state.addModalShow}
                                onHide={addModalClosed}
                                dataShowCust={this.state.dataShow}
                                showDetails={this.state.showDetails}
                                file1={this.state.arrayFiles} />

                        }

                    </div>

                </div>
            </body>
        )
    }
}


Admin.contextType = CompanyContext;

export default Admin;
