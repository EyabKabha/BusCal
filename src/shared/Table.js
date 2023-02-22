import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";

function TableHeader(props) {
  return (
    <th scope="col">
      {props.header.value}
      <FontAwesomeIcon
        className="ml-1"
        icon={faSort}
        hidden={!props.header.toSort}
        onClick={() => props.sortOn(props.header)}
      ></FontAwesomeIcon>
    </th>
  );
}

export default class Table extends React.Component {
  // constructor(props) {
  //   super(props);

  // }
  render() {

    return (
      <div style={{overflowX:"auto" }}>

      <table className="table  table-striped table-bordered border-dark ml-3 text-center"
        style={{ borderWidth: "3px"}}>
        <thead className="thead font-weight-normal thead-dark">
          <tr >
            {this.props.header.map(key => (
              <TableHeader
                header={key}
                sortOn={(header) => this.props.sortDataByKey(header)}
              />
            ))}
          </tr>
        </thead>
        {
          // 5 
          // 0 15 i<length ? color : red ? :'green'
        }
        <tbody>
          {this.props.data.map((entries, index) => (
            this.props.historyColor ?
            <tr className="font-weight-bold"  style={(index < this.props.historyOneTookThem || index < this.props.closedVehiclesLength  ) ? { color: 'green' } : { color: 'red' }
            }>
              {Object.values(entries).map(column => (
                <td >{column}</td>
              ))}
            </tr>
            : 
            <tr className="font-weight-bold" >
            {Object.values(entries).map(column => (
              <td >{column}</td>
            ))}
            </tr>

          ))}
        </tbody>
      </table>
      </div>
    );
  }
}