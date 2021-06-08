import React, { Fragment } from 'react';

import {connect} from "react-redux";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import OneButton from '../../components/OneButton';
import {showToastMessage} from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL , cartProducts} from '../../utils/Constants';

import  ImageComponent from '../../components/ImageComponent';

import './CartPage.css';

class SaveLater extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            saveLaterList:[],
            loader:true
        }
        this.toastRef = React.createRef();
    }

    componentWillMount(){
        this.getSaveLaterProducts();
    }

    getSaveLaterProducts = () => {
        let emailId = this.props.loginData.emailId
        let restUrl = `${PRODUCT_BASE_URL}account/saveforlater/${emailId}`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) { 
                    this.setState({ saveLaterList: res.data.savedProducts, loader:false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

 

    addProductToCart(product){
        this.setState({loader:true},()=>{
            let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/1` ;
                serviceCall({}, restUrl, 'GET')
                    .then((res) => {
                        if (!res.error) {
                            showToastMessage(this.toastRef,'success', '',`Product "${product.title}" added to cart` );
                            this.setState({loader:false})
                        } else {
                            this.setState({loader:false})
                        }
                    })
                    .catch((error) => {
                        this.setState({loader:false})
                    })
        })
    }




    deleteProductFromWishlist(rowData){
        this.setState({loader:true},()=>{
      
        let inpobj = {
            "emailId": this.props.loginData.emailId,
            "osku": rowData.osku
        }
        let restUrl = `${PRODUCT_BASE_URL}account/removesaveforlater`;
        serviceCall(inpobj, restUrl, 'POST')
            .then((res) => {
                if (!res.error) {
                    showToastMessage(this.toastRef,'error', '', `Product "${rowData.title}" removed from wishlist`);
                    this.setState({saveLaterList: res.data.savedProducts, loader:false});
                } else {
                    this.setState({loader:false})
                }
            })
            .catch((error) => {
                this.setState({loader:false})
            })
        })
    }


    render(){
        const {saveLaterList,orderTotal, loader} = this.state;
        const imageBodyTemplate = (rowData) => {
            return <img src={`${rowData.image}`} 
                    onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                    alt={rowData.image} style={{height:80}} />;
        }
        return(
                <Fragment>
                     <Toast ref={this.toastRef} />
                     <div style={{ padding: 10,margin:'4%' }}>

                        <div className="p-grid p-mt-4">
                        <div className="p-col-1"></div>
                            <div className="p-col-8">
                            <div style={{ fontSize: 34, fontWeight: '600',marginBottom:22 }}>
                             My Wishlist
                             </div>
                            <DataTable 
                                emptyMessage="No Items in wishlist."
                                loading={loader}
                                value={saveLaterList}>
                                <Column header="Image" 
                                        body={imageBodyTemplate} 
                                            />
                                <Column field="title" header="Product" />
                                <Column field="price" header="Price" />
                                <Column header="" 
                                    body={(rowData)=> 
                                    <OneButton 
                                        onClick={()=>this.addProductToCart(rowData)}
                                        buttonLabel={"Add to cart"}
                                        btnSize="small"
                                        btnBlock={false}
                                        buttonStyle={{height:32}}
                                        /> }
                                />
                                <Column header=""
                                    body={(rowData)=>
                                        <Button label="Remove" 
                                        onClick={()=>this.deleteProductFromWishlist(rowData)}
                                        className="p-button-danger p-button-text p-button-sm" />
                                    }
                                />
                            </DataTable>
                            </div>
                            <div className="p-col-1"></div>

                        </div>
                     </div>
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
export default connect(mapStateToProps,mapDispatchToProps)(SaveLater);

