import React, { Fragment } from 'react';

import { Row, Col, Timeline } from 'antd';
import { connect } from "react-redux";
import { Button } from "primereact/button";
import { Messages } from 'primereact/messages';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import DropIn from "braintree-web-drop-in-react";
import { Checkbox } from 'primereact/checkbox';


import Locations from './Locations';
import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';

import { formValidation, emailValidation, isNotEmpty } from '../../utils/Utils';
import { taxValidation, addressValidate } from '../../utils/commonService';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { showToastMessage } from '../../utils/Utils';
import { appTheme, PRODUCT_BASE_URL, GOOGLE_MERCHANT_ID } from '../../utils/Constants';

import {styles} from '../../styles/CheckOutPage.css';


class CheckOutPage extends React.Component {
    instance;
    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            checkbillingAddress: false,
            disableShipping: false,
            disableBilling: false,
            orderTax: 0,
            clientToken: null,
            showCard: false,
            formInvalid: false,
            shippingAddress: {},
            billingAddress: {},
            applyCode:false,
            fullname: '',
            email: '',
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            region: '',
            billing_fullname:'',
            billing_line1: '',
            billing_line2: '',
            billing_city: '',
            billing_postalCode: '',
            billing_region: '',
            errorMsg: '',
            billingErrorMsgs:[],
            shippingErrorMsgs:[],
            isError: {
                fullname: '',
                email: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                region: '',
                billing_fullname:'',
                billing_line1: '',
                billing_line2: '',
                billing_city: '',
                billing_postalCode: '',
                billing_region: ''
            }
        }

        this.messageRef = React.createRef();
    }





    async onSubmitPayment() {
        let {shippingAddress, billingAddress} =  this.state;
        if(Object.keys(shippingAddress).length === 0){
           this.messageRef.current.show({ severity: 'error', summary: '', sticky: true, content: 'Please add shipping address.'})
        }else if(Object.keys(billingAddress).length === 0){
            this.messageRef.current.show({ severity: 'error', summary: '', sticky: true, content: 'Please add billing address.'})
        }else{
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
      


    }



    submitOrder = () => {

        const { email, shippingAddress, billingAddress } = this.state;
        let userCart = userProfile.getCart();

        let formData = {
            "cart": userCart,
            "email": email,
            "shippingAddress": shippingAddress,
            "billingAddress":billingAddress
        }
        let restUrl = `${PRODUCT_BASE_URL}cart/checkout`;
        serviceCall(formData, restUrl, 'POST')
            .then((res) => {
                this.setState({ showLoader: false }, () => {
                    if (!res.data.error) {
                        userProfile.setCart([]);
                        userProfile.setcartDetails({});
                        this.props.setUserData({ cartcount: 0, orderTotal: 0 })
                        this.props.history.replace('/order-success');
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
            case 'billing_fullname':
                isError.billing_fullname =
                    value.length === 0
                        ? 'Please enter full name.'
                        : '';
                break;
            case 'billing_line1':
                isError.billing_line1 =
                    value.length === 0
                        ? 'Please enter shipping address.'
                        : '';
                break;
            case 'billing_city':
                isError.billing_city =
                    value.length === 0
                        ? 'Please enter a city name.'
                        : '';
                break;
            case 'billing_region':
                isError.billing_region =
                    value.length === 0
                        ? 'Please enter a state, region or province.'
                        : '';
                break;
            case 'billing_postalCode':
                isError.billing_postalCode =
                    value.length === 0
                        ? 'Please enter a ZIP or postal code.'
                        : value.length !== 5 ? 'ZIP or postal code should be 5 digits' : '';
                break;
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value,
            formInvalid: false,
            errorMsg: ''
        })
    }


    validateShippingAddress = (e) => {
        e.preventDefault();
        const { disableShipping, fullname, email, line1, line2, city, region, postalCode, isError } = this.state;
        if (disableShipping) {
            this.setState({ disableShipping: false })
        } else {
            if (formValidation(isError, { fullname, email, line1, city, region, postalCode })) {
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
                } else
                    this.setState({ formInvalid: false, showLoader: true })

                let addressData = {
                    "uid": "",
                    "fullname":fullname,
                    "line1": line1,
                    "line2": line2,
                    "city": city,
                    "postalCode": postalCode,
                    "region": region,
                    "country": 'USA',
                    "isDefault": false
                }
                addressValidate(addressData).then((res) => {
                    this.setState({ showLoader: false }, () => {
                        if (res.data.data && !res.data.data.messages) {
                            this.setState({ shippingAddress: res.data.data.address, disableShipping: true }, () => {
                                taxValidation(res.data.address);
                            })
                        } else {
                          this.setState({shippingErrorMsgs:res.data.data.messages})
                        }
                    })
                }).catch((error) => {
                    this.setState({ showLoader: false })
                })
            } else {
                this.setState({ formInvalid: true, errorMsg: 'Please enter all required fields' });
            }
        }



    }

    validateBillingAddress = (e) => {
        e.preventDefault();
        const {billing_fullname, billing_line1, billing_line2, billing_city, billing_region, billing_postalCode, isError } = this.state;
        if (formValidation(isError, { billing_fullname, billing_line1, billing_city, billing_region, billing_postalCode })) {
            if(!isNotEmpty(billing_fullname)){
                isError.billing_fullname = 'Please enter fullname.'
                this.setState({ isError })
                return
            }else if (!isNotEmpty(billing_line1)) {
                isError.billing_line1 = 'Please enter an address.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(billing_city)) {
                isError.city = 'Please enter a city name.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(billing_region)) {
                isError.billing_region = 'Please enter a state, region or province.'
                this.setState({ isError })
                return
            } else if (!isNotEmpty(billing_postalCode)) {
                isError.billing_postalCode = 'Please enter a ZIP or postal code.'
                this.setState({ isError })
                return
            } else
                this.setState({ formInvalid: false, showLoader: true })

            let addressData = {
                "uid": "",
                "fullname": billing_fullname,
                "line1": billing_line1,
                "line2": billing_line2,
                "city": billing_city,
                "postalCode": billing_postalCode,
                "region": billing_region,
                "country": 'USA',
                "isDefault": false
            }
            addressValidate(addressData).then((res) => {
                this.setState({ showLoader: false }, () => {
                    if (res.data.data && !res.data.data.messages) {
                        this.setState({ billingAddress: res.data.data.address }, () => {
                            taxValidation(res.data.address);
                            this.showCardForm();
                        })
                    } else {
                        this.setState({billingErrorMsgs:res.data.data.messages})
                    }
                })
            }).catch((error) => {
                this.setState({ showLoader: false })
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
        let userData = userProfile.getUserObj();
        this.setState({ shippingAddress: address, email: userData && userData.emailId ? userData.emailId : '' })
    }

    checkbillingAddress(value){
        if(value.checked){
            if(Object.keys(this.state.shippingAddress).length === 0){
                this.messageRef.current.show({ severity: 'error', summary: '', sticky: true, content: 'Please add shipping address before enabling.'})
            }else{
                this.setState({billingAddress:this.state.shippingAddress, checkbillingAddress: value.checked },()=>{
                    this.showCardForm();
                })
            }
        }else{
            this.setState({ checkbillingAddress: value.checked })
        }
        
    }



    render() {
        const { disableShipping, checkbillingAddress, showCard, clientToken, isError, fullname, email,
            line1, line2, city, region, postalCode, disableBilling, billing_fullname, billing_line1, billing_line2, billing_city, applyCode,
            billing_region, billing_postalCode, formInvalid, orderTax, showLoader, errorMsg, shippingErrorMsgs, billingErrorMsgs } = this.state;

        let userData = userProfile.getUserObj();
        let userCartDetails = userProfile.getcartDetails();

       
        return (
            <Fragment>

                <div className={styles.cardBorder}>
                    <Row className={styles.checkoutSubmain}>
                        <Col xs={24} md={24} lg={18} className="p-shadow-1 p-p-4" >
                            <Messages ref={this.messageRef} />
                            <Timeline>
                                <Timeline.Item dot={<i className="pi pi-map-marker" style={{ fontSize: '1.8em', color: appTheme.logoTextColor }} />}>
                                    <h3 style={{ margin: 0 }}>Shipping address</h3>
                                    <Divider />
                                    {userData && userData.accessToken ?
                                        <Locations selectDeliveryAddress={this.selectDeliveryAddress.bind(this)} /> :
                                        <Fragment>
                                            <div className="p-fluid p-formgrid p-grid">
                                                <div className="p-field p-col-12 p-md-6">
                                                    <label htmlFor="fullname"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Full Name</label>
                                                    <InputText id="fullname" type="text"
                                                        disabled={disableShipping}
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
                                                        disabled={disableShipping}
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
                                                        disabled={disableShipping}
                                                        placeholder="Street Address"
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
                                                        disabled={disableShipping}
                                                        placeholder="Apt, Suite, Building, Unit, etc"
                                                        value={line2} name="line2"
                                                        className={"p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="city"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>City</label>
                                                    <InputText id="city" type="text"
                                                        disabled={disableShipping}
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
                                                        disabled={disableShipping}
                                                        value={region} name="region" required
                                                        className={(isError.region.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.region.length > 0 && (
                                                        <small id="region-help" className="p-error p-d-block">{isError.region}</small>
                                                    )}
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="postalCode" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Zip code</label>
                                                    <InputText id="postalCode" type="number"
                                                        disabled={disableShipping}
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
                                            {shippingErrorMsgs.length !==0 && shippingErrorMsgs.map((error)=>(
                                                 <h5 className="p-error p-d-block">{error.summary}</h5>
                                            ))}
                                            <OneButton
                                                onClick={(e) => this.validateShippingAddress(e)}
                                                buttonLabel={(disableShipping) ? "Change" : "Save & Continue"}
                                                btnShape="round"
                                                btnSize="large"
                                                buttonStyle={{ fontSize: 16, margin: 12, width: 240, height: 40, }}
                                            />
                                        </Fragment>}

                                </Timeline.Item>
                                <Timeline.Item dot={<i className="pi pi-id-card" style={{ fontSize: '1.8em', color: appTheme.logoTextColor }} />}>
                                    <h3 style={{ margin: 0 }}>Billing address</h3>
                                    <Divider />
                                    <div className="p-field-checkbox">
                                        <Checkbox inputId="billing" checked={checkbillingAddress} onChange={e => this.checkbillingAddress(e)} />
                                        <label htmlFor="billing" style={{ fontWeight: '600' }}>Use Shipping Address as Billing Address</label>
                                    </div>

                                    {!checkbillingAddress &&
                                        <Fragment>
                                            <div className="p-fluid p-formgrid p-grid">
                                            <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="billing_fullname"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Full name</label>
                                                    <InputText id="billing_fullname" type="text"
                                                        disabled={disableBilling}
                                                        value={billing_fullname} name="billing_fullname" required
                                                        className={(isError.billing_fullname.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.billing_fullname.length > 0 && (
                                                        <small id="billing_line1-help" className="p-error p-d-block">{isError.billing_fullname}</small>
                                                    )}
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="billing_line1"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Address</label>
                                                    <InputText id="billing_line1" type="text"
                                                        disabled={disableBilling}
                                                        placeholder="Street Address"
                                                        value={billing_line1} name="billing_line1" required
                                                        className={(isError.billing_line1.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.billing_line1.length > 0 && (
                                                        <small id="billing_line1-help" className="p-error p-d-block">{isError.billing_line1}</small>
                                                    )}
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="" style={{ color: '#fff' }}>s</label>
                                                    <InputText type="text"
                                                        disabled={disableBilling}
                                                        placeholder="Apt, Suite, Building, Unit, etc"
                                                        value={billing_line2} name="billing_line2"
                                                        className={"p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="billing_city"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>City</label>
                                                    <InputText id="billing_city" type="text"
                                                        disabled={disableBilling}
                                                        value={billing_city} name="billing_city" required
                                                        className={(isError.billing_city.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.billing_city.length > 0 && (
                                                        <small id="billing_city-help" className="p-error p-d-block">{isError.billing_city}</small>
                                                    )}
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="billing_region" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span> State</label>
                                                    <InputText id="billing_region" type="text"
                                                        disabled={disableBilling}
                                                        value={billing_region} name="billing_region" required
                                                        className={(isError.billing_region.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.billing_region.length > 0 && (
                                                        <small id="billing_region-help" className="p-error p-d-block">{isError.billing_region}</small>
                                                    )}
                                                </div>
                                                <div className="p-field p-col-12 p-md-4">
                                                    <label htmlFor="billing_postalCode" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Zip code</label>
                                                    <InputText id="billing_postalCode" type="number"
                                                        disabled={disableBilling}
                                                        value={billing_postalCode} name="billing_postalCode" required
                                                        className={(isError.billing_postalCode.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                                        onChange={this.handleChange}
                                                    />
                                                    {isError.billing_postalCode.length > 0 && (
                                                        <small id="billing_postalCode-help" className="p-error p-d-block">{isError.billing_postalCode}</small>
                                                    )}
                                                </div>
                                            </div>
                                            {isNotEmpty(errorMsg) &&
                                                <h5 className="p-error p-d-block">{errorMsg}</h5>
                                            }
                                            {billingErrorMsgs.map((error)=>(
                                                 <h5 className="p-error p-d-block">{error.summary}</h5>
                                            ))}
                                            <OneButton
                                                onClick={(e) => this.validateBillingAddress(e)}
                                                buttonLabel={(disableBilling) ? "Change" : "Save & Continue"}
                                                btnShape="round"
                                                btnSize="large"
                                                buttonStyle={{ fontSize: 16, margin: 12, width: 240, height: 40, }}
                                            />
                                        </Fragment>}
                                </Timeline.Item>
                                <Timeline.Item dot={<i className="pi pi-credit-card" style={{ fontSize: '1.8em', color: appTheme.logoTextColor }} />}>
                                    <h3 style={{ margin: 0 }}>Payment details</h3>
                                    <Divider />
                                    {showCard &&
                                        <DropIn
                                            options={
                                                {
                                                    authorization: clientToken,
                                                    paypal: { flow: 'vault' },
                                                    paypalCredit: { flow: 'vault' },
                                                    googlePay: {
                                                        merchantId: GOOGLE_MERCHANT_ID,
                                                        transactionInfo: {
                                                            currencyCode: 'USD',
                                                            totalPrice: `${userCartDetails.orderTotal}`,
                                                            totalPriceStatus: "FINAL"
                                                        }
                                                    },
                                                    applePay: {
                                                        displayName: 'One auto',
                                                        paymentRequest: {
                                                            total: {
                                                                label: 'One auto',
                                                                amount: `${userCartDetails.orderTotal}`,
                                                            },
                                                            countryCode: 'USA',
                                                            currencyCode: 'USD',
                                                            supportedNetworks: ['discover'],
                                                            merchantCapabilities: ['supports3DS']
                                                        }
                                                    }
                                                }
                                            }
                                            onInstance={(instance) => (this.instance = instance)}

                                        />
                                    }
                                </Timeline.Item>
                            </Timeline>

                            <OneButton
                                onClick={this.onSubmitPayment.bind(this)}
                                buttonLabel={"Place your Order"}
                                btnShape="round"
                                btnSize="large"
                                btnDisabled={!showCard}
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

                                <div className="p-formgroup-inline p-mt-4">
                                    <div className="p-field">
                                        <div className="p-inputgroup">
                                            <InputText className="p-inputtext-sm" placeholder="Enter code" />
                                            <Button type="button" label="Apply" className="p-button-sm"
                                                onClick={()=> this.setState({applyCode:true})}
                                                style={{
                                                    backgroundColor: appTheme.logoTextColor,
                                                    borderColor: appTheme.logoTextColor
                                                }} />
                                        </div>
                                        {applyCode &&
                                            <small className="p-error p-d-block">Code is invalid, Please check again</small>
                                        }
                                    </div>

                                </div>
                                <div className="cartdetails-spacebetween">
                                    <h3>Items:</h3>
                                    <h3>{userCartDetails.cartcount}</h3>
                                </div>
                                <div className="cartdetails-spacebetween">
                                    <h3>Sub Total:</h3>
                                    <h3>${userCartDetails.orderTotal}</h3>
                                </div>
                                <div className="cartdetails-spacebetween">
                                    <h3>Tax:</h3>
                                    <h3>${orderTax}</h3>
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




