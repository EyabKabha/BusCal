import React from 'react';
import { Redirect } from 'react-router-dom';
import fetcher from './api/fetcher';
import { setUser, getUser } from './api/auth';
import { validateLoginCustomerAndAdmin } from './shared/validation';
import './assets/style.css'
export default class Login extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      isSignUp: false,
      isReset: false,
      customerRole: false,
      adminCompanyRole: false,
      userCompanyRole: false,
      statusCookie: true,
      role: '',
      msg: '',
      dataLogIn: {
        email: '',
        password: ''
      },
      formState: {},
      formMessages: {},
      validityState: {},
      roleLoginCustomers: {},
     
    }
  }

  onChangeHandler = event => {
    this.setState({ msg: '' });
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const savedData = { ...this.state.dataLogIn, [target.name]: value };
    this.setState({ dataLogIn: savedData });
  }

  onBlur = (fieldName, value) => {
    const nextState = { ...this.state.formState, [fieldName]: value };
    this.setState({ formState: nextState });

    validateLoginCustomerAndAdmin(nextState, fieldName)
      .done(this.handleValidationResult);
  }

  handleValidationResult = (result) => {
    const msgs = { ...this.state.formMessages };
    const validity = { ...this.state.validityState };
    result.tested.forEach((fieldName) => {


      if (result.hasErrors(fieldName)) {

        msgs[fieldName] = result.getErrors(fieldName)[0];
        validity[fieldName] = 'form-control is-invalid btn-round';

      } else if (result.hasWarnings(fieldName)) {
        msgs[fieldName] = result.getWarnings(fieldName)[0];
        validity[fieldName] = 'warning';
      } else {
        delete msgs[fieldName];
        validity[fieldName] = 'form-control is-valid btn-round';
      }
    });
    this.setState({ formMessages: msgs, validityState: validity });

  }

  onClickReset = () => {
    this.props.history.push('/reset');
    // this.setState({ isReset: true });
  }

  onClickSignUp = () => {
    // this.setState({ isSignUp: true });
    this.props.history.push('/signup')
  }

  onClickLogin = async () => {

    try {
      if (!validateLoginCustomerAndAdmin(this.state.formState).done(this.handleValidationResult).hasErrors()) {

        var { data } = await fetcher.post('/login/customers', this.state.dataLogIn)
        if (typeof (data) === 'string') {
          this.setState({
            msg: data,
            validityState: {
              email: 'form-control btn-round is-invalid',
              password: 'form-control btn-round is-invalid',
            }
          });
          return;
        } else {
          setUser(data);
          this.setState({ role: data.role.name })
        }
        if (data.role.name === 'customer') {
          this.props.history.push('/customer')
          // this.setState({ customerRole: true });
        } else if (data.role.name === 'adminCompany') {
          // this.setState({ adminCompanyRole: true });
          // this.props.history.replace('/company')
          this.props.history.push('/company')
          // this.props.history.length=0;

        } else if (data.role.name === 'userCompany') {
          // this.setState({ userCompanyRole: true });
          this.props.history.push('/company')

        }

      }

    } catch (error) {
      if (error instanceof TypeError) {
        this.setState({ msg: data })
      } else if (error instanceof Error) {
        this.setState({ msg: data })
      }

    }
  }


  componentDidMount = async () => {
    if (getUser()) {
      var loginValidateCustomers = JSON.parse(getUser());
      await this.setState({ roleLoginCustomers: loginValidateCustomers })
      switch (this.state.roleLoginCustomers.role.name) {
        case 'adminCompany':
          this.props.history.push('/company');
          break;
        case 'userCompany':
          this.props.history.push('/company')
          break;
        case 'customer':
          this.props.history.push('/customer')
          break;
        default:
          break;
      }
    }
  }
  handleKeyDown = (e, fieldName, value) => {
    const nextState = { ...this.state.formState, [fieldName]: value };
    this.setState({ formState: nextState });

    validateLoginCustomerAndAdmin(nextState, fieldName)
      .done(this.handleValidationResult);
    if (e.key === 'Enter') {
      this.onClickLogin();
    }
  }

  render() {
    // if (getUser()) return <Redirect to="/" />

    if (this.state.role !== '') {

      // return Homepages(this.state.role);
    }

    return (
      <body id="idLoginStyle">

        <div>

          <div className="container">

            <div className="row">
              <div className="col-md-3">

              </div>
              <div className="col-md-6 " id="loginPageStyle">
                <div className="form-group d-flex justify-content-center mt-4">
                  <img src={'./logoFinal/blackImageLogo.png'} alt="Logo" width={'300px'}></img>
                </div>
                <div className="form-group mt-5">
                  <input id="emailInput" type="email" style={{ border: '3px solid CornflowerBlue' }} className={this.state.validityState.email || "form-control btn-round"} placeholder="דואר אלקטרוני" name="email" value={this.state.dataLogIn.email} onChange={this.onChangeHandler} onBlur={() => this.onBlur('email', this.state.dataLogIn.email)} />
                  <label className="float-right text-danger">{this.state.formMessages.email}</label>
                </div>
                <div className="form-group">
                  <input id="passwordInput" type="password" style={{ border: '3px solid CornflowerBlue' }} className={this.state.validityState.password || "form-control btn-round"} placeholder="סיסמה" name="password" value={this.state.dataLogIn.password} onKeyDown={(e) => { this.handleKeyDown(e, 'password', this.state.dataLogIn.password) }} onChange={this.onChangeHandler} />

                  <div className="text-danger text-right">{this.state.formMessages.password}</div>

                  {this.state.msg ?
                    <div className="text-danger text-right">{this.state.msg}</div> : null
                  }

                </div>
                <div className="form-group  text-right d-flex justify-content-right">
                  <a href=" " onClick={this.onClickReset}>שחזור סיסמה</a>
                </div>
                <button type="button" id="loginButton" className="btn btn-block" onClick={this.onClickLogin}>כניסה</button>
                <button type="button" id="loginButton" className="btn btn-block" onClick={this.onClickSignUp}>הרשמה</button>
              </div>
              {this.state.isReset && <Redirect to="/reset" />}
              {this.state.isSignUp && <Redirect to="/signup" />}

            </div>
          </div>


        </div>

      </body>
    )
  }
}
