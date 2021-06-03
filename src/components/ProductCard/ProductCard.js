import React from "react";
import { Skeleton } from 'primereact/skeleton';
import placeholder from '../../assets/placeholder.png'
import { Tooltip } from 'primereact/tooltip';
import { Button } from 'primereact/button';
import OneButton from '../OneButton';

import './ProductCard.css'
import { appTheme } from "../../utils/Constants";


const ProductCard = ({ showSkeletion, product, openProductDetail, addToCart, saveLater }) => {
    let showLoading = showSkeletion ? showSkeletion : false;
  if(showLoading){
    return (
        <div className="product_main">
           <div className="product_header">
                {/* <img src={placeholder}  className="product_image" 
                />  */}
                  <Skeleton size="14rem"></Skeleton>
           </div>
         
           <div className="product_footer" >
               <div style={{height:80}}>
                    <Skeleton width="100%" height="50px"/>
               </div>
                <Skeleton width="100%" height="60px"/>
                <Skeleton width="100%" height="44px" className="p-mt-4" borderRadius="22px"/>
           </div>
        </div>
  );
  }else{
    return (
        <div className="product_main">
           <div className="product_header" onClick={() => openProductDetail(product)}>
                <img src={product.image}  className="product_image" 
                onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                /> 
           </div>
           <div className="product_footer" >
               <div style={{height:80}} onClick={() => openProductDetail(product)}>
                <div style={{
                    fontSize:13,
                    color:'#999',
                    fontWeight:'500',
                    marginBottom:6
                }}>
                  SKU :  {product.osku}
                </div>
                <div className="product_title">{product.title}</div>
               </div>
                <div style={{fontSize:12,color:appTheme.dark1}}>
                    Part Number: {product.partnumber}
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:8, justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{
                        fontSize:18,
                        fontWeight:'700'
                    }}>
                        ${product.price}
                    </div>
                    <Button icon="pi pi-bookmark" className="p-button-rounded p-button-sm"  
                    tooltip="Save to later"
                    tooltipOptions={{position: 'bottom'}}
                    onClick={()=> saveLater(product)}
                    style={{backgroundColor:appTheme.primaryColor,
                        borderColor:appTheme.primaryColor}}/>
                </div>
                <OneButton 
                    onClick={() => addToCart(product)} 
                    buttonLabel={"Add to cart"}
                    btnShape="round"
                    btnSize="large"
                    buttonStyle={{fontSize:16,marginTop:22,
                            backgroundColor:appTheme.logoTextColor,
                            borderColor:appTheme.logoTextColor}}
                    /> 
           </div>
        </div>
  );
  }
 
};



export default ProductCard;