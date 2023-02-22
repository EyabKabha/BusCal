import React from 'react';
import { Redirect } from 'react-router-dom';
import fetcher from '../api/fetcher';
import { setUser, getUser } from '../api/auth';
import { validateLoginCustomerAndAdmin } from '../shared/validation';

export default class AdminLogin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isReset: false,
      isSignUp: false,
      adminRole: false,
      supportRole: false,
      saleRole: false,
      msgErrorAdmin: '',
      dataLogIn: {
        email: '',
        password: ''
      },
      formState: {},
      formMessages: {},
      validityState: {},
      role: '',
      roleLogin: {}
    }
  }

  onClickReset = () => {
    this.setState({ isReset: true });
  }

  onChangeHandler = event => {
    this.setState({ msgErrorAdmin: '' });
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
  onClickLogin = async () => {
    try {
      if (!validateLoginCustomerAndAdmin(this.state.formState).done(this.handleValidationResult).hasErrors()) {
        var { data } = await fetcher.post('/login/employees', this.state.dataLogIn);
        if (typeof (data) === 'string') {
          this.setState({
            msgErrorAdmin: data,
            validityState: {
              email: 'form-control  btn-round is-invalid',
              password: 'form-control btn-round is-invalid',
            }
          });
          return;
        } else {
          setUser(data);
          this.setState({ role: data.role.name })
        }

        if (data.role.name === 'admin') {
          // this.setState({ adminRole: true });
          this.props.history.push('/admin')
        } else if (data.role.name === 'support') {
          // this.setState({ supportRole: true });
          this.props.history.push('/support')
        } else if (data.role.name === 'sale') {
          // this.setState({ saleRole: true });
          this.props.history.push('/salesman')
        } else if (data.role.name === 'subAdmin') {
          this.props.history.push('/admin');
        }
      }
    } catch (error) {
      if (error instanceof TypeError) {
        this.setState({ msgErrorAdmin: data })
      } else if (error instanceof Error) {
        this.setState({ msgErrorAdmin: data })
      }
    }
  }
  componentDidMount = async () => {
    if (getUser()) {
      var loginValidate = JSON.parse(getUser());
      await this.setState({ roleLogin: loginValidate })
      switch (this.state.roleLogin.role.name) {
        case 'admin':
        case 'subAdmin': {
          this.props.history.push('/admin');
          break;
        }
        case 'support':
          this.props.history.push('/support')
          break;
        case 'sale':
          this.props.history.push('/salesman')
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
    return (
      <div id="idLoginStyle2">

        <div className="container">
          <div className="row">
            <div className="col-md-3">

            </div>
            <div className="col-md-6 " id="back2">
              <div className="form-group d-flex justify-content-center">
                <img src={'./logoFinal/fff.png'} alt="Logo" width={'350px'}></img>
              </div>
              <div className="form-group mt-5">
                <input id="emailInput" type="email" style={{border:'3px solid CornflowerBlue'}} className={this.state.validityState.email || "form-control btn-round"} placeholder="דואר אלקטרוני" name="email" value={this.state.dataLogIn.email} onChange={this.onChangeHandler} onBlur={() => this.onBlur('email', this.state.dataLogIn.email)} />
                <label className="float-right" id="labelValidate">{this.state.formMessages.email}</label>
              </div>
              <div className="form-group">
                <input id="passwordInput" type="password" style={{border:'3px solid CornflowerBlue'}} className={this.state.validityState.password || "form-control btn-round"} placeholder="סיסמה" name="password" value={this.state.dataLogIn.password} onKeyDown={(e) => { this.handleKeyDown(e, 'password', this.state.dataLogIn.password) }} onChange={this.onChangeHandler} />
                <label className="float-right" id="labelValidate" >{this.state.formMessages.password}</label>

                {this.state.msgErrorAdmin ?
                  <div className="text-danger text-right">{this.state.msgErrorAdmin}</div> : null
                }
              </div>

              <button type="button" className="btn btn-success btn-block mt-2" onClick={this.onClickLogin} >כניסה</button>

              {this.state.adminRole && <Redirect to="/admin" />}
              {this.state.supportRole && <Redirect to="/support" />}
              {this.state.saleRole && <Redirect to="/salesman" />}
            </div>
          </div>
        </div>

      </div>


    )
  }
}
