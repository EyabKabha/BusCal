import React from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import fetcher from '../api/fetcher';
import PopUp from '../shared/PopUp';
import Navbar from '../Navbar';
import Table from '../shared/Table';
import Swal from 'sweetalert2'

class Employees extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isNewCustomer: false,
            onCancel: false,
            employees: [],
            dataAfterFilterFinal: [],
            editEmployee: false,
            addModalShow: false,
            idDelete: false,
            isDelete: null,
            errormsg: false,
            emptyArray: false,
            message: '',
            filterData: false,
            searchInput: {
                first_name: ''
            },
            formState: {},
            formMessages: {},
            validityState: {},

        }
    }

    onPupUpClicked = (id) => {
        this.setState({ isDelete: true, addModalShow: true, idDelete: id })

    }

    onClickNewCustomer = () => {
        // this.setState({ isNewCustomer: true });
        this.props.history.push('/admin/employees/signup/');
    }

    onCancelClicked = () => {
        // this.setState({ onCancel: true });
        this.props.history.goBack();
    }

    searchByNameEmployee = (event) => {
        var dataAfterFilterTemp = []

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.searchInput, [target.name]: value };
        this.setState({ searchInput: savedData });
        
        let arrayTemp = this.state.employees.map((employee, index) => {
            return (employee.first_name + " " + employee.last_name).includes(value)

        })

        if (arrayTemp.length > 0) {
            for (let index = 0; index < arrayTemp.length; index++) {
                if (arrayTemp[index] === true) {
                    dataAfterFilterTemp.push(this.state.employees[index])
                }
            }
            this.setState({ dataAfterFilterFinal: dataAfterFilterTemp, filterData: true })
        }

        if (dataAfterFilterTemp === undefined || dataAfterFilterTemp.length === 0) {
            this.setState({ emptyArray: true })
        }

        if (value === '') {
            this.setState({ filterData: false })
        }

        if (dataAfterFilterTemp.length >= 1) {
            this.setState({ emptyArray: false })
        }

    }

    componentDidMount = async () => {
        try {
            console.clear()
            const employeesData = await fetcher.get('/employees');
            this.setState({ employees: employeesData.data });

        } catch (error) {

        }
    }

    tableHeaders = [
        { key: "id", value: "שם עובד/ת", role: "", toSort: false },
        { key: "id", value: "תפקיד", role: "", toSort: false },
        { key: "id", value: "", role: "", toSort: false }
    ];


    onClickDeleteUser = async (id, password) => {
        try {

            const data = await fetcher.post('/admin/password', password)

            if (data.status === 200) {
                const dataEmploye = await fetcher.delete(`/employees/${id}`);
                const updatedEmployees = this.state.employees.filter(function (element) { return element.id !== id; });
                this.setState({ employees: updatedEmployees, addModalShow: false });
                Swal.fire({
                    title: `${dataEmploye.data}`,
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    }
                })
            } else {
                this.setState({
                    validityState: {
                        ...this.state.validityState,
                        password: 'form-control is-invalid'
                    }
                })
                this.changePopView(data)

            }
        } catch (error) {

        }
    }
    changePopView = (data, errormsg) => {

        this.setState({ message: data.data, errormsg: true })
    }
    setStateLabel = () => {
        this.setState({
            validityState: {
                ...this.state.validityState,
                password: 'form-control'
            }
        })
    }
    render() {
        let addModalClosed = () => this.setState({ addModalShow: false, addModalShowEdit: false })
        return (
            <div>
                <Navbar />
                <div className="container-fluid">
                    <div className="row mt-4">

                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="form-group">

                                    <div className="text-right col-sm-10">
                                        <h1 className="mb-4">עובדים</h1>
                                        <button type="button" className="btn btn-outline-primary btn-block" onClick={this.onClickNewCustomer}>הגדרת עובד חדש</button>
                                    </div>
                                    {/* {this.state.isNewCustomer && <Redirect to="/admin/employees/signup/" />} */}
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4"> </div>

                        <div className="col-md-4"></div>
                    </div>

                    <div className="row mt-4">

                        <div className="col-md-4">

                            <div className="form-group">
                                <div className="form-group">

                                    <label htmlFor="searchFirstName" className="d-flex align-items-right col-sm-9 col-form-label">חיפוש לפי שם</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="searchFirstName" onChange={this.searchByNameEmployee} placeholder="חיפוש לפי שם" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row ml-2">
                        <div className="col-md-2"></div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 text-center mr-3" >
                            {!this.state.filterData ?
                                <Table
                                    header={this.tableHeaders}
                                    data={this.state.employees.map(employee => {
                                        return ({
                                            employeeName: employee.first_name + " " + employee.last_name,
                                            roleName: employee.role.name,
                                            actions: [<button type="button" key={employee.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/admin/employees/signup/${employee.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>,
                                            <button type="button" key={employee.id + "delete"} title="Delete" className="btn btn-outline"
                                                onClick={() => this.onPupUpClicked(employee.id)}>
                                                <FontAwesomeIcon className="fa-lg " icon={faTrashAlt} color='red'> </FontAwesomeIcon></button>,
                                            ]
                                        });
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                    className="col-lg-8 col-md-8 col-sm-12 col-xs-12"
                                >
                                </Table> : null
                            }
                            {this.state.filterData ?
                                <Table
                                    header={this.tableHeaders}
                                    data={this.state.dataAfterFilterFinal.map(employee => {

                                        return ({
                                            employeeName: employee.first_name + " " + employee.last_name,
                                            roleName: employee.role.name,
                                            actions: [<button type="button" key={employee.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/admin/employees/signup/${employee.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>,
                                            <button type="button" key={employee.id + "delete"} title="Delete" className="btn btn-outline"
                                                onClick={() => this.onPupUpClicked(employee.id)}>
                                                <FontAwesomeIcon className="fa-lg " icon={faTrashAlt} color='red'> </FontAwesomeIcon></button>,
                                            ]
                                        });
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                    className="col-lg-8 col-md-8 col-sm-12 col-xs-12"
                                >
                                </Table> : null
                            }


                            {this.state.emptyArray ? <div id="errorInput" className="text-danger font-weight-bold">עובד לא קיים</div> : null}
                            <div className="col-md-2"></div>
                            {this.state.isDelete && <PopUp show={this.state.addModalShow}
                                onHide={addModalClosed}
                                isDelete={this.state.isDelete}
                                onClickDeleteUser={this.onClickDeleteUser}
                                idDelete={this.state.idDelete}
                                errormsg={this.state.errormsg}
                                message={this.state.message}
                                changePopView={this.changePopView}
                                validityState={this.state.validityState.password}
                                setStateLabel={this.setStateLabel}
                            />

                            }
                        </div>

                        <div className="col-md-2"></div>
                    </div>
                    <div className="form-group row">
                        <div className="col-md-2">
                            <div className="form-group text-right">
                                <button type="button" className="btn btn-danger" onClick={this.onCancelClicked}> חזרה</button>
                            </div>
                        </div>

                        {/* {this.state.onCancel && <Redirect to="/admin" />} */}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Employees);
