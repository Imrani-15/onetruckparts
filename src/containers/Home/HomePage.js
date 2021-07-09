import React, { Fragment } from 'react';

import { connect } from "react-redux";
import { Row, Col, Select, Input } from 'antd';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from 'primereact/skeleton';

import OneButton from '../../components/OneButton';
import Slider from '../../components/Slider';
import serviceCall from '../../utils/Services';


import truckimg1 from '../../assets/truckimg1.jpg';
import truckimg2 from '../../assets/truckimg2.jpg';
import truckimg3 from '../../assets/truckimg3.jpg';
import ReactSnackBar from "../../components/ReactSnackBar";
import { trimString } from '../../utils/Utils';
import { updateProductToCart } from '../../utils/commonService';
import { PRODUCT_BASE_URL, appTheme, deviceWidth } from '../../utils/Constants';


import { appStore } from '../../App';

import {styles} from '../../styles/HomePage.css'

const { Option } = Select;
class HomePage extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            sliderList: [],
            dummyArray: [1, 2, 3, 4, 5, 6],
            featuredProducts: [],
            showDilalog: false,
            selectedPrd: {},
            showFeaturedProducts: true,
            Show: false,
            Showing: false,
            toastMsg: ''
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 4,
                numScroll: 2
            },
            {
                breakpoint: '768px',
                numVisible: 3,
                numScroll: 1
            },
            {
                breakpoint: '480px',
                numVisible: 2,
                numScroll: 1
            }
        ]
    }

    componentWillMount() {
        window.addEventListener("resize", this.updateWindowDimensions);
        this.getSlider();
        this.getProductsByCategory();
    }


    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions)
    }

    updateWindowDimensions() {
        let width = window.innerWidth;
        if (width > deviceWidth.LAPTOP) {
            this.setState({ numVisible: 5 })
        } else if (width > deviceWidth.TAB) {
            this.setState({ numVisible: 4 })
        } else {
            this.setState({ numVisible: 2 })
        }

    }




    getProductsByCategory = () => {
        let restUrl = `${PRODUCT_BASE_URL}prod/home?hideCategoryBlocks=true`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ featuredProducts: res.data.data, showFeaturedProducts: false })
                } else {

                }
            })
            .catch((error) => {
            })
    }



    getSlider() {
        let sliders = [
            { id: 1, imgurl: truckimg1 },
            { id: 2, imgurl: truckimg2 },
            { is: 3, imgurl: truckimg3 }
        ];
        this.setState({ sliderList: sliders })
    }

    renderProductTemplate(product) {
        return (
            <div className="product-item" onClick={() => this.displayDialog(product)}>
                <div className="product-item-content">
                    <div className="p-mb-3">
                        <img src={product.image}
                            onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                            alt={product.name} className="product-image grow " />
                    </div>
                </div>
            </div>
        );
    }

    displayDialog = (product) => {
        this.setState({ showDilalog: true, selectedPrd: product })
    }

    closeDialog = () => {
        this.setState({ showDilalog: false })
    }

    goToProductDetailPage() {
        const { selectedPrd } = this.state;
        this.props.history.push('/productdetails/osku:' + selectedPrd.osku, { selectedProduct: selectedPrd })
    }

    goToBrandsPage = () => {
        this.props.history.push('/brands')
    }

    addToCart = (product) => {
        updateProductToCart(product, 1).then((resp) => {
            if (!resp.data.error) {
                this.setState({ showDilalog: false, toastMsg: `Product  added to the cart.` }, () => {
                    this.showToast();
                })
                this.props.setUserData({ cartcount: resp.data.cartcount, orderTotal: resp.data.ordertotal });
            } else {
                this.setState({ showDilalog: false, toastMsg: resp.data.message }, () => {
                    this.showToast();
                })
            }

        })
    }

    showToast = () => {
        if (this.state.Showing) return;
        this.setState({ Show: true, Showing: true });
        setTimeout(() => {
            this.setState({ Show: false, Showing: false });
        }, 2000);
    };


    render() {
        const { sliderList, featuredProducts, showDilalog, selectedPrd, showFeaturedProducts, dummyArray, toastMsg } = this.state;
        return (
            <Fragment>
                <Slider data={sliderList} goToBrandsPage={this.goToBrandsPage.bind(this)} />
                {showFeaturedProducts ?
                    <div className={styles.homePageStyle}>
                        {dummyArray.map((cat) => (
                            <div className={styles.carouselFeaturedProducts} style={{ paddingBottom: '0.4%' }}>
                                <Skeleton width="100%" height="240px" />
                            </div>
                        ))}
                    </div> :
                    <div className={styles.homePageStyle}>
                        {featuredProducts.length !== 0 && featuredProducts.map((cat, index) => (
                            <div key={`cat-${index}`}>
                                {cat.sectionType === "grid" ?
                                    <div className={styles.carouselFeaturedProductsGrid}>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {cat.results.map((product, index) => (
                                                <>
                                                    {product.blocktype === "html" ?
                                                        <div className="p-col-6 p-d-flex p-d-row p-ai-center p-jc-center"
                                                            style={index === 1 ? { borderLeft: "2px solid #EAEDED" } : {}}
                                                        >
                                                            <div dangerouslySetInnerHTML={{ __html: product.value }} />
                                                        </div> :
                                                        <div className="p-col-6 p-d-flex  p-flex-row p-flex-wrap p-ai-center p-jc-center"
                                                            style={index === 1 ? { borderLeft: "2px solid #EAEDED" } : {}}
                                                            onClick={() => this.displayDialog(product.items)}
                                                        >
                                                            <div className={styles.catGridTitle}>{trimString(product.items.title, 50)}</div>
                                                            <img src={product.items.image}
                                                                className={styles.catGridImage}
                                                                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                                                alt={product.items.title} />
                                                        </div>}
                                                </>
                                            ))}pDialog
                                        </div>
                                    </div> :
                                    <div className={styles.carouselFeaturedProducts}>
                                        <Carousel value={cat.items} numVisible={5} numScroll={2} responsiveOptions={this.responsiveOptions} id={"cat-carousel"}
                                            itemTemplate={this.renderProductTemplate.bind(this)} header={<div className={styles.catScollHeader}>{cat.heading}</div>} />
                                    </div>}
                            </div>
                        ))}
                    </div>}
                <Dialog visible={showDilalog} closable={false} header={null}
                    onHide={() => this.closeDialog()} modal className="home-prd-dialog">
                    <div style={{ position: 'absolute', top: 16, left: 14, cursor: "pointer",backgroundColor:'#fff' }} onClick={() => this.closeDialog()}>
                        <i className="pi pi-times" style={{ fontSize: 22, fontWeight: 'bold', color: appTheme.primaryColor,padding: 4 }}></i>
                    </div>
                    <div className="p-grid">
                        <div className="p-col-12 p-md-12 p-lg-5 p-xl-4 p-col-align-center" style={{ justifyContent: 'center' }}>
                            <img src={selectedPrd.image}
                                onError={(e) => e.target.src = 'https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                alt={selectedPrd.title} />
                        </div>

                        <div className="p-col-12 p-md-12 p-lg-7 p-xl-8 p-col-align-center p-justify-center">
                            <h3>{trimString(selectedPrd.title, 70)}</h3>
                            <p style={{marginBottom: 12, color:appTheme.logoTextColor }}>$ {selectedPrd.price}</p>
                            <OneButton
                                onClick={() => this.addToCart(selectedPrd)}
                                buttonLabel={"Add to cart"}
                                btnSize="large"
                                btnShape="round"
                                buttonStyle={{
                                    fontSize: 16, width: 150, height: 40, marginRight: 10,
                                    marginTop: 4

                                }}
                            />
                            <OneButton
                                onClick={() => this.goToProductDetailPage()}
                                buttonLabel={"Product details"}
                                btnSize="large"
                                btnShape="round"
                                buttonStyle={{
                                    fontSize: 16, backgroundColor: appTheme.logoTextColor, marginTop: 4,
                                    borderColor: appTheme.logoTextColor, width: 200, height: 40

                                }}
                            />
                        </div>

                    </div>
                </Dialog>
                <ReactSnackBar Show={this.state.Show}>
                    {toastMsg}
                </ReactSnackBar>

            </Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
        userdata: state.userData
    }
}
function mapDispatchToProps(dispatch) {
    return {
        setUserData: obj => {
            dispatch({ type: "SET_APP_DATA", data: obj });
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

