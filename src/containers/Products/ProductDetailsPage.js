import React, { Fragment } from 'react';

import { Galleria } from 'primereact/galleria';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';

import serviceCall from '../../utils/Services';
import dummyImage from '../../assets/dummy.jpg';

import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';

import { appTheme , PRODUCT_BASE_URL} from '../../utils/Constants';

import { isNotEmpty, showToastMessage } from '../../utils/Utils';

import './ProductDetailsPage.css';

class ProductDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedQuantity: 1,
            cartLoader:false,
            showLoader:true,
            productDetails: {},
            productImages: [],
            hidden: false,
            quantities: [
                { name: 1, value: 1 },
                { name: 2, value: 2 },
                { name: 3, value: 3 },
                { name: 4, value: 4 },
                { name: 5, value: 5 },
                { name: 6, value: 6 },
                { name: 7, value: 7 },
                { name: 8, value: 8 },
                { name: 9, value: 9 },
                { name: 10, value: 10 }
            ]
        }
        this.productDetails = React.createRef();
        this.Features = React.createRef();
        this.Reviews = React.createRef();
        this.Warranty = React.createRef();
        this.toastRef = React.createRef();
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getProductDetails();
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.osku.replace(":", "") !== this.props.match.params.osku.replace(":", "")){
            this.setState({showLoader:true})
            this.getProductDetails();  
        }
    }

    getProductDetails = () => {
        let SKU =  this.props.match.params.osku.replace(":", "");
        let restUrl = `${PRODUCT_BASE_URL}prod/details?osku=${SKU}`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    let productImages = res.data && res.data.files.toString().split(",").filter(x => !x.includes("pdf"))
                    this.setState({ productDetails: res.data,  productImages: productImages,showLoader:false })
                } else {

                }
            })
            .catch((error) => {
            })
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








    itemTemplate(item) {
        return <img
            src={item}
            style={{ height: 400, width: '100%', objectFit: 'contain' }}
            onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
        />
    }

    thumbnailTemplate(item) {
        if (isNotEmpty) {
            return <img src={item} className="thumbnailImage"
            onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'} />
        } else {
            return <img src={dummyImage} className="thumbnailImage" 
            onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}/>
        }

    }

    render() {
        const { selectedQuantity, quantities, productDetails, productImages, showLoader, cartLoader } = this.state;
        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                {showLoader ?
                <div className="p-grid detailmaindiv">
                    <div className="p-col-5 p-p-2">
                         <Skeleton height="400px" width="100%" />
                    </div>
                    <div className="p-col-4 p-p-4">
                        <Skeleton width="100%" className="p-mb-4 p-p-2" />
                        <Skeleton width="90%" className="p-mb-4 p-p-4" />
                        <Skeleton width="60%" height="250px" className="p-mb-4 p-p-4" />
                    </div>
                    <div className="p-col-3 p-shadow-2 p-pt-6 p-pl-4 p-pr-4" style={{ borderRadius: 6, height: 400 }}>
                        <Skeleton width="100%" className="p-mb-4 p-p-2" />
                        <Skeleton width="100%" className="p-mb-4 p-p-6" />
                    </div>
                </div>
                 :
                <div className="p-grid detailmaindiv">
                    <div className="p-col-5 p-p-2">
                        <Galleria value={productImages}
                            numVisible={3}
                            circular
                            showItemNavigators
                            item={this.itemTemplate} thumbnail={this.thumbnailTemplate}
                        />
                    </div>
                    <div className="p-col-4 p-p-4">
                        <div style={{ fontSize: 26, fontWeight: '700', lineHeight: '32px' }}>
                            {productDetails.title}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: '500', marginTop: 20, lineHeight: '22px', color: appTheme.dark5 }}>
                            {productDetails.short_description_2}
                        </div>
                        <div style={{ fontSize: 16, fontWeight: '500', marginTop: 20, lineHeight: '22px', color: appTheme.dark2 }}>
                            Key Features:
                    </div>
                        <ul style={{ paddingInlineStart: 20 }}>
                            <li className="product_li">Brand Label : {productDetails.brandlabel}</li>
                            <li className="product_li">Category : {productDetails.category}</li>
                            <li className="product_li">SKU : {productDetails.osku}</li>
                            <li className="product_li">Part Number : {productDetails.partnumber}</li>
                        </ul>
                    </div>
                    <div className="p-col-3 p-shadow-2 p-pt-6 p-pl-4 p-pr-4" style={{ borderRadius: 6, height: 400 }}>
                        <div style={{
                            fontSize: 26,
                            fontWeight: '700'
                        }}>
                            ${productDetails.usd_retailprice}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: '500', lineHeight: '22px', color: appTheme.dark2 }}>
                                Quantity :
                    </div>
                            <Dropdown value={selectedQuantity} options={quantities}
                                onChange={(e) => this.setState({ selectedQuantity: e.value })}
                                optionLabel="name" className="p-dropdown-sm p-ml-4" />
                        </div>
                        <OneButton 
                            onClick={() => this.addToCart(productDetails)}
                            buttonLabel={"Add to cart"}
                            btnShape="round"
                            btnSize="large"
                            buttonStyle={{fontSize:16,marginTop:26,
                                    backgroundColor:appTheme.logoTextColor,
                                    borderColor:appTheme.logoTextColor}}
                        /> 
                         <OneButton 
                            onClick={() => this.addToCart(productDetails)}
                            buttonLabel={"Save Later"}
                            btnShape="round"
                            btnSize="large"
                            buttonStyle={{fontSize:16,marginTop:26}}
                        /> 
                    </div>
                </div>
                }
                {!showLoader &&
                <div className="product_navbar">
                    <a onClick={() => this.productDetails.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Product Details</a>
                    <a onClick={() => this.Features.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Features</a>
                    <a onClick={() => this.Reviews.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Reviews</a>
                    <a onClick={() => this.Warranty.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Warranty</a>
                </div> }
                {!showLoader &&
                <div style={{ margin: '3%' }}>
                    <section ref={this.productDetails}>
                        <div className="product_navbar_title">Product Details</div>
                        <div className="product_navbar_desc">
                            {productDetails.description}
                        </div>
                    </section>
                    <section ref={this.Features}>
                        <div className="product_navbar_title">Features</div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </section>
                    <section ref={this.Reviews}>
                        <div className="product_navbar_title">Reviews</div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </section>
                    <section ref={this.Warranty}>
                        <div className="product_navbar_title">Warranty</div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                        <div className="product_navbar_desc">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                            ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </section>
                </div> }

                {cartLoader && <AppSpinner />}
            </Fragment>
        )
    }
}


export default ProductDetailsPage;