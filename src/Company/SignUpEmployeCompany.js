import React from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from '../Navbar';
import { AddDepModal } from '../Company/AddDepModal';
import { CompanyContext } from '../CompanyContext';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import fetcher from '../api/fetcher';
import { validateFormEmployeeCompany } from '../shared/validation';

class SignUpEmployeCompany extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCancelSignUp: false,
            dataEmployee: {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                city: '',
                street: '',
                postal_code: '',
                email_notification: null,
                sms_notification: null,
            },
            selectedCity: '',
            defaultCity: '',
            editEmployeeAdmin: false,
            formState: {},
            formMessages: {},
            validityState: {},

        }
    }

    onChangeHandler = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.dataEmployee, [target.name]: value };
        this.setState({ dataEmployee: savedData });
    }

    isCancelSign = () => {
        // this.setState({ isCancelSignUp: true })
        this.props.history.push('/company/employees');
    }
    onBlur = (fieldName, value) => {

        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });

        validateFormEmployeeCompany(nextState, fieldName, this.state.dataEmployee.confirmPassword)
            .done(this.handleValidationResult);
    }

    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };
        result.tested.forEach((fieldName) => {
            if (result.hasErrors(fieldName)) {

                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';

            } else if (result.hasWarnings(fieldName)) {
                msgs[fieldName] = result.getWarnings(fieldName)[0];
                validity[fieldName] = 'warning';
            } else {
                delete msgs[fieldName];
                validity[fieldName] = 'form-control is-valid';
            }
        }); 
        this.setState({ formMessages: msgs, validityState: validity });

    }

    onSaveEmployee = async () => {

        try {
            const createEmployee = {
                first_name: this.state.dataEmployee.first_name,
                last_name: this.state.dataEmployee.last_name,
                email: this.state.dataEmployee.email,
                phone: this.state.dataEmployee.phone,
                id: this.state.dataEmployee.id,
                password: this.state.dataEmployee.password,
                city: this.state.dataEmployee.city,
                street: this.state.dataEmployee.street,
                postal_code: this.state.dataEmployee.postal_code,
                // email_notification: this.state.dataEmployee.email_notification,
                email_notification: this.state.dataEmployee.email_notification,
                sms_notification: this.state.dataEmployee.sms_notification,
            }
            if (!validateFormEmployeeCompany(this.state.formState).done(this.handleValidationResult).hasErrors()) {
                const { data } = await fetcher.post('companies/userCompany', createEmployee);
                this.setState({ createEmployeeCompany: true, addModalShow: true, message: data })

            }

        } catch (error) {

        }

    }
    onEditEmployee = async () => {
        try {
            const editInfo = window.location.pathname.split('/')[1];
            var validationTempCompanyEmploye = validateFormEmployeeCompany(this.state.formState).done(this.handleValidationResult)

            if (this.state.formState.password === '' && this.state.formState.confirmPassword === '') {

                validationTempCompanyEmploye.tests.password.errorCount = 0
                validationTempCompanyEmploye.tests.confirmPassword.errorCount = 0
                delete validationTempCompanyEmploye.tests.password['errors'];
                delete validationTempCompanyEmploye.tests.confirmPassword['errors'];
                this.setState({
                    validityState: {
                        ...this.state.validityState,
                        password: 'form-control',
                        confirmPassword: 'form-control',
                    },
                    formMessages: {
                        ...this.state.formMessages,
                        password: '',
                        confirmPassword: '',
                    }
                })

            } else if (validationTempCompanyEmploye.hasErrors('password')) {
                delete validationTempCompanyEmploye.tests.password['errors'];
            } else if (validationTempCompanyEmploye.hasErrors('confirmPassword')) {
                delete validationTempCompanyEmploye.tests.confirmPassword['errors'];
            }
            if ((Object.keys(validationTempCompanyEmploye.getErrors()).length === 0) &&
                !(validationTempCompanyEmploye.hasErrors('confirmPassword')) &&
                !(validationTempCompanyEmploye.hasErrors('password'))) {
                if (editInfo === 'edit_employee_Info') {
                    var { data } = await fetcher.put('/customers/myDetails', this.state.dataEmployee);
                    this.setState({ updatePopup: true, addModalShow: true, message: data })
                } else {
                    const { data } = await fetcher.put(`/companies/company_employee/${this.state.id}`, this.state.dataEmployee);
                    this.setState({ updatePopup: true, addModalShow: true, message: data, editEmployeeAdmin: true })
                }
            }
        } catch (error) {

        }
    }

    componentDidMount = async () => {
        try {
            console.clear()

            const details = await fetcher.get('/customers/myDetails');

            await this.setState({
                dataEmployee: {
                    ...this.state.dataEmployee,
                    email_notification: details.data.email_notification,
                    sms_notification: details.data.sms_notification
                }

            })

            const id = window.location.pathname.split('/')[3];
            const urlPath = window.location.pathname.split('/')[1];

            if (id || urlPath === 'edit_employee_Info') {
                if (id) {
                    const { data } = await fetcher.get(`/companies/company_employee/${id}`);
                    this.setState({
                        id: id,
                        //here we pass all the data from edit to current object
                        formState: {
                            ...data,
                            password: '',
                            confirmPassword: ''
                        }
                    })
                    const mappedEmployee = this.mapApiResultToState(data);
                    this.setState({
                        editUser: true,
                        dataEmployee: mappedEmployee
                    }, () => {
                        const { cities } = this.context
                        const selectedCity = cities.find(city => city.name === mappedEmployee.city)

                        this.setState({ selectedCity })
                    })
                } else {
                    const { data } = await fetcher.get('/customers/myDetails')
                    const mappedEmployee = this.mapApiResultToState(data);
                    this.setState({
                        editUser: true,
                        dataEmployee: mappedEmployee
                    })
                }

            }

        } catch (error) {
            throw error;
        }
    }
    mapApiResultToState = employee => {
        const mappedEmployee = {
            first_name: employee.first_name,
            last_name: employee.last_name,
            phone: employee.phone,
            email: employee.email,
            city: employee.city,
            street: employee.street,
            postal_code: employee.postal_code,
            password: employee.password || '',
            // role_id: employee.role_id,
        }
        return mappedEmployee
    }

    render() {
        const { cities } = this.context;
        return (
            <div>
                <Navbar />

                <div className="container-fluid">
                    {this.state.updatePopup && <AddDepModal show={this.state.addModalShow}
                        onHide={() => false}
                        msg={this.state.message}
                        updatePopup={this.state.updatePopup}
                        editEmployeeAdmin={this.state.editEmployeeAdmin} />}

                    {this.state.createEmployeeCompany && <AddDepModal show={this.state.addModalShow}
                        onHide={() => false}
                        msg={this.state.message}
                        createEmployeeCompany={this.state.createEmployeeCompany}
                    />}
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="form-group row mt-3">
                                {this.state.editUser ?
                                    <h1 className="md-flex align-items-right mr-3">עריכת עובד</h1> :
                                    <h1 className="md-flex align-items-right mr-3">הגדרת עובד חדש</h1>
                                }                            
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputFirstName" className="d-flex align-items-right col-sm-12 col-form-label">שם פרטי</label>
                                <div className="col-sm-12">
                                    <input type="text" className={this.state.validityState.first_name || 'form-control'} id="inputFirstName" name="first_name" value={this.state.dataEmployee.first_name} onChange={this.onChangeHandler} onBlur={() => this.onBlur('first_name', this.state.dataEmployee.first_name)} />
                                    <label className="float-right text-danger">{this.state.formMessages.first_name}</label>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="inputLastName" className="d-flex align-items-right col-sm-12 col-form-label">שם משפחה</label>
                                <div className="col-sm-12">
                                    <input type="text" className={this.state.validityState.last_name || 'form-control'} id="inputLastName" name="last_name" value={this.state.dataEmployee.last_name} onChange={this.onChangeHandler} onBlur={() => this.onBlur('last_name', this.state.dataEmployee.last_name)} />
                                    <label className="float-right text-danger">{this.state.formMessages.last_name}</label>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="inputPhone2" className="d-flex align-items-right col-sm-12 col-form-label"> נייד</label>
                                <div className="col-sm-12">
                                    <input type="text" className={this.state.validityState.phone || 'form-control'} id="inputPhone2" name="phone" value={this.state.dataEmployee.phone} onChange={this.onChangeHandler} onBlur={() => this.onBlur('phone', this.state.dataEmployee.phone)} />
                                    <label className="float-right text-danger">{this.state.formMessages.phone}</label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputEmail" className="d-flex align-items-right col-sm-12 col-form-label">דוא"ל</label>
                                <div className="col-sm-12">
                                    <input type="text" className={this.state.validityState.email || 'form-control'} id="inputEmail" name="email" value={this.state.dataEmployee.email} onChange={this.onChangeHandler} onBlur={() => this.onBlur('email', this.state.dataEmployee.email)} />
                                    <label className="float-right text-danger">{this.state.formMessages.email}</label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassOne" className="d-flex align-items-right col-sm-12 col-form-label">סיסמה</label>
                                <div className="col-sm-12">
                                    <input type="password" className={this.state.validityState.password || 'form-control'} id="inputPassOne" name="password" value={this.state.dataEmployee.password} onChange={this.onChangeHandler} onBlur={() => this.onBlur('password', this.state.dataEmployee.password)} />
                                    <label className="float-right text-danger">{this.state.formMessages.password}</label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="inputPassTwo" className="d-flex align-items-right col-sm-12 col-form-label">אשר סיסמה</label>
                                <div className="col-sm-12">
                                    <input type="password" name="confirmPassword" className={this.state.validityState.confirmPassword || 'form-control'} id="inputPassTwo" value={this.state.dataEmployee.confirmPassword} onChange={this.onChangeHandler} onBlur={() => this.onBlur('confirmPassword', this.state.dataEmployee.confirmPassword)} />
                                    <label className="float-right text-danger">{this.state.formMessages.confirmPassword}</label>
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-4 col-sm-12">
                                    <label htmlFor="inputCity" className="d-flex align-items-right mt-2 ">עיר</label>
                                    <Autocomplete
                                        id="combo-box-demo"
                                        className={this.state.validityState.city || 'form-control'}
                                        options={cities}
                                        getOptionLabel={(option) => option.name}
                                        onChange={((evt, city) => {
                                            if (city) {
                                                let { dataEmployee } = this.state
                                                dataEmployee.city = city.name

                                                const { cities } = this.context
                                                const selectedCity = cities.find(city => city && city.name === dataEmployee.city)

                                                this.setState({ dataEmployee, selectedCity })
                                            }
                                        })}
                                        onBlur={() => this.onBlur('city', this.state.dataEmployee.city)}
                                        defaultValue={this.state.selectedCity}
                                        value={this.state.selectedCity}
                                        disableClearable={true}
                                        wrapperStyle={{ position: 'relative', display: 'inline-block', color: 'red' }}
                                        style={{ direction: 'rtl' }}
                                        noOptionsText={'ישוב לא קיים'}
                                        renderInput={(params) => <TextField {...params} size="small" placeholder="יישוב" InputProps={{ ...params.InputProps, disableUnderline: true }} />}
                                    />
                                    <label className="float-right text-danger">{this.state.formMessages.city}</label>
                                </div>

                                <div className="col-md-4 col-sm-12">
                                    <label htmlFor="inputStreet" className="d-flex align-items-right mt-2">רחוב</label>
                                    <input type="text" className="form-control" id="inputPassTwo" name="street" onChange={this.onChangeHandler} value={this.state.dataEmployee.street} />
                                </div>
                                <div className="col-md-4 col-sm-12">
                                    <label htmlFor="inputZip" className="d-flex align-items-right mt-2" >מיקוד</label>
                                    <input type="text" className="form-control" name="postal_code" id="inputZip" placeholder="3007500" onChange={this.onChangeHandler} value={this.state.dataEmployee.postal_code} />
                                </div>
                            </div>
                            <div className="form-group row">
                                <div className="col-md-3 col-sm-12">
                                    <div className="form-group text-right">
                                        <button type="button" className="btn btn-danger btn-block" onClick={this.isCancelSign}> חזרה</button>
                                    </div>
                                </div>


                                <div className="col-md-6"></div>
                                <div className="col-md-3 col-sm-12">
                                    {this.state.editUser ?
                                        <div className="form-group">
                                            <button type="button" className="btn btn-outline-primary btn-block" onClick={this.onEditEmployee}> עדכן</button>
                                        </div> :
                                        <div className="form-group">
                                            <button type="button" className="btn btn-outline-primary btn-block" onClick={this.onSaveEmployee}> סיום הרשמה</button>
                                        </div>}
                                </div>

                            </div>
                            {this.state.isCancelSignUp && <Redirect to="/company/employees" />}
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </div>
            </div>
        );
    }
}


SignUpEmployeCompany.contextType = CompanyContext;

export default SignUpEmployeCompany;