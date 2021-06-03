import React ,{Fragment} from 'react';

import {connect} from "react-redux";
import { Toast } from 'primereact/toast';
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Skeleton } from 'primereact/skeleton';

import OneButton from '../../components/OneButton'; 
import Slider from '../../components/Slider';
import serviceCall from '../../utils/Services';

import truckimg1 from '../../assets/truckimg1.jpg';
import truckimg2 from '../../assets/truckimg2.jpg';
import truckimg3 from '../../assets/truckimg3.jpg';

import { isNotEmpty, showToastMessage } from '../../utils/Utils';
import {PRODUCT_BASE_URL, appTheme} from '../../utils/Constants';


import { appStore } from '../../App';

import './HomePage.css'

class HomePage extends React.Component {
  
 
    constructor(props){
        super(props);
        this.state={
            sliderList:[],
            dummyArray:[1,2,3,4,5,6],
            featuredProducts:[],
            showDilalog:false,
            selectedPrd:{},
            showFeaturedProducts:true
        }
        this.toastRef = React.createRef();
        
    }

    componentWillMount(){
        this.getSlider();
        this.getProductsByCategory();
    }

    componentDidMount(){
       
        // if(Object.keys(this.props.userdata).length === 0 && !this.props.userdata.cartcount){
        //     this.props.setUserData({cartcount:0,orderTotal:0})
        // } 
    }




    getProductsByCategory = () => {
        let restUrl = `${PRODUCT_BASE_URL}prod/home?hideCategoryBlocks=true`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    this.setState({ featuredProducts: res.data.data,showFeaturedProducts:false })
                } else {

                }
            })
            .catch((error) => {
            })
    }

    getSlider(){
        let sliders = [
            {id:1, imgurl: truckimg1},
            {id:2, imgurl:truckimg2},
            {is:3, imgurl:truckimg3}
        ];
        this.setState({sliderList:sliders})
    }

    renderProductTemplate(product){
        return (
            <div className="product-item" onClick={() => this.displayDialog(product)}>
                <div className="product-item-content">
                    <div className="p-mb-3">
                        <img src={product.image} 
                        onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                         alt={product.name} className="product-image grow " />
                    </div>
                </div>
            </div>
        );
    }

    displayDialog=(product)=>{
        this.setState({showDilalog:true,selectedPrd:product})
    }

    closeDialog=()=>{
        this.setState({showDilalog:false})
    }

    goToProductDetailPage(){
        const {selectedPrd} = this.state;
        this.props.history.push('/productdetails/osku:'+ selectedPrd.osku, {selectedProduct:selectedPrd})
    }

    goToBrandsPage=()=>{
        this.props.history.push('/brands')
    }

    addToCart = (product) => {
        let restUrl = `${PRODUCT_BASE_URL}cart/add/${product.osku}/1`
        serviceCall({}, restUrl, 'GET')
            .then((res) => {
                if (!res.error) {
                    showToastMessage(this.toastRef, 'success', '', `Product "${product.title}" added to cart`);
                    this.setState({ showDilalog: false })
                    this.props.setUserData({ cartcount: res.data.cart.length, orderTotal: res.data.ordertotal });
                } else {

                }
            })
            .catch((error) => {

            })
    }


    render(){
        const {sliderList,featuredProducts,showDilalog,selectedPrd,showFeaturedProducts, dummyArray}=this.state;
        return(
            <Fragment>
                <Toast ref={this.toastRef} />
                <Slider data={sliderList} goToBrandsPage={this.goToBrandsPage.bind(this)}/>
                {showFeaturedProducts ? 
                <div className="homePage-style">
                    {dummyArray.map((cat)=>(
                        <div className="carousel-featured-products" style={{paddingBottom:'0.4%'}}>
                             <Skeleton width="100%" height="240px" />
                        </div>
                    ))}
                </div> :
                <div className="homePage-style">
                    {featuredProducts.length !==0 && featuredProducts.map((cat,index)=>(
                        <div key={`cat-${index}`}>
                        {cat.sectionType === "grid" ?
                        <div className="carousel-featured-products-grid">

                            <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                                {cat.results.map((product,index)=>(
                                    <>
                                    {product.blocktype === "html" ?
                                    <div className="p-col-6 p-d-flex p-d-row p-ai-center p-jc-center"
                                    style={index === 1 ? {borderLeft:"2px solid #EAEDED"} : {}}
                                    >
                                        <div dangerouslySetInnerHTML={{__html: product.value}} />
                                    </div> :
                                     <div className="p-col-6 p-d-flex p-d-row p-ai-center p-jc-center"
                                     style={index === 1 ? {borderLeft:"2px solid #EAEDED"} : {}}
                                     onClick={() => this.displayDialog(product.items)}
                                    >
                                        <div style={{marginRight:12,fontSize:22,fontWeight:'400', width:200}}>{product.items.title}</div>
                                        <img src={product.items.image} 
                                            style={{width:220,height:200,objectFit:'contain'}}
                                            onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                                            alt={product.items.title}/>
                                    </div>}
                                    </>
                                ))}
                            </div>
                        </div> :
                        <div className="carousel-featured-products">
                            <Carousel value={cat.items} numVisible={5} numScroll={2} id={"cat-carousel"} circular={false}
                            itemTemplate={this.renderProductTemplate.bind(this)} header={<div style={{fontWeight:'600', fontSize:22}}>{cat.heading}</div>} />
                        </div> } 
                        </div>
                    ))}
                 </div> }
                 <Dialog visible={showDilalog} style={{ width: '50vw' }} closable={false} header={null}
                    onHide={() => this.closeDialog()} modal className="home-prd-dialog">
                    <div className="p-grid">
                    <div style={{position:'absolute', top:16, left:14, cursor:"pointer"}} onClick={()=> this.closeDialog()}>
                        <i className="pi pi-times" style={{fontSize:22, fontWeight:'bold',color:appTheme.primaryColor}}></i>
                    </div>
                    <div className="p-col-1 p-col-align-center"></div>
                    <div className="p-col-4 p-col-align-center">
                    <img src={selectedPrd.image} 
                          onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                         alt={selectedPrd.title} style={{width:200,height:200,objectFit:'contain'}} />
                    </div>

                        <div className="p-col-7 p-col-align-center">
                            <div style={{fontSize:22}}>{selectedPrd.title}</div>
                            <div style={{fontSize:20,marginTop:12,marginBottom:16}}>$ {selectedPrd.price}</div>
                            <OneButton 
                                 onClick={()=>this.addToCart(selectedPrd)}
                                buttonLabel={"Add to cart"}
                                btnSize="large"
                                btnShape="round"
                                buttonStyle={{fontSize:16, width: 150, height: 40,marginRight: 10,
                            
                            }}
                            />
                             <OneButton 
                                 onClick={()=>this.goToProductDetailPage()}
                                buttonLabel={"See product details"}
                                btnSize="large"
                                btnShape="round"
                                buttonStyle={{fontSize:16, backgroundColor: appTheme.logoTextColor,
                                borderColor: appTheme.logoTextColor, width: 200, height: 40
                            
                            }}
                            />
                        </div>

                    </div>
                </Dialog>
            </Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
       userdata : state.userData
    }
}
function mapDispatchToProps(dispatch){
    return {
        setUserData: obj =>{
            dispatch({ type: "SET_APP_DATA", data: obj });
          }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(HomePage);

