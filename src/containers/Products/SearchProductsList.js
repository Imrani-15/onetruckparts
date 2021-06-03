import React, { Fragment } from 'react';

import { message, Pagination, Empty } from 'antd';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import serviceCall from '../../utils/Services';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';
import {isNotEmpty, showToastMessage} from '../../utils/Utils';
import { connect } from "react-redux";


import ProductCard from '../../components/ProductCard/ProductCard';
import AppSpinner from '../../components/AppSpinner';

import './ProductList.css';

class SearchProductsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 30,
            totalProducts:0,
            productsList: [],
            displayItems: [15, 30, 45],
            showLoader:true,
            cartLoader:false,
            fromBrands: false,
            categories:[],
            selectedCat:false,
            selectedCategory:{}
        }
        this.toastRef = React.createRef();
        this.updateCategory = true
    }

    componentWillMount() {
        this.getProductsList();
        this.getCategory();
        this.updateCategory = true;
        let brand = new URLSearchParams(this.props.location.search).get("brands");
        let checkBrand = isNotEmpty(brand) ? brand : false;
        this.setState({fromBrands:checkBrand})
    }


    componentDidUpdate(prevProps){
        if(prevProps.match.params.val.replace(":", "") !== this.props.match.params.val.replace(":", "")){
            this.setState({showLoader:true,pageNum:1})
            this.getProductsList();
            
        }
        if(prevProps.getCategories.length === this.props.getCategories.length && this.updateCategory){
            this.getCategory();
        }
    }

    getCategory=()=>{
        let allcat = this.props.getCategories.map((item)=>{
                item.selected = false;
            return item
        })
        this.updateCategory = false
        this.setState({categories:allcat})
    }

    getProductsList = () => {
        const { pageNum, pageSize, fromBrands, selectedCat, selectedCategory } = this.state;
        let search =  this.props.match.params.val.replace(":", "");
        let restUrl =   encodeURI(`${PRODUCT_BASE_URL}globalsearch/${search}?page=${pageNum}&limit=${pageSize}`) ;
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ productsList: res.data.data, totalProducts: res.data.total, showLoader:false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getAllProductsBrand(){
        this.setState({showLoader:true,pageNum:1,selectedCat:false,selectedCategory:{}},()=>{
            this.getProductsList();
            this.getCategory();
        })
        
    }

    
    getProductsByBrandCat(cat){
        let categories = this.state.categories.map((item)=>{
            if(item._id === cat._id){
                item.selected = true
            }else{
                item.selected = false
            }
        
        return item
        })
        this.setState({categories:categories,selectedCat:true,selectedCategory:cat,pageNum:1,showLoader:true},()=>{
            this.getProductsList();
        })
        
    }




    displayItems = (item) => {
        this.setState({ pageSize: item,showLoader:true }, () => {
            this.getProductsList();
        })
    }

    paginationBtn = (type) =>{
        this.setState({pageNum: (type === 'ADD')?  this.state.pageNum+1 : this.state.pageNum-1,showLoader:true},()=>{
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }

    paginationBtn1 =(page, pageSize) => {
        this.setState({pageNum: page, pageSize:pageSize, showLoader:true},()=>{
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }


    openProductDetail=(selectedProduct)=>{
       this.props.history.push('/productdetails/osku:'+ selectedProduct.osku)
    }

    addToCart=(product)=>{
        this.setState({cartLoader:true},()=>{
            let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/1`
                serviceCall({}, restUrl, 'GET')
                    .then((res) => {
                        if (!res.error) {
                            showToastMessage(this.toastRef,'success', '', `Product "${product.title}" added to cart`);
                            this.setState({cartLoader:false})
                            console.log("updateCartCount", res)
                            this.props.setUserData({ cartcount: res.data.cart.length, orderTotal: res.data.ordertotal });
                        } else {
                            this.setState({cartLoader:false})
                        }
                    })
                    .catch((error) => {
                        this.setState({cartLoader:false})
                    })
        })  
    }

    saveLater=(product)=>{
        if(this.props.loginData && this.props.loginData.emailId){
            let restUrl = `${PRODUCT_BASE_URL}account/saveforlater`;
            let inpobj = {
                "emailId": this.props.loginData.emailId,
                "osku": product.osku
            }
            serviceCall(inpobj, restUrl, 'POST')
                .then((res) => {
                    if (!res.error) {
                        message.success(`Product "${product.title}" added as save for later`);
                        this.setState({cartLoader:false})
                    } else {
                        this.setState({cartLoader:false})
                    }
                })
                .catch((error) => {
                    this.setState({cartLoader:false})
                })
        }else{
            showToastMessage(this.toastRef,'error', 'Error Message', `Please login to save for later`);
        }
        

    }



    render() {
        const { pageSize, pageNum, displayItems, productsList, totalProducts, showLoader, 
            cartLoader, fromBrands, categories, selectedCat } = this.state;
        return (
            <Fragment>
                 <Toast ref={this.toastRef} />
                {showLoader ?
                <div style={{height:350}}>
                       <AppSpinner />
                </div> :
                <div className="p-grid maindiv" >
                    <div className="p-col-2 p-mt-6">
                        {fromBrands &&
                            <div className="p-shadow-1">
                                <div className='subcat-list-item'>
                                <h2 style={{padding:10,textAlign:'center',fontWeight:600,color:appTheme.logoTextColor}}>
                                    Categories
                                </h2>
                                </div>
                                <div className='subcat-list-item' onClick={this.getAllProductsBrand.bind(this)}>
                                         <h4 style={{padding:6,textAlign:'center',color:(selectedCat) ?appTheme.dark2 :  appTheme.logoTextColor}}>
                                             All
                                         </h4>
                                     </div>
                                {categories.map((cat)=>(
                                      <div className='subcat-list-item' onClick={this.getProductsByBrandCat.bind(this,cat)}
                                      >
                                         <h4 style={{padding:6,textAlign:'center',color:(cat.selected) ? appTheme.logoTextColor : appTheme.dark2}}>
                                             {cat.display_name}
                                         </h4>
                                     </div>
                                ))}
                            </div>
                        }

                    </div>
                    <div className="p-col-10">
                        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                fontSize: 14,
                                fontWeight: '500',
                                marginRight: 10
                            }}>
                                Display Items :
                        </div>
                            <span className="p-buttonset">
                                {displayItems.map((item) => (
                                    <Button label={item}
                                        className="p-button-outlined p-button-secondary"
                                        style={{
                                            backgroundColor: (pageSize === item) ? appTheme.dark1 : '',
                                            color: (pageSize === item) ? '#fff' : '',
                                            border: (pageSize === item) ? "1px solid black" : ''
                                        }}
                                        onClick={() => this.displayItems(item)}
                                    />
                                ))}
                            </span>
                        </div> */}
                        <Divider />
                        {productsList.length !==0  ?
                        <div  style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                            {productsList.map((product) => (
                                <ProductCard
                                    product={product}
                                    openProductDetail={this.openProductDetail.bind(this)}
                                    addToCart={this.addToCart.bind(this)}
                                    saveLater={this.saveLater.bind(this)}
                                />
                            )
                            )}
                        </div> : 
                        <div><Empty /></div>}
                        <Divider />
                        <div style={{
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'center', alignItems: 'center',
                            marginTop: 20,
                            }}>
                                     <Pagination
                            total={totalProducts}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            defaultPageSize={pageSize}
                            pageSizeOptions={displayItems}
                            defaultCurrent={pageNum}
                            onChange={(page,pageSize)=> this.paginationBtn1(page,pageSize)}
                            />
                            {/* <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 14, paddingRight: 14, paddingTop: 4, paddingBottom: 4 }}>
                                <span style={{ color: 'var(--text-color)', userSelect: 'none', textAlign: 'center', alignSelf: 'center' }}>
                                    Showing {pageNum} - {pageSize}
                                </span>
                                <span className="p-buttonset p-ml-4">
                                    <Button icon="pi pi-angle-left"
                                        className="p-button-outlined p-button-secondary"
                                        disabled={pageNum === 1}
                                        onClick={() => this.paginationBtn('SUB')} />
                                    <Button icon="pi pi-angle-right" 
                                        className="p-button-outlined p-button-secondary" 
                                        onClick={() => this.paginationBtn('ADD')} />
                                </span>
                            </div> */}

                        </div>
                    </div>
                </div> }
                {cartLoader && <AppSpinner />}
            </Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
        userdata: state.userData,
        loginData: state.userLoginData,
        getCategories:state.getCategories
    }
 }
 function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj =>{
            dispatch({ type: "SET_APP_DATA", data: obj });
          }
    }
 }
 
export default connect(mapStateToProps, mapDispatchToProps)(SearchProductsList);
