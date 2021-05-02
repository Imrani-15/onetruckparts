import React ,{Fragment} from 'react';

import {connect} from "react-redux";
import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';


import Slider from '../../components/Slider';
import serviceCall from '../../utils/Services';

import {PRODUCT_BASE_URL} from '../../utils/Constants';


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
        
    }

    componentWillMount(){
        this.getSlider();
        this.getProductsByCategory();
    }

    componentDidMount(){
        if(Object.keys(this.props.userdata).length === 0 && !this.props.userdata.cartcount){
            this.props.setUserData({cartcount:0,orderTotal:0})
        } 
    }


    getProductsByCategory = () => {
        let restUrl = `${PRODUCT_BASE_URL}prod/home`
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
            {id:1, imgurl:'https://www.onetruck.us/assets/images/truckimg1.jpg'},
            {id:2, imgurl:'https://www.onetruck.us/assets/images/truckimg2.jpg'},
            {is:3, imgurl:'https://www.onetruck.us/assets/images/truckimg4.jpg'}
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


    render(){
        const {sliderList,featuredProducts,showDilalog,selectedPrd,showFeaturedProducts, dummyArray}=this.state;
        
        return(
            <Fragment>
                <Slider data={sliderList} goToBrandsPage={this.goToBrandsPage.bind(this)}/>
                {showFeaturedProducts ? 
                <div className="homePage-style">
                    {dummyArray.map((cat)=>(
                        <div className="carousel-featured-products">
                             <Skeleton width="100%" height="240px" />
                        </div>
                    ))}
                </div> :
                <div className="homePage-style">
                    {featuredProducts.length !==0 && featuredProducts.map((cat)=>(
                        <div className="carousel-featured-products">
                            <Carousel value={cat.items} numVisible={4} numScroll={2} 
                            itemTemplate={this.renderProductTemplate.bind(this)} header={<h3 style={{fontWeight:'bold'}}>{cat.category}</h3>} />
                        </div> 
                    ))}
                 </div> }
                 <Dialog visible={showDilalog} style={{ width: '50vw' }} 
                    onHide={() => this.closeDialog()} modal >
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <img src={selectedPrd.image} 
                          onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                         alt={selectedPrd.title} style={{width:220}} />
                        <div>
                            <div style={{fontSize:22}}>{selectedPrd.title}</div>
                            <div style={{fontSize:20,marginTop:12,marginBottom:16}}>$ {selectedPrd.price}</div>
                            <Button label="See Products details" className="p-button-raised" 
                                onClick={()=>this.goToProductDetailPage()}
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

