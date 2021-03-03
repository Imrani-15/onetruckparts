import React from "react";
import {Carousel} from 'primereact/carousel';

import './styles/Slider.css'


const Slider = ({ data, isLoading }) => {
  return (
   <Carousel 
   style={{backgroundColor: '#EAEDED'}}
   autoplayInterval={10000}
   value={data} itemTemplate={(item)=>{
     return(
       <div>
           <img src={item.imgurl}  style={{height:'100%',width:'100%'}} />
       </div>
      
     )
   }} numVisible={1}></Carousel> 
  );
};



export default Slider;