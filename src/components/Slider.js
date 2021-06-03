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
              <img src={item.imgurl}  style={{height:'100%',width:'140%',}}
                onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'} />
          </div>
          
        )
        })}
       </Carousel>
      {/* <div class="overlay">
        <div style={{alignSelf:'flex-end', fontSize:16, fontWeight:'500'}} onClick={() => goToBrandsPage()}>
          Shop By Brand
        </div>
      </div> */}

  </div>
 
  );
};



export default Slider;