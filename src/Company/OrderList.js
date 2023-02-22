import React from "react";

import Navbar from "../Navbar";
import { Card, ListGroup } from "react-bootstrap";

import Cards from "../shared/Cards";
import fetcher from "../api/fetcher";
import { CompanyContext } from "../CompanyContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { validateFormFilterOrder } from "../shared/validation";

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avaliable: false,
      backCompany: false,
      dataOrders: [],
      vehicles: [],
      isOpen: false,
      orderListData: false,
      show: false,
      extras: [],
      dataAfterFilter: [],
      emptyChecked: [],
      dataFilter: {
        startdate: "",
        enddate: "",
        starttime: "",
        endtime: "",
        capacity: "",
        startpoint: "",
        destination: "",
        vehicletype: "",
        extra: [],
      },
      tempVhicle: "",
      page: 1,
      size: 3,
      noResult: false,
      isModeFilter: false,
      checkMe: false,
      requestURLFilter: "",
      hasNext: false,
      hasPrev: false,
      formState: {},
      formMessages: {},
      validityState: {},
      windowWidth: window.innerWidth,
    };
  }

  onClickFilter = async () => {
    var vehicle = this.state.vehicles.filter((vehicle) => {
      if (vehicle.id.toString() === this.state.dataFilter.vehicletype) {
        return vehicle.vehicle_type.type;
      }
      //check this -- this line deleting the warning  "Expected to return a value at the end of arrow function"
      return null;
    });
    if (vehicle.length >= 1) {
      var finalType = vehicle[0].vehicle_type.type;

      await this.setState({
        dataFilter: {
          ...this.state.dataFilter,
          vehicletype: finalType,
          capacity: vehicle[0].capacity,
        },
        tempVhicle: vehicle[0].id.toString(),
      });
    }
    let requestURL = "";
    Object.keys(this.state.dataFilter).forEach((key) => {
      if (key === "extra") {
        if (this.state.dataFilter.extra.length >= 1) {
          requestURL = requestURL.concat(
            `&${key}=${this.state.dataFilter[key]}`
          );
        }
      } else {
        if (this.state.dataFilter[key] !== "") {
          requestURL = requestURL.concat(
            `&${key}=${this.state.dataFilter[key]}`
          );
        }
      }
    });
    await this.setState({
      dataFilter: {
        ...this.state.dataFilter,
        vehicletype: this.state.tempVhicle,
      },
    });

    requestURL = "/companies/orders?".concat(requestURL.slice(1));
    if (
      !validateFormFilterOrder(this.state.formState)
        .done(this.handleValidationResult)
        .hasErrors()
    ) {
      const { data } = await fetcher.get(requestURL);
      this.setState({
        dataAfterFilter: data.otherOrders.orders,
        isModeFilter: true,
        requestURLFilter: requestURL,
      });
    }
  };

  onChangeCheckboxexs = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.value : null;
    const checked = target.checked;
    this.addToStateArrayCheckBox(target.name, value, checked, target);
    this.state.emptyChecked.push(target);
  };

  addToStateArrayCheckBox = (stateName, id, checked, target) => {
    if (checked === true) {
      this.state.dataFilter[stateName].push(id);
    } else {
      var index = this.state.dataFilter[stateName].indexOf(id);
      this.state.dataFilter[stateName].splice(index, 1);
    }
  };

  onChangeHandler = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const savedData = { ...this.state.dataFilter, [target.name]: value };
    if (target.value === "" && target.name === "vehicletype") {
      this.setState({tempVhicle:''});
    }
    this.setState({ dataFilter: savedData });
  };

  filterChecked = () => {
    let counter = false;
    Object.keys(this.state.dataFilter).map((i, key) => {
      if (this.state.dataFilter[i] !== "") {
        counter = true;
      }
      //check this -- this line deleting the warning  "Expected to return a value at the end of arrow function"
      return null;
    });
    if (counter) return false;
    return true;
  };

  toggleMenu = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  onClickMoreDetails = () => {
    this.setState({ avaliable: true });
  };

  isAvaliable = () => {
    this.setState({ avaliable: true });
  };

  backButtonCompany = () => {
    // this.setState({ backCompany: true });
    this.props.history.push("/company");
  };

  handleResize = (e) => {
    this.setState({ windowWidth: window.innerWidth });
  };

  componentDidMount = async () => {
    try {
      console.clear()

      window.addEventListener("resize", this.handleResize);
      var date = new Date(),
        month = "" + (date.getMonth() + 1),
        day = "" + date.getDate(),
        year = date.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      const finalDate = [year, month, day].join("-");
      this.setState({ currentDate: finalDate });
      const { data } = await fetcher.get(
        `/companies/orders?size=${this.state.size}&page=${this.state.page}`
      );
      if (data.otherOrders.orders.length < 1) {
        this.setState({
          noResult: true,
          dataOrders: [],
          hasPrev: false,
          hasNext: false,
        });
      } else {
        this.setState({
          hasPrev: data.otherOrders.hasPrev,
          hasNext: data.otherOrders.hasNext,
          noResult: false,
          dataOrders: data.otherOrders.orders,
        });
      }
      // this.setState({ dataOrders: data.ordersList, orderListData: true });
      const dataDetails = await fetcher.get(
        "http://localhost:3001/orders/order_details"
      );

      this.setState({
        extras: dataDetails.data.Extras,
        vehicles: dataDetails.data.Vehicles,
      });
    } catch (error) {}
  };

  onClickPrevNex = async (size, page, stateName) => {
    try {
      if (stateName === "hasNext") {
        await this.setState((prevState) => ({
          page: (prevState.page += 1),
        }));
      } else {
        await this.setState((prevState) => ({
          page: (prevState.page -= 1),
        }));
      }
      const { data } = await fetcher.get(
        `/companies/orders?size=${size}&page=${this.state.page}`
      );
      this.setState({
        hasPrev: data.otherOrders.hasPrev,
        hasNext: data.otherOrders.hasNext,
        noResult: false,
        dataOrders: data.otherOrders.orders,
      });
    } catch (error) {}
  };
  myOrdersClick = () => {
    this.props.history.push("/company/order_list/my_orders");
    // this.props.history.push('/company/bid');
  };

  onBlur = (fieldName, value) => {
    const nextState = { ...this.state.formState, [fieldName]: value };
    this.setState({ formState: nextState });

    validateFormFilterOrder(nextState, fieldName).done(
      this.handleValidationResult
    );
  };
  handleValidationResult = (result) => {
    const msgs = { ...this.state.formMessages };
    const validity = { ...this.state.validityState };

    result.tested.forEach((fieldName) => {
      // if current field has errors
      if (result.hasErrors(fieldName)) {
        msgs[fieldName] = result.getErrors(fieldName)[0];
        validity[fieldName] = "form-control is-invalid";
      } else if (result.hasWarnings(fieldName)) {
        msgs[fieldName] = result.getWarnings(fieldName)[0];
        validity[fieldName] = "warning";
      } else {
        // otherwise, there's not much need for it.
        delete msgs[fieldName];
        validity[fieldName] = "form-control is-valid";
      }
    });

    this.setState({ formMessages: msgs, validityState: validity });
  };
  onDeleteFilter = async () => {
    try {
      // const { dataFilter } = this.state
      if (this.state.emptyChecked.length >= 1) {
        this.state.emptyChecked.forEach((extra) => {
          extra.checked = false;
          // document.querySelector('.inputCheck').checked=false
        });
      }
      await this.setState({
        page: 1,
        size: 3,

        dataFilter: {
          startdate: "",
          enddate: "",
          vehicletype: "",
          starttime: "",
          endtime: "",
          extra: [],
        },
        tempVhicle: "",
        validityState: {
          startdate: "",
          enddate: "",
        },
        formMessages: {
          startdate: "",
          enddate: "",
        },
        emptyChecked: [],
      });
      const { data } = await fetcher.get(
        `/companies/orders?size=${this.state.size}&page=${this.state.page}`
      );
      this.setState({
        dataOrders: data.otherOrders.orders,
        isModeFilter: false,
        hasNext: data.otherOrders.hasNext,
        hasPrev: data.otherOrders.hasPrev,
      });
    } catch (error) {}
  };
  updateFinalState = (stateFinal) => {
    this.setState({
      dataOrders: stateFinal,
    });
  };

  render() {
    const show = this.state.isOpen ? "show" : "";
    return (
      <div>
        <Navbar />
        <div className="container-fluid">
          <div className="row mt-4">
            <div className="col-md-8">
              <div className="form-group">
                <div className="text-right col-sm-10">
                  <h1 className="mb-4">לוח הזמנות</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="mt-3 ml-5">
              <button
                type="button"
                className="btn btn-warning"
                onClick={this.myOrdersClick}
              >
                הזמנות שלי
              </button>
            </div>
            <div className="mt-3 ml-5">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#filters"
                className="d-block d-md-none btn btn-primary btn-block mb-3"
                onClick={this.toggleMenu}
              >
                סינון
              </button>
              <Card
                style={{ width: "" }}
                className={"d-md-block collapse" + show}
              >
                <ListGroup variant="flush">
                  <h4 htmlFor="inputFilter" className="text-center ml-3">
                    סינון
                  </h4>

                  <ListGroup.Item>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-group row">
                          <label
                            htmlFor="fromDate"
                            className="d-flex align-items-right col-sm-10 col-form-label"
                          >
                            מתאריך
                          </label>
                          <div className="col-sm-10">
                            <input
                              min={this.state.currentDate}
                              max="9999-12-31"
                              type="date"
                              className={
                                this.state.validityState.startdate ||
                                "form-control"
                              }
                              id="startdate"
                              name="startdate"
                              value={this.state.dataFilter.startdate}
                              onBlur={() =>
                                this.onBlur(
                                  "startdate",
                                  this.state.dataFilter.startdate
                                )
                              }
                              onChange={this.onChangeHandler}
                            />
                            <label className="float-right text-danger">
                              {this.state.formMessages.startdate}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group row">
                          <label
                            htmlFor="toDate"
                            className="d-flex align-items-right col-sm-10 col-form-label"
                          >
                            עד תאריך
                          </label>
                          <div className="col-sm-10">
                            <input
                              min={this.state.currentDate}
                              max="9999-12-31"
                              type="date"
                              className={
                                this.state.validityState.enddate ||
                                "form-control"
                              }
                              id="enddate"
                              name="enddate"
                              value={this.state.dataFilter.enddate}
                              onBlur={() =>
                                this.onBlur(
                                  "enddate",
                                  this.state.dataFilter.enddate
                                )
                              }
                              onChange={this.onChangeHandler}
                            />
                            <label className="float-right text-danger">
                              {this.state.formMessages.enddate}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group row">
                          <label
                            htmlFor="fromTime"
                            className="d-flex align-items-right col-sm-10 col-form-label"
                          >
                            משעה
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="time"
                              className="form-control"
                              id="starttime"
                              name="starttime"
                              value={this.state.dataFilter.starttime}
                              onChange={this.onChangeHandler}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group row">
                          <label
                            htmlFor="toTime"
                            className="d-flex align-items-right col-sm-10 col-form-label"
                          >
                            עד שעה
                          </label>
                          <div className="col-sm-10">
                            <input
                              type="time"
                              className="form-control"
                              id="endtime"
                              name="endtime"
                              value={this.state.dataFilter.endtime}
                              onChange={this.onChangeHandler}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="form-group row">
                          <label
                            htmlFor="vehicleType"
                            className="d-flex align-items-right col-sm-10 col-form-label"
                          >
                            {" "}
                            סוג רכב
                          </label>
                          <div className="col-sm-10">
                            <select
                              className="form-control"
                              id="vehicletype"
                              name="vehicletype"
                              value={this.state.dataFilter.vehicletype}
                              onChange={this.onChangeHandler}
                            >
                              <option value="">
                                סוג רכב
                              </option>
                              {this.state.vehicles.map((vehicle, index) => (
                                <option key={index} value={vehicle.id}>
                                  {vehicle.vehicle_type.type} {vehicle.capacity}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-5">
                        <div className="form-group row">
                          <label
                            htmlFor="vehicleType"
                            className="d-flex align-items-right col-sm-10 col-form-label mb-2"
                          >
                            תוספות
                          </label>
                          <div className="form-check form-check-inline">
                            {this.state.extras.map((extra, index) => {
                              return [
                                <input
                                  id={extra.id}
                                  value={extra.name}
                                  className="inputCheck form-check-input ml-1"
                                  type="checkbox"
                                  name="extra"
                                  onChange={this.onChangeCheckboxexs}
                                />,
                                <label
                                  className="form-check-label ml-2"
                                  htmlFor={extra.id}
                                >
                                  {extra.name}
                                </label>,
                              ];
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="form-group row">
                          <div>
                            <label
                              htmlFor="capacity"
                              className="d-flex align-items-right col-sm-10 col-form-label"
                            >
                              &nbsp;
                            </label>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group row"></div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8"></div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-primary btn-block"
                          type="button"
                          onClick={this.onClickFilter}
                        >
                          סנן
                        </button>
                        <button
                          className="btn btn-danger btn-block"
                          type="button"
                          onClick={this.onDeleteFilter}
                        >
                          בטל סינון
                        </button>
                      </div>
                      <div className="col-md-4"></div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </div>
            {/* <div> */}
            <div className="row ">
              {/* <div className="col-md-1 col-sm-3 mb-2"></div> */}
              {/* <div className="col-md-3 col-sm-6 "> */}
              {!this.state.isModeFilter || this.filterChecked()
                ? this.state.dataOrders.map(
                    (order, index) => (
                      (
                        <Cards
                          idList={order.id}
                          serial_number={order.serial_number}
                          start_point={order.start_point}
                          destination={order.destination}
                          customerFirstName={order.customerFirstName}
                          customerLastName={order.customerLastName}
                          customerPhone={order.customerPhone}
                          dataOrders={this.state.dataOrders}
                          updateFinalState={this.updateFinalState}
                          subscription={order.subscription || []}
                          extraOrders={this.state.extras}
                        />
                      )
                    )
                  )
                : !this.filterChecked() && !this.state.isModeFilter
                ? this.state.dataOrders.map((order) => (
                    <Cards
                      idList={order.id}
                      serial_number={order.serial_number}
                      start_point={order.start_point}
                      destination={order.destination}
                      customerFirstName={order.customerFirstName}
                      customerLastName={order.customerLastName}
                      customerPhone={order.customerPhone}
                      dataOrders={this.state.dataOrders}
                      updateFinalState={this.updateFinalState}
                      subscription={order.subscription || []}
                      extraOrders={this.state.extras}
                    />
                  ))
                : this.state.dataAfterFilter.map((order) => (
                    <Cards
                      idList={order.id}
                      serial_number={order.serial_number}
                      start_point={order.start_point}
                      destination={order.destination}
                      customerFirstName={order.customerFirstName}
                      customerLastName={order.customerLastName}
                      customerPhone={order.customerPhone}
                      dataOrders={this.state.dataAfterFilter}
                      updateFinalState={this.updateFinalState}
                      subscription={order.subscription || []}
                      extraOrders={this.state.extras}
                    />
                  ))}
            </div>
            {this.state.isModeFilter ? null : (
              <div className="row">
                <div className="col-3 col-md-1 col-sm-12"></div>
                <div
                  className={
                    this.state.windowWidth < 700
                      ? "col-sm-12 ml-4 mt-2 text-center"
                      : "col-md-6  mt-3 mb-2"
                  }
                >
                  <button
                    type="button"
                    className="btn btn-primary ml-3"
                    disabled={this.state.hasNext === false}
                    onClick={() => {
                      this.onClickPrevNex(
                        this.state.size,
                        this.state.page,
                        "hasNext"
                      );
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="ml-2"
                    ></FontAwesomeIcon>
                    הבא
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={this.state.page === 1}
                    onClick={(event) => {
                      this.onClickPrevNex(
                        this.state.size,
                        this.state.page,
                        "hasPrev"
                      );
                    }}
                  >
                    הקודם
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="mr-2"
                    ></FontAwesomeIcon>
                  </button>
                </div>
                <div className="col-3 col-md-4 col-sm-5"></div>
              </div>
            )}

            <div className="mt-3 ml-5">
              <button
                type="button"
                className="btn btn-danger float-right col-md-2 col-sm-2 mb-2"
                onClick={this.backButtonCompany}
              >
                חזרה
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

OrderList.contextType = CompanyContext;

export default OrderList;
