import React, { Fragment } from 'react';

import { message, Pagination, Empty } from 'antd';
import { Divider } from 'primereact/divider';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import serviceCall from '../../utils/Services';

import { updateProductToCart, productSaveLater } from '../../utils/commonService';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';
import {isNotEmpty, showToastMessage} from '../../utils/Utils';
import { connect } from "react-redux";


import ReactSnackBar from "../../components/ReactSnackBar";
import ProductCard from '../../components/ProductCard/ProductCard';
import AppSpinner from '../../components/AppSpinner';

import './ProductList.css';

class SearchProductsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationFirst: 0,
            pageNum: 0,
            pageSize: 30,
            totalProducts:0,
            productsList: [],
            displayItems: [30, 45, 60, 75, 90],
            showLoader:true,
            cartLoader:false,
            categories:[],
            selectedCat:false,
            selectedCategory:{},
            Show: false,
            Showing: false,
            toastMsg: '',
            fitment:''
        }
        this.toastRef = React.createRef();
        this.updateCategory = true
    }

    componentWillMount() {
        this.getCategory();
        this.updateCategory = true;
        let fitment = new URLSearchParams(this.props.location.search).get("fitment");
        this.setState({fitment: isNotEmpty(fitment) ? fitment : ""},()=>{
            this.getProductsList();
        })
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
        const { pageNum, pageSize, fitment } = this.state;
        let search =  this.props.match.params.val.replace(":", "");
        let restUrl =   encodeURI(`${PRODUCT_BASE_URL}globalsearch/${search}?page=${pageNum}&fitment=${fitment}&limit=${pageSize}`) ;
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


    onChangePagination = (pageNum, paginationFirst, pageSize) => {
        this.setState({ pageNum: pageNum, paginationFirst: paginationFirst, pageSize: pageSize, showLoader: true }, () => {
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }


    openProductDetail=(selectedProduct)=>{
       this.props.history.push('/productdetails/osku:'+ selectedProduct.osku)
    }

    addToCart=(product)=>{
        this.setState({cartLoader:true},()=>{
            updateProductToCart(product, 1).then((res) => {
                if (!res.data.error) {
                    this.setState({ cartLoader: false, toastMsg: `Product  added to the cart.` }, () => {
                        this.showToast();
                    })
                    this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                } else {
                    this.setState({ cartLoader: false })
                }
            }).catch((error) => {
                this.setState({ cartLoader: false })
            })
        })  
    }

    saveLater=(product)=>{
        if (this.props.loginData && this.props.loginData.emailId) {
            productSaveLater(this.props.loginData.emailId, product).then((res) => {
                if (!res.error) {
                    this.setState({ cartLoader: false, toastMsg: `Product  added to wishlist` }, () => {
                        this.showToast();
                    })
                } else {
                    this.setState({ cartLoader: false })
                }
            }).catch((error) => {
                this.setState({ cartLoader: false })
            })      
        } else {
            this.setState({ cartLoader: false, toastMsg: `Please login to add to wishlist` }, () => {
                this.showToast();
            })
        }
        
    }

    showToast = () => {
        if (this.state.Showing) return;
        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false, toastMsg: '' });
        }, 2000);
    };



    render() {
        const { pageSize, displayItems, productsList, totalProducts, showLoader, 
            cartLoader, toastMsg,paginationFirst } = this.state;

            const pageTemplate = {
                layout: 'CurrentPageReport FirstPageLink  PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown',
                'CurrentPageReport': (options) => {
                    return (
                        <span style={{ color: appTheme.primaryColor, userSelect: 'none', width: '160px', textAlign: 'center' }}>
                            {options.first} - {options.last} of {options.totalRecords}
                        </span>
                    )
                }
            };
        return (
            <Fragment>
                 <Toast ref={this.toastRef} />
                {showLoader ?
                <div style={{height:350}}>
                       <AppSpinner />
                </div> :
                <div className="p-grid maindiv" >
                    <div className="p-col-2 p-mt-6">


                    </div>
                    <div className="p-col-10">
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
                                  <Paginator
                                    first={paginationFirst}
                                    rows={pageSize}
                                    totalRecords={totalProducts}
                                    rowsPerPageOptions={displayItems}
                                    template={pageTemplate}
                                    onPageChange={(e) => this.onChangePagination(e.page, e.first, e.rows)}></Paginator>

                        </div>
                    </div>
                </div> }
                {cartLoader && <AppSpinner />}
                <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>
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
