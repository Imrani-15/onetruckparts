import React, { Fragment } from 'react';

import {connect} from "react-redux";

import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import emptyCart from '../../assets/emptycart.jpg';
import OneButton from '../../components/OneButton';
import {showToastMessage} from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL , cartProducts} from '../../utils/Constants';

import  ImageComponent from '../../components/ImageComponent';

import './CartPage.css';

class CartPage extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            cartList:[],
            orderTotal:0,
            cartLoader:true
        }
        this.toastRef = React.createRef();
    }

    componentWillMount(){
        this.getCartProducts();
    }

    getCartProducts = () => {
        let restUrl = `${PRODUCT_BASE_URL}cart`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.props.setUserData({cartcount:res.data.cart.length,orderTotal:res.data.ordertotal})
                    this.setState({ cartList: res.data.cart, orderTotal: res.data.ordertotal, cartLoader:false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

 

    updateProductFromCart(product,type){
        this.setState({cartLoader:true},()=>{
            let restUrl = (type === 'ADD') ? `${PRODUCT_BASE_URL}cart/add/${product.osku}/${parseInt(product.quantity)+1}` : `${PRODUCT_BASE_URL}cart/remove/${product.osku}`;
                serviceCall({}, restUrl, 'GET')
                    .then((res) => {
                        if (!res.data.error) {
                            showToastMessage(this.toastRef,'success', '', (type === 'ADD') ? `Product "${product.title}" added to cart` : `Product "${product.title}" removed from cart` );
                            this.setState({cartLoader:false})
                            this.getCartProducts();
                        } else {
                            showToastMessage(this.toastRef,'error', '', res.data.message );
                            this.setState({cartLoader:false})
                        }
                    })
                    .catch((error) => {
                        this.setState({cartLoader:false})
                    })
        })
    }




    deleteProductFromCart(rowData,row){
        this.setState({cartLoader:true},()=>{
        let restUrl = `${PRODUCT_BASE_URL}cart/delete/${row.rowIndex}`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    showToastMessage(this.toastRef,'error', '', `Product "${rowData.title}" deleted from cart`);
                    this.setState({cartList: res.data.cart, orderTotal: res.data.ordertotal,cartLoader:false});
                    this.props.setUserData({cartcount:res.data.cart.length,orderTotal:res.data.ordertotal})
                } else {
                    this.setState({cartLoader:false})
                }
            })
            .catch((error) => {
                this.setState({cartLoader:false})
            })
        })
    }


    render(){
        const {cartList,orderTotal, cartLoader} = this.state;
        const imageBodyTemplate = (rowData) => {
            return <img src={`${rowData.image}`} 
                    onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'} 
                    alt={rowData.image} style={{height:80}} />;
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
                                <Column field="category" header="Category" />
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
                                        $ {orderTotal.toFixed(2)}
                                    </div>
                                </div>
                                <Divider />
                                <div className="cartdetailsAlign">
                                    <div className="totalText">
                                        Total
                                    </div>
                                    <div className="totalText">
                                        $ {orderTotal.toFixed(2)}
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
                </Fragment>
        )
    }

}


function mapStateToProps(state) {
    return {
       
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

