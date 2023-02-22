import { withRouter, Redirect } from "react-router-dom";
import React from "react";
import '../assets/style.css';
import { Form } from "react-bootstrap";
import Navbar from "../Navbar";
import fetcher from "../api/fetcher";
import { CompanyContext } from "../CompanyContext";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AddDepModal } from "../Company/AddDepModal";
import PopUp from "../shared/PopUp";
import { getUser } from "../api/auth";
import { validateFormEmployee } from "../shared/validation";
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class SignUpEmployee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      files: [],
      onSaveData: false,
      imagePreviewUrl: null,
      imagePreviewUrl2: null,
      setImage: "",
      message: "",
      isCancelSignUpFromDetails: false,
      isCancelSignUp: false,
      editUser: false,
      addModalShow: false,
      updatePopup: false,
      isClickAdd: false,
      roles: [],
      dataEmployee: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        identity: "",
        password: "",
        confirmPassword: "",
        city: "",
        street: "",
        role_id: "",
        postal_code: "",
      },
      filesArray: [],
      file1: [],
      file1Obj: [],
      isCreateEmployee: false,
      isBackEmployee: false,
      selectedCity: null,
      updatePopupFromAdmin:false,
      editEmployeeInfo: false,
      nameID: "",
      formState: {},
      formMessages: {},
      validityState: {},
      noErrorsMatch: false,
      inputsFilesArray: [],
      username: "",
      item: [],
      fileTemp: '',
      filesArrayShow: [],
      urlPath:''
    };
  }

  Userinput = (event) => {
    // const target = event.target;
    this.setState({ username: event.target.value });
    const file1 = event.target.files[0];
    if (event.target.files[0] !== undefined) {
      this.setState({ fileTemp: file1 })
    }
  }

  AddList = (input) => {
    if (input !== "") {
      this.state.file1Obj.push(this.state.fileTemp);
      var listArray = this.state.item;
      listArray.push(input);
      this.setState({
        item: listArray, username: "", isClickAdd: true,
        validityState: {
          ...this.state.validityState,
          item: '',
        }

      });
      if (this.state.file1Obj.length >= 3) {
        this.setState({
          formMessages: {
            ...this.state.formMessages,
            item: '',
          },
          validityState: {
            ...this.state.validityState,
            item: 'form-control is-valid',
          }
        })
      }
    }
  }

  deleteList(index) {
    var delArray = this.state.item;
    var delFile = this.state.file1Obj
    delArray.splice(index, 1);
    delFile.splice(index, 1)
    this.setState({ item: delArray, file1Obj: delFile });
    if (!this.state.editUser) {

      if (this.state.file1Obj.length < 3) {
        this.setState({
          validityState: {
            ...this.state.validityState,
            item: 'form-control is-invalid',
          },
          formMessages: {
            ...this.state.formMessages,
            item: 'אנא בחר לפחות 3 קבצים',
          },
        })
      }

    }
  }

  addInputFiles = () => {
    this.setState((prev) => ({
      inputsFilesArray: [...prev.inputsFilesArray, ""],
    }));
  };


  onChangeHandler = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const savedData = { ...this.state.dataEmployee, [target.name]: value };
    this.setState({ dataEmployee: savedData });
  };

  onBlur = (fieldName, value) => {
    const nextState = { ...this.state.formState, [fieldName]: value };
    this.setState({ formState: nextState });

    validateFormEmployee(nextState, fieldName).done(
      this.handleValidationResult
    );
  };
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
        validity[fieldName] = "form-control is-invalid";
        // }
        // if current field has warnings
      } else if (result.hasWarnings(fieldName)) {
        // set its message to the first warning from the warnings array
        msgs[fieldName] = result.getWarnings(fieldName)[0];
        validity[fieldName] = "warning";
      } else {
        // otherwise, there's not much need for it.
        delete msgs[fieldName];
        validity[fieldName] = "form-control is-valid";
      }
    });

    // setformMessages(msgs);
    this.setState({ formMessages: msgs, validityState: validity });
    // setValidityState(validity);
  };
  // isCancelSign = () => {
  // const editInfo = window.location.pathname.split('/')[1];
  // if (editInfo === 'edit_employee_Info') {
  // } else {
  //   this.setState({ isCancelSignUp: true })
  // }
  // debugger
  //   this.props.history.goBack();
  // };
  backButtonAdminInfo = () => {
    this.props.history.goBack();
    // this.setState({ isCancelSignUpFromDetails: true })
  }
  onSaveEmployee = async () => {
    const { file1Obj } = this.state;
    this.setState({ onSaveData: true });
    const createEmployee = {
      first_name: this.state.dataEmployee.first_name,
      last_name: this.state.dataEmployee.last_name,
      email: this.state.dataEmployee.email,
      phone: this.state.dataEmployee.phone,
      identity: this.state.dataEmployee.identity,
      password: this.state.dataEmployee.password,
      city: this.state.dataEmployee.city,
      street: this.state.dataEmployee.street,
      postal_code: this.state.dataEmployee.postal_code,
      role_id: this.state.dataEmployee.role_id,
    };

    try {
      if (
        !validateFormEmployee(this.state.formState)
          .done(this.handleValidationResult)
          .hasErrors()
      ) {
        let formData = new FormData();
        file1Obj.forEach((element) => {
          formData.append("files", element);
        });
        const temp = await fetcher.post("/employees", createEmployee);

        if (temp.status === 200) {
          this.setState({
            isCreateEmployee: true,
            addModalShow: true,
            message: "נוצר בהצלחה",
          });
          console.log(this.state.file1Obj)
          await fetcher.post(`/employees/upload_employee_files/${temp.data}`, formData);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'שגיאה!!',
            text: temp.data
          })
          
        }
      }
    } catch (error) { }
  };


  onEditEmployee = async () => {
    try {
      const editInfo = window.location.pathname.split("/")[1];
      var validationTemp = validateFormEmployee(this.state.formState).done(
        this.handleValidationResult
      );
      delete validationTemp.tests.identity["errors"];
      validationTemp.tests.identity.errorCount = 0;
      if (
        this.state.formState.password === "" &&
        this.state.formState.confirmPassword === ""
      ) {
        validationTemp.tests.password.errorCount = 0;
        validationTemp.tests.confirmPassword.errorCount = 0;
        delete validationTemp.tests.password["errors"];
        delete validationTemp.tests.confirmPassword["errors"];
        this.setState({
          validityState: {
            ...this.state.validityState,
            password: "form-control",
            confirmPassword: "form-control",
          },
          formMessages: {
            ...this.state.formMessages,
            password: "",
            confirmPassword: "",
          },
        });
      }
      delete validationTemp.tests.item["errors"];

      if (validationTemp.hasErrors("password")) {
        delete validationTemp.tests.password["errors"];
      }
      if (validationTemp.hasErrors("confirmPassword")) {
        delete validationTemp.tests.confirmPassword["errors"];
      }
      if (validationTemp.hasErrors('item')) {
        delete validationTemp.tests.item["item"] //item
      }

      //check if the object of errors is empty, if yes update the employee, and if not STOP
      if (Object.keys(validationTemp.getErrors()).length === 0 &&
        !validationTemp.hasErrors("confirmPassword") &&
        !validationTemp.hasErrors("password")) {
        if (editInfo === "edit_employee_Info") {
          var { data } = await fetcher.put(
            "/employees/myDetails",
            this.state.dataEmployee
          );
          this.setState({
            updatePopup: true,
            addModalShow: true,
            message: data,
          });
        } else {
          let formData = new FormData();
          this.state.file1Obj.forEach((element) => {
            formData.append("files", element);
          });
          await fetcher.post(`/employees/upload_employee_files/${this.state.id}`, formData);
          const { data } = await fetcher.put(
            `/employees/${this.state.id}`,
            this.state.dataEmployee
          );
          this.setState({
            updatePopupFromAdmin: true,
            addModalShow: true,
            message: data,

          });
        }
      }
    } catch (error) { }
  };

  componentDidMount = async () => {
    try {
      console.clear()

      const loginDetailsCookie = getUser();
      if (loginDetailsCookie) {
        let loginDetailsPersonal = JSON.parse(loginDetailsCookie);
        this.setState({ loginRole: loginDetailsPersonal.role.name });
      }
      const { data } = await fetcher.get("/admin/roles");
      this.setState({ roles: data });
      const id = window.location.pathname.split("/")[4];
      const urlPath = window.location.pathname.split("/")[1];
      this.setState({urlPath: urlPath})
      if (id || urlPath === "edit_employee_Info") {
        if (id) {
          const { data } = await fetcher.get(`/employees/${id}`);
          const fileEmployeData = await fetcher.get(`/employees/load_files/${id}`);
          this.setState({
            filesArrayShow: fileEmployeData.data,
            id: id,
            //here we pass all the data from edit to current object
            formState: {
              ...data,
              password: "",
              confirmPassword: "",
              item: fileEmployeData.data,
            },
          });
          const mappedEmployee = this.mapApiResultToState(data);
          this.setState(
            {
              editUser: true,
              dataEmployee: mappedEmployee,

            },
            () => {
              const { cities } = this.context;
              const selectedCity = cities.find(
                (city) => city.name === mappedEmployee.city
              );

              this.setState({ selectedCity });
            }
          );
        } else {
          const { data } = await fetcher.get("/employees/myDetails");
          const mappedEmployee = this.mapApiResultToState(data);
          await this.setState(
            {
              editUser: true,
              dataEmployee: mappedEmployee,
              formState: {
                ...data,
                password: "",
                confirmPassword: "",
              },
            },
            () => {
              const { cities } = this.context;
              const selectedCity = cities.find(
                (city) => city.name === mappedEmployee.city
              );
              this.setState({ selectedCity, editEmployeeInfo: true });
            }
          );
        }
      }
    } catch (error) {
      throw error;
    }
  };

  mapApiResultToState = (employee) => {
    const mappedEmployee = {
      first_name: employee.first_name,
      last_name: employee.last_name,
      phone: employee.phone,
      email: employee.email,
      city: employee.city,
      street: employee.street,
      postal_code: employee.postal_code,
      identity: employee.identity || "",
      password: employee.password || "",
      confirmPassword: "",
      role_id: employee.role_id,
    };

    return mappedEmployee;
  };
  backBtnEmployee = () => {
    this.setState({ isBackEmployee: true });

  };

  handleKeyPress = (e) => {
    var value = e.currentTarget.value.split(" ");
    if (value) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  deleteFile = () => { };
  render() {
    const { cities } = this.context;

    return (
      <div>
        <Navbar />
        <div>
          <div className="container-fluid">
            {(this.state.updatePopup || this.state.updatePopupFromAdmin) && (
              <AddDepModal
                show={this.state.addModalShow}
                onHide={() => false}
                msg={this.state.message}
                updatePopup={this.state.updatePopup}
                updatePopupFromAdmin={this.state.updatePopupFromAdmin}
                editInfoShow={this.state.editEmployeeInfo}
              />
            )}
            <div className="row">
              <div className="col-md-2"></div>
              <div className="col-md-8">
                <div className="form-group row mt-3">
                  {this.state.editUser ? (
                    <h1 className="md-flex align-items-right mr-3">
                      עריכת עובד
                    </h1>
                  ) : (
                      <h1 className="md-flex align-items-right mr-3">
                        הגדרת עובד חדש
                      </h1>
                    )}
                </div>
                <div className="form-group row">
                  <div className="col-md-10">
                    <label
                      htmlFor="inputFirst"
                      className="d-flex align-items-right"
                    >
                      שם פרטי
                    </label>
                    <input
                      type="text"
                      id="inputFirst"
                      className={
                        this.state.validityState.first_name || "form-control"
                      }
                      name="first_name"
                      value={this.state.dataEmployee.first_name}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur(
                          "first_name",
                          this.state.dataEmployee.first_name
                        )
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.first_name}
                    </label>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-10">
                    <label
                      htmlFor="inputLastName"
                      className="d-flex align-items-right"
                    >
                      שם משפחה
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.validityState.last_name || "form-control"
                      }
                      id="inputLastName"
                      name="last_name"
                      value={this.state.dataEmployee.last_name}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur(
                          "last_name",
                          this.state.dataEmployee.last_name
                        )
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.last_name}
                    </label>
                  </div>
                </div>
                {this.state.editUser ? null : (
                  <div className="form-group row">
                    <div className="col-md-10">
                      <label
                        htmlFor="inputID"
                        className="d-flex align-items-rightl"
                      >
                        תעודת זהות
                      </label>
                      <input
                        type="text"
                        className={
                          this.state.validityState.identity || "form-control"
                        }
                        id="inputID"
                        name="identity"
                        value={this.state.dataEmployee.identity}
                        onChange={this.onChangeHandler}
                        onBlur={() =>
                          this.onBlur(
                            "identity",
                            this.state.dataEmployee.identity
                          )
                        }
                      />
                      <label className="float-right text-danger">
                        {this.state.formMessages.identity}
                      </label>
                    </div>
                  </div>
                )}
                <div className="form-group row">
                  <div className="col-md-10">
                    <label
                      htmlFor="inputPhone2"
                      className="d-flex align-items-right"
                    >
                      {" "}
                      נייד
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.validityState.phone || "form-control"
                      }
                      id="inputPhone2"
                      name="phone"
                      value={this.state.dataEmployee.phone}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur("phone", this.state.dataEmployee.phone)
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.phone}
                    </label>
                  </div>
                </div>
                <div className="form-group row">
                  <div className="col-md-10">
                    <label
                      htmlFor="inputEmail"
                      className="d-flex align-items-right"
                    >
                      דוא"ל
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.validityState.email || "form-control"
                      }
                      id="inputEmail"
                      name="email"
                      value={this.state.dataEmployee.email}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur("email", this.state.dataEmployee.email)
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.email}
                    </label>
                  </div>
                </div>

                <div>
                  <div className="form-group row">
                    <div className="col-md-10">
                      <label
                        htmlFor="inputPassOne"
                        className="d-flex align-items-right"
                      >
                        סיסמה
                      </label>
                      <input
                        type="password"
                        className={
                          this.state.validityState.password || "form-control"
                        }
                        id="inputPassOne"
                        name="password"
                        value={this.state.dataEmployee.password}
                        onChange={this.onChangeHandler}
                        onBlur={() =>
                          this.onBlur(
                            "password",
                            this.state.dataEmployee.password
                          )
                        }
                      />
                      <label className="float-right text-danger">
                        {this.state.formMessages.password}
                      </label>
                    </div>
                  </div>

                  <div className="form-group row">
                    <div className="col-md-10">
                      <label
                        htmlFor="inputPassTwo"
                        className="d-flex align-items-right "
                      >
                        אשר סיסמה
                      </label>
                      <input
                        type="password"
                        className={
                          this.state.validityState.confirmPassword ||
                          "form-control"
                        }
                        id="inputPassTwo"
                        name="confirmPassword"
                        value={this.state.dataEmployee.typeconfirmPassword}
                        onChange={this.onChangeHandler}
                        onBlur={() =>
                          this.onBlur(
                            "confirmPassword",
                            this.state.dataEmployee.confirmPassword
                          )
                        }
                      />
                      <label className="float-right text-danger">
                        {this.state.formMessages.confirmPassword}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-group row">
                  <div className="col-md-4">
                    <label
                      htmlFor="inputCity"
                      className="d-flex align-items-right "
                    >
                      יישוב
                    </label>
                    <Autocomplete
                      id="inputCity"
                      className={
                        this.state.validityState.city || "form-control"
                      }
                      options={cities}
                      getOptionLabel={(option) => option.name}
                      onChange={(evt, city) => {
                        if (city) {
                          let { dataEmployee } = this.state;
                          dataEmployee.city = city.name;

                          const { cities } = this.context;
                          const selectedCity = cities.find(
                            (city) => city && city.name === dataEmployee.city
                          );

                          this.setState({ dataEmployee, selectedCity });
                        }
                      }}
                      defaultValue={this.state.selectedCity}
                      onBlur={() =>
                        this.onBlur("city", this.state.dataEmployee.city)
                      }
                      value={this.state.selectedCity}
                      disableClearable={true}
                      wrapperStyle={{
                        position: "relative",
                        display: "inline-block",
                        color: "red",
                      }}
                      style={{ direction: "rtl" }}
                      noOptionsText={"ישוב לא קיים"}
                      error={this.state.errorAuto}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder="יישוב"
                          InputProps={{
                            ...params.InputProps,
                            disableUnderline: true,
                          }}
                        />
                      )}
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.city}
                    </label>
                  </div>
                  <div className="col-md-4">
                    <label
                      htmlFor="inputStreet"
                      className="d-flex align-items-right "
                    >
                      רחוב
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.validityState.street || "form-control"
                      }
                      id="inputStreet"
                      placeholder="רחוב"
                      name="street"
                      value={this.state.dataEmployee.street}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur("street", this.state.dataEmployee.street)
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.street}
                    </label>
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="inputZip"
                      className="d-flex align-items-right"
                    >
                      מיקוד
                    </label>
                    <input
                      type="text"
                      className={
                        this.state.validityState.postal_code || "form-control"
                      }
                      id="inputZip"
                      placeholder="3007500"
                      name="postal_code"
                      value={this.state.dataEmployee.postal_code}
                      onChange={this.onChangeHandler}
                      onBlur={() =>
                        this.onBlur(
                          "postal_code",
                          this.state.dataEmployee.postal_code
                        )
                      }
                    />
                    <label className="float-right text-danger">
                      {this.state.formMessages.postal_code}
                    </label>
                  </div>
                </div>
                {this.state.urlPath === 'edit_employee_Info' ? null :
                  <div>
                    <div className="form-group row">
                      <div className="col-md-4">
                        <label
                          htmlFor="inputCustomer"
                          className="d-flex align-items-right "
                        >
                          תפקיד
                    </label>
                        <select
                          className={
                            this.state.validityState.role_id || "form-control"
                          }
                          id="inputCustomer"
                          name="role_id"
                          value={this.state.dataEmployee.role_id}
                          onKeyPress={this.handleKeyPress}
                          onChange={this.onChangeHandler}
                          disabled={this.state.editUser === true}
                          onBlur={() =>
                            this.onBlur("role_id", this.state.dataEmployee.role_id)
                          }
                        >
                          <option selected value="">
                            תפקיד
                      </option>
                          {this.state.roles.map((role, index) => (
                            <option key={index} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                        <label className="float-right text-danger">
                          {this.state.formMessages.role_id}
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="form-group row">
                        <div className="col-md-8">
                          <div className="input-group">
                            <Form>
                              <Form.File id="fileInput">
                                <Form.File.Label></Form.File.Label>
                                <Form.File.Input
                                  type="file"
                                  name="file1"
                                  onChange={this.Userinput}
                                  value={this.state.username}
                                  onBlur={this.state.editUser ? null : () => this.onBlur('item', this.state.file1Obj)}
                                  className={this.state.validityState.item || ''}
                                />
                              </Form.File>
                            </Form>
                          </div>

                          {this.state.editUser ?
                            <ol>
                              {this.state.filesArrayShow.map((val, index) => (
                                <li>
                                  <a href={val.path}>{val.path}</a>
                                </li>
                              ))}
                            </ol> : null

                          }

                          <ol start={(this.state.filesArrayShow.length + 1)}>
                            {this.state.item.map((val, index) => (
                              <li>
                                <div id="output">
                                  {val.split('\\')[2]}
                                  <button type="button" title="Delete" className="btn btn-outline" onClick={() => this.deleteList(index)} ><FontAwesomeIcon className="fa-lg " icon={faTimesCircle} color='red'> </FontAwesomeIcon></button>
                                </div>
                              </li>
                            ))}
                          </ol>
                          {/* </div> */}
                          <div className="text-danger text-right">{this.state.formMessages.item}</div>
                        </div>

                      </div>
                    </div>
                    <div className="row form-group">
                      <div className="col-md-2">
                        <button
                          className="btn btn-success btn-block btn-round"
                          id="add"
                          onClick={() => this.AddList(this.state.username)}
                        >
                          הוסף קובץ
                    </button>
                      </div>
                      <div className="col-md-10"></div>
                    </div>
                  </div>
                }
                <div className="form-group row">
                  <div className="col-md-2">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-danger btn-block"
                        onClick={this.backButtonAdminInfo}
                      >
                        {" "}
                        חזרה
                      </button>
                    </div>
                  </div>

                  <div className="col-md-5"></div>
                  <div className="col-md-3">
                    {this.state.editUser ? (
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-block"
                        onClick={this.onEditEmployee}
                      >
                        {" "}
                        עדכן
                      </button>
                    ) : (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-block"
                          onClick={this.onSaveEmployee}
                        >
                          {" "}
                        סיום הרשמה
                        </button>
                      )}
                  </div>

                  {this.state.isCreateEmployee && (
                    <PopUp
                      show={this.state.addModalShow}
                      onHide={() => false}
                      isCreateEmployee={this.state.isCreateEmployee}
                      msg={this.state.message}
                      backBtnEmployee={this.backBtnEmployee}
                    />
                  )}
                  {/* {this.state.isCancelSignUp && <Redirect to="/admin/employees" />} */}
                  {this.state.isCancelSignUpFromDetails && <Redirect to="/admin" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SignUpEmployee.contextType = CompanyContext;

export default withRouter(SignUpEmployee);
