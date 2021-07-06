import React, { Fragment } from 'react';

import { connect } from "react-redux";

import { InputText } from "primereact/inputtext";
import { Steps, Row, Col } from 'antd';


import { Divider } from 'primereact/divider';


import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';
import { emailValidation, isNotEmpty } from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL, orderStatus } from '../../utils/Constants';


import './Orders.css'

const { Step } = Steps;


class TrackOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailId: '',
            orderId: '',
            isError: {
                emailId: '',
                orderId: ''
            },
            formInvalid: false,
            orderItem: {},
            orderDetails: [],
            orderLoader: false
        }
        this.toastRef = React.createRef();
    }

    componentWillMount() {

    }



    getOrdersDetails(selorder) {
        console.log("getOrdersDetails", selorder)
        this.setState({ orderLoader: true, orderDetails: [] }, () => {
            let restUrl = `${PRODUCT_BASE_URL}account/order/detail/${selorder._id}`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    if (!res.error) {
                        this.setState({ orderDetails: res.data.orderDetails, orderLoader: false })
                    }
                })
                .catch((error) => {
                    this.setState({ orderLoader: false })
                })
        })

    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case 'emailId':
                isError.emailId =
                    emailValidation.test(value)
                        ? ''
                        : 'Email is not valid.';
                break;
            case 'orderId':
                isError.orderId =
                    value.length === 0
                        ? 'Please enter order Id'
                        : '';
                break;
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value,
            formInvalid: false
        })
    }


    checkOrderStatus = (e) => {
        e.preventDefault();
        const {isError, emailId, orderId} = this.state;
        if(!isNotEmpty(emailId)){
            isError.emailId = 'Please enter email Id.'
            this.setState({ isError })
        }else if(!isNotEmpty(orderId)){
            isError.orderId = 'Please enter orderId.'
            this.setState({ isError })
        }else{
            let restUrl = `${PRODUCT_BASE_URL}account/trackorder?email=${this.state.emailId}&id=${this.state.orderId}`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    this.setState({ orderLoader: false }, () => {
                        if (!res.data.error) {
                                this.getOrdersDetails(res.data.orders)
                                this.setState({ orderItem: res.data.orders })
            
                        } else {
    
                        }
                    })
    
                })
                .catch((error) => {
                    this.setState({ orderLoader: false })
                })
        }
     
    }




    render() {
        const { emailId, orderId, isError, formInvalid, orderItem, orderDetails, orderLoader } = this.state;
     
        return (
            <Fragment>
                <div className="checkout-main">
                    <Row className="checkout-submain">
                        <Col xs={24} md={24} lg={22} className="p-shadow-1 p-p-lg-4 p-p-2" >
                            <h2>Track Order Status</h2>
                            <Divider />
                            {Object.keys(orderItem).length === 0 ?
                                <div>
                                    <div className="p-fluid p-formgrid p-grid">
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="email" className="p-d-block">Email address</label>
                                            <InputText id="email" value={emailId} name="emailId"
                                                className={(isError.emailId.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                onChange={this.handleChange} />
                                            {isError.emailId.length > 0 && (
                                                <small id="email-help" className="p-error p-d-block">{isError.emailId}</small>
                                            )}
                                        </div>
                                        <div className="p-field p-col-12 p-md-4">
                                            <label htmlFor="orderId" className="p-d-block">Order Id</label>
                                            <InputText id="orderId" value={orderId} name="orderId"
                                                className={(isError.orderId.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                onChange={this.handleChange} />
                                            {isError.orderId.length > 0 && (
                                                <small id="email-help" className="p-error p-d-block">{isError.orderId}</small>
                                            )}
                                        </div>
                                        <div className="p-field p-col-12 p-md-1"></div>
                                        <div className="p-field p-col-12 p-md-3">
                                            <OneButton
                                                onClick={(e) => this.checkOrderStatus(e)}
                                                buttonLabel={"Check Status"}
                                                btnShape="round"
                                                btnSize="large"
                                                buttonStyle={{ fontSize: 16, marginTop: 26, height: 40, }}
                                            />
                                        </div>

                                    </div>
                                </div> :
                                <div>
                                    <div className="p-shadow-2 p-mb-4">
                                        <div className="p-shadow-2 order-main">
                                            <span style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                <div>
                                                    <h4 style={{ color: appTheme.secondaryColor }}>Order Id: {orderItem._id}</h4>
                                                    <h5 style={{ color: appTheme.dark6 }}>Order Createdon : {' '} {new Date(orderItem.created).toDateString()}</h5>
                                                </div>
                                            </span>
                                            <div className="order-steps">
                                                <Steps size="small" progressDot
                                                    responsive
                                                    current={
                                                        (orderItem.status === orderStatus.PENDING) ? 0 : 1
                                                    }
                                                >
                                                    <Step title="Pending" />
                                                    <Step title="In Progress" />
                                                    <Step title="Shipped" />
                                                    <Step title="Completed" />
                                                </Steps>
                                            </div>
                                        </div>
                                    
                                            <div>
                                                {orderDetails.map((product) => (
                                                    <Row className="p-pb-1 p-pt-1 border-bottom" align="middle">
                                                        <Col xs={7} md={4} lg={4} className="col-align-center p-p-lg-3">
                                                            <img src={`${product.image}`}
                                                                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                                alt={product.image} style={{ height: '90%', width: '90%', objectFit: 'contain' }} />
                                                        </Col>
                                                        <Col xs={1} md={1} lg={1}></Col>
                                                        <Col xs={16} md={11} lg={9} >
                                                            <h3 style={{ color: appTheme.secondaryColor, fontWeight: '600' }}>{product.title}</h3>
                                                            <h4 style={{ color: appTheme.logoTextColor }}>$ {product.price}</h4>
                                                        </Col>
                                                        <Col xs={0} md={1} lg={1}></Col>
                                                        <Col xs={12} md={4} lg={4} className="col-align-center">
                                                            <h3 style={{ color: appTheme.dark3 }}>Quantity : {product.quantity}</h3>
                                                        </Col>
                                                        <Col xs={12} md={3} lg={4} className="col-align-center">
                                                            <h3 style={{ color: appTheme.dark3 }}>Total : $ {product.total}</h3>
                                                        </Col>

                                                    </Row>
                                                ))}
                                                <h3 style={{ color: appTheme.primaryColor, padding: 12, }}>Order Total: $ {orderItem.orderTotal}</h3>
                                            </div>
                                    </div>
                                </div>}
                        </Col>
                    </Row>
                </div>
                {orderLoader && <AppSpinner />}
            </Fragment>
        )
    }





}


function mapStateToProps(state) {
    return {

    }
}
function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TrackOrder);

