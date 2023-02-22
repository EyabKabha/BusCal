import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faArrowLeft, faArrowRight, faStreetView } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2'
import fetcher from '../api/fetcher';

import Navbar from '../Navbar';
import Table from '../shared/Table';
import PopUp from '../shared/PopUp';

export default class Users extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
            filterArray: [],
            isNewCustomer: false,
            onCancel: false,
            isDelete: false,
            addModalShow: false,
            idDelete: null,
            message: '',
            errormsg: false,
            filterData: false,
            emptyArray: false,
            hasPrev: false,
            hasNext: false,
            isSearch: false,
            dataSearch: [],
            page: 1,
            size: 5,
            dataAfterFilterFinal: [],
            dataAfterFilterFinal1: [],
            searchInput: {
                first_name: '',
                code: '',
            },
            validityState: {}
        }
    }

    onClickNewCustomer = async () => {
        // this.setState({ isNewCustomer: true });
        this.props.history.push('/signup');
    }

    onCancelClicked = () => {
        // this.setState({ onCancel: true });
        this.props.history.goBack();
    }
    vipHeaders = [
        { key: "id", value: "שם", company: "", toSort: false },
        { key: "id", value: "שם חברה / לקוח פרטי", company: "", toSort: false },
        { key: "id", value: "סמל חברה", company: "", toSort: false },
        { key: "id", value: "", company: "", toSort: false }
    ];

    componentDidMount = async () => {
        try {
            console.clear()

            const dataForSearch = await fetcher.get('/customers')
            this.setState({ dataSearch: dataForSearch.data.res })
            const { data } = await fetcher.get(`/customers?size=${this.state.size}&page=${this.state.page}`)
            if (data.res.length < 1) {
                this.setState({ noResult: true, users: [], hasPrev: false, hasNext: false })

            } else {
                this.setState({ users: data.res, filterArray: data.res, hasPrev: data.hasPrev, hasNext: data.hasNext });

            }

        } catch (error) {

        }
    }
    onBlur = async (fieldName, value) => {
        if (value === '')
            this.setState({ isSearch: false, size: this.state.size = 5, page: this.state.page = 1 })
        const { data } = await fetcher.get(`/customers?size=${this.state.size}&page=${this.state.page}`);
        this.setState({ hasPrev: data.hasPrev, hasNext: data.hasNext, noResult: false, users: data.res, filterArray: data.res })
    }
    onClickPrevNexCustomers = async (size, page, isSearch, stateName) => {
        try {
            if (!isSearch) {
                if (stateName === 'hasNext') {
                    await this.setState(prevState => ({
                        page: prevState.page+=1
                    }))
                }else{
                    await this.setState(prevState => ({
                        page: prevState.page-=1
                    }))
                }
                const { data } = await fetcher.get(`/customers?size=${size}&page=${this.state.page}`);

                this.setState({ hasPrev: data.hasPrev, hasNext: data.hasNext, noResult: false, users: data.res, filterArray: data.res })

            }
        } catch (error) {

        }
    }
    onPupUpClicked = (id) => {
        // const Toast = Swal.mixin({
        //     toast: true,
        //     position: 'top-end',
        //     showConfirmButton: false,
        //     timer: 3000,
        //     timerProgressBar: true,
        //     onOpen: (toast) => {
        //       toast.addEventListener('mouseenter', Swal.stopTimer)
        //       toast.addEventListener('mouseleave', Swal.resumeTimer)
        //     }
        //   })

        //   Toast.fire({
        //     icon: 'success',
        //     title: 'Signed in successfully'
        //   })
        this.setState({ isDelete: true, addModalShow: true, idDelete: id })
    }

    onClickDeleteUser = async (id, password) => {
        try {
            const data = await fetcher.post('/admin/password', password)
            if (data.status === 200) {
                const deleteUser = await fetcher.delete(`/customers/${id}`);
                const updatedUsers = this.state.users.filter(function (element) { return element.id !== id; });
                this.setState({ users: updatedUsers, addModalShow: false });
                Swal.fire({
                    title: `${deleteUser.data}`,
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
    changePopView = (data) => {
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
    searchByNameCustomer = async (event) => {
        var dataAfterFilterTemp = []

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.searchInput, [target.name]: value };
        this.setState({ searchInput: savedData, isSearch: true });

        let arrayTemp = this.state.dataSearch.map((user, index) => {
            return (user.first_name + " " + user.last_name).includes(value)
        })
        console.log(arrayTemp)
        if (this.state.searchInput.first_name === '' && this.state.searchInput.code === '') {
            await this.setState({ isSearch: false })
        }

        if (target.name === 'code') {
            var arrayCompany = this.state.dataSearch.map((element, index) => {
                return element.companies.length > 0 ? element.companies[0].code.includes(value) : null;
            })
            if (arrayCompany.length > 0) {
                for (let index = 0; index < arrayCompany.length; index++) {
                    if (arrayCompany[index] === true) {
                        dataAfterFilterTemp.push(this.state.dataSearch[index])
                    }
                }
                this.setState({ dataAfterFilterFinal: dataAfterFilterTemp, filterData: true })
            }
        }


        if (arrayTemp.length > 0) {
            for (let index = 0; index < arrayTemp.length; index++) {
                if (arrayTemp[index] === true) {
                    dataAfterFilterTemp.push(this.state.dataSearch[index])
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
                                        <h1 className="mb-4">משתמשים</h1>
                                        <button type="button" className="btn btn-primary btn-block" onClick={this.onClickNewCustomer}>הגדרת לקוח חדש</button>
                                    </div>
                                    {/* {this.state.isNewCustomer && <Redirect to="/signup" />} */}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                        <div className="col-md-4"></div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-5">
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="searchFirstName" className="d-flex align-items-right col-sm-12 col-form-label" >חיפוש לפי שם</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="searchFirstName" placeholder="חיפוש לפי שם" name="first_name" value={this.state.searchInput.first_name} onChange={this.searchByNameCustomer} onBlur={() => this.onBlur('first_name', this.state.searchInput.first_name)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-5">
                            <div className="form-group">
                                <div className="form-group">
                                    <label htmlFor="searchCode" className="d-flex align-items-right col-sm-12 col-form-label">חיפוש לפי ח.פ / עוסק מורשה</label>
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="searchCode" name="code" value={this.state.searchInput.code} onChange={this.searchByNameCustomer} placeholder="חיפוש לפי ח.פ / עוסק מורשה" onBlur={() => this.onBlur('code', this.state.searchInput.code)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="row ml-2 mt-3">
                        <div className="col-md-2"></div>
                        <div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 text-center mr-3" >
                            {!this.state.filterData ?
                                <Table
                                    header={this.vipHeaders}
                                    data={this.state.users.map(user => {
                                        return ({
                                            username: user.first_name + " " + user.last_name, userCompany: user.companies.length > 0 ? (user.companies.map(company => company.name)) : user.type, code: user.companies.length > 0 ? (user.companies.map(company => company.code)) : '-    ',
                                            // action: [
                                            // <button type="button" key={user.id + "edit"} title="Edit" className="btn btn-outline ">
                                            //     <Link to={`/admin/users/signup/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>,
                                            // <button type="button"  title="Edittt" className="btn btn-outline ">
                                            //    <Link to={`company/bid/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faAlignCenter}> </FontAwesomeIcon> </Link></button>,
                                            // <button id={user.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpClicked(user.id)}><FontAwesomeIcon className="fa-lg " icon={faAdjust} color='green'> </FontAwesomeIcon></button>,
                                            // <button id={user.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpClicked(user.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button>]
                                            action: [<button type="button" key={user.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/admin/users/signup/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>, <button id={user.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpClicked(user.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button>,
                                            <button type="button" title="עריכה" className="btn btn-outline "> <Link to={user.role.name === 'customer' ? { pathname: `/admin/customer/waiting_requests/${user.id}` } : { pathname: `/admin/all_waiting_customer_orders/${user.id}` }} ><FontAwesomeIcon className="fa-lg " icon={faStreetView} color='black'> </FontAwesomeIcon> </Link></button>]
                                        })
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                    className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                </Table> : null
                            }
                            {this.state.filterData ?
                                <Table
                                    header={this.vipHeaders}
                                    data={this.state.dataAfterFilterFinal.map(user => {
                                        return ({
                                            username: user.first_name + " " + user.last_name, userCompany: user.companies.length > 0 ? (user.companies.map(company => company.name)) : user.type, code: user.companies.length > 0 ? (user.companies.map(company => company.code)) : '-', action: [<button type="button" key={user.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/admin/users/signup/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>, <button id={user.id} type="button" title="Delete" className="btn btn-outline" onClick={() => this.onPupUpClicked(user.id)}><FontAwesomeIcon className="fa-lg " icon={faTrash} color='red'> </FontAwesomeIcon></button>,
                                            <button type="button" title="עריכה" className="btn btn-outline "> <Link to={user.role.name === 'customer' ? { pathname: `/admin/customer/waiting_requests/${user.id}` } : { pathname: `/admin/all_waiting_customer_orders/${user.id}` }} ><FontAwesomeIcon className="fa-lg " icon={faStreetView} color='black'> </FontAwesomeIcon> </Link></button>,
                                            ]
                                        })
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                                    className="col-lg-8 col-md-8 col-sm-12 col-xs-12">
                                </Table> : null

                            }

                            {this.state.emptyArray ? <div id="errorInput" className="text-danger font-weight-bold">משתמש לא קיים</div> : null}

                        </div>
                        <div className="col-md-2"></div>
                        {this.state.isDelete && <PopUp
                            show={this.state.addModalShow}
                            onHide={addModalClosed}
                            isDelete={this.state.isDelete}
                            onClickDeleteUser={this.onClickDeleteUser}
                            idDelete={this.state.idDelete}
                            message={this.state.message}
                            changePopView={this.changePopView}
                            errormsg={this.state.errormsg}
                            setStateLabel={this.setStateLabel}
                            validityState={this.state.validityState.password} />

                        }
                    </div>
                    <div className="row">

                        <div className="col-3 col-md-1 col-sm-12"></div>
                        {!this.state.filterData ?
                            <div className="col-6 col-md-6 col-sm-8 mt-3 mb-2">

                                <button type="button" disabled={this.state.hasNext === false} class="btn btn-primary ml-3" onClick={() => {
                                    this.onClickPrevNexCustomers(this.state.size, this.state.page, this.state.isSearch, 'hasNext');
                                }}><FontAwesomeIcon icon={faArrowRight} className="ml-2"></FontAwesomeIcon>הבא
                                          </button>

                                <button type="button" class="btn btn-primary" disabled={this.state.page === 1}
                                    onClick={event => {
                                        this.onClickPrevNexCustomers(this.state.size, this.state.page, this.state.isSearch, 'hasPrev');
                                    }}>הקודם
                                        <FontAwesomeIcon icon={faArrowLeft} className="mr-2"></FontAwesomeIcon>
                                </button>


                            </div> : null}
                        <div className="col-3 col-md-4 col-sm-5"></div>

                    </div>
                    <div className="form-group">
                        <div className="col-md-2">
                            <div className="form-group text-right">
                                <button type="button" className="btn btn-danger" onClick={this.onCancelClicked}> חזרה</button>
                            </div>
                        </div>

                        {/* {this.state.onCancel && <Redirect to="/admin" />} */}
                    </div>
                </div>
            </div >
        )
    }
}
