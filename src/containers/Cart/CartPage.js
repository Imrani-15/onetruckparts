import React, { Fragment } from 'react';

import {connect} from "react-redux";

import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import ReactSnackBar from "../../components/ReactSnackBar";
import emptyCart from '../../assets/emptycart.jpg';
import OneButton from '../../components/OneButton';
import {updateProductToCart} from '../../utils/commonService';
import userProfile from '../../utils/UserProfile';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';

import './CartPage.css';

class CartPage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            cartList:[],
            orderTotal:0,
            cartLoader:true,
            Show: false,
            Showing: false,
            toastMsg:''
        }
        this.toastRef = React.createRef();
    }

    componentWillMount(){
        this.setCartProducts();
    }

    setCartProducts(){
        if(this.props.loginData && this.props.loginData.accessToken){
            this.getCartProducts();
        }else{
            let guestCart = userProfile.getCart();
            let guestCartDetails = userProfile.getcartDetails();
            this.setState({cartList:guestCart && guestCart.length!==0 ? guestCart : [],cartLoader:false,orderTotal:guestCartDetails && guestCartDetails.orderTotal ? guestCartDetails.orderTotal : 0})
        }
    }

    getCartProducts = () => {
        let restUrl = `${PRODUCT_BASE_URL}cart`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.props.setUserData({cartcount:res.data.cartcount,orderTotal:res.data.ordertotal})
                    this.setState({ cartList: res.data.cart, orderTotal: res.data.ordertotal, cartLoader:false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

 

    updateProductFromCart(product,type){
        this.setState({cartLoader:true},()=>{
                let quantity = (type === 'ADD') ? parseInt(product.quantity)+1 : parseInt(product.quantity)-1;
                let toastMsg = (type === 'ADD') ? `Product added to the cart.` : `Product removed from the cart.`;
                updateProductToCart(product,quantity, type).then((res)=>{
                        if (!res.data.error) {
                            this.setState({ cartLoader: false, toastMsg:toastMsg },()=>{
                                this.showToast();
                            })
                            this.setCartProducts();
                            this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                        } else {
                            this.setState({ cartLoader: false, toastMsg:res.data.message },()=>{
                                this.showToast();
                            })
                        }
                    })
        })
    }




    deleteProductFromCart(product){
        this.setState({cartLoader:true},()=>{
            updateProductToCart(product,0).then((res)=>{
                if (!res.data.error) {
                    this.setState({ cartLoader: false, toastMsg:'Product removed from the cart.' },()=>{
                        this.showToast();
                    })
                    this.setCartProducts();
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ cartLoader: false, toastMsg:res.data.message },()=>{
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
            this.setState({ Show: false, Showing: false, toastMsg:'' });
        }, 2000);
    };



    render(){
        const {cartList,orderTotal, cartLoader,toastMsg} = this.state;
        const imageBodyTemplate = (rowData) => {
            return <img src={`${rowData.image}`} 
                    onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'} 
                    alt={rowData.image} style={{height:90,width:90, objectFit:'contain'}} />;
        }
        return(
                <Fragment>
                     <Toast ref={this.toastRef} />
                     <div style={{ padding: 10,margin:'4%' }}>
                        <div style={{ fontSize: 34, fontWeight: '600' }}>
                            Shopping Cart
                        </div>
                        <div className="p-grid p-mt-4">
                            <div className="p-col-8">
                            <DataTable 
                                emptyMessage={
                                    <div style={{display:'grid', justifyContent:'center'}}>
                                        <img src={emptyCart} alt="cartEmpty" style={{height:160,alignSelf:'center'}} />
                                        <h3 style={{textAlign:'center', color:appTheme.logoTextColor,fontWeight: '800',}}>No Items in cart</h3>
                                    </div>
                                }
                                loading={cartLoader}
                                value={cartList}>
                                <Column header="Image" 
                                        body={imageBodyTemplate} 
                                            />
                                <Column field="title" header="Product" />
                                <Column field="price" header="Price" />
                                <Column header="Quantity" 
                                    body={(rowData)=><div style={{ display:'flex', flexDirection:'row'}}>
                                                  <Button icon="pi pi-minus" 
                                                     onClick={()=>this.updateProductFromCart(rowData,'SUB')}
                                                     className="p-button-outlined p-button-sm p-button-secondary" />
                                                  <div style={{width:'26%',display:'flex',justifyContent:'center',alignItems:'center',fontSize:16}}>{rowData.quantity}</div>
                                                  <Button icon="pi pi-plus" 
                                                    onClick={()=>this.updateProductFromCart(rowData,'ADD')}
                                                    className="p-button-outlined p-button-sm p-button-secondary" />
                                        </div>}
                                />
                                <Column header=""
                                    body={(rowData,row)=>
                                        <Button label="Remove" 
                                        onClick={()=>this.deleteProductFromCart(rowData,row)}
                                        className="p-button-danger p-button-text p-button-sm" />
                                    }
                                />
                            </DataTable>
                            </div>
                            <div className="p-col-1"></div>
                            <div className="p-col-3 p-shadow-3" style={{height:360,padding: 26}}>
                                <div style={{ fontSize: 24, fontWeight: '600' }}>
                                   Order Summary
                                 </div>
                                <Divider />
                                <div className="cartdetailsAlign">
                                    <div className="cartdetailsText">
                                        Sub Total
                                    </div>
                                    <div className="cartdetailsText">
                                        $ {orderTotal}
                                    </div>
                                </div>
                                <Divider />
                                <div className="cartdetailsAlign">
                                    <div className="totalText">
                                        Total
                                    </div>
                                    <div className="totalText">
                                        $ {orderTotal}
                                    </div>
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

                        </div>
                     </div>
                     <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>
                </Fragment>
        )
    }

}


function mapStateToProps(state) {
    return {
        loginData: state.userLoginData,
    }
}
function mapDispatchToProps(dispatch){
    return {
        setUserData: obj =>{
            dispatch({ type: "SET_APP_DATA", data: obj });
          }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CartPage);

