import React from 'react';


 
 const ImageComponent = ({image,name,imgStyle}) => {
  

        return (
            <img src={image} style={imgStyle}
            onError={(e) => e.target.src='https://dublin.anglican.org/cmsfiles/placeholder.png'}
             alt={name} />
        )
     }

 
 
 
export default ImageComponent;
 

