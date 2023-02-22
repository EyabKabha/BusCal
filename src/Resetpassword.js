import React from 'react';
import { Redirect } from 'react-router-dom';
import fetcher from './api/fetcher';
import { validateCode } from './shared/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert';

export default class Resetpassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isCancel: false,
            passRest: false,
            passOrNot: false,
            msgReset: '',
            msgResetError: '',
            resetPassword: {
                email: '',
                password: '',
                confirmPassword: '',
                codeInput: '',
            },
            code: '',
            codeValid: false,
            formState: {},
            formMessages: {},
            validityState: {},
            emailValidation: false,
        }
    }
    onBlur = (fieldName, value) => {

       
        const nextState = { ...this.state.formState, [fieldName]: value };
        this.setState({ formState: nextState });
        validateCode(nextState, fieldName, this.state.code, this.state.emailValidation)
            .done(this.handleValidationResult);
    }
    handleValidationResult = (result) => {
        const msgs = { ...this.state.formMessages };
        const validity = { ...this.state.validityState };

        // iterate over the updated fields
        // (or everything, when submitting)
        result.tested.forEach((fieldName) => {
          
            // if current field has errors
            if (result.hasErrors(fieldName)) {
                // set its message to the first error from the errors array
                // if(fieldName !== 'identity' && fieldName !== 'password' && fieldName !== 'confirmPassword' ){
                msgs[fieldName] = result.getErrors(fieldName)[0];
                validity[fieldName] = 'form-control is-invalid';
                // }
                // if current field has warnings
            } else if (result.hasWarnings(fieldName)) {

                // set its message to the first warning from the warnings array
                msgs[fieldName] = result.getWarnings(fieldName)[0];
                validity[fieldName] = 'warning';
            } else {

                // otherwise, there's not much need for it.
                delete msgs[fieldName];
                validity[fieldName] = 'form-control is-valid';

            }
        });

        // setformMessages(msgs);
        this.setState({ formMessages: msgs, validityState: validity });
        // setValidityState(validity);
    }
    onClickCancel = () => {
        this.props.history.push('/login')
        // this.setState({ isCancel: true });
    }

    onResetPassword = async (email) => {

        try {
            this.setState({ msgReset: '', })
            if (!validateCode(this.state.formState).done(this.handleValidationResult).hasErrors('email')) {
                const { data } = await fetcher.post('/login/reset_password', { email });
                if (data.msg) {
                    await this.setState({
                        msgReset: data.msg, passOrNot: true, code: data.code, emailValidation: true
                    })
                } else {
                    this.setState({
                        msgResetError: data.data, passOrNot: false,
                        validityState: {
                            ...this.state.validityState,
                            email: 'form-control is-invalid',

                        },
                        formMessages: {
                            ...this.state.formMessages,
                            email: data
                        }
                    })

                }
            }

        } catch (error) {
        }

    }
    onChangeHandler = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const savedData = { ...this.state.resetPassword, [target.name]: value };

        this.setState({ resetPassword: savedData });
    }
    
    handleKeyPress = (e)=>{
        var value = e.currentTarget.value.split(' ');
        if (value) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    onClickedNewPassword = async () => {
        try {
            let newPassword = {
                email: this.state.resetPassword.email,
                password: this.state.resetPassword.password
            }

            if (!validateCode(this.state.formState, '', this.state.code, this.state.passOrNot).done(this.handleValidationResult).hasErrors()) {
                const data = await fetcher.put('/login/reset_password', newPassword);
                if (data.status === 200) {
                    swal({
                        title: `${data.data}`,

                        type: "warning",
                        showCancelButton: true,

                        closeOnConfirm: false,
                        buttons: {
                            text: "סיום",
                        }
                    }).then(() => {
                        this.props.history.push('/login');
                    })
                }
            }

        } catch (error) {

        }
    }
    
    handleKeyPress = (e)=>{
        var value = e.currentTarget.value.split(' ');
        if (value) {
            e.preventDefault();
            e.stopPropagation();
        }
    } 

    render() {

        return (
            <div id= "resetVal">
            <div className="container">
                <div className="row" >
                    <div className="col-md-3">
                    </div>
                    <div className="col-md-6 mt-5" >
                        <div className="d-flex justify-content-center">
                            <FontAwesomeIcon icon={faUnlockAlt} size={"10x"} style={{ color: 'ForestGreen' }}></FontAwesomeIcon>
                            {/* <img src={'ResetIcon.png'} alt="Logo" width={'100px'}></img> */}
                        </div>
                        <div className="form-group mt-5">
                            <label htmlFor="inputEmailReset" className="float-right">דוא"ל</label>
                            <input type="email" id="inputEmailReset"className={this.state.validityState.email || 'form-control'} name="email" placeholder="דואר אלקטרוני" value={this.state.resetPassword.email} onChange={this.onChangeHandler} onKeyPress={this.state.passOrNot ? this.handleKeyPress:null} onBlur={() => this.onBlur('email', this.state.resetPassword.email)} disabled={this.state.passOrNot === true}/>
                            <label className="float-right text-danger">{this.state.formMessages.email}</label>
                        </div>
                        {
                            this.state.passOrNot ? <div className="text-success font-weight-bold text-right mb-2">{this.state.msgReset} </div>

                                : <div className="text-danger font-weight-bold text-right mb-2">{this.state.msgResetError}</div>
                        }
                        {/* {this.state.msgReset ?
                            <div className="text-success font-weight-bold text-right mb-2">{this.state.msgReset}
                            </div> : null
                        }
                        {this.state.msgResetError ?
                            <div className="text-danger font-weight-bold text-right mb-2">{this.state.msgResetError}</div>
                            : null
                        } */}

                        {this.state.passOrNot ?
                            <div>
                                <div className="form-group text-right d-flex justify-content-right">                                    
                                    <div>לא קיבלת קוד האימות ?  <a href="# " onClick={() => this.onResetPassword(this.state.resetPassword.email)}>לחץ כאן</a>  ונשלח אליך שוב את הקוד.</div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="codeReq" className="d-flex align-items-right col-sm-5 col-form-label">קוד אימות</label>
                                    <div className="col-sm-12">
                                        <input id="codeReq" type="text" className={this.state.validityState.codeInput || 'form-control'} name="codeInput" placeholder="קוד אימות" onChange={this.onChangeHandler} value={this.state.resetPassword.codeInput} onBlur={() => this.onBlur('codeInput', this.state.resetPassword.codeInput)} />
                                        <label className="float-right text-danger">{this.state.formMessages.codeInput}</label>
                                    </div>
                             
                                    <label htmlFor="inputPassword" className="d-flex align-items-right col-sm-3 col-form-label">סיסמה</label>

                                    <div className="col-sm-12">
                                        <input id="inputPassword" type="password" className={this.state.validityState.password || 'form-control'} name="password" placeholder="סיסמה" onChange={this.onChangeHandler} value={this.state.resetPassword.password} onBlur={() => this.onBlur('password', this.state.resetPassword.password)} />
                                        <label className="float-right text-danger">{this.state.formMessages.password}</label>
                                    </div>

                                

                                    <label htmlFor="inputPasswordConf" className="d-flex align-items-right col-sm-6 col-form-label">אשר סיסמה</label>
                                    <div className="col-sm-12">
                                        <input id="inputPasswordConf" type="password" className={this.state.validityState.confirmPassword || 'form-control'} name="confirmPassword" placeholder="אשר סיסמה" value={this.state.resetPassword.confirmPassword} onChange={this.onChangeHandler} onBlur={() => this.onBlur('confirmPassword', this.state.resetPassword.confirmPassword)} />                                        <label className="float-right text-danger">{this.state.formMessages.password}</label>
                                        <label className="float-right text-danger">{this.state.formMessages.confirmPassword}</label>
                                    </div>
                                </div>
                            </div> : null
 
                        }
                        {this.state.passOrNot ?

                            <button type="button" className="btn btn-primary btn-block" onClick={this.onClickedNewPassword} >שמירה</button>
                            :
                            <button type="button" className="btn btn-success btn-block" onClick={() => this.onResetPassword(this.state.resetPassword.email)}>אפס סיסמה</button>
                        }
                        <button type="button" className="btn btn-outline-danger btn-block" onClick={this.onClickCancel}>ביטול</button>
                        {this.state.isCancel && <Redirect to="/" />}

                    </div>
                </div>
            </div>
            </div>
        )
    }
}
