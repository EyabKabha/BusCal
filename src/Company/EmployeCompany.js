import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../Navbar";
import Table from "../shared/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Redirect } from "react-router-dom";
import fetcher from "../api/fetcher";
import swal from "sweetalert";

export default class EmployeCompany extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      isBack: false,
      isNewEm: false,
      page: 1,
      size: 5,
      hasPrev: false,
      hasNext: false,
      noResult: false,
    };
  }

  tableHeaders = [
    { key: "id", value: "שם עובד/ת", role: "", toSort: false },
    { key: "id", value: "", role: "", toSort: false },
  ];

  componentDidMount = async () => {
    try {
      console.clear()

      const { data } = await fetcher.get(
        `/companies/employees?size=${this.state.size}&page=${this.state.page}`
      );
      if (data.allEmployees.length < 1) {
        this.setState({
          noResult: true,
          employees: [],
          hasPrev: false,
          hasNext: false,
        });
      } else {
        this.setState({
          employees: data.allEmployees,
          hasPrev: data.hasPrev,
          hasNext: data.hasNext,
        });
      }
    } catch (error) {}
  };
  onClickNextPrevEmployees = async (size, page, stateName) => {
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
        `/companies/employees?size=${size}&page=${this.state.page}`
      );
      this.setState({
        hasPrev: data.hasPrev,
        hasNext: data.hasNext,
        noResult: false,
        employees: data.allEmployees,
      });
    } catch (error) {}
  };
  excludeFromStateArrayById = async (stateName, id) => {
    swal({
      title: "האם אתה בטוח שברצונך למחוק?",
      text: "לאחר מחיקה, לא תוכל להחזיר עובד זה!",
      icon: "warning",
      buttons: ["ביטול", "מחק"],

      ButtonOptions: {
        className: "success",
      },
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        const { data } = await fetcher.delete(
          `/companies/company_employee/${id}`
        );
        let filteredArray = this.state.employees.filter(
          (item) => item.id !== id
        );
        this.setState({
          employees: filteredArray,
        });
        swal(`${data}`, {
          icon: "success",
        });
      }
    });
  };
  onCancelClicked = () => {
    // this.setState({ isBack: true })
    this.props.history.goBack();
  };
  onClickNewEmployee = () => {
    // this.setState({isNewEm:true})
    this.props.history.push("/company/signup");
  };
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h1 className="text-right mt-5 col-sm-10">עובדים</h1>
          <div className="row ml-2 mt-3">
            <div className="col-sm-10 text-right mr-3">
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={this.onClickNewEmployee}
              >
                הוספת עובד חדש
              </button>
            </div>
            {this.state.isNewEm && <Redirect to="/company/signup" />}
            <div className="col-md-1"></div>
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12 text-center mr-3">
              <Table
                header={this.tableHeaders}
                data={this.state.employees.map((data) => {
                
                  
                  return {
                    name: data.name,
                    action: [
                      <button
                        type="button"
                        key={data.id + "edit"}
                        title="Edit"
                        className="btn btn-outline "
                      >
                        <Link to={`/company/signup/${data.id}`}>
                          <FontAwesomeIcon className="fa-lg " icon={faEdit}>
                            {" "}
                          </FontAwesomeIcon>{" "}
                        </Link>
                      </button>,
                      <button
                        id={data.id}
                        type="button"
                        title="Delete"
                        className="btn btn-outline"
                        onClick={() =>
                          this.excludeFromStateArrayById("employee", data.id)
                        }
                      >
                        <FontAwesomeIcon
                          className="fa-lg "
                          icon={faTrash}
                          color="red"
                        >
                          {" "}
                        </FontAwesomeIcon>
                      </button>,
                    ],
                  };
                })}
                sortDataByKey={(sortKey) => this.SortByKey(sortKey)}
                className="col-lg-8 col-md-8 col-sm-12 col-xs-12"
              ></Table>
              <div className="row">
                <div className="col-md-5"></div>
                <div className="col-md-4 mt-5">
                  {this.state.hasNext && (
                    <button
                      type="button"
                      class="btn btn-primary ml-3"
                      onClick={() => {
                        this.onClickNextPrevEmployees(
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
                  )}

                  {this.state.hasPrev && (
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={(event) => {
                        this.onClickNextPrevEmployees(
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
                  )}
                </div>
                <div className="col-md-5"></div>
              </div>
              <div className="row">
                <div className="col-md-2 col-sm-4">
                  <div className="mt-3  d-flex align-items-right">
                    <button
                      type="button"
                      className="btn btn-danger btn-block"
                      onClick={this.onCancelClicked}
                    >
                      {" "}
                      חזרה
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {this.state.isBack && <Redirect to="/company/" />}
            <div className="col-md-1"></div>
          </div>
        </div>
      </div>
    );
  }
}
