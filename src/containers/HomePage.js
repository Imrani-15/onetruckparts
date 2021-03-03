import React ,{Fragment} from 'react';

import { Carousel } from 'primereact/carousel';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Slider from '../components/Slider';
import {featuredProducts} from '../utils/Constants';
import './styles/HomePage.css'

class HomePage extends React.Component {
  
 
    constructor(props){
        super(props);
        this.state={
            sliderList:[],
            featuredProducts:featuredProducts,
            showDilalog:false,
            selectedPrd:{}
        }
        Carousel.changePageOnTouch = (e,diff) => {
            if (diff < 0) {
                this.navForward(e);
            }
            else {
                this.navBackward(e);
            }
        }
    }

    componentDidMount(){
        this.getSlider()
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
                        <img src={product.imgurl} 
                        onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                         alt={product.name} className="product-image grow " />
                    </div>
                    <div>
                        <div className="p-mt-2" style={{color:'#333',fontWeight:'500'}}>{product.name}</div>
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
        this.props.history.push("/productdetails")
    }


    render(){
        const {sliderList,featuredProducts,showDilalog,selectedPrd}=this.state;

        return(
            <Fragment >
                <Slider data={sliderList}/>
                
                <div className="homePage-style">

               
                {featuredProducts.map((cat)=>(
                    (cat.type === 'scroll')?
                    <div className="carousel-featured-products">
                        <Carousel value={cat.items} numVisible={4} numScroll={2} 
                        itemTemplate={this.renderProductTemplate.bind(this)} header={<h3>{cat.name}</h3>} />
                    </div> :
                    <div className="carousel-featured-products grid-product-style" >
                        {cat.items.map((product,index)=>(
                            <div style={{display:'flex',flexDirection: 'row',alignItems: 'center', justifyContent:'center', 
                             borderRight:(index === 0) ? "0.8px solid var(--surface-d)" : '',paddingRight:(index === 0) ? 40 :0,}}>
                                     <div style={{fontSize:22,marginRight: 60,fontWeight: '400',}}>{product.name}</div>
                                     <img src={product.imgurl} 
                        onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                         alt={product.name} style={{height:150}} />
                            </div>
                        ))}
                    </div>
                ))}
                 </div>
                 <Dialog visible={showDilalog} style={{ width: '50vw' }} 
                 onHide={() => this.closeDialog()} modal >
                    <div style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
                    <img src={selectedPrd.imgurl} 
                        onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                         alt={selectedPrd.name} style={{width:260}} />
                        <div>
                            <div style={{fontSize:22}}>{selectedPrd.name}</div>
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


export default HomePage;