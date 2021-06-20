import React, { Fragment } from 'react';

import {connect} from "react-redux";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import OneButton from '../../components/OneButton';
import {showToastMessage} from '../../utils/Utils';
import serviceCall from '../../utils/Services';
import ReactSnackBar from "../../components/ReactSnackBar";
import {updateProductToCart} from '../../utils/commonService';
import { PRODUCT_BASE_URL } from '../../utils/Constants';

import './CartPage.css';

class SaveLater extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            saveLaterList:[],
            loader:true,
            Show: false,
            Showing: false,
            toastMsg:''
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
            updateProductToCart(product,1).then((res)=>{
                if (!res.data.error) {
                    this.setState({ loader: false, toastMsg:'Product added to the cart.' },()=>{
                        this.showToast();
                    })
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ loader: false, toastMsg:res.data.message },()=>{
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
                    this.setState({ loader: false, toastMsg:'Product removed from wishlist.' },()=>{
                        this.showToast();
                    })
                    this.getSaveLaterProducts()
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
        const {saveLaterList,toastMsg, loader} = this.state;
        const imageBodyTemplate = (rowData) => {
            return <img src={`${rowData.image}`} 
                    onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} 
                    alt={rowData.image} style={{height:90,width:90, objectFit:'contain'}} />;
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
export default connect(mapStateToProps,mapDispatchToProps)(SaveLater);

