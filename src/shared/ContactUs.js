import React from 'react';
import '../assets/style.css'
export default class ContactUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
           
                <footer id="main-footer" class="bg-dark text-white mt-5">

                                <p class="lead text-center">
                                  נתקעת ? נשמח לעזור.                                         </p>
                                     
                                <p id="phoneColor" class="lead text-center">
                                   
                                   073-3988700
                                         </p>
                                         <p id="year" class="lead text-center">
                                    A.M.K Cloud technologies &copy;
                                         BusCal {new Date().getFullYear()}
                                         </p>
                </footer>
           
        )
    }
}

