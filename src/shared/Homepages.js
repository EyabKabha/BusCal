import React from 'react';
import {Redirect} from 'react-router-dom';

const homepages = {
    admin: '/admin',
    adminCompany: '/company',
    userCompany: '/company',
    customer: '/customer'
}
export default role => this.history.push(`${homepages[role]}`);