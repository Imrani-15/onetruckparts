import React, { Fragment } from 'react';

//import { Empty } from 'antd';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import serviceCall from '../utils/Services';
import { appTheme, PRODUCT_BASE_URL } from '../utils/Constants';
import {showToastMessage} from '../utils/Utils';
import { connect } from "react-redux";

import './styles/ProductList.css';
import ProductCard from '../components/ProductCard/ProductCard';
import AppSpinner from '../components/AppSpinner';

class ProductsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 15,
            productsList: [],
            displayItems: [15, 30, 45],
            showLoader:true,
            cartLoader:false,
            fromBrands: this.props.location.state.fromBrands ? this.props.location.state.fromBrands : false,
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
        this.updateCategory = true
    }


    componentDidUpdate(prevProps){
        if(prevProps.location.state.catName !== this.props.location.state.catName){
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
        let category =  this.props.location.state.catName;
        let filter =  (fromBrands) ? (selectedCat) ? 
                        `&brand=${encodeURIComponent(category)}&category=${selectedCategory.display_name}` : `&brand=${encodeURIComponent(category)}` : `&category=${category}`
        let restUrl =   encodeURI(`${PRODUCT_BASE_URL}prod?db=mainDB&page=${pageNum}&limit=${pageSize}${filter}`) ;
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ productsList: res.data.products,showLoader:false })
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


    openProductDetail=(selectedProduct)=>{
       this.props.history.push('/productdetails/osku:'+ selectedProduct.osku, {selectedProduct:selectedProduct})
    }

    addToCart=(product)=>{
        this.setState({cartLoader:true},()=>{
            let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}`
                serviceCall({}, restUrl, 'GET')
                    .then((res) => {
                        if (!res.error) {
                            showToastMessage(this.toastRef,'success', '', `Product "${product.title}" added to cart`);
                            this.setState({cartLoader:false})
                        } else {
                            this.setState({cartLoader:false})
                        }
                    })
                    .catch((error) => {
                        this.setState({cartLoader:false})
                    })
        })
        
      
    }



    render() {
        const { pageSize, pageNum, displayItems, productsList, showLoader, cartLoader, fromBrands, categories, selectedCat } = this.state;
   
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
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
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
                        </div>
                        <Divider />
                        {productsList.length !==0  ?
                        <div  style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                            {productsList.map((product) => (
                                <ProductCard
                                    product={product}
                                    openProductDetail={this.openProductDetail.bind(this)}
                                    addToCart={this.addToCart.bind(this)}
                                />
                            )
                            )}
                        </div> : 
                        <div>Empty</div>}
                        <div style={{
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'center', alignItems: 'center',
                            }}>
                            <div style={{ backgroundColor: '#fff', display: 'flex', alignItems: 'center', paddingLeft: 14, paddingRight: 14, paddingTop: 4, paddingBottom: 4 }}>
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
                            </div>

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
        getCategories:state.getCategories
    }
 }
 function mapDispatchToProps(dispatch) {
    return {
     
    }
 }
 
export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
