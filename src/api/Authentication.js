import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { getUser } from './auth';


class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Authenticated: false,
    };
  }
  componentDidMount() {
    console.clear()

    if (getUser()) {
      var person = JSON.parse(getUser())
      this.setState({ personRole: person.role.name })
      const { history } = this.props;

      if (person.role.name === 'adminCompany' || person.role.name === 'userCompany') {
        history.push('/company');
      } else if (person.role.name === 'customer') {
        history.push('/customer');
      } else if (person.role.name === 'admin' ||person.role.name === 'subAdmin' ) {
        history.push('/admin');
      } else if (person.role.name === 'support') {
        history.push('/support');
      } 
      this.setState({ Authenticated: true });
    } else {
      this.setState({ Authenticated: true });
    }
  }

  render() {
    const { children } = this.props;
    const { Authenticated } = this.state;
    if (Authenticated === false) {
      return (
        <div>loading....</div>
      );
    }
    return (
      <div>
        {children}
      </div>
    );
  }
}

export default withRouter(Authentication);