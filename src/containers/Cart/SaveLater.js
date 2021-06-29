import React, { Fragment } from 'react';

import { connect } from "react-redux";
import { Row, Col } from 'antd';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import AppSpinner from '../../components/AppSpinner';
import emptyWishlist from '../../assets/empty-wishlist.png';
import OneButton from '../../components/OneButton';
import serviceCall from '../../utils/Services';
import ReactSnackBar from "../../components/ReactSnackBar";
import { updateProductToCart } from '../../utils/commonService';
import { PRODUCT_BASE_URL, appTheme } from '../../utils/Constants';

import './CartPage.css';

class SaveLater extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            saveLaterList: [],
            showLoader: true,
            Show: false,
            Showing: false,
            toastMsg: ''
        }
        this.toastRef = React.createRef();
    }

    componentWillMount() {
        this.getSaveLaterProducts();
    }

    getSaveLaterProducts = () => {
        let emailId = this.props.loginData.emailId
        let restUrl = `${PRODUCT_BASE_URL}account/saveforlater/${emailId}`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ saveLaterList: res.data.savedProducts, showLoader: false })
                } else {

                }
            })
            .catch((error) => {
            })
    }



    addProductToCart(product) {
        this.setState({ showLoader: true }, () => {
            updateProductToCart(product, 1).then((res) => {
                if (!res.data.error) {
                    this.setState({ showLoader: false, toastMsg: 'Product added to the cart.' }, () => {
                        this.showToast();
                    })
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ showLoader: false, toastMsg: res.data.message }, () => {
                        this.showToast();
                    })
                }
            })
        })
    }

    showToast = () => {
        if (this.state.Showing) return;
        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false, toastMsg: '' });
        }, 2000);
    };




    deleteProductFromWishlist(rowData) {
        this.setState({ showLoader: true }, () => {

            let inpobj = {
                "emailId": this.props.loginData.emailId,
                "osku": rowData.osku
            }
            let restUrl = `${PRODUCT_BASE_URL}account/removesaveforlater`;
            serviceCall(inpobj, restUrl, 'POST')
                .then((res) => {
                    if (!res.error) {
                        this.setState({ showLoader: false, toastMsg: 'Product removed from wishlist.' }, () => {
                            this.showToast();
                        })
                        this.getSaveLaterProducts()
                    } else {
                        this.setState({ showLoader: false })
                    }
                })
                .catch((error) => {
                    this.setState({ showLoader: false })
                })
        })
    }

    render() {
        const { saveLaterList, toastMsg, showLoader } = this.state;

        return (
            <Fragment>
                <div className="checkout-main">
                    <Row className="checkout-submain">
                        <Col xs={24} md={24} lg={18} className="p-shadow-1 p-p-4" >
                            <h2>My Wishlist</h2>
                            <Divider />
                            {saveLaterList.length === 0 ?
                                <div>
                                    <div style={{ display: 'grid', justifyContent: 'center' }}>
                                        <img src={emptyWishlist} alt="emptyWishlist" style={{ height: 140, alignSelf: 'center' }} />
                                        <h3 style={{ textAlign: 'center', color: appTheme.logoTextColor, fontWeight: '800', marginTop: 12 }}>
                                            No Items in wishlist.
                                        </h3>
                                    </div>
                                </div> :
                                <div>
                                    {saveLaterList.map((product) => (
                                        <Row className="p-pb-3 p-pt-2 border-bottom" align="middle">
                                            <Col xs={7} md={4} lg={4} className="col-align-center p-p-lg-3">
                                                <img src={`${product.image}`}
                                                    onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                    alt={product.image} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                            </Col>
                                            <Col xs={1} md={1} lg={1}></Col>
                                            <Col xs={16} md={11} lg={11} >
                                                <h2 style={{ color: appTheme.secondaryColor, fontWeight: 'bold'}}>{product.title}</h2>
                                                <h3 style={{ color: appTheme.logoTextColor }}>$ {product.price}</h3>
                                            </Col>
                                            <Col xs={0} md={1} lg={1}></Col>
                                            <Col xs={12} md={4} lg={4} className="col-align-center">
                                                    <OneButton
                                                    onClick={() => this.addProductToCart(product)}
                                                    buttonLabel={"Add to cart"}
                                                    btnSize="small"
                                                    btnBlock={false}
                                                    buttonStyle={{ height: 36, width:'90%' }}
                                                />
                                            </Col>
                                            <Col xs={12} md={3} lg={3} className="col-align-center">
                                                <Button label="Remove"
                                                    onClick={() => this.deleteProductFromWishlist(product)}
                                                    className="p-button-danger p-button-text" />
                                            </Col>

                                        </Row>
                                    ))}
                                </div>
                            }
                        </Col>
                    </Row>
                </div>
                <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>
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
export default connect(mapStateToProps, mapDispatchToProps)(SaveLater);

