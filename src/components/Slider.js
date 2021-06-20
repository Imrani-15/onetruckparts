import React from "react";
import {Carousel} from 'antd';

import './styles/Slider.css'


const Slider = ({ data, goToBrandsPage }) => {
  return (
  <div  className="container">
      <Carousel autoplay dots={false}>
        {data.map((item)=>{
        return(
          <div style={{display:'flex'}} key={item.id}>
              <img src={item.imgurl}  style={{height:'90%',width:'120%'}} alt={item.id}
                onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'} />
          </div>
          
        )
        })}
       </Carousel>
  </div>
 
  );
};



export default Slider;