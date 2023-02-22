import React from 'react';
import '../assets/style.css'
export default class AddOrder extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            role:'',
        }
    }

    onClickCreateOrder = () => {
        if(this.state.role === 'customer'){
            this.props.history.push('/customer/bid'); 
        }else{
            this.props.history.push('/company/bid');
        }
    }
    
    onClickCreateBus = () => {
        this.props.history.push('/company/bus_offer');
    }
    componentDidMount=async()=>{
        console.clear()
        const {redirctRole} = this.props.location.state
        await this.setState({role: redirctRole})
    }
    render() {
        return (
            <div className="container-fluid" id="container">
                <div className="row mt-5">
                    <div className="col-2"></div>
                    <div className="col-4">
                        <button type="button" className="btn btn-primary btn-block mb-2" id={this.state.role!== 'customer' ? "Alleventsbtn" : "eventWithoutBus" } onClick={this.onClickCreateOrder}>בקשת הצעת מחיר</button>
                    </div>
                    {this.state.role !== 'customer' ? 
                    <div className="col-4">
                        <button type="button" className="btn btn-success btn-block mb-2" id="Createeventbtn" onClick={this.onClickCreateBus}> הצעת אוטובוס</button>
                    </div>:null
                    }
                </div>
            </div>
        )
    }
}