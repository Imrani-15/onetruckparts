import React, { Fragment } from 'react';

import { connect } from "react-redux";
import { Row, Col } from 'antd';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';

import AppSpinner from '../../components/AppSpinner';
import ReactSnackBar from "../../components/ReactSnackBar";
import emptyCart from '../../assets/emptycart.jpg';
import OneButton from '../../components/OneButton';
import { updateProductToCart } from '../../utils/commonService';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';

import './CartPage.css';

class CartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            orderTotal: 0,
            cartCount: 0,
            cartLoader: true,
            Show: false,
            Showing: false,
            toastMsg: ''
        }
        this.toastRef = React.createRef();
    }

    componentWillMount() {
        this.setCartProducts();
    }

    setCartProducts() {
        if (this.props.loginData && this.props.loginData.accessToken) {
            this.getCartProducts();
        } else {
            let guestCart = userProfile.getCart();
            let guestCartDetails = userProfile.getcartDetails();
            this.setState({
                cartList: guestCart && guestCart.length !== 0 ? guestCart : [], cartLoader: false,
                orderTotal: guestCartDetails && guestCartDetails.orderTotal ? guestCartDetails.orderTotal : 0,
                cartCount: guestCartDetails && guestCartDetails.cartcount ? guestCartDetails.cartcount : 0
            })
        }
    }

    getCartProducts = () => {
        let restUrl = `${PRODUCT_BASE_URL}cart`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal })
                    this.setState({ cartList: res.data.cart, cartCount: res.data.cartcount, orderTotal: res.data.ordertotal, cartLoader: false })
                } else {

                }
            })
            .catch((error) => {
            })
    }



    updateProductFromCart(product, type) {
        this.setState({ cartLoader: true }, () => {
            let quantity = (type === 'ADD') ? parseInt(product.quantity) + 1 : parseInt(product.quantity) - 1;
            let toastMsg = (type === 'ADD') ? `Product added to the cart.` : `Product removed from the cart.`;
            updateProductToCart(product, quantity, type).then((res) => {
                if (!res.data.error) {
                    this.setState({ cartLoader: false, toastMsg: toastMsg }, () => {
                        this.showToast();
                    })
                    this.setCartProducts();
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ cartLoader: false, toastMsg: res.data.message }, () => {
                        this.showToast();
                    })
                }
            })
        })
    }




    deleteProductFromCart(product) {
        this.setState({ cartLoader: true }, () => {
            updateProductToCart(product, 0).then((res) => {
                if (!res.data.error) {
                    this.setState({ cartLoader: false, toastMsg: 'Product removed from the cart.' }, () => {
                        this.showToast();
                    })
                    this.setCartProducts();
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ cartLoader: false, toastMsg: res.data.message }, () => {
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




    render() {
        const { cartList, cartCount, orderTotal, cartLoader, toastMsg } = this.state;

        return (
            <Fragment>
                <div className="checkout-main">
                    <Row className="checkout-submain">
                        <Col xs={24} md={24} lg={18} className="p-shadow-1 p-p-4" >
                            <h2>Shopping Cart</h2>
                            <Divider />
                            {cartList.length === 0 ?
                                <div>
                                    <div style={{ display: 'grid', justifyContent: 'center' }}>
                                        <img src={emptyCart} alt="cartEmpty" style={{ height: 160, alignSelf: 'center' }} />
                                        <h3 style={{ textAlign: 'center', color: appTheme.logoTextColor, fontWeight: '800', }}>No Items in cart</h3>
                                    </div>
                                </div> :
                                <div>
                                    {cartList.map((cart) => (
                                        <Row className="p-pb-3 p-pt-2 border-bottom" align="middle">
                                            <Col xs={7} md={4} lg={4} className="col-align-center p-p-lg-3">
                                                <img src={`${cart.image}`}
                                                    onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                    alt={cart.image} style={{ height: '100%', width: '100%', objectFit: 'contain' }} />
                                            </Col>
                                            <Col xs={1} md={1} lg={1}></Col>
                                            <Col xs={16} md={11} lg={11} >
                                                <h3 style={{ color: appTheme.secondaryColor, fontWeight: 'bold', margin: 0 }}>{cart.title}</h3>
                                                <h4 style={{ color: appTheme.secondaryColor }}>$ {cart.price}</h4>
                                                <h4 style={{ color: appTheme.logoTextColor }}>Sub Total : $ {cart.total ? cart.total : 0}</h4>
                                            </Col>
                                            <Col xs={0} md={1} lg={1}></Col>
                                            <Col xs={12} md={4} lg={4} className="col-align-center">
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                                                    <Button icon="pi pi-minus"
                                                        onClick={() => this.updateProductFromCart(cart, 'SUB')}
                                                        className="p-button-outlined p-button-sm p-button-secondary" />
                                                    <div style={{ width: '26%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 16 }}>{cart.quantity}</div>
                                                    <Button icon="pi pi-plus"
                                                        onClick={() => this.updateProductFromCart(cart, 'ADD')}
                                                        className="p-button-outlined p-button-sm p-button-secondary" />
                                                </div>
                                            </Col>
                                            <Col xs={12} md={3} lg={3} className="col-align-center">
                                                <Button label="Remove"
                                                    onClick={() => this.deleteProductFromCart(cart)}
                                                    className="p-button-danger p-button-text" />
                                            </Col>

                                        </Row>
                                    ))}

                                </div>}
                        </Col>
                        <Col xs={24} md={24} lg={1} ></Col>
                        <Col xs={24} md={24} lg={5}>
                            <div className="p-shadow-1 p-p-3  p-mb-3">
                                <h2>Cart Details</h2>
                                <Divider />
                                <div className="cartdetails-spacebetween">
                                    <h3>Items:</h3>
                                    <h3>{cartCount}</h3>
                                </div>
                                <div className="cartdetails-spacebetween">
                                    <h3>Sub Total:</h3>
                                    <h3>${orderTotal}</h3>
                                </div>
                                <Divider />
                                <div className="cartdetails-spacebetween">
                                    <h2>Total:</h2>
                                    <h2>${orderTotal}</h2>
                                </div>
                                <OneButton 
                                    onClick={()=> this.props.history.push("/checkout")}
                                    buttonLabel={"Proceed to checkout"}
                                    btnShape="round"
                                    btnSize="large"
                                    buttonStyle={{fontSize:16,marginTop:16,color:'#fff'}}
                                    btnDisabled={cartList.length ===0}
                                /> 
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>
                {cartLoader && <AppSpinner />}
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
export default connect(mapStateToProps, mapDispatchToProps)(CartPage);

