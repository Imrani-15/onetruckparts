import React, { Fragment } from 'react';


import { connect } from "react-redux";
import { Galleria } from 'primereact/galleria';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import ReactImageZoom from 'react-image-zoom';

import serviceCall from '../../utils/Services';
import dummyImage from '../../assets/dummy.jpg';
import noReview from '../../assets/noreview.jpg';

import OneButton from '../../components/OneButton';
import AppSpinner from '../../components/AppSpinner';

import ReactSnackBar from "../../components/ReactSnackBar";
import userProfile from '../../utils/UserProfile';
import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';

import { isNotEmpty } from '../../utils/Utils';

import './ProductDetailsPage.css';


class ProductDetailsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedQuantity: 1,
            cartLoader: false,
            showLoader: true,
            productDetails: {},
            productImages: [],
            fitmentList: [],
            productFitmentList:[],
            hidden: false,
            quantities: [
                { name: 1, value: 1 },
                { name: 2, value: 2 },
                { name: 3, value: 3 }
            ],
            Show: false,
            Showing: false,
            toastMsg:''
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
        this.getUserFitmentList();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params.osku.replace(":", "") !== this.props.match.params.osku.replace(":", "")) {
            this.setState({ showLoader: true })
            this.getProductDetails();
            this.getUserFitmentList();
        }
    }

    getUserFitmentList = () => {
        let restUrl = `${PRODUCT_BASE_URL}fitment/garage`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ fitmentList: res.data.garage })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getProductDetails = () => {
        let SKU = this.props.match.params.osku.replace(":", "");
        let restUrl = `${PRODUCT_BASE_URL}prod/details?osku=${SKU}`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    let productImages = res.data && res.data.files.toString().split(",").filter(x => !x.includes("pdf"))
                    this.setState({ productDetails: res.data, productImages: productImages, showLoader: false })
                    this.getProductFitment(res.data.fitmentOsku);
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getProductFitment = (fitmentOsku) => {
        let restUrl = `${PRODUCT_BASE_URL}prod/fitments`
        serviceCall({
            "fitmentOsku" :fitmentOsku
        }, restUrl, 'POST')
            .then((res) => {
                if (!res.error) {
                    this.setState({ productFitmentList: res.data.data })
                } else {

                }
            })
            .catch((error) => {
            })
    }


    addToCart = (product) => {
        this.setState({ cartLoader: true }, () => {
            let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/${this.state.selectedQuantity}`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    if (!res.error) {
                        
                        this.setState({ cartLoader: false, toastMsg:`Product  added to the cart.` },()=>{
                            this.showToast();
                        })
                        this.props.setUserData({ cartcount: res.data.cartcount, orderTotal: res.data.ordertotal });
                    } else {
                        this.setState({ cartLoader: false })
                    }
                })
                .catch((error) => {
                    this.setState({ cartLoader: false })
                })
        })


    }

    saveLater = (product) => {
        let userData = userProfile.getUserObj();
        if (userData && userData.emailId) {
            let restUrl = `${PRODUCT_BASE_URL}account/saveforlater`;
            let inpobj = {
                "emailId": userData.emailId,
                "osku": product.osku
            }
            serviceCall(inpobj, restUrl, 'POST')
                .then((res) => {
                    if (!res.error) {
                        this.setState({ cartLoader: false, toastMsg:`Product  added to the wishlist` },()=>{
                            this.showToast();
                        })
                    } else {
                        this.setState({ cartLoader: false })
                    }
                })
                .catch((error) => {
                    this.setState({ cartLoader: false })
                })
        } else {
            this.setState({ cartLoader: false, toastMsg:`Please login to add to the wishlist` },()=>{
                this.showToast();
            })
        }


    }

    showToast = () => {
        if (this.state.Showing) return;
        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false, toastMsg:'' });
        }, 2000);
    };








    itemTemplate(item) {
        const props = { width: 400, height: 400, zoomWidth: 500, img: item, zoomPosition: 'right' };
        if (isNotEmpty(item)) {
            return <ReactImageZoom {...props} />
        } else {
            return <img
                src={item}
                style={{ height: 400, width: '100%', objectFit: 'contain' }}
                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
            />
        }
    }

    thumbnailTemplate(item) {
        if (isNotEmpty(item)) {
            return <img src={item} className="thumbnailImage"
                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'} />
        } else {
            return <img src={dummyImage} className="thumbnailImage"
                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'} />
        }

    }

    render() {
        const { selectedQuantity, quantities, productDetails, productImages,
            showLoader, cartLoader, fitmentList, toastMsg, productFitmentList } = this.state;
        const { userFitmentData } = this.props;

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
                        <Skeleton width="100%" className="p-mb-4 p-p-4" />

                        <Skeleton width="100%" height="180px" className="p-mb-4 p-p-4" />
                        <Skeleton width="100%" height="180px" className="p-mb-4 p-p-4" />
                        <Skeleton width="100%" height="180px" className="p-mb-4 p-p-4" />
                        <Skeleton width="100%" height="180px" className="p-mb-4 p-p-4" />
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
                            <div style={{ fontSize: 18, fontWeight: '500', marginTop: 20, lineHeight: '22px', color: appTheme.dark2 }}>
                                Key Features:
                    </div>
                            <ul style={{ paddingInlineStart: 20 }}>
                                <li className="product_li">Brand Label : {productDetails.brandlabel}</li>
                                <li className="product_li">Part Number : {productDetails.partnumber}</li>
                            </ul>
                            <div style={{ fontSize: 18, fontWeight: '500', marginTop: 20, lineHeight: '22px', color: appTheme.dark2 }}>
                                Specifications:
                    </div>
                            <ul style={{ paddingInlineStart: 20 }}>
                                <li className="product_li">Color : {productDetails.colormode}</li>
                                <li className="product_li">Dimensions : {parseInt(productDetails.width_inches)}" *  {parseInt(productDetails.height_inches)}"</li>
                                <li className="product_li">Weight :  {productDetails.weight_lb} lb</li>
                            </ul>
                        </div>
                        <div className="p-col-3 p-shadow-2 p-pt-4 p-pl-4 p-pr-4" style={{ borderRadius: 6, height: 420 }}>
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
                                buttonStyle={{
                                    fontSize: 16, marginTop: 26,
                                    backgroundColor: appTheme.logoTextColor,
                                    borderColor: appTheme.logoTextColor
                                }}
                            />
                            <OneButton
                                onClick={() => this.saveLater(productDetails)}
                                buttonLabel={"Save Later"}
                                btnShape="round"
                                btnSize="large"
                                buttonStyle={{ fontSize: 16, marginTop: 26, marginBottom: 14 }}
                            />
                            <h3 style={{color:appTheme.secondaryColor,fontWeight:'bold'}}>Your Compatible Vechiles</h3>
                            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 12 }}>
                                {fitmentList.map((fit, index) =>
                                    <div style={{
                                        backgroundColor: 'green', borderRadius: 15, paddingLeft: 6, paddingRight: 8,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 12,
                                    }}>
                                        <i className="pi pi-check-circle" style={{ color: '#fff', fontSize: 14 }} />
                                        <div style={{ color: '#fff', fontSize: 14, fontWeight:'500', marginLeft: 6 }}>Car {' '} {index + 1}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
                {!showLoader &&
                    <div className="product_navbar p-shadow-3">
                        <a onClick={() => this.productDetails.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Product Details</a>
                        <a onClick={() => this.Features.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Features</a>
                        <a onClick={() => this.Features.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Compatibility</a>
                        <a onClick={() => this.Reviews.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Reviews</a>
                        <a onClick={() => this.Warranty.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Warranty</a>
                    </div>}

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

                            <ul class="striped-list">
                                <li>Brand Label : {productDetails.brandlabel}</li>
                                <li>Category : {productDetails.category}</li>
                                <li>Dimensions : {parseInt(productDetails.width_inches)}" *  {parseInt(productDetails.height_inches)}"</li>
                                <li>Color Mode : {productDetails.colormode}</li>
                                <li>Weight :  {productDetails.weight_lb} lb</li>
                            </ul>
                            <ul class="striped-list p-mt-3">
                                {productDetails.featuredTexts && productDetails.featuredTexts.length !== 0 &&
                                    productDetails.featuredTexts.map((text, index) => (
                                        <li>{index + 1}. {' '}{text}</li>
                                    ))}
                            </ul>
                        </section>
                        <section>
                        <div className="product_navbar_title">Compatibility</div>
                        <DataTable 
                                emptyMessage={
                                    <div style={{display:'grid', justifyContent:'center'}}>
                                        {/* <img src={emptyCart} alt="cartEmpty" style={{height:160,alignSelf:'center'}} /> */}
                                        <h3 style={{textAlign:'center', color:appTheme.logoTextColor,fontWeight: '800',}}>No Fitment Data</h3>
                                    </div>
                                }
                                loading={false}
                                value={productFitmentList}>
                                <Column field="company" header="Company" />
                                <Column field="modelname" header="Model name" />
                                <Column field="exppartno" header="Part no" />
                                <Column field="year" header="Year" />
                                <Column field="bodytype" header="Body Type" />
                                <Column field="engbase" header="Engine base" />
                            </DataTable>
                        </section>
                        <section ref={this.Reviews}>
                            <div className="product_navbar_title">Reviews</div>
                            <div style={{ display: 'flex', flexDirection:'column', justifyContent: 'center',alignItems:'center' }}>
                                <img src={noReview} alt="noReview" style={{ height: 160, alignSelf: 'center' }} />
                                <h2 style={{ textAlign: 'center', color: appTheme.logoTextColor, fontWeight: '800', }}>No Active Reviews</h2>
                            </div>
                        </section>
                        <section ref={this.Warranty}>
                            <div className="product_navbar_title">Warranty</div>
                            <h2 style={{ color: appTheme.secondaryColor,fontWeight: 'bold', }}>
                                {productDetails.warranty ? productDetails.warranty : 'One Year Fixed Warranty'}</h2>
                        </section>
                    </div>}

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

    }
}
function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsPage);





