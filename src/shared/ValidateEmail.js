import React from "react";
import { Modal } from 'react-bootstrap';
import fetcher from "../api/fetcher";
import Swal from 'sweetalert2'
import { Redirect } from 'react-router-dom';

export default class ValidateEmail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      valueInputCode: '',
      notValidCode: false,
      formstateInput: 'form-control mb-2',
      backAfterSignUp: false,
    }
  }
  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      notValidCode: false,
      formstateInput: 'form-control mb-2',
    })

  }
  componentDidMount = () => {
    console.clear();
    this.fetchDataCodeValidate();
  }
  fetchDataCodeValidate = async () => {

    try {
      const obj = { "email": this.props.signUpData.email };
      var { data } = await fetcher.post('/signup/confirmEmail', obj)
      this.setState({ code: data })

    } catch (error) {

    }
  }
  onClickFinsih = async () => {
    try {
      if (this.props.changeEmailValidate) {
        if (this.state.code === this.state.valueInputCode) {
          const  data = await fetcher.put('/customers/myDetails', this.props.signUpData);
          if (data.status === 200) {
            this.props.disablePopAfter();
            Swal.fire({
              title: `${data.data}`,
              icon: "success",
              allowOutsideClick: false,
              confirmButtonText: 'סיום',
            }).then(() => {
              this.props.redirectPage();
            })
          }
        } else {
          this.setState({ notValidCode: true, formstateInput: 'form-control mb-2 is-invalid' })
        }

      } else {
        if (this.state.code === this.state.valueInputCode) {
          const data = await fetcher.post('/signup', this.props.signUpData);
          if (data.status === 200) {
            this.props.disablePopAfter();
            Swal.fire({
              title: `${data.data}`,
              icon: "success",
              allowOutsideClick: false,
              confirmButtonText: 'סיום',
            }).then(() => {
              this.props.redirectPage();
            })
          }else {
            Swal.fire({
              icon: 'error',
              title: 'שגיאה!!',
              text: data.data
            }).then(() =>{
              this.props.addModalClosed()
            })
          }
        } else {
          this.setState({ notValidCode: true, formstateInput: 'form-control mb-2 is-invalid' })
        }

      }
    } catch (error) {

    }
  }
  render() {

    return (
      <div>
        <Modal
          {...this.props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header style={{ backgroundColor: 'CornflowerBlue' }}>
            <Modal.Title className="text-center" id="contained-modal-title-vcenter">

              <div>שלום {this.props.signUpData.first_name} {this.props.signUpData.last_name}</div>

            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="row">
              <div className="col-3"></div>
              <div className="col-5 mr-1">
                <h4>למען אבטחה נוספת, </h4>

              </div>
              <div className="col-4"></div>
            </div>
            <div className="row">
              <div className="col-1"></div>
              <div className="col-10">
                <h4>עלינו לאמת את כתובת הדוא"ל שלך נא להקליד את הקוד שקיבלת בדוא"ל</h4>
                <p>{this.props.signUpData.email}</p>
              </div>
              <div className="col-1"></div>
            </div>
            <div className="row">
              <div className="col-md-4">

              </div>
              <div className="col-md-4">
                <input className={this.state.formstateInput} style={{ borderWidth: '3px' }} id="currentCode" name="valueInputCode" type="password" placeholder="קוד אימות..." onChange={this.onChangeHandler} />
                {this.state.notValidCode ? <div className="font-weight-bold text-danger">קוד אינו תואם</div> : null}
              </div>
              <div className="col-md-4">

              </div>
            </div>
            <div>לא קיבלת קוד האימות ?  <a href="# " onClick={this.fetchDataCodeValidate}>לחץ כאן</a>  ונשלח אליך שוב את הקוד.</div>
            <div className="row">
              <div className="col-5"></div>
              <div className="col-2">
                <button className="btn btn-primary mt-3 btn-block" onClick={this.onClickFinsih}>סיום</button>
              </div>
              <div className="col-5"></div>
            </div>
          </Modal.Body>
        </Modal>
        {this.props.changeEmailValidate ?
          <div>
            <Modal
              {...this.props}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered>
              <Modal.Header style={{ backgroundColor: 'red' }}>
                <Modal.Title className="text-center" id="contained-modal-title-vcenter">

                  <div>שלום {this.props.signUpData.first_name} {this.props.signUpData.last_name}</div>

                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <div className="row">
                  <div className="col-3"></div>
                  <div className="col-5 mr-1">
                    <h4>למען אבטחה נוספת, </h4>

                  </div>
                  <div className="col-4"></div>
                </div>
                <div className="row">
                  <div className="col-1"></div>
                  <div className="col-10">
                    <h4>עלינו לאמת את כתובת הדוא"ל שלך נא להקליד את הקוד שקיבלת בדוא"ל</h4>
                    <p>{this.props.signUpData.companyemail}</p>
                  </div>
                  <div className="col-1"></div>
                </div>
                <div className="row">
                  <div className="col-md-4">

                  </div>
                  <div className="col-md-4">
                    <input className={this.state.formstateInput} style={{ borderWidth: '3px' }} id="currentCode" name="valueInputCode" type="password" placeholder="קוד אימות..." onChange={this.onChangeHandler} />
                    {this.state.notValidCode ? <div className="font-weight-bold text-danger">קוד אינו תואם</div> : null}
                  </div>
                  <div className="col-md-4">

                  </div>
                </div>
                <div>לא קיבלת קוד האימות ?  <a href="# " onClick={this.fetchDataCodeValidate}>לחץ כאן</a>  ונשלח אליך שוב את הקוד.</div>
                <div className="row">
                  <div className="col-5"></div>
                  <div className="col-2">
                    <button className="btn btn-primary mt-3 btn-block" onClick={this.onClickFinsih}>סיום</button>
                  </div>
                  <div className="col-5"></div>
                </div>
              </Modal.Body>
            </Modal>
          </div>



          : null}
        {this.state.backAfterSignUp && <Redirect to="/login" />}
      </div>
    )
  }
}