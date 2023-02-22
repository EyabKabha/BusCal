import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faArrowRight, faArrowLeft, faStreetView } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import fetcher from '../api/fetcher';
import Table from '../shared/Table';
import Navbar from '../Navbar';
import { getUser } from '../api/auth';

export default class Support extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            personalInfoSupport: {

            },
            filterData: false,
            emptyArray: false,
            size: 5,
            page: 1,
            hasNext: false,
            hasPrev: false,
            filterArray: [],
            dataAfterFilterFinal: [],
            isSearch: false,
            searchInput: {
                first_name: ''
            }
        }
    }
    tableHeaders = [
        { key: "id", value: "שם לקוח", role: "", toSort: false },
        { key: "id", value: "שם חברה / לקוח פרטי", role: "", toSort: false },
        { key: "id", value: "", role: "", toSort: false }
    ];

    onBlur = async (fieldName, value) => {
        if (value === '')
            this.setState({ isSearch: false, size: this.state.size = 5, page: this.state.page = 1 })
        const { data } = await fetcher.get(`/customers?size=${this.state.size}&page=${this.state.page}`);
        this.setState({ hasPrev: data.hasPrev, hasNext: data.hasNext, noResult: false, users: data.res, filterArray: data.res })
    }
    componentDidMount = async () => {
        try {
            console.clear()

            var person = JSON.parse(getUser())
            await this.setState({ personalInfoSupport: person })
            const dataForSearch = await fetcher.get('/customers');
            this.setState({ dataSearch: dataForSearch.data.res })
            const { data } = await fetcher.get(`/customers?size=${this.state.size}&page=${this.state.page}`)
            if (data.res.length < 1) {
                this.setState({ noResult: true, users: [], hasPrev: false, hasNext: false })

            } else {
                this.setState({ users: data.res, filterArray: data.res, hasPrev: data.hasPrev, hasNext: data.hasNext });
            }
            // this.setState({ users: dataForSearch.data.res });
        } catch (error) {

        }
    }
    onClickPrevNexCustomers = async (size, page, isSearch, stateName) => {
        try {
            if (!isSearch) {
                if (stateName === 'hasNext') {
                    await this.setState(prevState => ({
                        page: prevState.page += 1
                    }))
                } else {
                    await this.setState(prevState => ({
                        page: prevState.page -= 1
                    }))
                }
                const { data } = await fetcher.get(`/customers?size=${size}&page=${this.state.page}`);
                this.setState({ hasPrev: data.hasPrev, hasNext: data.hasNext, noResult: false, users: data.res, filterArray: data.res })
            }
        } catch (error) {

        }

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

        if (this.state.searchInput.first_name === '') {
            await this.setState({ isSearch: false })
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
        return (
            <div>
                <Navbar />
                <div className="container-fluid">
                    <div className="text-right mt-4">
                        <h1> {`שלום ${this.state.personalInfoSupport.firstname} ${this.state.personalInfoSupport.lastname}`} </h1>
                    </div>

                    <div className="row">
                        <div className="col-md-3"></div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <div className="form-group">
                                    <div className="col-sm-10">
                                        <input type="text" className="form-control" id="searchCode" placeholder="חיפוש לפי שם" onChange={this.searchByNameCustomer} />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="row">
                        <div className="col-md-12 text-center">
                            {!this.state.filterData ?
                                <Table
                                    header={this.tableHeaders}
                                    data={this.state.users.map(user => {
                                        return ({
                                            username: user.first_name + " " + user.last_name, userRole: user.companies.length < 1 ? user.type : user.companies[0].name, action: [<button type="button" key={user.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/support/users/signup/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>, <button type="button" title="עריכה" className="btn btn-outline "> <Link to={user.role.name === 'customer' ? { pathname: `/support/customer/waiting_requests/${user.id}` } : { pathname: `/support/all_waiting_customer_orders/${user.id}` }} ><FontAwesomeIcon className="fa-lg " icon={faStreetView} color='black'> </FontAwesomeIcon> </Link></button>]
                                        });
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                                </Table> : null
                            }
                            {this.state.filterData ?

                                <Table
                                    header={this.tableHeaders}
                                    data={this.state.dataAfterFilterFinal.map(user => {
                                        return ({
                                            username: user.first_name + " " + user.last_name, userRole: user.companies.length < 1 ? user.type : user.companies[0].name, action: [<button type="button" key={user.id + "edit"} title="Edit" className="btn btn-outline ">
                                                <Link to={`/support/users/signup/${user.id}`} ><FontAwesomeIcon className="fa-lg " icon={faEdit}> </FontAwesomeIcon> </Link></button>, <button type="button" title="עריכה" className="btn btn-outline "> <Link to={user.role.name === 'customer' ? { pathname: `/support/customer/waiting_requests/${user.id}` } : { pathname: `/support/all_waiting_customer_orders/${user.id}` }} ><FontAwesomeIcon className="fa-lg " icon={faStreetView} color='black'> </FontAwesomeIcon> </Link></button>]
                                        });
                                    })}
                                    sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                                </Table> : null


                            }
                            <div className="text-center">
                                {this.state.emptyArray ? <div id="errorInput" className="text-danger font-weight-bold">משתמש לא קיים</div> : null}
                            </div>
                            <div className="row">

                                <div className="col-3 col-md-3 col-sm-12"></div>
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
                        </div>
                    </div>

                </div>

            </div>

        );
    }
}