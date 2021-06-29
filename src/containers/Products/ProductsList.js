import React, { Fragment } from 'react';

import { connect } from "react-redux";
import { Divider } from 'primereact/divider';
import { Toast } from 'primereact/toast';
import { Checkbox } from 'primereact/checkbox';
import { Paginator } from 'primereact/paginator';

import serviceCall from '../../utils/Services';
import noProductsFound from '../../assets/No_Product_Found.png';

import { updateProductToCart, productSaveLater } from '../../utils/commonService';
import { appTheme, PRODUCT_BASE_URL , deviceWidth} from '../../utils/Constants';
import { isNotEmpty } from '../../utils/Utils';


import ReactSnackBar from "../../components/ReactSnackBar";
import ProductCard from '../../components/ProductCard/ProductCard';
import AppSpinner from '../../components/AppSpinner';

import './ProductList.css';

class ProductsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paginationFirst: 0,
            pageNum: 0,
            pageSize: 24,
            totalProducts: 0,
            productsList: [],
            dummyProductsList: [1, 2, 3, 4, 5, 6, 7, 8],
            displayItems: [24, 48, 72],
            showLoader: true,
            cartLoader: false,
            fromBrands: false,
            categories: [],
            showCategoryFilter: false,
            selectedCategory: "",
            filterName:"",
            productFilters: [],
            selectedFilters:[],
            defaultType: "",
            Show: false,
            Showing: false,
            toastMsg: '',
            isLargeDevice:true
        }
        this.toastRef = React.createRef();
        this.updateCategory = true;
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentWillMount() {
        window.scrollTo(0, 0);
        window.addEventListener("resize", this.updateWindowDimensions);
        this.updateCategory = true;
        let brand = new URLSearchParams(this.props.location.search).get("brands");
        let checkBrand = isNotEmpty(brand) ? brand : false;
        let defaultType = this.props.match.params.type.replace(":", "");
        if(checkBrand){
            this.getCategory();
        }
        this.setState({ fromBrands: checkBrand, defaultType, showCategoryFilter: checkBrand }, () => {
            this.getProductsList();
        })
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }

    
    updateWindowDimensions() {
        let width = window.innerWidth;
        if (width > deviceWidth.LAPTOP) {
            this.setState({ isLargeDevice: true })
        } else if (width > deviceWidth.TAB) {
            this.setState({ isLargeDevice: true })
        } else {
            this.setState({ isLargeDevice: false})
        }

    }


    componentDidUpdate(prevProps) {
        if (prevProps.match.params.type.replace(":", "") !== this.props.match.params.type.replace(":", "")) {
            window.scrollTo(0, 0);
            let defaultType = this.props.match.params.type.replace(":", "");
            let brand = new URLSearchParams(this.props.location.search).get("brands");
            let checkBrand = isNotEmpty(brand) ? brand : false;
            this.setState({ showLoader: true, pageNum: 1, defaultType, fromBrands: checkBrand }, () => {
                this.getProductsList();
            })
        }
    }

    getCategory = () => {
        let allCategories = this.props.getCategories;
        let productFilters = allCategories.map(a => a.name);
        let removeDuplicateFilters = [...new Set(productFilters)]
        this.setState({ categories: this.props.getCategories, productFilters: removeDuplicateFilters }, () => {
        })

    }

    getProductsList = () => {
        const { pageNum, pageSize, fromBrands, selectedCategory, defaultType, selectedFilters } = this.state;
        // If sort by only brand then send brand
        // If sort by only category then send category
        // If sort by both send both
        let filter = "";
        if (fromBrands) {
            if (selectedFilters.length !==0) {
                filter = `&brand=${encodeURIComponent(defaultType)}&category=${selectedFilters}`;
            } else {
                filter = `&brand=${encodeURIComponent(defaultType)}`;
            }
        } else {
            if(selectedFilters.length !==0){
                filter = `&category=${defaultType}&brand=${selectedFilters}`;
            }else{
                filter = `&category=${defaultType}`;
            }
            
        }

        let restUrl = encodeURI(`${PRODUCT_BASE_URL}prod?db=mainDB&page=${pageNum}&limit=${pageSize}${filter}`);
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    if (fromBrands) {
                        this.setState({ productsList: res.data.products, totalProducts: res.data.total, 
                            filterName: 'Categories', showLoader: false })
                    }else{
                        this.setState({ productsList: res.data.products, totalProducts: res.data.total, 
                            filterName: res.data.filters[0].name,
                            productFilters: res.data.filters[0].data, showLoader: false })
                    }

                } else {

                }
            })
            .catch((error) => {
            })
    }




    displayItems = (item) => {
        this.setState({ pageSize: item, showLoader: true }, () => {
            this.getProductsList();
        })
    }

    onChangePagination = (pageNum, paginationFirst, pageSize) => {
        this.setState({ pageNum: pageNum, paginationFirst: paginationFirst, pageSize: pageSize, showLoader: true }, () => {
            window.scrollTo(0, 0);
            this.getProductsList();
        })
    }


    openProductDetail = (selectedProduct) => {
        this.props.history.push('/productdetails/osku:' + selectedProduct.osku)
    }

    addToCart = (product) => {
        this.setState({ cartLoader: true }, () => {
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

    saveLater = (product) => {
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

    onFiltersChange=(e)=> {
        let selectedFilters = [...this.state.selectedFilters];
        if (e.checked) {
            selectedFilters.push(e.value);
        }
        else {
            for (let i = 0; i < selectedFilters.length; i++) {
                const selectedFilter = selectedFilters[i];

                if (selectedFilter == e.value) {
                    selectedFilters.splice(i, 1);
                    break;
                }
            }
        }
        this.setState({ selectedFilters, pageNum: 1, showLoader: true },()=>{
            this.getProductsList();
        });
    }



    render() {
        const { pageSize, paginationFirst, displayItems, productsList, dummyProductsList, totalProducts, showLoader,
            cartLoader, showCategoryFilter, categories, selectedCat, filterName, productFilters,selectedFilters, 
            toastMsg, isLargeDevice } = this.state;

        const pageTemplate = {
            layout: (isLargeDevice) ?
            'CurrentPageReport FirstPageLink  PrevPageLink PageLinks NextPageLink LastPageLink  RowsPerPageDropdown' : 
            'CurrentPageReport PrevPageLink NextPageLink RowsPerPageDropdown',
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
                <div className="p-grid maindiv" >
                    {isLargeDevice &&
                    <div className="p-col-2 p-mt-6" >
                            <div className="filter-vl">
                                <div className='subcat-list-item'>
                                    <h3 style={{ fontWeight: 700, color: appTheme.logoTextColor, textTransform: 'capitalize' }}>
                                        {filterName}
                                    </h3>
                                </div>
                                {productFilters.length !== 0 && productFilters.map((brand) => (
                                <div className="p-field-checkbox">
                                    <Checkbox inputId={brand} value={brand}  name="brand"
                                        checked={selectedFilters.some((item) => item === brand)} 
                                        onChange={this.onFiltersChange} />
                                    <label htmlFor={brand}>{brand}</label>
                                </div>))}
                            </div>
                    </div> }
                    <div className={isLargeDevice ? "p-col-10" : "p-col-12" }>
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
                                    <div style={{ display: 'grid', justifyContent: 'center' }}>
                                        <img src={noProductsFound} alt="noProductsFound" style={{ height: 200, alignSelf: 'center' }} />
                                    </div>}
                            </div>}
                        <Divider />
                        {!showLoader &&
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
                        }
                    </div>
                </div>
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
