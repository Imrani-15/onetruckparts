import React from "react";
import { Skeleton } from 'primereact/skeleton';
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
                <img src={product.image}  className="product_image"  alt={product.title}
                onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                /> 
           </div>
           <div className="product_footer" >
               <div className="product_sub-footer" onClick={() => openProductDetail(product)}>
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
                <div style={{display:'flex',flexDirection:'row',marginTop:8, justifyContent:'space-between',alignItems:'center'}}>
                    <div className="product_price">
                        ${product.price}
                    </div>
                    <Button icon="pi pi-heart" className="p-button-rounded p-button-sm"  
                    onClick={()=> saveLater(product)}
                    style={{backgroundColor:appTheme.dark6,
                        borderColor:appTheme.dark6}}/>
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