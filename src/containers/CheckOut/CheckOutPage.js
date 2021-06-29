import React, { Fragment } from 'react';

import { Row, Col } from 'antd';
import { connect } from "react-redux";
import { Steps } from 'primereact/steps';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import DropIn from "braintree-web-drop-in-react";

import Locations from './Locations';
import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';

import { formValidation, emailValidation, isNotEmpty } from '../../utils/Utils';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { showToastMessage } from '../../utils/Utils';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';

import './CheckOutPage.css';


class CheckOutPage extends React.Component {
    instance;
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            activeIndex: 0,
            clientToken: null,
            showCard: false,
            formInvalid: false,
            userAddress: {},
            fullname: '',
            email: '',
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            region: '',
            country: '',
            errorMsg: '',
            isError: {
                country: '',
                fullname: '',
                email: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                region: '',

            }
        }
    }





    async onSubmitPayment() {
      

        const { nonce } = await this.instance.requestPaymentMethod();
        let userCartDetails = userProfile.getcartDetails();
        let restUrl = `${PRODUCT_BASE_URL}payments/chargecard`;
        let payment = {
            "oneautopaymentType": "braintree",
            "amount": parseInt(userCartDetails.orderTotal),
            "desc": "hello",
            "payment_method_nonce": nonce
        }
        this.setState({ showLoader: true });
        await serviceCall(payment, restUrl, 'POST')
            .then((res) => {
                if (!res.data.error) {
                    this.submitOrder();
                } else {
                    this.setState({ showLoader: false });
                }
            }).catch((error) => { this.setState({ showLoader: false }); })


    }



    submitOrder = () => {

        const { email, userAddress } = this.state;
        let userCart = userProfile.getCart();

        let formData = {
            "cart": userCart,
            "email": email,
            "address": userAddress
        }
        let restUrl = `${PRODUCT_BASE_URL}cart/checkout`;
        serviceCall(formData, restUrl, 'POST')
            .then((res) => {
                this.setState({ showLoader: false }, () => {
                    if (!res.data.error) {
                        userProfile.setCart([]);
                        userProfile.setcartDetails({});
                        this.props.setUserData({ cartcount: 0, orderTotal: 0 })
                        this.props.history.replace('/');
                    } else {

                    }
                })
            })
            .catch((error) => {
                this.setState({ showLoader: false }, () => {
                    showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                })
            })
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let isError = { ...this.state.isError };
        switch (name) {
            case 'fullname':
                isError.fullname =
                    value.length === 0
                        ? 'Please enter name.'
                        : '';
                break;
            case 'email':
                isError.email =
                    emailValidation.test(value)
                        ? ''
                        : 'Email is not valid.';
                break;
            case 'line1':
                isError.line1 =
                    value.length === 0
                        ? 'Please enter an address.'
                        : '';
                break;
            case 'city':
                isError.city =
                    value.length === 0
                        ? 'Please enter a city name.'
                        : '';
                break;
            case 'region':
                isError.region =
                    value.length === 0
                        ? 'Please enter a state, region or province.'
                        : '';
                break;
            case 'postalCode':
                isError.postalCode =
                    value.length === 0
                        ? 'Please enter a ZIP or postal code.'
                        : value.length !== 5 ? 'ZIP or postal code should be 5 digits' : '';
                break;
            case 'country':
                isError.country =
                    value.length === 0
                        ? 'Please enter a country.'
                        : '';
                break;
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value,
            formInvalid: false,
            errorMsg:''
        })
    }


    validateUserAddress = (e) => {
        e.preventDefault();
        const { fullname, email, line1, line2, city, region, postalCode, country, isError } = this.state;
        if (formValidation(isError, { fullname, email, line1, city, region, postalCode, country })) {
            if (!isNotEmpty(fullname)) {
                isError.fullname = 'Please enter name.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(email)) {
                isError.email = 'Please enter a valid email address.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(line1)) {
                isError.line1 = 'Please enter an address.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(city)) {
                isError.city = 'Please enter a city name.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(region)) {
                isError.region = 'Please enter a state, region or province.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(postalCode)) {
                isError.postalCode = 'Please enter a ZIP or postal code.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(country)) {
                isError.country = 'Please enter a country.'
                this.setState({ isError })
                return
            } else
                this.setState({ formInvalid: false, showLoader: true })
            let addressData = {
                "uid": "",
                "line1": line1,
                "line2": line2,
                "city": city,
                "postalCode": postalCode,
                "region": region,
                "country": country,
                "isDefault": true
            }
            let restUrl = `${PRODUCT_BASE_URL}address/validate`;
            serviceCall(addressData, restUrl, 'POST')
                .then((res) => {
                    this.setState({ showLoader: false }, () => {
                        if (!res.data.error) {
                            this.setState({ userAddress: res.data.address, activeIndex: 1 })
                        } else {

                        }
                    })
                })
                .catch((error) => {

                })
        } else {
            this.setState({ formInvalid: true, errorMsg: 'Please enter all required fields' });
        }


    }

    showCardForm() {
        this.setState({ showLoader: true });
        let restUrl = `${PRODUCT_BASE_URL}payments/braintree_client_token?email=${this.state.email}`;
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                this.setState({ showLoader: false }, () => {
                    if (!res.data.error) {
                        this.setState({ clientToken: res.data.data, showCard: true })
                    } else {

                    }
                })
            })
            .catch((error) => {
                this.setState({ showLoader: false });
            })
    }

    selectDeliveryAddress(address) {
        this.setState({ userAddress: address, activeIndex: 1 })
    }


    render() {
        const { activeIndex, showCard, clientToken, isError, fullname, email,
            line1, line2, city, region, postalCode, country, formInvalid, showLoader, errorMsg } = this.state;

        let userData = userProfile.getUserObj();
        let userCartDetails = userProfile.getcartDetails();

        const items = [
            {
                label: 'Delivery address',
            },
            {
                label: 'Payment Details',
            }
        ];
        return (
            <Fragment>
                <div className="checkout-main">
                    <Row className="checkout-submain">
                        <Col xs={24} md={24} lg={18} className="p-shadow-1 p-p-4" >
                            <Steps model={items} activeIndex={activeIndex} />
                            <div className="p-mt-3">
                                <h2 style={{ margin: 0 }}><i className="pi pi-map-marker" style={{ fontSize: '1em', color: appTheme.logoTextColor }} />Shipping Address</h2>
                                <Divider />
                                {userData && userData.accessToken ?
                                    <Locations selectDeliveryAddress={this.selectDeliveryAddress.bind(this)} /> :
                                    <Fragment>
                                        <div className="p-fluid p-formgrid p-grid">
                                            <div className="p-field p-col-12 p-md-6">
                                                <label htmlFor="fullname"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Full Name</label>
                                                <InputText id="fullname" type="text"
                                                    value={fullname} name="fullname" required
                                                    className={(isError.fullname.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.fullname.length > 0 && (
                                                    <small id="line1-help" className="p-error p-d-block">{isError.fullname}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-6">
                                                <label htmlFor="email"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Email address</label>
                                                <InputText id="email" type="text"
                                                    value={email} name="email" required
                                                    className={(isError.email.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.email.length > 0 && (
                                                    <small id="line1-help" className="p-error p-d-block">{isError.email}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-6">
                                                <label htmlFor="address"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Address</label>
                                                <InputText id="address" type="text"
                                                    placeholder="Area, Colony, Street, Sector, Village"
                                                    value={line1} name="line1" required
                                                    className={(isError.line1.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.line1.length > 0 && (
                                                    <small id="line1-help" className="p-error p-d-block">{isError.line1}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-6">
                                                <label htmlFor="" style={{ color: '#fff' }}>s</label>
                                                <InputText type="text"
                                                    placeholder="Flat, House no., Building, Company, Apartment"
                                                    value={line2} name="line2"
                                                    className={"p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                            <div className="p-field p-col-12 p-md-4">
                                                <label htmlFor="city"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>City</label>
                                                <InputText id="city" type="text"
                                                    value={city} name="city" required
                                                    className={(isError.city.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.city.length > 0 && (
                                                    <small id="city-help" className="p-error p-d-block">{isError.city}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-4">
                                                <label htmlFor="region" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span> State</label>
                                                <InputText id="region" type="text"
                                                    value={region} name="region" required
                                                    className={(isError.region.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.region.length > 0 && (
                                                    <small id="region-help" className="p-error p-d-block">{isError.region}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-4">
                                                <label htmlFor="country" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Country</label>
                                                <InputText id="country" type="text"
                                                    value={country} name="country" required
                                                    className={(isError.country.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.country.length > 0 && (
                                                    <small id="country-help" className="p-error p-d-block">{isError.country}</small>
                                                )}
                                            </div>
                                            <div className="p-field p-col-12 p-md-6">
                                                <label htmlFor="postalCode" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Zip code</label>
                                                <InputText id="postalCode" type="text"
                                                    value={postalCode} name="postalCode" required
                                                    className={(isError.postalCode.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                    onChange={this.handleChange}
                                                />
                                                {isError.postalCode.length > 0 && (
                                                    <small id="postalCode-help" className="p-error p-d-block">{isError.postalCode}</small>
                                                )}
                                            </div>
                                        </div>
                                        {isNotEmpty(errorMsg) &&
                                            <h5 className="p-error p-d-block">{errorMsg}</h5>
                                        }
                                        <OneButton
                                            onClick={(e) => this.validateUserAddress(e)}
                                            buttonLabel={"Save & Continue"}
                                            btnShape="round"
                                            btnSize="large"
                                            buttonStyle={{ fontSize: 16, margin: 12, width: 240, height: 40, }}
                                        />
                                    </Fragment>}

                            </div>
                            {activeIndex === 0 ?
                                <div className="p-shadow-8 p-p-3 p-mb-3 p-mt-3">
                                    <h2 style={{ margin: 0 }}><i className="pi pi-credit-card" style={{ fontSize: '1em', color: appTheme.logoTextColor }} /> Payment Details</h2>
                                </div> :
                                <div>
                                    <h2 style={{ margin: 0 }}><i className="pi pi-credit-card" style={{ fontSize: '1em', color: appTheme.logoTextColor }} /> Payment Details</h2>
                                    <Divider />
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <div className="p-shadow-3 payment_selection_card"
                                            onClick={() => this.showCardForm()}>
                                            <h2>Card</h2>
                                            <i className="pi pi-credit-card" />
                                        </div>
                                        <div className="p-shadow-3 payment_selection_card"
                                            onClick={() => this.showCardForm()}>
                                            <h2>Paypal</h2>
                                            <i className="pi pi-paypal" />
                                        </div>
                                    </div>
                                    {showCard &&
                                        <DropIn
                                            options={
                                                {authorization: clientToken ,
                                                paypal: {flow: 'checkout'},
                                                paypalCredit:{flow: 'checkout'}
                                            }
                                            }
                                            onInstance={(instance) => (this.instance = instance)}
                                      
                                        />
                                    }
                                </div>}
                            <Divider />
                            <OneButton
                                onClick={this.onSubmitPayment.bind(this)}
                                buttonLabel={"Place your Order"}
                                btnShape="round"
                                btnSize="large"
                                btnDisabled={activeIndex === 0}
                                buttonStyle={{ fontSize: 16, marginTop: 12, width: 240, height: 40, }}
                            />
                        </Col>
                        <Col xs={24} md={24} lg={1} ></Col>
                        <Col xs={24} md={24} lg={5}>
                            {userData && userData.accessToken ? null :
                                <div className="p-shadow-1 p-p-3 p-mb-3" onClick={() => this.props.history.replace("/login")}>
                                    <span style={{ color: appTheme.logoTextColor, fontWeight: '500', cursor: 'pointer' }}>Already have account ? Sign In <i className="pi pi-angle-right"></i></span>
                                </div>}
                            <div className="p-shadow-1 p-p-3  p-mb-3">
                                <h2>Order Summary</h2>
                                <Divider />
                                <div className="cartdetails-spacebetween">
                                    <h3>Items:</h3>
                                    <h3>{userCartDetails.cartcount}</h3>
                                </div>
                                <div className="cartdetails-spacebetween">
                                    <h3>Sub Total:</h3>
                                    <h3>${userCartDetails.orderTotal}</h3>
                                </div>
                                <Divider />
                                <div className="cartdetails-spacebetween">
                                    <h2>Total:</h2>
                                    <h2>${userCartDetails.orderTotal}</h2>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
                {showLoader && <AppSpinner />}
            </Fragment>
        )
    }




}


function mapStateToProps(state) {
    return {
        loginData: state.userLoginData,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOutPage);




