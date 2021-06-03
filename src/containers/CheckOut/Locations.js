import React, { Fragment } from 'react';

import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from "primereact/inputtext";

import OneButton from '../../components/OneButton';
import { formValidation, showToastMessage } from '../../utils/Utils';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { PRODUCT_BASE_URL, appTheme } from '../../utils/Constants';


import './CheckOutPage.css';

class Locations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userAddress:[],
            addressModal: false,
            formInvalid: false,
            loading: false,
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            region: '',
            country: '',
            isDefaultAddress: false,
            newAddress:true,
            addressId:'',
            isError: {
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                region: '',
                country: ''
            }
        }

        this.toastRef = React.createRef();
    }

    componentDidMount(){
        this.getUserAddress();
    }

    getUserAddress(){
        let userData = userProfile.getUserObj();
        if(userData && userData.accessToken && userData.userId){
            let restUrl = `${PRODUCT_BASE_URL}address/`;
            serviceCall({"uid": userData.userId}, restUrl, 'POST')
                .then((res) => {
                    this.setState({ loading: false }, () => {
                        if (!res.data.error) {
                            this.setState({userAddress:res.data.data})
                        } else {

                        }
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false }, () => {
                        showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                    })
                })
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        let isError = { ...this.state.isError };
        switch (name) {
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
                        : '';
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
            [name]: value
        })
    }


    addorUpdateUserAddress(addressData){
        const { line1, city, region, postalCode, country, newAddress } = this.state;
        if (formValidation(this.state.isError, { line1, city, region, postalCode, country })) {
            this.setState({ formInvalid: false })
            let restUrl = (newAddress) ?`${PRODUCT_BASE_URL}address/add` : `${PRODUCT_BASE_URL}address/update`;
            serviceCall(addressData, restUrl, 'POST')
                .then((res) => {
                    this.setState({ loading: false }, () => {
                        if (!res.data.error) {
                            showToastMessage(this.toastRef, 'success', '', 'Address added successfully');
                            this.setState({addressModal:false},()=>{
                                this.getUserAddress();
                            });
                        } else {

                        }
                    })
                })
                .catch((error) => {
                    this.setState({ loading: false }, () => {
                        showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                    })
                })
        } else {
            this.setState({ formInvalid: true });
            showToastMessage(this.toastRef, 'error', '', `Please fill all required fields`);
        }
    }

    validateUserAddress=()=>{
        const { line1, line2, city, region, postalCode, country,isDefaultAddress, newAddress, addressId } = this.state;
        let userData = userProfile.getUserObj();
        if (userData && userData.accessToken && userData.userId) {
            if (formValidation(this.state.isError, { line1, city, region, postalCode, country })) {
                this.setState({ formInvalid: false })
                let addressData = {
                    "uid": userData.userId,
                    "line1": line1,
                    "line2": line2,
                    "city": city,
                    "postalCode": postalCode,
                    "region": region,
                    "country": country,
                    "isDefault" : isDefaultAddress
                }
                if(!newAddress){
                    addressData["id"] = addressId;
                }
                let restUrl = `${PRODUCT_BASE_URL}address/validate`;
                serviceCall(addressData, restUrl, 'POST')
                    .then((res) => {
                        this.setState({ loading: false }, () => {
                            if (!res.data.error) {
                                this.addorUpdateUserAddress(addressData);
                            } else {

                            }
                        })
                    })
                    .catch((error) => {
                        this.setState({ loading: false }, () => {
                            showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                        })
                    })
            } else {
                this.setState({ formInvalid: true });
                showToastMessage(this.toastRef, 'error', '', `Please fill all required fields`);
            }
        } else {
            showToastMessage(this.toastRef, 'error', '', `Please login to add new address`);
        }

    }

    editAddress=(address)=>{
        this.setState({
            addressId:address._id,
            line1:address.line1,
            line2:address.line2,
            city:address.city,
            region:address.region,
            postalCode:address.postalCode,
            country:address.country
        },()=>{
            this.setState({addressModal:true,newAddress:false})
        })
    }

    removeAddress=(address)=>{
        let userData = userProfile.getUserObj();
        if (userData && userData.accessToken && userData.userId) {
        let addressData = {
            "id": address._id,
        }
        let restUrl = `${PRODUCT_BASE_URL}address/delete`;
        serviceCall(addressData, restUrl, 'POST')
            .then((res) => {
                this.setState({ loading: false }, () => {
                    if (!res.data.error) {
                        this.getUserAddress();
                    } else {

                    }
                })
            })
            .catch((error) => {
                this.setState({ loading: false }, () => {
                    showToastMessage(this.toastRef, 'error', '', 'Opps, Something went wrong, Try again');
                })
            })

        }
    }


    closeDialog = () => {
        this.setState({ addressModal: false })
    }



    render() {
        const { userAddress, addressModal, isError, line1, line2, city, region, 
                postalCode, country, formInvalid, isDefaultAddress, newAddress } = this.state;

        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                <h1>Your Addresses</h1>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <div className="addLocationCard" onClick={() => this.setState({ addressModal: true, newAddress:true })}>
                        <i className="pi pi-plus" style={{ fontSize: '1.8em', fontWeight: 'bold', color: appTheme.primaryColor }}></i>
                        <div style={{ fontSize: 22, fontWeight: '600', color: appTheme.secondaryColor, marginTop: 6 }}>Add Address</div>
                    </div>
                    {userAddress.map((address)=>(
                        <div className="locationCard">
                            <div>
                            <h3>{address.line1}</h3>
                            <h3>{address.line2}</h3>
                            <h3>{address.city}, {address.region}. {' '} {address.postalCode}</h3>
                            <h3 style={{textTransform:'uppercase'}}>{address.country}</h3>
                            </div>
                 
                            <div>
                                <OneButton 
                                onClick={() => this.props.selectDeliveryAddress(address)}
                                buttonLabel={"Delivery to this address"}
                                btnShape="round"
                                buttonStyle={{fontSize:14, 
                                    margin:4,
                                    backgroundColor:appTheme.logoTextColor,
                                    borderColor:appTheme.logoTextColor
                                }}
                                /> 
                                <div>
                                <Button label="Edit" className="p-button-text" onClick={()=> this.editAddress(address)} /> 
                                <Button label="Remove" className="p-button-text" onClick={()=> this.removeAddress(address)} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Dialog header={(newAddress) ? "Add New Address" : "Edit Address"} visible={addressModal} style={{ width: '36vw' }}
                    onHide={() => this.closeDialog()} modal>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="p-field">
                            <label htmlFor="address" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Address</label>
                            <InputText id="address" value={line1} name="line1" required
                                placeholder="Flat, House no., Building, Company, Apartment"
                                className={(isError.line1.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.line1.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.line1}</small>
                            )}
                            <InputText id="address" value={line2} name="line2"
                                className={"p-inputtext-sm p-d-block p-mt-3"}
                                placeholder="Area, Colony, Street, Sector, Village"
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="city" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span> Town / City</label>
                            <InputText id="city" value={city} name="city" required
                                className={(isError.city.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.city.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.city}</small>
                            )}
                        </div>
                        <div className="p-field">
                            <label htmlFor="region" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span> State / Province / Region</label>
                            <InputText id="region" value={region} name="region" required
                                className={(isError.region.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.region.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.region}</small>
                            )}
                        </div>
                        <div className="p-field">
                            <label htmlFor="postalCode" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Zip code</label>
                            <InputText id="postalCode" value={postalCode} name="postalCode" required
                                className={(isError.postalCode.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.postalCode.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.postalCode}</small>
                            )}
                        </div>
                        <div className="p-field">
                            <label htmlFor="country" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Country</label>
                            <InputText id="country" value={country} name="country" required
                                className={(isError.country.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.country.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.country}</small>
                            )}
                        </div>
                    </div>
                    <div className="p-field-checkbox">
                        <Checkbox inputId="binary" checked={isDefaultAddress} onChange={e => this.setState({ isDefaultAddress: e.checked })} />
                        <label htmlFor="binary">Add as default</label>
                    </div>
                    <OneButton
                        onClick={this.validateUserAddress}
                        buttonLabel={(newAddress) ? "Add address" : "Update Address"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{ fontSize: 16, marginTop: 16 }}
                    />
                </Dialog>
            </Fragment>
        )
    }



}

export default Locations;