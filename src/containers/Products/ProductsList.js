import React, { Fragment } from 'react';

import { message, Pagination, Empty } from 'antd';
import { Divider } from 'primereact/divider';

import { Toast } from 'primereact/toast';
import serviceCall from '../../utils/Services';
import noProductsFound from '../../assets/No_Product_Found.png';

import { appTheme, PRODUCT_BASE_URL } from '../../utils/Constants';
import { isNotEmpty, showToastMessage } from '../../utils/Utils';
import { connect } from "react-redux";


import ProductCard from '../../components/ProductCard/ProductCard';
import AppSpinner from '../../components/AppSpinner';

import './ProductList.css';

class ProductsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pageSize: 30,
            totalProducts: 0,
            productsList: [],
            dummyProductsList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            displayItems: [30, 45, 60, 75, 90],
            showLoader: true,
            cartLoader: false,
            fromBrands: false,
            categories: [],
            selectedCat: false,
            selectedCategory: {},
            productFilters:[]
        }
        this.toastRef = React.createRef();
        this.updateCategory = true
    }

    componentWillMount() {
        this.getCategory();
        this.updateCategory = true;
        let brand = new URLSearchParams(this.props.location.search).get("brands");
        let checkBrand = isNotEmpty(brand) ? brand : false;
        this.setState({ fromBrands: checkBrand }, () => {
            this.getProductsList();
        })
    }


    componentDidUpdate(prevProps) {
        if (prevProps.match.params.category.replace(":", "") !== this.props.match.params.category.replace(":", "")) {
            this.setState({ showLoader: true, pageNum: 1 }, () => {
                this.getProductsList();
            })
        }
        if (prevProps.getCategories.length === this.props.getCategories.length && this.updateCategory) {
            this.getCategory();
        }
    }

    getCategory = () => {
        this.setState({ categories: this.props.getCategories },()=>{
            let allcat = this.state.categories.map((item) => {
                item.selected = false;
                return item
            })
            this.updateCategory = false
            this.setState({ categories: allcat })
        })

    }

    getProductsList = () => {
        const { pageNum, pageSize, fromBrands, selectedCat, selectedCategory } = this.state;
        let category = this.props.match.params.category.replace(":", "");
        let filter = (fromBrands) ? (selectedCat) ?
            `&brand=${encodeURIComponent(category)}&category=${selectedCategory.name}` : `&brand=${encodeURIComponent(category)}` : `&category=${category}`
        let restUrl = encodeURI(`${PRODUCT_BASE_URL}prod?db=mainDB&page=${pageNum}&limit=${pageSize}${filter}`);
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ productsList: res.data.products, totalProducts: res.data.total,productFilters:res.data.filters, showLoader: false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getAllProductsBrand() {
        this.setState({ showLoader: true, pageNum: 1, selectedCat: false, selectedCategory: {} }, () => {
            this.getProductsList();
            this.getCategory();
        })

    }


    getProductsByBrandCat(cat) {
        let categories = this.state.categories.map((item) => {
            if (item._id === cat._id) {
                item.selected = true
            } else {
                item.selected = false
            }

            return item
        })
        this.setState({ categories: categories, selectedCat: true, selectedCategory: cat, pageNum: 1, showLoader: true }, () => {
            this.getProductsList();
        })

    }

    getProductsByCatBrand(brand){

    }




    displayItems = (item) => {
        this.setState({ pageSize: item, showLoader: true }, () => {
            this.getProductsList();
        })
    }

    paginationBtn = (type) => {
        this.setState({ pageNum: (type === 'ADD') ? this.state.pageNum + 1 : this.state.pageNum - 1, showLoader: true }, () => {
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }

    paginationBtn1 = (page, pageSize) => {
        this.setState({ pageNum: page, pageSize: pageSize, showLoader: true }, () => {
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }


    openProductDetail = (selectedProduct) => {
        this.props.history.push('/productdetails/osku:' + selectedProduct.osku)
    }

    addToCart = (product) => {
        this.setState({ cartLoader: true }, () => {
            let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/1`
            serviceCall({}, restUrl, 'GET')
                .then((res) => {
                    if (!res.error) {
                        showToastMessage(this.toastRef, 'success', '', `Product "${product.title}" added to cart`);
                        this.setState({ cartLoader: false })
                        this.props.setUserData({ cartcount: res.data.cart.length, orderTotal: res.data.ordertotal });
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
        if (this.props.loginData && this.props.loginData.emailId) {
            let restUrl = `${PRODUCT_BASE_URL}account/saveforlater`;
            let inpobj = {
                "emailId": this.props.loginData.emailId,
                "osku": product.osku
            }
            serviceCall(inpobj, restUrl, 'POST')
                .then((res) => {
                    if (!res.error) {
                        message.success({
                            content: `Product "${product.title}" added as save for later`,
                            className: 'custom-class',
                            style: {
                                marginTop: '12vh',
                            },
                        });
                        // message.success(`Product "${product.title}" added as save for later`,);
                        this.setState({ cartLoader: false })
                    } else {
                        this.setState({ cartLoader: false })
                    }
                })
                .catch((error) => {
                    this.setState({ cartLoader: false })
                })
        } else {
            showToastMessage(this.toastRef, 'error', 'Error Message', `Please login to save for later`);
        }


    }



    render() {
        const { pageSize, pageNum, displayItems, productsList, dummyProductsList, totalProducts, showLoader,
            cartLoader, fromBrands, categories, selectedCat, productFilters } = this.state;
        return (
            <Fragment>
                <Toast ref={this.toastRef} />
                <div className="p-grid maindiv" >
                    <div className="p-col-2 p-mt-6">
                        {fromBrands ?
                            <div className="p-shadow-1">
                                <div className='subcat-list-item'>
                                    <h2 style={{ padding: 10, textAlign: 'center', fontWeight: 600, color: appTheme.logoTextColor }}>
                                        Categories
                                </h2>
                                </div>
                                <div className='subcat-list-item' onClick={this.getAllProductsBrand.bind(this)}>
                                    <h4 style={{ padding: 6, textAlign: 'center', color: (selectedCat) ? appTheme.dark2 : appTheme.logoTextColor }}>
                                        All
                                         </h4>
                                </div>
                                {categories.map((cat) => (
                                    <div className='subcat-list-item' onClick={this.getProductsByBrandCat.bind(this, cat)}
                                    >
                                        <h4 style={{ padding: 6, textAlign: 'center', color: (cat.selected) ? appTheme.logoTextColor : appTheme.dark2 }}>
                                            {cat.display_name}
                                        </h4>
                                    </div>
                                ))}
                            </div> :
                            <div className="p-shadow-1">
                            <div className='subcat-list-item'>
                                <h2 style={{ padding: 10, textAlign: 'center', fontWeight: 600, color: appTheme.logoTextColor }}>
                                    {productFilters.length !== 0 && productFilters[0].name}
                            </h2>
                            </div>
                            <div className='subcat-list-item' onClick={this.getAllProductsBrand.bind(this)}>
                                <h4 style={{ padding: 6, textAlign: 'center', color: (selectedCat) ? appTheme.dark2 : appTheme.logoTextColor }}>
                                    All
                                     </h4>
                            </div>
                            {productFilters.length !== 0 && productFilters[0].data.map((brand) => (
                                <div className='subcat-list-item' onClick={this.getProductsByBrandCat.bind(this, brand)}>
                                    <h4 style={{ padding: 6, textAlign: 'center', color: appTheme.dark2 }}>
                                        {brand}
                                    </h4>
                                </div>
                            ))}
                        </div>
                        }

                    </div>
                    <div className="p-col-10">
                        <Divider />
                        {showLoader ?
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                                    {dummyProductsList.map((product) => (
                                        <ProductCard
                                            showSkeletion={true}
                                            product={product}
                                            openProductDetail={this.openProductDetail.bind(this)}
                                            addToCart={this.addToCart.bind(this)}
                                            saveLater={this.saveLater.bind(this)}
                                        />
                                    )
                                    )}
                                </div>
                            </div> :
                            <div>
                                {productsList.length !== 0 ?
                                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }} >
                                        {productsList.map((product) => (
                                            <ProductCard
                                                showSkeletion={false}
                                                product={product}
                                                openProductDetail={this.openProductDetail.bind(this)}
                                                addToCart={this.addToCart.bind(this)}
                                                saveLater={this.saveLater.bind(this)}
                                            />
                                        )
                                        )}
                                    </div> :
                                    <div style={{display:'grid', justifyContent:'center'}}>
                                      <img src={noProductsFound} alt="noProductsFound" style={{height:200,alignSelf:'center'}} />
                                  </div>}
                            </div>}
                        <Divider />
                        {!showLoader &&
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
                                onChange={(page, pageSize) => this.paginationBtn1(page, pageSize)}
                            />
                        </div>
                        }
                    </div>
                </div>
                {cartLoader && <AppSpinner />}
            </Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
        userdata: state.userData,
        loginData: state.userLoginData,
        getCategories: state.getCategories
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
