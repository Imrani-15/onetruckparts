import React, { Fragment } from 'react';

import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";

import OneButton from '../../components/OneButton';
import ReactSnackBar from "../../components/ReactSnackBar";

import AppSpinner from '../../components/AppSpinner';
import { addressValidate } from '../../utils/commonService';
import { formValidation, showToastMessage, isNotEmpty } from '../../utils/Utils';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { PRODUCT_BASE_URL, appTheme } from '../../utils/Constants';


import './CheckOutPage.css';

class Locations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userAddress: [],
            errorMsg: '',
            addressErrorMsg:[],
            itemsToShow:2,
            expanded: false,
            addressModal: false,
            formInvalid: false,
            loading: false,
            fullname: '',
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            region: '',
            newAddress: true,
            addressId: '',
            isError: {
                fullname: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                region: ''
            },
            Show: false,
            Showing: false,
            toastMsg: '',
            
        }
    
        this.toastRef = React.createRef();
        this.showMore = this.showMore.bind(this);
    }

    componentDidMount() {
        this.getUserAddress();
    }

    getUserAddress() {
        let userData = userProfile.getUserObj();
        if (userData && userData.accessToken && userData.userId) {
            let restUrl = `${PRODUCT_BASE_URL}address/`;
            serviceCall({ "uid": userData.userId }, restUrl, 'POST')
                .then((res) => {
                    this.setState({ loading: false }, () => {
                        if (!res.data.error) {
                            this.setState({ userAddress: res.data.data })
                        } else {
                            this.setState({ userAddress: [] })
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
            case 'fullname':
                isError.fullname =
                    value.length === 0
                        ? 'Please enter full name.'
                        : '';
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
            default:
                break;
        }

        this.setState({
            isError,
            [name]: value
        })
    }



    addorUpdateUserAddress(addressData) {
        const { line1, city, region, postalCode, newAddress } = this.state;
        if (formValidation(this.state.isError, { line1, city, region, postalCode })) {
            this.setState({ formInvalid: false })
            let restUrl = (newAddress) ? `${PRODUCT_BASE_URL}address/add` : `${PRODUCT_BASE_URL}address/update`;
            serviceCall(addressData, restUrl, 'POST')
                .then((res) => {
                    this.setState({ loading: false }, () => {
                        if (!res.data.error) {
                            this.setState({ toastMsg: 'Address added successfully' }, () => {
                                this.showToast();
                                this.closeDialog();
                                this.getUserAddress();
                            })

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
            this.setState({ formInvalid: true, errorMsg: 'Please fill all required fields' });
        }
    }

    validateUserAddress = () => {
        const { fullname, line1, line2, city, region, postalCode, newAddress, addressId } = this.state;
        let userData = userProfile.getUserObj();
        if (userData && userData.accessToken && userData.userId) {
            if (formValidation(this.state.isError, { fullname, line1, city, region, postalCode })) {
                this.setState({ formInvalid: false, loading:true })
                let addressData = {
                    "uid": userData.userId,
                    "fullname": fullname,
                    "line1": line1,
                    "line2": line2,
                    "city": city,
                    "postalCode": postalCode,
                    "region": region,
                    "country": 'USA',
                    "isDefault": false
                }
                if (!newAddress) {
                    addressData["id"] = addressId;
                }
                addressValidate(addressData).then((res) => {
                    this.setState({ loading: false }, () => {
                        if (res.data.data && !res.data.data.messages) {
                            this.addorUpdateUserAddress(addressData);
                        } else {
                            this.setState({ addressErrorMsg: res.data.data.messages })
                        }
                    })
                }).catch((error) => {
                    this.setState({ loading: false })
                })
            } else {
                this.setState({ formInvalid: true, errorMsg: 'Please fill all required fields' });
            }
        } else {
            showToastMessage(this.toastRef, 'error', '', `Please login to add new address`);
        }

    }

    editAddress = (address) => {
        this.setState({
            addressId: address._id,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            region: address.region,
            postalCode: address.postalCode
        }, () => {
            this.setState({ addressModal: true, newAddress: false })
        })
    }

    removeAddress = (address) => {
        let userData = userProfile.getUserObj();
        if (userData && userData.accessToken && userData.userId) {
            let addressData = {
                "id": address._id,
            }
            this.setState({loading:true})
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
        this.setState({
            addressModal: false,
            fullname: '',
            line1: '',
            line2: '',
            city: '',
            postalCode: '',
            region: '',
            formInvalid: false,
            addressId: '',
            isError: {
                fullname: '',
                line1: '',
                line2: '',
                city: '',
                postalCode: '',
                region: ''
            }
        })
    }

    showToast = () => {
        if (this.state.Showing) return;
        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false, toastMsg: '' });
        }, 2000);
    };

    selectDeliveryAddress = (address) => {
        let userAddress = this.state.userAddress.map((addr) => {
            if (addr._id === address._id) {
                addr.isDefault = true
            } else {
                addr.isDefault = false
            }
            return addr
        })
        this.setState({ userAddress: userAddress }, () => {
            this.props.selectDeliveryAddress(address)
        })
    }

    showMore() {
        this.state.itemsToShow === 2 ? (
          this.setState({ itemsToShow: this.state.userAddress.length, expanded: true })
        ) : (
          this.setState({ itemsToShow: 2, expanded: false })
        )
      }



    render() {
        const { userAddress, addressModal, isError, fullname, line1, line2, city, region,
            postalCode, formInvalid, newAddress, errorMsg, toastMsg, loading, addressErrorMsg, itemsToShow, expanded } = this.state;

        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                <div>
                    <h5 style={{textAlign:'right', color:appTheme.logoTextColor, cursor:'pointer'}} onClick={this.showMore} >{(expanded) ? 'Show less' : 'Show more'}</h5>
                    <div className="p-d-flex p-flex-wrap">
                        <div className="p-col-12 p-md-4 card_ main">
                            <div className="addLocationCard" onClick={() => this.setState({ addressModal: true })}>
                                <i className="pi pi-plus" style={{ fontSize: '1.6em', fontWeight: 'bold', color: appTheme.primaryColor }}></i>
                                <div style={{ fontSize: 18, fontWeight: '600', color: appTheme.secondaryColor, marginTop: 6 }}>Add Address</div>
                            </div>
                        </div>
                        {userAddress.slice(0, itemsToShow).map((address) => (
                            <div className="p-col-12 p-md-4 card_ main" >
                                <div className={(address.isDefault) ? "locationCard selectedLocation" : "locationCard"}>
                                    <div onClick={() => this.selectDeliveryAddress(address)}>
                                        <h4>{address.fullname},</h4>
                                        <h4>{address.line1}</h4>
                                        <h4>{address.line2}</h4>
                                        <h4>{address.city}, {address.region}. {' '} {address.postalCode}</h4>
                                        <h4 style={{ textTransform: 'uppercase' }}>{address.country}</h4>
                                    </div>
                                    <div>
                                        <OneButton
                                            onClick={() => this.selectDeliveryAddress(address)}
                                            buttonLabel={(address.isDefault) ? "Selected address" : "Select address"}
                                            btnShape="round"
                                            buttonStyle={{
                                                fontSize: 15,
                                                margin: 4,
                                                height: 36,
                                                backgroundColor: (address.isDefault) ? appTheme.logoTextColor : appTheme.secondaryColor,
                                                borderColor: (address.isDefault) ? appTheme.logoTextColor : appTheme.secondaryColor
                                            }}
                                        />
                                        <div>

                                            <Button label="Edit" className="p-button-text p-button-sm p-button-info" onClick={() => this.editAddress(address)} />
                                            <Button label="Remove" className="p-button-text p-button-sm p-button-danger" onClick={() => this.removeAddress(address)} />
                                        </div>
                                    </div>
                                </div>
                            </div>))}

                    </div>
                </div>
                <Dialog header={(newAddress) ? "Add New Address" : "Edit Address"} visible={addressModal} style={{ width: '36vw' }}
                    onHide={() => this.closeDialog()} modal>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="p-field">
                            <label htmlFor="fullname"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Full Name</label>
                            <InputText id="fullname" type="text"
                                value={fullname} name="fullname" required
                                className={(isError.fullname.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }}
                            />
                            {isError.fullname.length > 0 && (
                                <small id="line1-help" className="p-error p-d-block">{isError.fullname}</small>
                            )}
                        </div>
                        <div className="p-field">
                            <label htmlFor="address" className="p-d-block"><span style={{ color: formInvalid ? 'red' : '' }}>* </span>Address</label>
                            <InputText id="address" value={line1} name="line1" required
                                placeholder="Street Address"
                                className={(isError.line1.length > 0 || formInvalid) ? "p-invalid p-inputtext-sm p-d-block" : "p-inputtext-sm p-d-block"}
                                onChange={this.handleChange} style={{ width: '32vw' }} />
                            {isError.line1.length > 0 && (
                                <small id="email-help" className="p-error p-d-block">{isError.line1}</small>
                            )}
                            <InputText value={line2} name="line2"
                                className={"p-inputtext-sm p-d-block p-mt-3"}
                                placeholder="Apt, Suite, Building, Unit, etc"
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
                    </div>
                    {isNotEmpty(errorMsg) &&
                        <h5 className="p-error p-d-block">{errorMsg}</h5>
                    }
                    {addressErrorMsg.length !==0 && addressErrorMsg.map((error)=>(
                         <h5 className="p-error p-d-block">{error.summary}</h5>
                    ))}
                    <OneButton
                        onClick={this.validateUserAddress}
                        buttonLabel={(newAddress) ? "Add address" : "Update Address"}
                        btnShape="round"
                        btnSize="large"
                        buttonStyle={{ fontSize: 16, marginTop: 16 }}
                    />
                </Dialog>
                <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>
                {loading && <AppSpinner />}
            </Fragment>
        )
    }



}

export default Locations;