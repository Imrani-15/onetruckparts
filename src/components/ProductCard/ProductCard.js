import React from "react";
import { Skeleton } from 'primereact/skeleton';

import dummyImage from '../../assets/dummy.jpg'

import {isNotEmpty} from '../../utils/Utils';

import { Button } from 'primereact/button';
import './ProductCard.css'
import { appTheme } from "../../utils/Constants";


const ProductCard = ({ product, openProductDetail, addToCart }) => {

  return (
        <div className="product_main">
           <div className="product_header" onClick={() => openProductDetail(product)}>
                {(isNotEmpty) ?
                <img src={product.image}  className="product_image" 
                onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
                /> :
                <img src={dummyImage} className="product_image" /> }
           </div>
           <div className="product_footer">
               <div style={{height:80}}>
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
                <div style={{display:'flex',flexDirection:'row',marginTop:8}}>
                    <div style={{
                        fontSize:18,
                        fontWeight:'700'
                    }}>
                        ${product.price}
                    </div>
                </div>
                <Button  
                    label="Add to Cart" 
                    className="p-button-raised p-button-rounded p-button-warning" 
                    style={{width:'100%',marginTop:22}}
                    onClick={() => addToCart(product)}
                    />
           </div>
           

        </div>
  );
};



export default ProductCard;