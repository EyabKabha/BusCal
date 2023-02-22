import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faStar } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../Navbar';
import Table from '../shared/Table';
import fetcher from '../api/fetcher';
import { getUser } from '../api/auth';
import {faSquareFull } from "@fortawesome/free-solid-svg-icons";

export default class Salesman extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isNewCustomer: false,
            customers: [],
            count: 0,
            companyCount: 0,
            finalCompanies:0,
            allCustomer: 0,
            maxValue:2,
            finalCustomers:0,
            personalInfoSales: {

            },

        }
    }

    onClicNewCustomer = () => {
        // this.setState({ isNewCustomer: true });
        this.props.history.push('/signup')
    }

   
    vipHeaders = [
        { key: "id", value: " שם לקוח", toSort: false },
        { key: "id", value: " לקוח / שם חברה", toSort: false },
        { key: "id", value: "תאריך ביצוע", toSort: false }
    ];

    componentDidMount = async () => {
        try {
            console.clear()
            var person = JSON.parse(getUser())
            await this.setState({ personalInfoSales: person })
            const { data } = await fetcher.get('/employees/createdBySales');
            this.setState({ customers: data.created, allCustomer: data.created.length })
            this.state.customers.forEach(element => {
                if (element.type === 'לקוח רגיל') {
                    this.setState({ count: this.state.count + 1 })
                }
                if (element.type === 'רשות') {
                    this.setState({ count: this.state.count + 1 })
                }
                if (element.type === 'מוסד חינוכי') {
                    this.setState({ count: this.state.count + 1 })
                }
                if (element.type !== 'מוסד חינוכי' && element.type !== 'רשות' && element.type !== 'לקוח רגיל') {
                    this.setState({ companyCount: this.state.companyCount + 1 })

                }
            })
            if(Number.isInteger(this.state.count/100)){
                await this.setState({finalCustomers:this.state.count,count:0});
            }else{
                await this.setState({finalCustomers:this.state.count,count:this.state.count%100});
            }
            
            if(Number.isInteger(this.state.companyCount/100)){
                await this.setState({finalCompanies:this.state.companyCount, companyCount:0});
            }
            else{
                await this.setState({finalCompanies:this.state.companyCount,companyCount:this.state.companyCount%100});
            }
        } catch (error) {

        }
    }


    render() {

        return (
            <div>

                <Navbar />
                <div className="container">

                    <div className="text-right mt-4">
                        <h1> {`שלום ${this.state.personalInfoSales.firstname} ${this.state.personalInfoSales.lastname}`} </h1>
                    </div>

                    <div><p className="text-right">סטטוס מכירות : </p></div>
                    <div class="progress" style={{ height: '30px' }}>
                        <div class="progress-bar bg-danger" role="progressbar" style={{ width: `${this.state.companyCount}%` }} aria-valuenow="0" aria-valuemin="0" aria-valuemax={this.state.maxValue}>

                            {this.state.companyCount >= 10 ? <div>  <FontAwesomeIcon className="fa-lg" icon={faStar} style={{ marginBottom: '2px', marginRight: '15px' }}>

                            </FontAwesomeIcon>    {this.state.companyCount} חברות</div> : this.state.companyCount}

                        </div>
                    </div>
                    <div class="progress mt-2" style={{ height: '30px' }}>
                        <div class="progress-bar bg-warning" role="progressbar" style={{ width: `${this.state.count}%` }} aria-valuenow="0" aria-valuemin="0" aria-valuemax={this.state.maxValue}>

                            {this.state.count >= 10 ? <div>  <FontAwesomeIcon className="fa-lg" icon={faStar} style={{ marginBottom: '2px', marginRight: '15px' }}>

                            </FontAwesomeIcon>    {this.state.count} לקוחות רגילים</div> : this.state.count}

                        </div>
                    </div>
                    <div class="progress mt-2" style={{ height: '30px' }}>
                        <div class="progress-bar bg-success" role="progressbar" style={{ width: `${this.state.allCustomer}%` }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">

                            {this.state.allCustomer >= 10 ? <div>  <FontAwesomeIcon className="fa-lg" icon={faStar} style={{ marginBottom: '2px', marginRight: '15px' }}>

                            </FontAwesomeIcon>    {this.state.allCustomer} לקוחות סה"כ</div> : this.state.allCustomer}

                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-3 text-right">
                            <FontAwesomeIcon className="fa mt-2" icon={faSquareFull} color={'red'}></FontAwesomeIcon>
                            &nbsp;	
                            <label>חברות</label>

                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-md-3 text-right">
                            <FontAwesomeIcon className="fa mt-2" icon={faSquareFull} color={'orange'}></FontAwesomeIcon>
                            &nbsp;	
                            <label>לקוחות רגילים</label>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 text-right">
                            <FontAwesomeIcon className="fa mt-2" icon={faSquareFull} color={'green'}></FontAwesomeIcon>
                            &nbsp;	
                            <label>לקוחות סה"כ</label>

                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12"></div>
                        <div className="col-md-3 col-sm-6">
                            <div>
                                <button type="button" className="btn btn-outline-success btn-block mt-3 mb-4" onClick={this.onClicNewCustomer}><FontAwesomeIcon className="fa-1x" icon={faUserPlus} />  &nbsp; הוסף לקוח חדש</button>
                            </div>
                            {/* {this.state.isNewCustomer && <Redirect to="/signup" />} */}
                        </div>

                        <div className="container text-center">
                            <Table
                                header={this.vipHeaders}
                                data={this.state.customers.map(customer => {

                                    return ({
                                        firstNameAndLastName: customer.first_name + ' ' + customer.last_name,
                                        companyName: customer.type,
                                        creationDate: customer.creation_date
                                    });
                                })}
                                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}>
                            </Table>
                        </div>
                        <div className="col"></div>
                    </div>
                </div>

            </div>
        )
    }
}
